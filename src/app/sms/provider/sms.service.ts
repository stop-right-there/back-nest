import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    charset: 'utf-8',
    'X-NCP-auth-key': process.env.SNES_ACCESS_KEY,
    'X-NCP-service-secret': process.env.SNES_SECRET_KEY,
  };

  async sendSms(to: string, message: string) {
    const request = {
      type: 'SMS',
      countryCode: '82',
      from: process.env.NAVER_PHONE_NUMBER,
      to: [to],
      content: message,
    };

    const response = await axios.post(
      `https://sens.apigw.ntruss.com/sms/v2/services/${process.env.SNES_SERVICE_ID}/messages`,
      request,
      { headers: this.headers },
    );
    return response.status === 200;
  }
}
