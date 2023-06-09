import { TyphoonModule } from '@app/typhoon/typhoon.module';
import { WeatherModule } from '@app/weather/weather.module';
import { LoggerMiddleware } from '@common/middleware/logger.middleware';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SmsModule } from './app/sms/sms.module';
import { configOption } from './common/option/config.option';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [
    // config module
    ConfigModule.forRoot(configOption),
    //이벤트 모듈
    EventEmitterModule.forRoot(),
    // Prisam module
    PrismaModule,
    TyphoonModule,
    WeatherModule,
    SmsModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
