import { IsULID } from '@common/decorator/IsULID';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { TyphoonAroundWeatherCircleDTO } from './typhoon_arount_weather.dto';

export class TyphoonDetailDTO {
  @ApiProperty({
    name: 'typhoon_id',
    description: '태풍 id',
    type: 'stirng',
  })
  @IsULID()
  typhoon_id: string;

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
    description:
      '태풍 등급 grade_type에 따라 0~8 (순서대로) 과거데이터는 임의 값',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  grade?: number;

  @ApiProperty({
    name: 'grade_type',
    description: `태풍 등급 타입
    'TD' | 'TS' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'TY' | 'STY';
    `,

    type: 'string',
  })
  @IsString()
  @IsOptional()
  grade_type?:
    | 'TD'
    | 'TS'
    | 'H1'
    | 'H2'
    | 'H3'
    | 'H4'
    | 'H5'
    | 'TY'
    | 'STY'
    | 'STS';

  @ApiProperty({
    name: 'se_long_34',
    description: '남동 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  se_long_34?: number;

  @ApiProperty({
    name: 'se_lat_34',
    description: '남동 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  se_lat_34?: number;

  @ApiProperty({
    name: 'se_distance_34',
    description: '남동 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  se_distance_34?: number;

  @ApiProperty({
    name: 'ne_long_34',
    description: '북동 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  ne_long_34?: number;

  @ApiProperty({
    name: 'ne_lat_34',
    description: '북동 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  ne_lat_34?: number;

  @ApiProperty({
    name: 'ne_distance_34',
    description: '북동 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  ne_distance_34?: number;

  @ApiProperty({
    name: 'sw_long_34',
    description: '남서 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  sw_long_34?: number;

  @ApiProperty({
    name: 'sw_lat_34',
    description: '남서 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  sw_lat_34?: number;

  @ApiProperty({
    name: 'sw_distance_34',
    description: '남서 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  sw_distance_34?: number;

  @ApiProperty({
    name: 'nw_long_34',
    description: '북서 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  nw_long_34?: number;

  @ApiProperty({
    name: 'nw_lat_34',
    description: '북서 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  nw_lat_34?: number;

  @ApiProperty({
    name: 'nw_distance_34',
    description: '북서 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  nw_distance_34?: number;

  @ApiProperty({
    name: 'se_long_50',
    description: '남동 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  se_long_50?: number;

  @ApiProperty({
    name: 'se_lat_50',
    description: '남동 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  se_lat_50?: number;

  @ApiProperty({
    name: 'se_distance_50',
    description: '남동 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  se_distance_50?: number;

  @ApiProperty({
    name: 'ne_long_50',
    description: '북동 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  ne_long_50?: number;

  @ApiProperty({
    name: 'ne_lat_50',
    description: '북동 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  ne_lat_50?: number;

  @ApiProperty({
    name: 'ne_distance_50',
    description: '북동 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  ne_distance_50?: number;

  @ApiProperty({
    name: 'sw_long_50',
    description: '남서 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  sw_long_50?: number;

  @ApiProperty({
    name: 'sw_lat_50',
    description: '남서 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  sw_lat_50?: number;

  @ApiProperty({
    name: 'sw_distance_50',
    description: '남서 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  sw_distance_50?: number;

  @ApiProperty({
    name: 'nw_long_50',
    description: '북서 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  nw_long_50?: number;

  @ApiProperty({
    name: 'nw_lat_50',
    description: '북서 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  nw_lat_50?: number;

  @ApiProperty({
    name: 'nw_distance_50',
    description: '북서 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  nw_distance_50?: number;

  @ApiProperty({
    name: 'se_long_64',
    description: '남동 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  se_long_64?: number;

  @ApiProperty({
    name: 'se_lat_64',
    description: '남동 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  se_lat_64?: number;

  @ApiProperty({
    name: 'se_distance_64',
    description: '남동 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  se_distance_64?: number;

  @ApiProperty({
    name: 'ne_long_64',
    description: '북동 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  ne_long_64?: number;

  @ApiProperty({
    name: 'ne_lat_64',
    description: '북동 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  ne_lat_64?: number;

  @ApiProperty({
    name: 'ne_distance_64',
    description: '북동 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  ne_distance_64?: number;

  @ApiProperty({
    name: 'sw_long_64',
    description: '남서 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  sw_long_64?: number;

  @ApiProperty({
    name: 'sw_lat_64',
    description: '남서 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  sw_lat_64?: number;

  @ApiProperty({
    name: 'sw_distance_64',
    description: '남서 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  sw_distance_64?: number;

  @ApiProperty({
    name: 'nw_long_64',
    description: '북서 longitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  nw_long_64?: number;

  @ApiProperty({
    name: 'nw_lat_64',
    description: '북서 latitude',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  nw_lat_64?: number;

  @ApiProperty({
    name: 'nw_distance_64',
    description: '북서 거리 km',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  nw_distance_64?: number;

  @ApiProperty({
    name: 'around_weathers',
    description: '태풍 주변 날씨 프론트에는 해당하지않습니다',
    type: () => TyphoonAroundWeatherCircleDTO,
    isArray: true,
  })
  around_weathers_circle?: TyphoonAroundWeatherCircleDTO[];
}
