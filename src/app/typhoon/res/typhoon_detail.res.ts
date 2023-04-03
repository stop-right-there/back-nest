import { TyphoonDTO } from '@app/typhoon/dto/typhoon.dto';
import { TyphoonDetailDTO } from '@app/typhoon/dto/typhoon_detail.dto';
import { ApiProperty } from '@nestjs/swagger';
export class TyphoonDetailResponse extends TyphoonDTO {
  @ApiProperty({
    isArray: false,
    type: () => TyphoonDetailDTO,
    description: '현재 태풍 정보',
  })
  current_detail: TyphoonDetailDTO;

  @ApiProperty({
    isArray: true,
    type: () => TyphoonDetailDTO,
    description: '과거 태풍 정보',
  })
  historical_details: TyphoonDetailDTO[];
  @ApiProperty({
    isArray: true,
    type: () => TyphoonDetailDTO,
    description: '예측 태풍 정보',
  })
  predictions: any[];
  news: any[];
}
