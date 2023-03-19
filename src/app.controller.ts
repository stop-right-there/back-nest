import { ApiResponse } from '@common/response/ApiResponse';
import { apiResponeStatus } from '@common/response/ApiStatusResponse';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ApiResponse<string> {
    const result = this.appService.getHello();
    const a = '';
    return new ApiResponse(apiResponeStatus.SUCCESS, result);
  }
}
