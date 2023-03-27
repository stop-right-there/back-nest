import { ApiResponse } from '@common/response/ApiResponse';
import { apiResponeStatus } from '@common/response/ApiStatusResponse';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ApiResponse<string> {
    const result = this.appService.getHello();

    return new ApiResponse(apiResponeStatus.SUCCESS, result);
  }

  /** 독 예시 */
  // @ApiOperation({
  //   summary: '상품 생성 API',
  //   description: `
  //     상품 생성 API입니다
      
  //     필요한정보.
  //     - name: 상품 이름 - String
  //     - price: 상품 가격 - BigInt
  //     - introduce: 상품 소개 - String
  //     - quantity: 상품 개수 - Number
  //     - product_status: Enum (E_ProductStatus)
  //     - archive_id: 아카이브 id - String ULID
  //     - category_id: 카테고리 id - String ULID
  //   `,
  // })
  // @ApiBody({
  //   schema: { $ref: getSchemaPath(ProductCreateInputDTO) },
  //   examples: {
  //     PRODUCT: {
  //       description: `상품생성 예시`,
  //       value: productCreateInputEX,
  //     },
  //   },
  // })
  // @ApiResponseDTO(
  //   201,
  //   new BaseResponse(baseResponeStatus.SUCCESS, productCreateResponseEX),
  //   '성공',
  // )
  // @ApiResponseDTO(
  //   400.2,
  //   baseResponeStatus.ARCHIVE_NOT_EXIST,
  //   '아카이브가 존재하지 않을때',
  // )
  // @ApiResponseDTO(
  //   400.1,
  //   baseResponeStatus.CATEGORY_NOT_EXIST,
  //   '카테고리가 존재하지 않을때',
  // )
  // @UseGuards(JwtAccessAuthGuard, AdminAuthGuard)
  // @Post('/')
  // async createProduct(@Body() productCreateInputDTO: ProductCreateInputDTO) {
  //   const result = await this.productService.createProduct(
  //     productCreateInputDTO,
  //   );

  //   return new BaseResponse(baseResponeStatus.SUCCESS, result);
  // }

}
