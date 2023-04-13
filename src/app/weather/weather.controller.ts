import { SwaggerResponse } from '@common/decorator/SwaggerResponse.decorator';
import { baseApiResponeStatus } from '@common/response/baseApiResponeStatus';

import {
  BadRequestException,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';
import { BaseApiResponse } from '../../common/response/BaseApiResponse';
import { weatherMock } from './mock/weather.mock';
import { WeatherService } from './provider/weather.service';
import { WeatherResponse } from './res/weather.res';
import { WeatherQuery } from './type/weatherQuery.type';

@Controller('/weathers')
@ApiTags('WEATHER')
@ApiExtraModels(WeatherResponse)
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOperation({
    summary: '날씨 조회 API * 현재 목업 데이터를 응답합니다.',
    description: `
      * 현재 목업 데이터를 응답합니다.

      날씨 조회 api 입니다.
      현재 날씨 및 일기예보를 응답합니다. 
      query :
        lat ?: 위도 
        lon ?: 경도 
        start_date ?: yyyy-mm-dd (과거 날씨를 조회할때 시작날짜)
        end_date ?: yyyy-mm-dd  (과거 날씨를 조회할때 종료날짜)
        period: 기간 (n일 뒤 혹은 n일 전까지)
        city ?: 도시명 (도시 영문명으로 요청시 현재 도시의 날씨를 응답합니다.) 
        forecast_days? : 예보일 (1, 3 ,7)
        /* 위도 경도 도시명을 동시에 보낼시 위도 경도 값을 사용하여 날씨를 응답합니다. */
    `,
  })
  @ApiQuery({ name: 'lat', type: 'number', required: false })
  @ApiQuery({ name: 'lon', type: 'number', required: false })
  @ApiQuery({ name: 'start_date', type: 'string', required: false })
  @ApiQuery({ name: 'end_date', type: 'string', required: false })
  @ApiQuery({ name: 'period', type: 'number', required: false })
  @ApiQuery({ name: 'city', type: 'string', required: false })
  @ApiQuery({ name: 'forecast_days', type: 'Date', required: false })
  @SwaggerResponse(
    200,
    WeatherResponse,
    false,
    '성공',
    baseApiResponeStatus.SUCCESS,
    weatherMock,
  )
  @Get(':lat/:lon') //도시,국가 받아오기
  async getCity(@Param('lat') lat: number, @Param('lon') lon: number) {
    const cityData = await this.weatherService.getCity(lat, lon);
    return cityData;
  }

  @Get('cities')
  async getCitiesByOverpass(@Query('coords') coords: string) {
    console.log('start');
    const c = coords.split(',').map(parseFloat);
    const cities = await this.weatherService.getCitiesByOverpass(c);
    return cities;
  }
  /*
날씨 데이터 가져오는 흐름도 입니다

1. 위도 경도는 param으로, 시작날짜 / 종료 날짜 / 기간은 query로 받아옵니다.
2. 시작날짜와 기간만 있는 경우 종료 날짜를 정해줍니다
3. 종료날짜와 기간만 있는 경우 시작날짜를 정해줍니다.
4. getDateRange를 이용해 필요한 


4. 반복문을 실행시킬 date, end_date를 설정해줍니다.
5. 반복문을 실행하면서 (해당 date와 city 정보가 담겨있는)'yyyy-mm-dd-city' 형식의 key로 저장되어 있는 데이터가 있는지 확인합니다.

**데이터가 있다면
-> cacheManager로 불러오기

**데이터가 없다면
-> weatherService.getWeatherData 함수 실행
-> open-meteo api를 이용해서 해당 날짜와 필요한 데이터들을 가져와 저장해줍니다.
-> 이때 ttl은 3600초(1시간)으로 설정해두었습니다.
*/
  @Get('') // 날씨 데이터 가져오기
  async getWeather(@Query() query: WeatherQuery) {
    const { lat, lon, start_date, end_date, period, city, forecast_days } =
      query;
    let city_name = city;
    if (!city) {
      const cityData = await this.weatherService.getCity(lat, lon);
      city_name = cityData.city;
    }

    if (forecast_days) {
      if (start_date || end_date || period)
        return new BadRequestException(
          'need query start_date / end_date / period  or only forecast_days',
        );
    }
    const startDate = start_date
      ? new Date(start_date)
      : forecast_days
      ? new Date()
      : period
      ? new Date(new Date(end_date).getTime() - period * 24 * 60 * 60 * 1000)
      : new Date(new Date(end_date).getTime() - 7 * 24 * 60 * 60 * 1000);

    const endDate = end_date
      ? new Date(end_date)
      : forecast_days
      ? new Date(new Date().getTime() + forecast_days * 24 * 60 * 60 * 1000)
      : period
      ? new Date(new Date(start_date).getTime() + period * 24 * 60 * 60 * 1000)
      : new Date(new Date(start_date).getTime() + 7 * 24 * 60 * 60 * 1000);

    console.log(startDate, endDate);

    const dateRange = await this.weatherService.getDateRange(
      startDate,
      endDate,
    );
    const weatherList = [];
    //return dateRange;
    await Promise.all(
      dateRange.map(async (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const dateString = `${yyyy}-${mm}-${dd}`;
        const key = `${yyyy}-${mm}-${dd}-${city_name}`;
        console.log(key);

        const savedWeather = await this.cacheManager.get<string>(key);
        if (savedWeather) {
          //있다면 불러오기
          return savedWeather;
        } else {
          //없다면 api콜
          const weatherData = await this.weatherService.getWeatherData({
            lat,
            lon,
            dateString,
            city_name,
          });
          await this.cacheManager.set(key, weatherData, 3600);
          weatherList.push(weatherData);
        }
      }),
    );
    return new BaseApiResponse(baseApiResponeStatus.SUCCESS, weatherList);
  }

  /*
  //cache test:in-memory
  @Get('/cache')
  async getCache(): Promise<string> {
    const savedTime = await this.cacheManager.get<number>('time');
    if (savedTime) {
      return 'saved time : ' + savedTime;
    }
    const now = new Date().getTime();
    await this.cacheManager.set('time', now);
    return 'save new time : ' + now;
  }
  */
}
