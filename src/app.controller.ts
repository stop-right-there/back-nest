import { baseApiResponeStatus } from '@common/response/baseApiResponeStatus';
import { BaseApiResponse } from '@common/response/BaseApiResponse';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): BaseApiResponse<string> {
    const result = this.appService.getHello();
    return new BaseApiResponse(baseApiResponeStatus.SUCCESS, result);
  }
}
