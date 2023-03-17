import { TyphoonModule } from '@app/typhoon/typhoon.module';
import { LoggerMiddleware } from '@common/middleware/logger.middleware';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configOption } from './common/option/config.option';

@Module({
  imports: [
    // config module
    ConfigModule.forRoot(configOption),

    TyphoonModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
