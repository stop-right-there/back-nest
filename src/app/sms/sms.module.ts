import { Module } from '@nestjs/common';
import { SmsService } from './provider/sms.service';
import { SmsController } from './sms.controller';

@Module({
  providers: [SmsService],
  controllers: [SmsController],
})
export class SmsModule {}
