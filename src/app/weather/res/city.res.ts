import { ApiProperty } from '@nestjs/swagger';

export class CityResponse {
  @ApiProperty({
    name: 'city',
    description: '도시이름',
    type: 'string',
  })
  city: string;

  @ApiProperty({
    name: 'country',
    description: '국가이름',
    type: 'string',
  })
  country: string;
}
