import { WeatherModule } from '@app/weather/weather.module';
import { Module } from '@nestjs/common';
import { SmsService } from './provider/sms.service';
import { SmsController } from './sms.controller';
import { SmsListener } from './sms.event-listener';

@Module({
  imports: [WeatherModule],
  providers: [SmsService, SmsListener],
  controllers: [SmsController],
  exports: [SmsListener],
})
export class SmsModule {}
