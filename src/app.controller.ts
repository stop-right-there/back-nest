import { ApiResponse } from '@common/response/ApiResponse';
import { apiResponeStatus } from '@common/response/ApiStatusResponse';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
//작업1
  @Get()
  getHello(): ApiResponse<string> {
    const result = this.appService.getHello();

    return new ApiResponse(apiResponeStatus.SUCCESS, result);
  }
}
