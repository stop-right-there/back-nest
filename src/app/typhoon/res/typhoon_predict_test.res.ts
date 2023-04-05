import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { TyphoonDetailDTO } from '../dto/typhoon_detail.dto';

// AI 서버 보내기용
@ApiExtraModels(TyphoonDetailDTO)
export class TyphoonPredictionResponse {
  @ApiProperty({
    name: 'typhoon_id',
    description: '태풍 id',
    type: 'number',
  })
  typhoon_id: number;

  @ApiProperty({
    name: 'name',
    description: '태풍 이름',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    name: 'start_date',
    description: '태풍 시작 날짜',
    type: 'Date',
  })
  start_date: string | Date;

  @ApiProperty({
    name: 'end_date',
    description: '태풍 종료 날짜',
    type: 'Date',
  })
  end_date?: string | Date;

  @ApiProperty({
    name: 'historical_details',
    description: '과거 태풍 정보',
    type: () => TyphoonDetailDTO,
    isArray: true,
  })
  historical_details: TyphoonDetailDTO[];
}
