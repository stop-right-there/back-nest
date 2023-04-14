import { IsULID } from '@common/decorator/IsULID';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class TyphoonDTO {
  @ApiProperty({
    name: 'typhoon_id',
    description: '태풍 id',
    type: 'stirng',
  })
  @IsULID()
  typhoon_id: string;

  @ApiProperty({
    name: 'gdacs_id',
    description: '태풍 GDACS id',
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  gdacs_id?: number;

  @ApiProperty({
    name: 'aerisweather_id',
    description: '태풍 aerisweather id',
    type: 'string',
  })
  @IsString()
  @IsOptional()
  aerisweather_id?: string;

  @ApiProperty({
    name: 'name',
    description: '태풍 이름',
    type: 'string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: 'start_date',
    description: '태풍 시작 날짜',
    type: 'Date',
  })
  @IsDateString()
  start_date: string | Date;

  @ApiProperty({
    name: 'end_date',
    description: '태풍 종료 날짜',
    type: 'Date',
  })
  @IsDateString()
  end_date?: string | Date;
}
