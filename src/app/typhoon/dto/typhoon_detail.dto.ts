import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';
import { TyphoonAroundWeatherDTO } from './typhoon_arount_weather.dto';

export class TyphoonDetailDTO {
  @ApiProperty({
    name: 'typhoon_id',
    description: '태풍 id',
    type: 'number',
  })
  @IsNumber()
  typhoon_id: number;

  @ApiProperty({
    name: 'observation_date',
    description: '태풍 관측 시간',
    type: 'Date',
  })
  @IsDateString()
  observation_date: string | Date;

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

  @ApiProperty({
    name: 'around_weathers',
    description: '태풍 주변 날씨 프론트에는 해당하지않습니다',
    type: () => TyphoonAroundWeatherDTO,
    isArray: true,
  })
  arround_weathers?: TyphoonAroundWeatherDTO[];
}
