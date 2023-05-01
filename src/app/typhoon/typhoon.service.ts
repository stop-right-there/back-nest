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
          return result;
        }),
    );
    const newPredictions = await this.prisma.typhoonPrediction.createMany({
      data: predict.map((p) => ({
        typhoon_id: data.typhoon_id,
        observation_date: data.historical_details[0].observation_date,
        prediction_date: p.prediction_date,
        central_latitude: p.central_latitude,
        central_longitude: p.central_longitude,
      })),
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
}
