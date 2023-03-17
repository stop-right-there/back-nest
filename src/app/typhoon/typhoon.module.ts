import { Module } from '@nestjs/common';
import { typhoonController } from './typhoon.controller';

@Module({
  imports: [],
  controllers: [typhoonController],
  providers: [],
})
export class TyphoonModule {}
