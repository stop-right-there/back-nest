import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class TyphoonService {
  constructor(private readonly prisma: PrismaService) {}

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
}
