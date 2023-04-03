import { Module } from '@nestjs/common';
import { TyphoonController } from './typhoon.controller';
import { TyphoonService } from './typhoon.service';

@Module({
  imports: [],
  controllers: [TyphoonController],
  providers: [TyphoonService],
})
export class TyphoonModule {}
