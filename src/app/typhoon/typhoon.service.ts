import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Typhoon, TyphoonAroundWeather, TyphoonDetail } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { IPredictResponse } from './type/predict.type';
@Injectable()
export class TyphoonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
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
            around_weathers: {
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
        around_weathers: TyphoonAroundWeather[];
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
    const newPredictions = await this.prisma.typhoonPrediction
      .createMany({
        data: predict.map((p) => ({
          typhoon_id: data.typhoon_id,
          observation_date: data.historical_details[0].observation_date,
          prediction_date: p.prediction_date,
          central_latitude: p.central_latitude,
          central_longitude: p.central_longitude,
        })),
      })
      .catch((e) => {
        console.log(e);
      });
    return newPredictions;
  }

  async getRecentTyphoonData(typhoonId: string) {
    return await this.prisma.typhoon.findUnique({
      where: { typhoon_id: typhoonId },
      include: {
        historical_details: {
          include: { around_weathers: true },
          take: 2,
          orderBy: { observation_date: 'desc' },
        },
      },
    });
  }

  // async setDBPredict() {
  //   const allTyphoondata = await this.prisma.typhoon.findMany({});
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
  //         take: 2,
  //         include: {
  //           around_weathers: true,
  //         },
  //       });
  //       await this.predictTyphoon(
  //         { ...typhoon, historical_details: typhoonDetailData, typhoon_id },
  //         12,
  //         6,
  //       );
  //     }
  //   }
  // }

  // async setDB() {
  //   const typhoon = fs.readFileSync('dataSet.json', 'utf-8');
  //   const typhoonData = JSON.parse(typhoon).data;
  //   const typhoon_datas = [];
  //   const typhoon_detail_datas = [];
  //   const around_weather_datas = [];
  //   typhoonData.map(
  //     (
  //       data: {
  //         typhoon_details: (TyphoonDetail & {
  //           arround_weathers: TyphoonAroundWeather[];
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
  //         ({ arround_weathers: _, ...detail }) => ({
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

  //       const around_weathers = typhoon_details
  //         .map(({ arround_weathers }) =>
  //           arround_weathers.map((around_weather) => ({
  //             ...around_weather,
  //             observation_date: new Date(around_weather.observation_date),
  //           })),
  //         )
  //         .reduce((acc, cur) => [...acc, ...cur], []);
  //       around_weather_datas.push(...around_weathers);
  //     },
  //   );
  //   console.log(typhoon_datas.length);
  //   console.log(typhoon_detail_datas.length);
  //   console.log(around_weather_datas.length);
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
  //     'around_weathers.json',
  //     JSON.stringify([...around_weather_datas]),
  //     'utf-8',
  //   );
  // }
}
