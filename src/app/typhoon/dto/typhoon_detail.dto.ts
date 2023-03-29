import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class TyphoonDetailDTO {
  @ApiProperty({
    name: 'typhoon_id',
    description: '태풍 id',
    type: 'number',
  })
  @IsNumber()
  typhoon_id: number;

  @ApiProperty({
    name: '관측시간',
    description: '태풍 관측 시간',
    type: 'Date',
  })
  @IsDateString()
  observation_date: string;

  @ApiProperty({
    name: 'central_latitude',
    description: '태풍 중심 위도',
    type: 'number',
  })
  @IsNumber()
  central_latitude: number;

  @ApiProperty({
    name: 'central_longitude',
    description: '태풍 중심 경도',
    type: 'number',
  })
  @IsNumber()
  central_longitude: number;

  @ApiProperty({
    name: 'central_pressure',
    description: '태풍 중심 기압',
    type: 'number',
  })
  @IsNumber()
  central_pressure: number;

  @ApiProperty({
    name: 'maximum_wind_speed',
    description: '태풍 최대 풍속',
    type: 'number',
  })
  @IsNumber()
  maximum_wind_speed: number;

  @ApiProperty({
    name: 'wind_radius',
    description: '태풍 풍속 반경',
    type: 'number',
  })
  @IsNumber()
  wind_radius?: number;

  @ApiProperty({
    name: 'grade',
    description: '태풍 등급',
    type: 'number',
  })
  @IsNumber()
  grade: number;
}
