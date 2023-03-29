import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';

@Module({
  imports: [],
  controllers: [WeatherController],
  providers: [],
})
export class WeatherModule {}
