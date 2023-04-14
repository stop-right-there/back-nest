import { SwaggerResponse } from '@common/decorator/SwaggerResponse.decorator';
import { baseApiResponeStatus } from '@common/response/baseApiResponeStatus';
import {
  BadRequestException,
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Cache } from 'cache-manager';

import { GetCityQuery } from './interfaces/getCityQuery.interface';
import { WeatherQuery } from './interfaces/weatherQuery.interface';

import { citiesMock } from './mock/cities.mock';
import { cityMock } from './mock/city.mock';
import { weatherMock } from './mock/weather.mock';
import { WeatherService } from './provider/weather.service';
import { CityResponse } from './res/city.res';
import { WeatherResponse } from './res/weather.res';

@Controller('/weathers')
@ApiTags('WEATHER')
@ApiExtraModels(WeatherResponse)
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOperation({
    summary: '날씨 조회 API',
    description: `
      날씨 조회 api 입니다.
      현재 날씨 및 일기예보를 응답합니다. 
      query :
        lat ?: 위도 
        lon ?: 경도 
        start_date ?: yyyy-mm-dd (과거 날씨를 조회할때 시작날짜)
        end_date ?: yyyy-mm-dd  (과거 날씨를 조회할때 종료날짜)
        period: 기간 (n일 뒤 혹은 n일 전까지)
        city ?: 도시명 (도시 영문명으로 요청시 현재 도시의 날씨를 응답합니다.) 
        forecast_days? : 예보일 단위 (최대 7일) 
        /* 위도 경도 도시명을 동시에 보낼시 위도 경도 값을 사용하여 날씨를 응답합니다. */
        /* forecast_days 쿼리를 사용하려면 유일하게 사용해야합니다. 
        start_date || end_date || period가 있으면 에러를 리턴합니다 */
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
    true,
    '성공',
    baseApiResponeStatus.SUCCESS,
    weatherMock,
  )
  @SwaggerResponse(
    400,
    null,
    false,
    '실패',
    baseApiResponeStatus.WEATHER_QUERY_FAIL,
  )
  @Get('') // 날씨 데이터 가져오기
  async getWeather(@Query() query: WeatherQuery) {
    /*
      날씨 데이터 가져오는 흐름도 입니다

      1. 쿼리로 city(도시 이름)가 받아지는지 확인하고, 아니라면 getCity() 함수로 받아옵니다.
      2. forecast_days 쿼리를 사용하려면 유일하게 사용해야합니다.  start_date || end_date || period기 있으면 에러를 리턴합니다.
      3. 시작날짜와 기간만 있는 경우 종료 날짜를 정해줍니다. (period 기간이 설정되어있지 않다면 7일입니다)
      4. 종료날짜와 기간만 있는 경우 시작날짜를 정해줍니다. (period 기간이 설정되어있지 않다면 7일입니다)
      5. forecast_days 쿼리가 있다면 현재 날짜부터 해당되는 날짜 만큼 기간을 정해줍니다.
      6. getDateRange()를 이용해 순회할 날짜 배열을 리턴합니다.
      7. 날짜마다 (해당 date와 city 정보가 담겨있는)'yyyy-mm-dd-city' 형식의 key로 저장되어 있는 데이터가 있는지 확인합니다.

      **데이터가 있다면
      -> cacheManager로 불러오기

      **데이터가 없다면
      -> weatherService.getWeatherData 함수 실행
      -> open-meteo api를 이용해서 해당 날짜와 필요한 데이터들을 가져와 저장해줍니다.
      -> 이때 ttl은 3600초(1시간)으로 설정해두었습니다.
    */
    const { lat, lon, start_date, end_date, period, city, forecast_days } =
      query;
    let city_name = city;
    if (!city) {
      const cityData = await this.weatherService.getCity(lat, lon);
      city_name = cityData.city;
    }

    if (forecast_days) {
      if (start_date || end_date || period)
        throw new BadRequestException(
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

    const dateRange = await this.weatherService.getDateRange(
      startDate,
      endDate,
    );
    //return dateRange;
    const weatherList = await Promise.all(
      dateRange.map(async (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const dateString = `${yyyy}-${mm}-${dd}`;
        const key = `${yyyy}-${mm}-${dd}-${city_name}`;

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
          return weatherData;
        }
      }),
    );
    return weatherList;
  }

  @ApiOperation({
    summary: '도시, 국가 조회 API',
    description: `
      좌표로 도시, 국가 조회 api 입니다.
      도시와 국가 코드를 반환합니다
      query :
        lat ?: 위도 
        lon ?: 경도 
    `,
  })
  @ApiQuery({ name: 'lat', type: 'number', required: true })
  @ApiQuery({ name: 'lon', type: 'number', required: true })
  @SwaggerResponse(
    200,
    CityResponse,
    false,
    '성공',
    baseApiResponeStatus.SUCCESS,
    cityMock,
  )
  @SwaggerResponse(
    400,
    null,
    false,
    '실패',
    baseApiResponeStatus.CITY_QUERY_FAIL,
  )
  @Get('city') //도시,국가 받아오기
  async getCity(@Query() query: GetCityQuery) {
    const { lat, lon } = query;
    if (!lat || !lon)
      throw new BadRequestException('lat, lon queries are all needed');
    const cityData = await this.weatherService.getCity(lat, lon);
    return cityData;
  }

  @ApiOperation({
    summary: 'Overpass-api로 두 좌표 내 도시리스트 조회 API',
    description: `
      두 좌표로 이루어진 사각형 안의 도시들을 조회하는 api 입니다.  
      coords: 좌표 문자열은 남,서,북,동 값으로 이루어집니다.(최소 위도, 최소 경도, 최대 위도, 최대 경도)
      도시 배열을 반환합니다.
    `,
  })
  @ApiQuery({ name: 'coords', type: 'string', required: true })
  @SwaggerResponse(
    200,
    CityResponse,
    true,
    '성공',
    baseApiResponeStatus.SUCCESS,
    citiesMock,
  )
  @SwaggerResponse(
    400,
    null,
    false,
    '실패',
    baseApiResponeStatus.CITY_QUERY_FAIL,
  )
  @Get('cities')
  async getCitiesByOverpass(@Query('coords') coords: string) {
    const c = coords.split(',').map(parseFloat);
    if (c.length != 4) throw new BadRequestException('need 4 coords');
    const cities = await this.weatherService.getCitiesByOverpass(c);
    return cities;
  }
}
