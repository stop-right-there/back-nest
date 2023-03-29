import { baseApiResponeStatus } from '@common/response/baseApiResponeStatus';
import { BaseApiResponse } from '@common/response/BaseApiResponse';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { weatherMock } from './mock/weather.mock';

@Controller('/weathers')
@ApiTags('WHEATHER')
export class WeatherController {
  @ApiOperation({
    summary: '날씨 조회 API * 현재 목업 데이터를 응답합니다.',
    description: `
      * 현재 목업 데이터를 응답합니다.

      날씨 조회 api 입니다.
      현재 날씨 및 일기예보를 응답합니다. 
      query :
        lat ?: 위도 
        lon ?: 경도 
        start_date ?: 시간  (과거 날씨를 조회할때 시작날짜)
        end_date ?: 시간  (과거 날씨를 조회할때 종료날짜)
        city ?: 도시명 (도시 영문명으로 요청시 현재 도시의 날씨를 응답합니다.) 
        forecast_days? : 예보일 (1, 3 ,7 ,30)
        /* 위도 경도 도시명을 동시에 보낼시 위도 경도 값을 사용하여 날씨를 응답합니다. */
    `,
  })
  @ApiQuery({ name: 'lat', type: 'number', required: false })
  @ApiQuery({ name: 'lon', type: 'number', required: false })
  @ApiQuery({ name: 'start_date', type: 'Date', required: false })
  @ApiQuery({ name: 'end_date', type: 'Date', required: false })
  @ApiQuery({ name: 'forecast_days', type: 'Date', required: false })
  @ApiQuery({ name: 'city', type: 'sting', required: false })
  @Get('')
  async getTyphoonList(
    @Query() query: { lat: string; lon: string; startDate: string },
  ) {
    console.log(query);
    return new BaseApiResponse(baseApiResponeStatus.SUCCESS, weatherMock);
  }
}
