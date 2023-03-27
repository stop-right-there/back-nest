import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class TyphoonCreateInputDTO {
  @ApiProperty({
    name: 'typhoon_id',
    description: '태풍 id',
    type: 'number',
  })
  @IsNumber()
  typhoon_id: number;

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
  start_date: number;

  @ApiProperty({
    name: 'end_date',
    description: '태풍 종료 날짜',
    type: 'Date',
  })
  @IsDateString()
  end_date?: number;
}
