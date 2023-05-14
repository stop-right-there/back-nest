import { ApiProperty } from '@nestjs/swagger';
import { GRADE_TYPE, TyphoonPredictionCircle } from '@prisma/client';

// AI 서버 보내기용
export class TyphoonPredictionDTO implements TyphoonPredictionCircle {
  @ApiProperty({
    name: 'typhoon_id',
    description: '태풍 id',
    type: 'string',
  })
  typhoon_id: string;
  @ApiProperty({
    name: 'observation_date',
    description: '태풍 관측 시간',
    type: 'Date',
  })
  observation_date: Date;
  @ApiProperty({
    name: 'prediction_date',
    description: '태풍 예측 시간',
    type: 'Date',
  })
  prediction_date: Date;
  @ApiProperty({
    name: 'central_longitude',
    description: '태풍 중심 경도',
    type: 'number',
  })
  central_longitude: number;
  @ApiProperty({
    name: 'central_latitude',
    description: '태풍 중심 위도',
    type: 'number',
  })
  central_latitude: number;
  @ApiProperty({
    name: 'central_pressure',
    description: '태풍 중심 기압',
    type: 'number',
  })
  central_pressure: number | null;
  @ApiProperty({
    name: 'maximum_wind_speed',
    description: '태풍 최대 풍속',
    type: 'number',
  })
  maximum_wind_speed: number | null;
  @ApiProperty({
    name: 'grade',
    description: '태풍 등급',
    type: 'string',
  })
  grade: GRADE_TYPE | null;
}
