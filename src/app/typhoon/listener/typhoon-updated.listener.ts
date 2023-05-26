import { parseGDACS_XML } from '@common/util/parseGDACS_XML';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { ulid } from 'ulid';
import { TyphoonDetailDTO } from '../dto/typhoon_detail.dto';
import { GDASCTyphoonUpdatedEvent } from '../event/typhoon-updated.envent';
import { Grade, IAresWeatherData } from '../type/aerisweather.type';
import { TyphoonService } from '../typhoon.service';
import { WeatherService } from './../../weather/provider/weather.service';

@Injectable()
export class TyphoonUpdatedListener {
  private readonly logger = new Logger(TyphoonUpdatedListener.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly weatherService: WeatherService,
    private readonly typhoonService: TyphoonService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * GDACS에서 태풍정보가 업데이트될시 실행되는 이벤트입니다.
   *
   * 1. 태풍이 DB에 존재하는지 확인합니다.
   *
   * -- 태풍이 존재하지않을경우
   * 2. 태풍을 DB에 저장합니다.
   * 3, 태풍 중심부 날씨 정보를 가져옵니다.
   * 4. 중심부 날씨를 기반으로 태풍 Detail 정보를 DB에 저장합니다.
   * 5  태풍 예측을 위한 주변부 날씨를 가져옵니다.
   * 6. 가져온 주변 날씨 정보를 DB에 저장합니다.
   * 7. 주변날씨를 예측하기위해 AI 서버로 요청을 보냅니다.
   * 8. AI 서버로부터 응답받은 정보를 DB에 저장합니다.
   *
   *
   * -- 이미 DB에 태풍이 존재 할 경우
   * --- 태풍이 존재는 하나, 가장 최근 태풍 Detail의 관찰 날짜와 event로 넘어온 태풍의 관찰날짜가 다른경우
   * 2. 태풍 중심부 날씨 정보를 가져옵니다.
   * 3. 중심부 날씨를 기반으로 태풍 Detail 정보를 DB에 저장합니다. (관찰날짜가 다르기때문에 아직 태풍이 활동함을 의미)
   * 4. 태풍 예측을 위한 주변부 날씨를 가져옵니다.
   * 5. 가져온 주변 날씨 정보를 DB에 저장합니다.
   * 6. 주변날씨를 예측하기위해 AI 서버로 요청을 보냅니다.
   * 7. AI 서버로부터 응답받은 정보를 DB에 저장합니다.
   *
   *
   * --- 태풍이 존재는 하나, 가장 최근 태풍 Detail의 관찰 날짜와 event로 넘어온 태풍의 관찰날짜가 같은경우.
   * 2. 관찰 날짜가 같기때문에 태풍이 활동을 멈춘것을 의미합니다.
   * 3. 해당 태풍의 종료날짜를 업데이트합니다.
   * 이때 태풍종료가 되었기때문에 날씨 정보 및 예측을 받을 필요가 없습니다.
   *
   */
  @OnEvent('typhoon.GDACS.updated')
  async handleTyphoonUpdatedEvent(event: GDASCTyphoonUpdatedEvent) {
    this.logger.log(
      `[GDACS] 태풍 이벤트 발생 :: typhoon_id: ${event.id}, envent_date: ${event.date}`,
    );
    const { id: gdacs_id, date } = event;

    // #region GDACS 태풍 정보 가져오기
    // GDACS 사이트에서 XML을 가져온 후 태풍 detail 정보를 파싱합니다.
    const { data: xml } = await this.httpService.axiosRef.get(
      `https://www.gdacs.org/datareport/resources/TC/${gdacs_id}/rss_${gdacs_id}.xml`,
    );
    const {
      name,
      central_latitude,
      central_longitude,
      observation_date,
      start_date,
      maximum_wind_speed,
      grade,
    } = parseGDACS_XML(xml);
    // #endregion

    // #region DB 조회
    // DB에 태풍이 존재하는지 확인합니다.
    const typhoonFind: Prisma.TyphoonSelect = {
      typhoon_id: true,
      name: true,
      gdacs_id: true,
      start_date: true,
      end_date: true,
      historical_details: {
        select: {
          observation_date: true,
        },
        orderBy: {
          observation_date: 'desc',
        },
        where: {
          observation_date,
        },
      },
    };
    const exist = await this.prisma.typhoon.findFirst({
      select: typhoonFind,
      where: {
        OR: [
          {
            name,
            start_date,
          },
          {
            gdacs_id,
            start_date,
          },
          {
            start_date,
            historical_details: {
              some: {
                observation_date,
                central_latitude,
                central_longitude,
              },
            },
          },
        ],
      },
    });
    // #endregion

    const { pressure } =
      await this.weatherService.getTyphoonWeatherOpenWeatherMap({
        date: observation_date,
        lat: central_latitude,
        long: central_longitude,
      });
    // #region 태풍이 존재하지 않을 경우
    if (!exist) {
      this.logger.log(
        `[GDACS] 태풍 생성 :: name: ${name}, gdacs_id: ${gdacs_id}, envent_date: ${observation_date}`,
      );
      const typhoonDTO: Prisma.TyphoonCreateInput = {
        typhoon_id: ulid(),
        name,
        gdacs_id,
        start_date,
      };
      const around_weathers_circle =
        observation_date.getTime() > new Date('2022-06-08').getTime()
          ? await this.weatherService.getCircleAroundWeatherData(
              central_latitude,
              central_longitude,
              observation_date,
            )
          : await this.weatherService.getCircleAroundWeatherDataPast(
              central_latitude,
              central_longitude,
              observation_date,
            );

      const around_weathers_grid =
        observation_date.getTime() > new Date('2022-06-08').getTime()
          ? await this.weatherService.getGridAroundWeatherData(
              central_latitude,
              central_longitude,
              observation_date,
            )
          : await this.weatherService.getGridAroundWeatherDataPast(
              central_latitude,
              central_longitude,
              observation_date,
            );

      const detail: Prisma.TyphoonDetailCreateWithoutTyphoonInput = {
        observation_date,
        central_latitude,
        central_longitude,
        maximum_wind_speed,
        grade,
        grade_type: 'TY',
        central_pressure: pressure,
        around_weathers_circle: {
          createMany: { data: around_weathers_circle },
        },
        around_weathers_grid: {
          createMany: { data: around_weathers_grid },
        },
      };

      try {
        await this.prisma.typhoon.create({
          data: {
            ...typhoonDTO,
            historical_details: {
              create: detail,
            },
          },
        });
        return;
      } catch (e) {
        this.logger.error(e.message);
      }
    }
    // #endregion

    // gdacs에서 이름이 변경되었을경우 업데이트해준다.
    if (exist.name !== name) {
      this.logger.log(`[GDACS] 태풍 이름변경 :: ${exist.name} -> ${name}`);
      await this.prisma.typhoon.update({
        where: {
          typhoon_id: exist.typhoon_id,
        },
        data: {
          name,
        },
      });
    }

    // 태풍이 존재하지만 gdacs_id가 없을경우 추가해준다.
    if (!exist.gdacs_id) {
      try {
        await this.prisma.typhoon.update({
          where: {
            typhoon_id: exist.typhoon_id,
          },
          data: {
            gdacs_id,
          },
        });
      } catch (e) {
        this.logger.error(e);
      }
    }

    // #region DB에 태풍이 존재하고, 관찰 날짜가 같을 경우
    const now = new Date();
    now.setHours(now.getHours() - 12);
    // 업데이트가 12시간동안 이루어지지 않았다면 종료했다고 판단. 지닥스 업데이트 시간이 느려서 12시간전으로 설정
    if (
      exist.historical_details.length > 0 &&
      now.getTime() > new Date(observation_date).getTime()
    ) {
      this.logger.log(
        `[GDACS] 종료된 태풍 :: name: ${exist.name}, gdacs_id: ${event.id}, envent_date: ${event.date}`,
      );
      try {
        await this.prisma.typhoon.update({
          data: {
            end_date: observation_date,
          },
          where: {
            gdacs_id,
          },
        });
      } catch (e) {
        this.logger.error(e);
      }
      return;
    }
    // 관찰시간이 같으나 12시간이상이 지나지 않았다면 아직 태풍이 활동중이라고 판단.
    if (exist.historical_details.length > 0) {
      this.logger.log(
        `[GDACS] 태풍 정보 업데이트 안됨 :: name: ${exist.name}, gdacs_id: ${event.id}, envent_date: ${event.date}`,
      );
      return;
    }

    // #endregion

    // #region DB에 태풍이 존재하고, 관찰 날짜가 다름

    //태풍의 중심좌표와 8개의 1000km (45도 각도)를 구합니다.
    //구한 좌표를 기반으로 날씨정보를 가져옵니다.
    const around_weathers_circle =
      await this.weatherService.getCircleAroundWeatherData(
        central_latitude,
        central_longitude,
        observation_date,
      );
    const around_weathers_grid =
      await this.weatherService.getGridAroundWeatherData(
        central_latitude,
        central_longitude,
        observation_date,
      );
    const typhoonDetailDTO: TyphoonDetailDTO = {
      typhoon_id: exist.typhoon_id,
      observation_date,
      central_latitude,
      central_longitude,
      maximum_wind_speed,
      central_pressure: pressure,
      grade,
    };
    // 태풍 상세정보를 DB에 추가합니다.
    try {
      await this.prisma.typhoonDetail.create({
        data: {
          ...typhoonDetailDTO,
          around_weathers_circle: {
            createMany: { data: around_weathers_circle },
          },
          around_weathers_grid: {
            createMany: { data: around_weathers_grid },
          },
        },
      });
    } catch (e) {
      this.logger.error(e.message);
    }

    // #endregion

    // #region 예측데이터

    //가장 최근의 2점 가져오기
    const preprocessed_data = await this.typhoonService.getRecentTyphoonData(
      exist.typhoon_id,
    );

    //예측데이터 추가
    await this.typhoonService.predictTyphoonCircle(preprocessed_data);
    await this.typhoonService.predictTyphoonGrid(preprocessed_data);
    // #endregion
    const typhoonWithPredict = await this.prisma.typhoon.findFirst({
      where: { typhoon_id: exist.typhoon_id },
      include: {
        predictions_circle: {
          where: {
            observation_date,
          },
        },
        predictions_grid: {
          where: {
            observation_date,
          },
        },
      },
    });
    //SMS 전송
    typhoonWithPredict.predictions_circle.length > 0 &&
      (await this.eventEmitter.emit('typhoon.sms', {
        name: typhoonWithPredict.name,
        tyhoon_predictions: typhoonWithPredict.predictions_circle,
      }));
    typhoonWithPredict.predictions_grid.length > 0 &&
      (await this.eventEmitter.emit('typhoon.sms', {
        name: typhoonWithPredict.name,
        tyhoon_predictions: typhoonWithPredict.predictions_circle,
      }));
  }

  @OnEvent('typhoon.aerisweather.updated')
  async onTyphoonAerisweatherUpdated(typhoon: IAresWeatherData) {
    // #region data 가공
    const { id: aerisweather_id, profile, position } = typhoon;
    const {
      lifespan,
      maxStormCat,
      windSpeed,
      // boundingBox,
      name: aerisweather_name,
      year,
    } = profile;
    const { startDateTimeISO, endDateTimeISO } = lifespan;
    const { location, details, dateTimeISO } = position;
    const { maxKPH } = windSpeed;
    const { coordinates } = location;
    const { windRadii } = details;
    //DB에 저장할 데이터 가공
    const name =
      aerisweather_name.toUpperCase() + '-' + year.toString().slice(2);
    const [central_longitude, central_latitude] = coordinates;

    const start_date = new Date(startDateTimeISO);
    const end_date = endDateTimeISO ? new Date(endDateTimeISO) : undefined;
    const observation_date = new Date(dateTimeISO);
    const maximum_wind_speed = maxKPH;
    const grade_type = maxStormCat;
    const radius: IRadius = windRadii
      .map((raidus) => {
        const { quadrants, windSpeedKTS } = raidus;
        const { se, ne, sw, nw } = quadrants;
        if (windSpeedKTS === 34 || windSpeedKTS === 50 || windSpeedKTS === 64) {
          return {
            ['se_long_' + windSpeedKTS]: se.loc.long,
            ['se_lat_' + windSpeedKTS]: se.loc.lat,
            ['se_distance_' + windSpeedKTS]: se.distanceKM,
            ['ne_long_' + windSpeedKTS]: ne.loc.long,
            ['ne_lat_' + windSpeedKTS]: ne.loc.lat,
            ['ne_distance_' + windSpeedKTS]: ne.distanceKM,
            ['sw_long_' + windSpeedKTS]: sw.loc.long,
            ['sw_lat_' + windSpeedKTS]: sw.loc.lat,
            ['sw_distance_' + windSpeedKTS]: sw.distanceKM,
            ['nw_long_' + windSpeedKTS]: nw.loc.long,
            ['nw_lat_' + windSpeedKTS]: nw.loc.lat,
            ['nw_distance_' + windSpeedKTS]: nw.distanceKM,
          };
        }
      })
      .reduce((acc, cur) => {
        return { ...acc, ...cur };
      });
    // #endregion

    //#region DB 조회
    const typhoonFind: Prisma.TyphoonSelect = {
      typhoon_id: true,
      name: true,
      gdacs_id: true,
      aerisweather_id: true,
      start_date: true,
      end_date: true,
      historical_details: {
        select: {
          observation_date: true,
          source: true,
        },
        orderBy: {
          observation_date: 'desc',
        },
        where: {
          observation_date,
        },
      },
      around_weathers_circle: {
        where: {
          observation_date,
        },
      },
    };
    const exist = await this.prisma.typhoon.findFirst({
      select: typhoonFind,
      where: {
        OR: [
          { aerisweather_id, start_date },
          { name, start_date },
          {
            start_date,
            historical_details: {
              some: {
                observation_date,
                central_latitude,
                central_longitude,
              },
            },
          },
        ],
      },
    });
    const { pressure } =
      await this.weatherService.getTyphoonWeatherOpenWeatherMap({
        date: observation_date,
        lat: central_latitude,
        long: central_longitude,
      });
    //#endregion

    //DB에 없는 태풍이면 저장합니다.
    if (!exist) {
      this.logger.log(
        `[aerisweather] 태풍 생성 :: aerisweather_id: ${aerisweather_id}, envent_date: ${observation_date}`,
      );

      const typhoonDTO: Prisma.TyphoonCreateInput = {
        typhoon_id: ulid(),
        name,
        aerisweather_id,
        start_date,
      };
      const around_weathers_circle =
        await this.weatherService.getCircleAroundWeatherData(
          central_latitude,
          central_longitude,
          observation_date,
        );
      const around_weathers_grid =
        await this.weatherService.getGridAroundWeatherData(
          central_latitude,
          central_longitude,
          observation_date,
        );
      const detail: Prisma.TyphoonDetailCreateWithoutTyphoonInput = {
        observation_date,
        central_latitude,
        central_longitude,
        maximum_wind_speed,
        grade: Grade[grade_type],
        grade_type: grade_type === 'STY' ? 'TY' : grade_type,
        central_pressure: pressure,
        around_weathers_circle: {
          createMany: { data: around_weathers_circle },
        },
        around_weathers_grid: {
          createMany: { data: around_weathers_grid },
        },
      };

      try {
        await this.prisma.typhoon.create({
          data: {
            ...typhoonDTO,
            historical_details: {
              create: detail,
            },
          },
        });
        return;
      } catch (e) {
        this.logger.error(e.message);
      }
    }

    // end_date가 있다는 것은 태풍이 종료됨을 의미합니다.
    if (end_date) {
      await this.prisma.typhoon.update({
        where: { typhoon_id: exist.typhoon_id },
        data: {
          end_date,
        },
      });
    }

    // 존재는 하지만 aerisweather_id가 없는 경우
    if (!exist.aerisweather_id) {
      await this.prisma.typhoon.update({
        where: { typhoon_id: exist.typhoon_id },
        data: {
          aerisweather_id,
        },
      });
    }
    // detail 정리
    const historical_details: Prisma.TyphoonDetailUncheckedCreateInput = {
      typhoon_id: exist.typhoon_id,
      observation_date,
      central_longitude,
      central_latitude,
      maximum_wind_speed,
      central_pressure: pressure,
      grade_type,
      grade: Grade[grade_type],
      source: 'AERISWEATHER',
      ...radius,
    };
    //존재하고 historical_details 가 === 0인경우
    if (exist.historical_details.length === 0) {
      this.logger.log(
        `[aerisweather] 태풍 detatil 생성 :: aerisweather_id: ${aerisweather_id}, envent_date: ${observation_date}`,
      );
      const around_weathers_circle =
        await this.weatherService.getCircleAroundWeatherData(
          central_latitude,
          central_longitude,
          observation_date,
        );
      const around_weathers_grid =
        await this.weatherService.getGridAroundWeatherData(
          central_latitude,
          central_longitude,
          observation_date,
        );

      await this.prisma.typhoonDetail.create({
        data: {
          ...historical_details,
          around_weathers_circle: {
            createMany: { data: around_weathers_circle },
          },
          around_weathers_grid: {
            createMany: { data: around_weathers_grid },
          },
        },
      });

      //가장 최근의 2점 가져오기
      const preprocessed_data = await this.typhoonService.getRecentTyphoonData(
        exist.typhoon_id,
      );

      //예측데이터 추가
      await this.typhoonService.predictTyphoonCircle(preprocessed_data);
      await this.typhoonService.predictTyphoonGrid(preprocessed_data);
      //예측데이터 추가
      const typhoonWithPredict = await this.prisma.typhoon.findFirst({
        where: { typhoon_id: exist.typhoon_id },
        include: {
          predictions_circle: {
            where: {
              observation_date,
            },
          },
          predictions_grid: {
            where: {
              observation_date,
            },
          },
        },
      });
      //SMS 전송
      typhoonWithPredict.predictions_circle.length > 0 &&
        (await this.eventEmitter.emit('typhoon.sms', {
          name: typhoonWithPredict.name,
          tyhoon_predictions: typhoonWithPredict.predictions_circle,
        }));
      typhoonWithPredict.predictions_grid.length > 0 &&
        (await this.eventEmitter.emit('typhoon.sms', {
          name: typhoonWithPredict.name,
          tyhoon_predictions: typhoonWithPredict.predictions_circle,
        }));
    }
    if (
      exist.historical_details.length > 0 &&
      exist.historical_details[0].source === 'GDACS'
    ) {
      this.logger.log(
        `[aerisweather] 태풍 detatil 업데이트 :: aerisweather_id: ${aerisweather_id}, envent_date: ${observation_date}`,
      );

      await this.prisma.typhoonDetail.update({
        where: {
          typhoon_id_observation_date: {
            typhoon_id: exist.typhoon_id,
            observation_date,
          },
        },
        data: historical_details,
      });

      return;
    }

    this.logger.log(
      `[aerisweather] 태풍 정보 업데이트 안됨 :: aerisweather_id: ${aerisweather_id}, envent_date: ${observation_date}`,
    );
    return;
  }
}

interface IRadius {
  se_long_34?: number;
  se_lat_34?: number;
  se_distance_34?: number;
  ne_long_34?: number;
  ne_lat_34?: number;
  ne_distance_34?: number;
  sw_long_34?: number;
  sw_lat_34?: number;
  sw_distance_34?: number;
  nw_long_34?: number;
  nw_lat_34?: number;
  nw_distance_34?: number;
  se_long_50?: number;
  se_lat_50?: number;
  se_distance_50?: number;
  ne_long_50?: number;
  ne_lat_50?: number;
  ne_distance_50?: number;
  sw_long_50?: number;
  sw_lat_50?: number;
  sw_distance_50?: number;
  nw_long_50?: number;
  nw_lat_50?: number;
  nw_distance_50?: number;
  se_long_64?: number;
  se_lat_64?: number;
  se_distance_64?: number;
  ne_long_64?: number;
  ne_lat_64?: number;
  ne_distance_64?: number;
  sw_long_64?: number;
  sw_lat_64?: number;
  sw_distance_64?: number;
  nw_long_64?: number;
  nw_lat_64?: number;
  nw_distance_64?: number;
}
