import { Controller, Param, Post } from '@nestjs/common';
import { SmsService } from './provider/sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly SmsService: SmsService) {}

  @Post('/:phone_number')
  async sendSms(@Param('phone_number') phone_number: string) {
    return await this.SmsService.sendSms(phone_number);
  }
}
