import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';

export class UserCreateInputDTO
  implements Omit<Prisma.UserUncheckedCreateInput, 'user_id'>
{
  @ApiProperty({
    name: 'lat',
    description: '위도',
    type: 'number',
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    name: 'lon',
    description: '경도',
    type: 'number',
  })
  @IsNumber()
  lon: number;

  @ApiProperty({
    name: 'phone_number',
    description: '전화번호',
    type: 'string',
  })
  @IsString()
  phone_number: string;
}
