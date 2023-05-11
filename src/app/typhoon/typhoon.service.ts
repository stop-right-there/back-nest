import { WeatherService } from '@app/weather/provider/weather.service';
import { get12Coordinates } from '@common/util/get12Coordinates';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Prisma,
  Typhoon,
  TyphoonAroundWeatherCircle,
  TyphoonDetail,
} from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { IPredictResponse } from './type/predict.type';
@Injectable()
export class TyphoonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly weatherService: WeatherService,
  ) {}

  async getTyphoonDetail(typhoon_id: string) {
    return this.prisma.typhoon.findUnique({
      where: {
        typhoon_id,
      },
      include: {
        historical_details: {
          orderBy: {
            observation_date: 'desc',
          },
          include: {
            predictions: true,
          },
        },
      },
    });
  }

  async getTyphoonList({
    start_date,
    end_date,
    period,
  }: {
    start_date?: Date;
    end_date?: Date;
    period?: number;
  }) {
    if (start_date && end_date) {
      return this.prisma.typhoon.findMany({
        where: {
          historical_details: {
            some: {
              observation_date: {
                gte: start_date,
                lte: end_date,
              },
            },
          },
        },
        include: {
          historical_details: {
            orderBy: {
              observation_date: 'desc',
            },
            include: {
              predictions: true,
            },
          },
        },
      });
    }

    if (start_date && period) {
      return this.prisma.typhoon.findMany({
        where: {
          historical_details: {
            some: {
              observation_date: {
                gte: start_date,
                lte: new Date(
                  start_date.getTime() + period * 24 * 60 * 60 * 1000,
                ),
              },
            },
          },
        },
        include: {
          historical_details: {
            orderBy: {
              observation_date: 'desc',
            },
            include: {
              predictions: true,
            },
          },
        },
      });
    }

    if (end_date && period) {
      return this.prisma.typhoon.findMany({
        where: {
          historical_details: {
            some: {
              observation_date: {
                lte: end_date,
                gte: new Date(
                  end_date.getTime() - period * 24 * 60 * 60 * 1000,
                ),
              },
            },
          },
        },
        include: {
          historical_details: {
            orderBy: {
              observation_date: 'desc',
            },
            include: {
              predictions: true,
            },
          },
        },
      });
    }
    return this.prisma.typhoon.findMany({
      where: {
        end_date: null,
      },
      include: {
        historical_details: {
          orderBy: {
            observation_date: 'desc',
          },
          include: {
            predictions: true,
          },
        },
      },
    });
  }

  async predictTyphoonTest(typhoon_id: string) {
    return this.prisma.typhoon.findFirst({
      where: {
        typhoon_id,
      },
      include: {
        historical_details: {
          orderBy: {
            observation_date: 'desc',
          },
          include: {
            around_weathers_circle: {
              orderBy: {
                point: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async predictTyphoon(
    data: Typhoon & {
      historical_details: (TyphoonDetail & {
        around_weathers: TyphoonAroundWeatherCircle[];
      })[];
    },
    count = 12,
    query_hour = 6,
  ) {
    const predict_url = this.configService.get('PREDICT_URL');

    const predict: IPredictResponse[] = await Promise.all(
      Array(count)
        .fill(0)
        .map(async (_, i) => {
          const { data: result }: { data: IPredictResponse } =
            await this.httpService.axiosRef.post(predict_url, {
              ...data,
              query_hour: query_hour * (i + 1),
            });
          console.log(result);
          return result;
        }),
    );
    const observation_date = new Date(
      Math.max(
        ...data.historical_details.map(({ observation_date }) =>
          observation_date.getTime(),
        ),
      ),
    );
    const newPredictions = await this.prisma.typhoonPrediction
      .createMany({
        data: predict.map((p) => ({
          typhoon_id: data.typhoon_id,
          observation_date: observation_date,
          prediction_date: p.prediction_date,
          central_latitude: p.central_latitude,
          central_longitude: p.central_longitude,
          grade: p.units.grade[p.grade],
        })),
      })
      .catch((e) => {
        console.log(e);
      });
    return newPredictions;
  }

  async predictTyphoonDBset(
    data: Typhoon & {
      historical_details: (TyphoonDetail & {
        around_weathers: TyphoonAroundWeatherCircle[];
      })[];
    },
    count = 12,
    query_hour = 6,
  ) {
    const predict_url = this.configService.get('PREDICT_URL');

    const { historical_details, ...typhoon } = data;
    const observation_date = new Date(
      Math.max(
        ...historical_details.map(({ observation_date }) =>
          observation_date.getTime(),
        ),
      ),
    );
    const detailDatas: (Partial<TyphoonDetail> & {
      around_weathers:
        | TyphoonAroundWeatherCircle[]
        | Prisma.TyphoonAroundWeatherCircleCreateManyTyphoon_detailInput[];
      prediction_date?: Date;
    })[][] = [historical_details];

    //예측정보 임시저장
    const predict: IPredictResponse[] = [];
    for (let i = 0; i < count; i++) {
      console.log(i);
      const { data: result }: { data: IPredictResponse } =
        await this.httpService.axiosRef
          .post(predict_url, {
            ...typhoon,
            historical_details: detailDatas[i],
            query_hour: query_hour,
          })
          .catch((e) => {
            console.log(e);
            return { data: null };
          });
      predict.push(result);
      //예측결과에 대한 날씨 조회
      const around_weathers: Prisma.TyphoonAroundWeatherCircleCreateManyTyphoon_detailInput[] =
        await Promise.all(
          [
            {
              latitude: result.central_latitude,
              longitude: result.central_longitude,
              bearing: 0,
              distance: 0,
            },
            ...get12Coordinates(
              result.central_latitude,
              result.central_longitude,
              750,
            ),
            ...get12Coordinates(
              result.central_latitude,
              result.central_longitude,
              1500,
            ),
          ].map(
            async (
              location,
              i,
            ): Promise<Prisma.TyphoonAroundWeatherCircleCreateManyTyphoon_detailInput> => {
              const { latitude, longitude, bearing, distance } = location;
              const wheather =
                await this.weatherService.getTyphoonWeatherDataPast({
                  date: new Date(observation_date),
                  long: longitude,
                  lat: latitude,
                });

              return {
                distance,
                point: bearing / 30,
                ...wheather,
              };
            },
          ),
        );
      detailDatas.push([
        {
          typhoon_id: data.typhoon_id,
          observation_date: new Date(result.prediction_date), // 예측을 위한 관측 시간 임의 설정
          central_latitude: result.central_latitude,
          central_longitude: result.central_longitude,
          grade_type: result.units.grade[result.grade],
          around_weathers,
        },
        detailDatas[i][0], //이전 데이터중 최신데이터를 뒤에 추가
      ]);
    }

    const newPredictions = await this.prisma.typhoonPrediction.createMany({
      data: predict.map((p) => ({
        typhoon_id: data.typhoon_id,
        observation_date: observation_date,
        prediction_date: p.prediction_date,
        central_latitude: p.central_latitude,
        central_longitude: p.central_longitude,
        grade: p.units.grade[p.grade],
      })),
    });
    console.log(observation_date);
    return newPredictions;
  }

  async getRecentTyphoonData(typhoonId: string) {
    return await this.prisma.typhoon.findUnique({
      where: { typhoon_id: typhoonId },
      include: {
        historical_details: {
          include: { around_weathers_circle: true },
          take: 2,
          orderBy: { observation_date: 'desc' },
        },
      },
    });
  }

  // async setDBPredict() {
  //   const allTyphoondata = await this.prisma.typhoon.findMany({
  //     orderBy: { typhoon_id: 'desc' },
  //   });
  //   // 순서를 보장하기위함
  //   for (const typhoon of allTyphoondata) {
  //     const { typhoon_id } = typhoon;
  //     // 4 개인경우 [1,2] [2.3] [3,4] 총 세번
  //     // 6 개인경우 [1,2] [2.3] [3,4] [4,5] [5,6] 총 다섯번
  //     // 즉 n 개인경우 n-1 번
  //     const detailCount = await this.prisma.typhoonDetail.count({
  //       where: { typhoon_id },
  //     });
  //     const skipArray = Array(detailCount - 1)
  //       .fill(0)
  //       .map((_, i) => i);
  //     console.log(skipArray);
  //     //이역시 순서 보장하기위함
  //     for (const skip of skipArray) {
  //       const typhoonDetailData = await this.prisma.typhoonDetail.findMany({
  //         where: { typhoon_id },
  //         skip: skip,
  //         orderBy: { observation_date: 'desc' },
  //         take: 2,
  //         include: {
  //           around_weathers_circle: true,
  //         },
  //       });
  //       const data = typhoonDetailData.map(
  //         ({ around_weathers_circle, ...detail }) => ({
  //           ...detail,
  //           around_weathers: around_weathers_circle,
  //         }),
  //       );

  //       await this.predictTyphoon2(
  //         { ...typhoon, historical_details: data, typhoon_id },
  //         12,
  //         6,
  //       );
  //     }
  //   }
  // }

  async test() {
    const count = await this.prisma.typhoonPrediction.findMany({
      where: {
        observation_date: {
          gte: new Date('2022-01-01'),
          lte: new Date('2022-12-31'),
        },
      },
    });
    console.log(
      count.filter((t) => {
        return (
          t.prediction_date.getTime() - t.observation_date.getTime() ===
            6 * 1000 * 3600 && t.grade === 'TD'
        );
      }),
    );
  }

  // async setDB() {
  //   const typhoon = fs.readFileSync('dataSet.json', 'utf-8');
  //   const typhoonData = JSON.parse(typhoon).data;
  //   const typhoon_datas = [];
  //   const typhoon_detail_datas = [];
  //   const around_weather_circle_datas = [];
  //   const around_weather_grid_datas = [];
  //   typhoonData.map(
  //     (
  //       data: {
  //         typhoon_details: (TyphoonDetail & {
  //           around_weathers_grid: TyphoonAroundWeatherGrid[];
  //           around_weathers_circle: TyphoonAroundWeatherCircle[];
  //         })[];
  //       } & Typhoon,
  //     ) => {
  //       const { typhoon_details, ...info } = data;
  //       typhoon_datas.push({
  //         ...info,
  //         gdacs_id: Number(info.gdacs_id),
  //         start_date: new Date(info.start_date),
  //         end_date: new Date(info.end_date),
  //       });
  //       const typhoon_detailList = typhoon_details.map(
  //         ({
  //           around_weathers_circle: _,
  //           around_weathers_grid: __,
  //           ...detail
  //         }) => ({
  //           ...detail,
  //           grade: null,
  //           central_longitude: Number(detail.central_longitude) / 10,
  //           central_latitude: Number(detail.central_latitude) / 10,
  //           central_pressure: Number(detail.central_pressure),
  //           maximum_wind_speed: Number(detail.maximum_wind_speed),
  //           observation_date: new Date(detail.observation_date),
  //           // TD" | "TS" | "H1" | "H2" | "H3" | "H4" | "H5" | "TY" | "STY"

  //           source: 'GDACS' as SOURCE,
  //         }),
  //       );
  //       typhoon_detail_datas.push(...typhoon_detailList);

  //       const around_weathers_circle = typhoon_details
  //         .map(({ around_weathers_circle }) =>
  //           around_weathers_circle.map((around_weather) => ({
  //             ...around_weather,
  //             observation_date: new Date(around_weather.observation_date),
  //           })),
  //         )
  //         .reduce((acc, cur) => [...acc, ...cur], []);
  //       around_weather_circle_datas.push(...around_weathers_circle);

  //       const around_weathers_grid = typhoon_details
  //         .map(({ around_weathers_grid }) =>
  //           around_weathers_grid.map((around_weather) => ({
  //             ...around_weather,
  //             observation_date: new Date(around_weather.observation_date),
  //           })),
  //         )
  //         .reduce((acc, cur) => [...acc, ...cur], []);
  //       around_weather_grid_datas.push(...around_weathers_grid);
  //     },
  //   );
  //   console.log(typhoon_datas.length);
  //   console.log(typhoon_detail_datas.length);
  //   console.log(around_weather_circle_datas.length);
  //   console.log(around_weather_grid_datas.length);
  //   fs.writeFileSync(
  //     'typhoons.json',
  //     JSON.stringify([...typhoon_datas]),
  //     'utf-8',
  //   );
  //   fs.writeFileSync(
  //     'typhoon_details.json',
  //     JSON.stringify([...typhoon_detail_datas]),
  //     'utf-8',
  //   );
  //   fs.writeFileSync(
  //     'around_weathers_circle.json',
  //     JSON.stringify([...around_weather_circle_datas]),
  //     'utf-8',
  //   );
  //   fs.writeFileSync(
  //     'around_weathers_grid.json',
  //     JSON.stringify([...around_weather_grid_datas]),
  //     'utf-8',
  //   );
  // }
}
