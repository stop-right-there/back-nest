import { WeatherService } from '@app/weather/provider/weather.service';
import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma/prisma.service';
import axios from 'axios';
import * as crypto from 'crypto';
import { SMSApplyDto } from '../sms-apply.dto';

@Injectable()
export class SmsService {
  private ACCESS_KEY_ID = process.env.SENS_ACCESS_KEY;
  private SECRET_KEY = process.env.SENS_SECRET_KEY;
  private SERVICE_ID = process.env.SENS_SERVICE_ID;

  constructor(
    private readonly weatherService: WeatherService,
    private readonly prisma: PrismaService,
  ) {}
  // private headers = {
  //   'Content-Type': 'application/json;charset=UTF-8',
  //   'x-ncp-apigw-timestamp': Date.now().toString(),
  //   'x-ncp-iam-access-key': ACCESS_KEY_ID,
  //   'x-ncp-apigw-signature-v2': this.makeSignatureForSMS(),
  // };

  async makeSignatureForSMS(): Promise<string> {
    const message = [];
    const hmac = crypto.createHmac('sha256', this.SECRET_KEY);
    const timeStamp = Date.now().toString();
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';

    message.push(method);
    message.push(space);
    message.push(`/sms/v2/services/${this.SERVICE_ID}/messages`);
    message.push(newLine);
    message.push(timeStamp);
    message.push(newLine);
    message.push(this.ACCESS_KEY_ID);
    // 시그니쳐 생성
    const signature = hmac.update(message.join('')).digest('base64');
    // string 으로 반환
    return signature.toString();
  }

  async sendSms(phone_number: string, message: string) {
    //파라미터: 수신자 배열 넘기기

    const options = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'x-ncp-apigw-timestamp': Date.now().toString(),
        'x-ncp-iam-access-key': this.ACCESS_KEY_ID,
        'x-ncp-apigw-signature-v2': await this.makeSignatureForSMS(),
      },
    };

    const request = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: process.env.SENS_PHONE_NUMBER, //발신자
      content: message, //문자 내용
      messages: [
        {
          to: phone_number, //수신자 배열
        },
      ],
    };

    try {
      const response = await axios.post(
        `https://sens.apigw.ntruss.com/sms/v2/services/${this.SERVICE_ID}/messages`,
        request,
        options,
      );
      console.log('문자메시지 발송 완료');
      return response.status === 200;
    } catch (error) {
      console.log(this.SERVICE_ID);
      console.log(error.response.data);
      //this.logger.error(`Error occurred: ${error.message}`, error.stack);
    }
  }

  async applyNotice(smsApplyDto: SMSApplyDto) {
    const { phone_number, longitude, latitude } = smsApplyDto;
    const { city } = await this.weatherService.getCity(latitude, longitude);
    if (city === 'non-city')
      throw new BadRequestException('존재하지 않는 지역입니다.');

    return await this.prisma.user.upsert({
      where: {
        phone_number,
      },
      update: {
        city,
      },
      create: {
        phone_number,
        city,
      },
    });
  }

  async getUserListByCity(city: string) {
    return await this.prisma.user.findMany({
      where: {
        city,
      },
    });
  }
}
