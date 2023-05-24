import { SmsModule } from '@app/sms/sms.module';
import { WeatherModule } from '@app/weather/weather.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TyphoonUpdatedListener } from './listener/typhoon-updated.listener';
import { TyphoonController } from './typhoon.controller';
import { TyphoonScheduler } from './typhoon.scheduler';
import { TyphoonService } from './typhoon.service';
@Module({
  imports: [ScheduleModule.forRoot(), HttpModule, WeatherModule, SmsModule],
  controllers: [TyphoonController],
  providers: [TyphoonService, TyphoonScheduler, TyphoonUpdatedListener],
})
export class TyphoonModule {}
