import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TyphoonController } from './typhoon.controller';
import { TyphoonScheduler } from './typhoon.scheduler';
import { TyphoonService } from './typhoon.service';
@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  controllers: [TyphoonController],
  providers: [TyphoonService, TyphoonScheduler],
})
export class TyphoonModule {}
