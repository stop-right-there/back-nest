import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SMSApplyDto {
  @ApiProperty({ description: '전화번호' })
  @IsString()
  phone_number: string;

  @ApiProperty({ description: 'longitude' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: 'latitude' })
  @IsNumber()
  latitude: number;
}
