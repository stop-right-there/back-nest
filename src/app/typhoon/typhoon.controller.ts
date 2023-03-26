import { Controller, Get } from '@nestjs/common';

@Controller('/typhoons')
export class typhoonController {
  @Get('/')
  async getTyphoonList() {
    return 'hi';
  }

  @Get('/:typhoon_id')
  async getTyphoonDetail() {
    return 'hi';
  }


}
