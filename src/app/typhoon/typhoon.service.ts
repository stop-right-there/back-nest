import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class TyphoonService {
  getHello(): string {
    const mockup = readFileSync;
    return 'Hello World!';
  }
}
