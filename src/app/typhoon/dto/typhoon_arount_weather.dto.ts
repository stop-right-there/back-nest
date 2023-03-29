import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class TyphoonAroundWeatherDTO {
  @ApiProperty({
    name: 'typhoon_id',
    description: '태풍 id',
    type: 'number',
  })
  @IsNumber()
  typhoon_id: number;

  @ApiProperty({
    name: 'datetime',
    description: '태풍 관측 시간',
    type: 'Date',
  })
  @IsDateString()
  observation_date: string;

  @ApiProperty({
    name: 'point',
    description: '태풍 주변 격자 점 정보',
    type: 'number',
  })
  @IsNumber()
  point: number;

  @ApiProperty({
    name: 'temperature_2m',
    description: '표면 위 2m 온도',
    type: 'number',
  })
  @IsNumber()
  temperature_2m?: number;

  @ApiProperty({
    name: 'relativehumidity_2m',
    description: '표면 위 2m 상대습도',
    type: 'number',
  })
  @IsNumber()
  relativehumidity_2m?: number;

  @ApiProperty({
    name: 'apparent_temperature',
    description: '체감온도',
    type: 'number',
  })
  @IsNumber()
  apparent_temperature?: number;

  @ApiProperty({
    name: 'pressure_msl',
    description: '대기압',
    type: 'number',
  })
  @IsNumber()
  pressure_msl?: number;

  @ApiProperty({
    name: 'cloudcover',
    description: '구름 cloudcover 정보',
    type: 'number',
  })
  @IsNumber()
  cloudcover?: number;

  @ApiProperty({
    name: 'cloudcover_low',
    description: '구름 low 정보',
    type: 'number',
  })
  @IsNumber()
  cloudcover_low?: number;

  @ApiProperty({
    name: 'cloudcover_mid',
    description: '구름 mid 정보',
    type: 'number',
  })
  @IsNumber()
  cloudcover_mid?: number;

  @ApiProperty({
    name: 'direct_normal_irradiance',
    description: '표면 자외선 양',
    type: 'number',
  })
  @IsNumber()
  direct_normal_irradiance?: number;

  @ApiProperty({
    name: 'windspeed_10m',
    description: '표면 10m 위 풍속',
    type: 'number',
  })
  @IsNumber()
  windspeed_10m?: number;

  @ApiProperty({
    name: 'windspeed_100m',
    description: '표면 100m 위 풍속',
    type: 'number',
  })
  @IsNumber()
  windspeed_100m?: number;

  @ApiProperty({
    name: 'winddirection_10m',
    description: '표면 10m 위 풍향',
    type: 'number',
  })
  @IsNumber()
  winddirection_10m?: number;

  @ApiProperty({
    name: 'winddirection_100m',
    description: '표면 100m 위 풍향',
    type: 'number',
  })
  @IsNumber()
  winddirection_100m?: number;

  @ApiProperty({
    name: 'windgusts_10m',
    description: '표면 10m 위 최대 돌풍',
    type: 'number',
  })
  @IsNumber()
  windgusts_10m?: number;
}
