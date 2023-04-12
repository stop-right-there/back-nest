import { TyphoonDTO } from '@app/typhoon/dto/typhoon.dto';
import { TyphoonDetailDTO } from '@app/typhoon/dto/typhoon_detail.dto';
import { ApiProperty } from '@nestjs/swagger';
export class TyphoonDetailResponse extends TyphoonDTO {
  @ApiProperty({
    isArray: false,
    required: false,
    type: () => TyphoonDetailDTO,
    description: '현재 태풍 정보 현재 활성화중인 태풍만 값을 반환합니다.',
  })
  current_detail?: TyphoonDetailDTO;

  @ApiProperty({
    isArray: true,
    type: () => TyphoonDetailDTO,
    description: '과거 태풍 정보 리스트',
  })
  historical_details: TyphoonDetailDTO[];

  @ApiProperty({
    isArray: true,
    type: () => TyphoonDetailDTO,
    description: '예측 태풍 정보 아직 구현되지 않음',
  })
  predictions?: any[];
  news?: any[];
}
