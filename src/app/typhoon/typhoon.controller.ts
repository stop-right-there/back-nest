import { Controller, Get } from '@nestjs/common';

@Controller('/typhoon')
export class typhoonController {
  @Get('/')
  async getTyphoonList() {
    console.log(process.env.PORT); //w//
    return 'hi';
  }
}
