import { Injectable } from '@nestjs/common';

@Injectable()
export class TyphoonService {
  getHello(): string {
    return 'Hello World!';
  }
}
