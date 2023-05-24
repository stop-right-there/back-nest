import { Body, Controller, Param, Post } from '@nestjs/common';
import { SmsService } from './provider/sms.service';
import { SMSApplyDto } from './sms-apply.dto';

@Controller('sms')
export class SmsController {
  constructor(private readonly SmsService: SmsService) {}
  @Post('/notice')
  async appllyNotice(@Body() smsApplyDto: SMSApplyDto) {
    return await this.SmsService.applyNotice(smsApplyDto);
  }
  @Post('/:phone_number')
  async sendSms(@Param('phone_number') phone_number: string) {
    return await this.SmsService.sendSms(phone_number, 'test');
  }
}
