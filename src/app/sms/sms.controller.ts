import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './provider/sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly SmsService: SmsService) {}

  @Post()
  async sendSms(@Body() body: { to: string; message: string }) {
    return await this.SmsService.sendSms(body.to, body.message);
  }
}
