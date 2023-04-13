import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { WeatherService } from './provider/weather.service';
import { WeatherController } from './weather.controller';

@Module({
  imports: [HttpModule, CacheModule.register({ isGlobal: true })],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
