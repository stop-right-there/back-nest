import { getNineCoordinates } from '@common/util/getNineCoordinates';
import { parseGDACS_XML } from '@common/util/parseGDACS_XML';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TyphoonDTO } from '../dto/typhoon.dto';
import { TyphoonAroundWeatherDTO } from '../dto/typhoon_arount_weather.dto';
import { TyphoonDetailDTO } from '../dto/typhoon_detail.dto';
import { GDASCTyphoonUpdatedEvent } from '../event/typhoon-updated.envent';

@Injectable()
export class TyphoonUpdatedListener {
  private readonly logger = new Logger(TyphoonUpdatedListener.name);
  constructor(private readonly httpService: HttpService) {}

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
  @OnEvent('typhoon.updated')
  async handleTyphoonUpdatedEvent(event: GDASCTyphoonUpdatedEvent) {
    this.logger.log(
      `태풍 이벤트 발생 :: typhoon_id: ${event.id}, envent_date: ${event.date}`,
    );
    const { id, date } = event;

    const { data: xml } = await this.httpService.axiosRef.get(
      `https://www.gdacs.org/datareport/resources/TC/${id}/rss_${id}.xml`,
    );

    // GDACS 사이트에서 제공하는 XML에서  태풍 detail 정보를 파싱합니다.
    const {
      name,
      central_latitude,
      central_longitude,
      observation_date,
      start_date,
      maximum_wind_speed,
      grade,
    } = parseGDACS_XML(xml);
    console.log(
      name,
      central_latitude,
      central_longitude,
      observation_date,
      start_date,
      maximum_wind_speed,
      grade,
    );

    // ==============================================================
    // 태풍이 DB에 존재하지 않을경우 추가하기위해 태풍 DTO를 생성합니다.
    const typhoonDTO: TyphoonDTO = {
      name,
      typhoon_id: id,
      start_date: start_date.toUTCString(),
    };

    // ==============================================================

    //태풍 중심부 기압을 받아옵니다.
    //관측은 과거에 이루어지기에 timemachine을 사용합니다.
    const { data: openWeatherMapRes } = await this.httpService.axiosRef
      .get(
        `https://api.openweathermap.org/data/3.0/onecall/timemachine?dt=${
          observation_date.getTime() / 1000
        }&lat=${central_latitude}&lon=${central_longitude}&appid=${
          process.env.OPEN_WEATHER_API_KEY
        }&type=hour`,
      )
      .catch((e) => {
        console.log(e.message);
        `1`;
        return { data: {} };
      });

    const { data: weatherData } = openWeatherMapRes;
    const { pressure } = weatherData[0];
    const typhoonDetailDTO: TyphoonDetailDTO = {
      typhoon_id: id,
      observation_date: observation_date.toUTCString(),
      central_latitude,
      central_longitude,
      maximum_wind_speed,
      central_pressure: pressure as number,
      //   wind_radius,
      grade,
    };
    console.log(typhoonDetailDTO);
    //태풍의 중심좌표와 8개의 1000km (45도 각도)를 구합니다.
    const ninePoint = getNineCoordinates(central_latitude, central_longitude);

    // date를 년도 월 일 시간으로 분리합니다
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString();
    const day = date.getUTCDate().toString();
    const hour = date.getUTCHours().toString();

    // 이후 날씨 서비스에 있는 조회 메소드를 이용하여  ninePoint에 대한 날씨 정보를 불러옵니다.
    // 날씨 서비스가 완성되면 수정을 해야합니다.
    // 날씨 서비스를 연동하기전까지는 axioService를 이용하여 날씨 정보를 불러옵니다.
    // ================================날씨 서비스로 교체해야할부분============================================
    const arroundWeaherList: TyphoonAroundWeatherDTO[] = await Promise.all(
      ninePoint.map(async ({ latitude, longitude }, index) => {
        const { data } = await this.httpService.axiosRef.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(
            4,
          )}&longitude=${longitude.toFixed(4)}&start_date=${year}-${
            month.length === 1 ? '0' + month : month
          }-${day.length === 1 ? '0' + day : day}&end_date=${year}-${
            month.length === 1 ? '0' + month : month
          }-${
            day.length === 1 ? '0' + day : day
          }&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,windspeed_10m,windspeed_80m,windspeed_120m,windspeed_180m,winddirection_10m,winddirection_120m,windgusts_10m,direct_normal_irradiance`,
        );
        // 응답받은 데이터에서 hourly 정보만 추출합니다.
        const { hourly } = data;
        // hourly 정보에서 필요한 정보만 추출합니다.
        const {
          temperature_2m,
          relativehumidity_2m,
          pressure_msl,
          cloudcover,
          cloudcover_low,
          cloudcover_mid,
          direct_normal_irradiance,
          apparent_temperature,
          windspeed_10m,
          windspeed_120m,
          winddirection_10m,
          winddirection_120m,
          windgusts_10m,
        } = hourly;
        return {
          typhoon_id: id,
          observation_date: observation_date.toUTCString(),
          point: index,
          temperature_2m: temperature_2m[Number(hour)] as number,
          relativehumidity_2m: relativehumidity_2m[Number(hour)] as number,
          apparent_temperature: apparent_temperature[Number(hour)] as number,
          pressure_msl: pressure_msl[Number(hour)] as number,
          cloudcover: cloudcover[Number(hour)] as number,
          cloudcover_low: cloudcover_low[Number(hour)] as number,
          cloudcover_mid: cloudcover_mid[Number(hour)] as number,
          direct_normal_irradiance: direct_normal_irradiance[
            Number(hour)
          ] as number,
          windspeed_10m: windspeed_10m[Number(hour)] as number,
          windspeed_100m: windspeed_120m[Number(hour)] as number,
          winddirection_10m: winddirection_10m[Number(hour)] as number,
          winddirection_100m: winddirection_120m[Number(hour)] as number,
          windgusts_10m: windgusts_10m[Number(hour)] as number,
        };
      }),
    );
    // =================================================================================================

    // 태풍 주변 날씨 정보를 저장하는 코드를 작성해야합니다. 아직 DB를 구축하지 않았기에 생략합니다.
    //=================================주변 날씨를 저장하는 코드 작성해야할부분==================================
    arroundWeaherList.forEach((arroundWeaher) => {
      //arroundWeaher
      //   console.log(arroundWeaher);
    });
    //=================================================================================================
  }
}