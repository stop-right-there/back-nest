import { ApiProperty } from '@nestjs/swagger';
export class WeatherResponse {
  @ApiProperty({
    name: 'city',
    description: '도시이름',
    type: 'string',
  })
  city: string;

  @ApiProperty({
    name: 'city_kr',
    description: '도시이름',
    type: 'string',
  })
  city_kr: string;

  @ApiProperty({
    name: 'latitude',
    description: '위도',
    type: 'number',
  })
  latitude: number;

  @ApiProperty({
    name: 'longitude',
    description: '경도',
    type: 'number',
  })
  longitude: number;

  @ApiProperty({
    name: 'generationtime_ms',
    description:
      '밀리초 단위의 일기 예보 생성 시간입니다. 주로 성능 모니터링 및 개선에 사용됩니다.',
    type: 'number',
  })
  generationtime_ms: number;

  @ApiProperty({
    name: 'utc_offset_seconds',
    description: '적용된 시간대 오프셋&시간대=매개변수',
    type: 'number',
  })
  utc_offset_seconds: number;

  @ApiProperty({
    name: 'timezone',
    description: '시간대 식별자',
    type: 'string',
  })
  timezone: string;

  @ApiProperty({
    name: 'timezone_abbreviation',
    description: '시간대 식별자(예:GMT) 및 약어(예:CEST)',
    type: 'string',
  })
  timezone_abbreviation: string;

  @ApiProperty({})
  elevation: number;

  @ApiProperty({
    name: 'hourly_units',
    description: `각 값의 단위: 
    time: string;
    temperature_2m: string;
    relativehumidity_2m: string;
    apparent_temperature: string;
    rain: string;
    weathercode: string;
    cloudcover: string;
    cloudcover_low: string;
    cloudcover_mid: string;
    cloudcover_high: string;
    `,
    type: 'object',
  })
  hourly_units: {
    time: string;
    temperature_2m: string;
    relativehumidity_2m: string;
    apparent_temperature: string;
    rain: string;
    weathercode: string;
    cloudcover: string;
    cloudcover_low: string;
    cloudcover_mid: string;
    cloudcover_high: string;
  };

  @ApiProperty({
    name: 'hourly',
    description: '시간 hourly.time => 시간이 담김 array',
    type: 'object',
  })
  hourly: {
    time: Date[];
  };

  @ApiProperty({
    name: 'temperature_2m',
    description: '지상 2미터의 기온',
    isArray: true,
    type: 'number',
  })
  temperature_2m: number[];
  @ApiProperty({
    name: 'relativehumidity_2m',
    description: '지상 2m의 상대 습도',
    isArray: true,
    type: 'number',
  })
  relativehumidity_2m: number[];

  @ApiProperty({
    name: 'apparent_temperature',
    description:
      '겉보기 온도는 바람의 냉각 요인, 상대 습도 및 일사량을 결합한 체감 온도',
    isArray: true,
    type: 'number',
  })
  apparent_temperature: number[];

  @ApiProperty({
    name: 'rain',
    description: '밀리미터 단위로 이전 시간의 대규모 기상 시스템에서 비',
    isArray: true,
    type: 'number',
  })
  rain: number[];

  @ApiProperty({
    name: 'weathercode',
    description:
      '숫자 코드로서의 기상 조건. WMO 날씨 해석 코드를 따르십시오. 자세한 내용은 아래 표를 참조하십시오.',
    isArray: true,
    type: 'number',
  })
  weathercode: number[];

  @ApiProperty({
    name: 'cloudcover',
    description: '면적 비율로 나타낸 총 구름량',
    isArray: true,
    type: 'number',
  })
  cloudcover: number[];

  @ApiProperty({
    name: 'cloudcover_low',
    description: '3km 고도까지 낮은 수준의 구름과 안개',
    isArray: true,
    type: 'number',
  })
  cloudcover_low: number[];

  @ApiProperty({
    name: 'cloudcover_mid',
    description: '고도 3~8km의 중간층 구름',
    isArray: true,
    type: 'number',
  })
  cloudcover_mid: number[];

  @ApiProperty({
    name: 'cloudcover_high',
    description: '8km 고도에서 높은 수준의 구름',
    isArray: true,
    type: 'number',
  })
  cloudcover_high: number[];
}
