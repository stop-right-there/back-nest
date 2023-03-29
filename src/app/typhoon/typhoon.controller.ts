import { SwaggerResponse } from '@common/decorator/SwaggerResponse.decorator';
import { baseApiResponeStatus } from '@common/response/baseApiResponeStatus';
import { BaseApiResponse } from '@common/response/BaseApiResponse';
import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TyphoonDetailResponse } from './res/typhoon_detail.res';
import { TyphoonListResponseItem } from './res/typhoon_list.res';

@Controller('/typhoons')
@ApiTags('TYPHOON')
@ApiExtraModels(TyphoonListResponseItem, TyphoonDetailResponse, BaseApiResponse)
export class typhoonController {
  @ApiOperation({
    summary: '태풍 리스트 조회 API * 현재 목업 데이터 제작중입니다.',
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
    [{ user_id: 'asdf' }], // result mock
  )
  // @SwaggerResponse(400.1, undefined, false, '에러', baseApiResponeStatus.FAIL)
  @Get('/')
  async getTyphoonList() {
    console.log(process.env.PORT);
    return 'hi';
  }

  @ApiOperation({
    summary: '태풍 상세 조회 API * 현재 목업 데이터 제작중입니다.',
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
  )
  @Get('/:typhoon_id')
  async getTyphoonDetail() {
    console.log(process.env.PORT);
    return 'hi';
  }
}
