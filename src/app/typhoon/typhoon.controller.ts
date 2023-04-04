import { SwaggerResponse } from '@common/decorator/SwaggerResponse.decorator';
import { BaseApiResponse } from '@common/response/BaseApiResponse';
import { baseApiResponeStatus } from '@common/response/baseApiResponeStatus';
import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { typhoon_HINAMNOR } from './mock/typhoon.mock';
import { TyphoonDetailResponse } from './res/typhoon_detail.res';
import { TyphoonListResponseItem } from './res/typhoon_list.res';
import { TyphoonQuery } from './type/typhoonQuery.type';
import { TyphoonScheduler } from './typhoon.scheduler';
import { TyphoonService } from './typhoon.service';

@Controller('/typhoons')
@ApiTags('TYPHOON')
@ApiExtraModels(TyphoonListResponseItem, TyphoonDetailResponse, BaseApiResponse)
export class TyphoonController {
  constructor(
    private readonly typhoonService: TyphoonService,
    private readonly typhoonScheduler: TyphoonScheduler,
  ) {}

  @ApiOperation({
    summary: '태풍 리스트 조회 API',
    description: `
      전세계 태풍을 조회하는 API 입니다.
      
      현재 schema는 예상 응답값 입니다.
    `,
  })
  @SwaggerResponse(
    200, // status code
    TyphoonListResponseItem, // result에 담길 DTO
    true, // result 가 array인지
    '성공시', // description
    baseApiResponeStatus.SUCCESS, // status
    [typhoon_HINAMNOR], // result mock
  )
  @ApiQuery({
    name: 'startDate',
    description: `시작 날짜
    *** 서버에서 UTC + 0 으로 변환 시킵니다.
    
    startDate가 없을시 현재 진행중인 태풍만 반환합니다.

    `,
    required: false,
    example: 'Sun, 28 Aug 2022 06:00:00 GMT',
  })
  @ApiQuery({
    name: 'endDate',
    description: `종료 날짜
    *** 서버에서 UTC + 0 으로 변환 시킵니다.  
    endDate는 과거 태풍을 조회할때 사용합니다.
    endDate가 없을시 현재 진행중인 태풍만 반환합니다.
    `,
    required: false,
    example: 'Sun, 28 Aug 2022 06:00:00 GMT',
  })
  @ApiQuery({
    name: 'period',
    description: `기간
    *** 시작 날짜와 종료날짜 둘다 있을시 이것은 무시합니다.

    startDate와 period가 있을시
    시작날짜 ~ 시작날짜 + period 만큼의 기간동안 활성화된 태풍을 조회합니다.

    endDate와 period가 있을시
    종료날짜 - period ~ 종료날짜 만큼의 기간동안 활성화된 태풍을 조회합니다.

    period를 입력하지 않을시 기본값은 7일 입니다.
    `,
    required: false,
    example: '7',
  })
  @Get('/')
  async getTyphoonList(@Query() query: TyphoonQuery) {
    const { startDate, endDate, period } = query;
    console.log(query);
    const typhoonList = await this.typhoonService.getTyphoonList({
      start_date: startDate && new Date(startDate),
      end_date: endDate && new Date(endDate),
      period: period ? Number(period) : 7,
    });

    return new BaseApiResponse(baseApiResponeStatus.SUCCESS, typhoonList);
  }

  @ApiOperation({
    summary: '태풍 상세 조회 API ',
    description: `
      특정 태풍 상세정보 조회 API 입니다.
      
      현재 schema는 예상 응답값 입니다.
    `,
  })
  @SwaggerResponse(
    200, // status code
    TyphoonDetailResponse, // result에 담길 DTO
    false, // result 가 array인지
    '성공시', // description
    baseApiResponeStatus.SUCCESS,
    typhoon_HINAMNOR,
  )
  //TODO API Param decorator 개발 필요.
  @ApiParam({
    type: 'number',
    required: true,
    name: 'typhoon_id',
    example: typhoon_HINAMNOR.typhoon_id,
  })
  @Get('/:typhoon_id')
  async getTyphoonDetail(
    @Param() { typhoon_id }: { typhoon_id: string },
  ): Promise<BaseApiResponse<TyphoonDetailResponse>> {
    const typhoon = await this.typhoonService.getTyphoonDetail(
      Number(typhoon_id),
    );
    if (typhoon.end_date)
      return new BaseApiResponse(baseApiResponeStatus.SUCCESS, { ...typhoon });

    return new BaseApiResponse(baseApiResponeStatus.SUCCESS, typhoon);
  }
}
