import { WeatherService } from '@app/weather/provider/weather.service';
import { get12Coordinates } from '@common/util/get12Coordinates';
import { generateCoordinates5x5 } from '@common/util/get5x5Coordinates';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Prisma,
  Typhoon,
  TyphoonAroundWeatherCircle,
  TyphoonAroundWeatherGrid,
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
            predictions_circle: true,
            predictions_grid: true,
            predictions_circle_with_weather_prediction: true,
            predictions_grid_with_weather_prediction: true,
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
              predictions_circle: true,
              predictions_grid: true,
              predictions_circle_with_weather_prediction: true,
              predictions_grid_with_weather_prediction: true,
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
              predictions_circle: true,
              predictions_grid: true,
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
              predictions_circle: true,
              predictions_grid: true,
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
            predictions_circle: true,
            predictions_grid: true,
          },
        },
      },
    });
  }

  async getTyphoonLists() {
    return await this.prisma.typhoon.findMany();
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
            around_weathers_grid: true,
          },
        },
      },
    });
  }

  // 앞으로 발생한 태풍 예측
  async predictTyphoonCircle(
    data: Typhoon & {
      historical_details: (TyphoonDetail & {
        around_weathers_circle: TyphoonAroundWeatherCircle[];
      })[];
    },
    count = 12,
    query_hour = 6,
  ) {
    const predict_url = this.configService.get('PREDICT_URL');
    if (data.historical_details.length < 2) return;
    // const {} = data;
    const observation_date = new Date(
      Math.max(
        ...data.historical_details.map(({ observation_date }) =>
          observation_date.getTime(),
        ),
      ),
    );
    const existPredictions = await this.prisma.typhoonPredictionCircle.findMany(
      {
        where: {
          typhoon_id: data.typhoon_id,
          observation_date: observation_date,
        },
      },
    );
    if (existPredictions.length > 0) {
      return;
    }
    const predict: IPredictResponse[] = await Promise.all(
      Array(count)
        .fill(0)
        .map(async (_, i) => {
          try {
            const { data: result }: { data: IPredictResponse } =
              await this.httpService.axiosRef.post(`${predict_url}/circle`, {
                ...data,
                query_hour: query_hour * (i + 1),
              });

            return result;
          } catch (e) {}
        }),
    );

    const newPredictions = await this.prisma.typhoonPredictionCircle
      .createMany({
        data: predict
          .filter((p) => p)
          .map((p) => ({
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

  async predictTyphoonGrid(
    data: Typhoon & {
      historical_details: (TyphoonDetail & {
        around_weathers_grid: TyphoonAroundWeatherGrid[];
      })[];
    },
    count = 12,
    query_hour = 6,
  ) {
    const predict_url = this.configService.get('PREDICT_URL');
    if (data.historical_details.length < 2) {
      return;
    }
    const observation_date = new Date(
      Math.max(
        ...data.historical_details.map(({ observation_date }) =>
          observation_date.getTime(),
        ),
      ),
    );
    const existPredictions = await this.prisma.typhoonPredictionGrid.findMany({
      where: {
        typhoon_id: data.typhoon_id,
        observation_date: observation_date,
      },
    });
    if (existPredictions.length > 0) {
      return;
    }
    const predict: IPredictResponse[] = await Promise.all(
      Array(count)
        .fill(0)
        .map(async (_, i) => {
          try {
            const { data: result }: { data: IPredictResponse } =
              await this.httpService.axiosRef.post(`${predict_url}/grid`, {
                ...data,
                query_hour: query_hour * (i + 1),
              });
            return result;
          } catch (e) {
            console.log('GRID PREDICT ERROR', e);
          }
        }),
    );

    const newPredictions = await this.prisma.typhoonPredictionGrid
      .createMany({
        data: predict
          .filter((p) => p)
          .map((p) => ({
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

  async predictTyphoonCircleWithWeatherPrediction(
    data: Typhoon & {
      historical_details: (TyphoonDetail & {
        around_weathers_circle: TyphoonAroundWeatherCircle[];
      })[];
    },
    count = 12,
    query_hour = 6,
  ) {
    const predict_url = this.configService.get('PREDICT_URL');
    const { historical_details, ...typhoon } = data;
    if (historical_details.length < 2) {
      return;
    }
    const observation_date = new Date(
      Math.max(
        ...data.historical_details.map(({ observation_date }) =>
          observation_date.getTime(),
        ),
      ),
    );
    const existCount =
      await this.prisma.typhoonPredictionCircleWithAroundWeatherPrediction.count(
        {
          where: {
            typhoon_id: data.typhoon_id,
            observation_date: observation_date,
          },
        },
      );
    if (existCount === count) return;
    const detailDatas: (Partial<TyphoonDetail> & {
      around_weathers_circle:
        | TyphoonAroundWeatherCircle[]
        | Prisma.TyphoonAroundWeatherCircleCreateManyTyphoon_detailInput[];
      prediction_date?: Date;
    })[][] = [historical_details];
    const predict: IPredictResponse[] = [];
    for (let i = 0; i < count; i++) {
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
      const around_weathers_circle: Prisma.TyphoonAroundWeatherCircleCreateManyTyphoon_detailInput[] =
        await this.weatherService.getCircleAroundWeatherData(
          result.central_latitude,
          result.central_longitude,
          new Date(result.prediction_date),
        );
      detailDatas.push([
        {
          typhoon_id: data.typhoon_id,
          observation_date: new Date(result.prediction_date), // 예측을 위한 관측 시간 임의 설정
          central_latitude: result.central_latitude,
          central_longitude: result.central_longitude,
          grade_type: result.units.grade[result.grade],
          around_weathers_circle,
        },
        detailDatas[i][0], //이전 데이터중 최신데이터를 뒤에 추가
      ]);
    }

    const newPredictions =
      await this.prisma.typhoonPredictionCircleWithAroundWeatherPrediction.createMany(
        {
          data: predict.map((p) => ({
            typhoon_id: data.typhoon_id,
            observation_date: observation_date,
            prediction_date: p.prediction_date,
            central_latitude: p.central_latitude,
            central_longitude: p.central_longitude,
            grade: p.units.grade[p.grade],
          })),
        },
      );
    return newPredictions;
  }

  async predictTyphoonGridWithWeatherPrediction(
    data: Typhoon & {
      historical_details: (TyphoonDetail & {
        around_weathers_grid: TyphoonAroundWeatherGrid[];
      })[];
    },
    count = 12,
    query_hour = 6,
  ) {
    const predict_url = this.configService.get('PREDICT_URL');
    const { historical_details, ...typhoon } = data;
    if (historical_details.length < 2) {
      return;
    }

    const observation_date = new Date(
      Math.max(
        ...data.historical_details.map(({ observation_date }) =>
          observation_date.getTime(),
        ),
      ),
    );
    const existCount =
      await this.prisma.typhoonPredictionGridWithAroundWeatherPrediction.count({
        where: {
          typhoon_id: data.typhoon_id,
          observation_date: observation_date,
        },
      });
    if (existCount === count) return;

    const detailDatas: (Partial<TyphoonDetail> & {
      around_weathers_grid:
        | TyphoonAroundWeatherGrid[]
        | Prisma.TyphoonAroundWeatherGridCreateManyTyphoon_detailInput[];
      prediction_date?: Date;
    })[][] = [historical_details];
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
      const around_weathers_grid: Prisma.TyphoonAroundWeatherGridCreateManyTyphoon_detailInput[] =
        await this.weatherService.getGridAroundWeatherData(
          result.central_latitude,
          result.central_longitude,
          new Date(result.prediction_date),
        );
      detailDatas.push([
        {
          typhoon_id: data.typhoon_id,
          observation_date: new Date(result.prediction_date), // 예측을 위한 관측 시간 임의 설정
          central_latitude: result.central_latitude,
          central_longitude: result.central_longitude,
          grade_type: result.units.grade[result.grade],
          around_weathers_grid,
        },
        detailDatas[i][0], //이전 데이터중 최신데이터를 뒤에 추가
      ]);
    }

    const newPredictions =
      await this.prisma.typhoonPredictionGridWithAroundWeatherPrediction.createMany(
        {
          data: predict.map((p) => ({
            typhoon_id: data.typhoon_id,
            observation_date: observation_date,
            prediction_date: p.prediction_date,
            central_latitude: p.central_latitude,
            central_longitude: p.central_longitude,
            grade: p.units.grade[p.grade],
          })),
        },
      );
    return newPredictions;
  }

  // 이전에 가지고 있던 데이터에 대한 예측
  async predictTyphoonCircleWithWeatherPredictionPast(
    data: Typhoon & {
      historical_details: (TyphoonDetail & {
        around_weathers_circle: TyphoonAroundWeatherCircle[];
      })[];
    },
    count = 12,
    query_hour = 6,
  ) {
    const predict_url = this.configService.get('PREDICT_URL');

    const { historical_details, ...typhoon } = data;
    if (historical_details.length < 2) return;
    const observation_date = new Date(
      Math.max(
        ...historical_details.map(({ observation_date }) =>
          observation_date.getTime(),
        ),
      ),
    );
    const existCount =
      await this.prisma.typhoonPredictionCircleWithAroundWeatherPrediction.count(
        {
          where: {
            typhoon_id: data.typhoon_id,
            observation_date: observation_date,
          },
        },
      );
    if (existCount === count) return;

    const detailDatas: (Partial<TyphoonDetail> & {
      around_weathers_circle:
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
      const around_weathers_circle: Prisma.TyphoonAroundWeatherCircleCreateManyTyphoon_detailInput[] =
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
          around_weathers_circle,
        },
        detailDatas[i][0], //이전 데이터중 최신데이터를 뒤에 추가
      ]);
    }

    const newPredictions =
      await this.prisma.typhoonPredictionCircleWithAroundWeatherPrediction.createMany(
        {
          data: predict.map((p) => ({
            typhoon_id: data.typhoon_id,
            observation_date: observation_date,
            prediction_date: p.prediction_date,
            central_latitude: p.central_latitude,
            central_longitude: p.central_longitude,
            grade: p.units.grade[p.grade],
          })),
        },
      );
    console.log(observation_date);
    return newPredictions;
  }
  async predictTyphoonGridWithWeatherPredictionPast(
    data: Typhoon & {
      historical_details: (TyphoonDetail & {
        around_weathers_grid: TyphoonAroundWeatherGrid[];
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

    if (historical_details.length < 2) {
      return;
    }
    const existCount =
      await this.prisma.typhoonPredictionGridWithAroundWeatherPrediction.count({
        where: {
          typhoon_id: data.typhoon_id,
          observation_date: observation_date,
        },
      });
    if (existCount === count) {
      return;
    }
    const detailDatas: (Partial<TyphoonDetail> & {
      around_weathers_grid:
        | TyphoonAroundWeatherGrid[]
        | Prisma.TyphoonAroundWeatherGridCreateManyTyphoon_detailInput[];
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
      const around_weathers_grid: Prisma.TyphoonAroundWeatherGridCreateManyTyphoon_detailInput[] =
        await Promise.all(
          generateCoordinates5x5(
            result.central_latitude,
            result.central_longitude,
          ).map(
            async (
              location,
            ): Promise<Prisma.TyphoonAroundWeatherGridCreateManyTyphoon_detailInput> => {
              const { latitude, longitude, y, x } = location;
              const wheather =
                await this.weatherService.getTyphoonWeatherDataPast({
                  date: new Date(observation_date),
                  long: longitude,
                  lat: latitude,
                });

              return {
                ...wheather,
                y,
                x,
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
          around_weathers_grid,
        },
        detailDatas[i][0], //이전 데이터중 최신데이터를 뒤에 추가
      ]);
    }

    const newPredictions =
      await this.prisma.typhoonPredictionGridWithAroundWeatherPrediction.createMany(
        {
          data: predict.map((p) => ({
            typhoon_id: data.typhoon_id,
            observation_date: observation_date,
            prediction_date: p.prediction_date,
            central_latitude: p.central_latitude,
            central_longitude: p.central_longitude,
            grade: p.units.grade[p.grade],
          })),
        },
      );
    console.log(observation_date);
    return newPredictions;
  }

  async getRecentTyphoonData(typhoonId: string) {
    return await this.prisma.typhoon.findUnique({
      where: { typhoon_id: typhoonId },
      include: {
        historical_details: {
          include: { around_weathers_circle: true, around_weathers_grid: true },
          take: 2,
          orderBy: { observation_date: 'desc' },
        },
      },
    });
  }

  async setDBPredictCircle() {
    const allTyphoondata = await this.prisma.typhoon.findMany({
      orderBy: { typhoon_id: 'desc' },
    });
    // 순서를 보장하기위함
    for (const typhoon of allTyphoondata) {
      const { typhoon_id } = typhoon;
      // 4 개인경우 [1,2] [2.3] [3,4] 총 세번
      // 6 개인경우 [1,2] [2.3] [3,4] [4,5] [5,6] 총 다섯번
      // 즉 n 개인경우 n-1 번
      const detailCount = await this.prisma.typhoonDetail.count({
        where: { typhoon_id },
      });
      const skipArray = Array(detailCount - 1)
        .fill(0)
        .map((_, i) => i);
      console.log(skipArray);
      //이역시 순서 보장하기위함
      for (const skip of skipArray) {
        const typhoonDetailData = await this.prisma.typhoonDetail.findMany({
          where: { typhoon_id },
          skip: skip,
          orderBy: { observation_date: 'desc' },
          take: 2,
          include: {
            around_weathers_circle: true,
          },
        });

        await this.predictTyphoonCircle(
          { ...typhoon, historical_details: typhoonDetailData, typhoon_id },
          12,
          6,
        );
      }
    }
  }
  async setDBPredictGrid() {
    const allTyphoondata = await this.prisma.typhoon.findMany({
      orderBy: { typhoon_id: 'asc' },
    });
    // 순서를 보장하기위함
    for (const typhoon of allTyphoondata) {
      const { typhoon_id } = typhoon;
      // 4 개인경우 [1,2] [2.3] [3,4] 총 세번
      // 6 개인경우 [1,2] [2.3] [3,4] [4,5] [5,6] 총 다섯번
      // 즉 n 개인경우 n-1 번
      const detailCount = await this.prisma.typhoonDetail.count({
        where: { typhoon_id },
      });
      const skipArray = Array(detailCount - 1)
        .fill(0)
        .map((_, i) => i);
      console.log(skipArray);
      //이역시 순서 보장하기위함
      for (const skip of skipArray) {
        const typhoonDetailData = await this.prisma.typhoonDetail.findMany({
          where: { typhoon_id },
          skip: skip,
          orderBy: { observation_date: 'desc' },
          take: 2,
          include: {
            around_weathers_grid: true,
          },
        });
        // console.log(typhoonDetailData.length);
        await this.predictTyphoonGrid(
          { ...typhoon, historical_details: typhoonDetailData, typhoon_id },
          12,
          6,
        );
      }
    }
  }

  async setDBPredictCircleWithWeatherPrediction() {
    const allTyphoondata = await this.prisma.typhoon.findMany({
      orderBy: { typhoon_id: 'desc' },
    });
    // 순서를 보장하기위함
    for (const typhoon of allTyphoondata) {
      const { typhoon_id } = typhoon;
      // 4 개인경우 [1,2] [2.3] [3,4] 총 세번
      // 6 개인경우 [1,2] [2.3] [3,4] [4,5] [5,6] 총 다섯번
      // 즉 n 개인경우 n-1 번
      const detailCount = await this.prisma.typhoonDetail.count({
        where: { typhoon_id },
      });
      const skipArray = Array(detailCount - 1)
        .fill(0)
        .map((_, i) => i);
      console.log(skipArray);
      //이역시 순서 보장하기위함
      for (const skip of skipArray) {
        const typhoonDetailData = await this.prisma.typhoonDetail.findMany({
          where: { typhoon_id },
          skip: skip,
          orderBy: { observation_date: 'desc' },
          take: 2,
          include: {
            around_weathers_circle: true,
          },
        });

        await this.predictTyphoonCircleWithWeatherPredictionPast(
          { ...typhoon, historical_details: typhoonDetailData, typhoon_id },
          12,
          6,
        );
      }
    }
  }
  async setDBPredictGridWithWeatherPrediction() {
    const allTyphoondata = await this.prisma.typhoon.findMany({
      orderBy: { typhoon_id: 'desc' },
    });
    // 순서를 보장하기위함
    for (const typhoon of allTyphoondata) {
      const { typhoon_id } = typhoon;
      // 4 개인경우 [1,2] [2.3] [3,4] 총 세번
      // 6 개인경우 [1,2] [2.3] [3,4] [4,5] [5,6] 총 다섯번
      // 즉 n 개인경우 n-1 번
      const detailCount = await this.prisma.typhoonDetail.count({
        where: { typhoon_id },
      });
      const skipArray = Array(detailCount - 1)
        .fill(0)
        .map((_, i) => i);
      console.log(skipArray);
      //이역시 순서 보장하기위함
      for (const skip of skipArray) {
        const typhoonDetailData = await this.prisma.typhoonDetail.findMany({
          where: { typhoon_id },
          skip: skip,
          orderBy: { observation_date: 'desc' },
          take: 2,
          include: {
            around_weathers_grid: true,
          },
        });

        await this.predictTyphoonGridWithWeatherPredictionPast(
          { ...typhoon, historical_details: typhoonDetailData, typhoon_id },
          12,
          6,
        );
      }
    }
  }

  async test() {
    const count = await this.prisma.typhoonPredictionCircle.findMany({
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

  async gridTest() {
    return this.prisma.typhoon.findFirst({
      include: {
        historical_details: {
          take: 2,
          orderBy: { observation_date: 'desc' },
          include: {
            around_weathers_grid: true,
          },
        },
      },
    });
  }

  async setDBPredictGridTest() {
    const typhoon = await this.prisma.typhoon.findFirst({
      include: {
        historical_details: {
          take: 2,
          orderBy: { observation_date: 'desc' },
          include: {
            around_weathers_grid: true,
          },
        },
      },
    });
    await this.predictTyphoonGrid(typhoon);
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
