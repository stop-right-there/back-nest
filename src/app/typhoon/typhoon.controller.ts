import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Typhoon List API')
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
