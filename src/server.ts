import { HttpApiExceptionFilter } from '@common/exception/http-api-exception.filter';
import { SuccessInterceptor } from '@common/interceptor/success.interceptor';
import { UnauthorizedExceptionFilter } from '@common/interceptor/unauthorizedException.filter';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as connectRedis from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as expressBasicAuth from 'express-basic-auth';
import * as session from 'express-session';
import { Redis } from 'ioredis';
import * as passport from 'passport';
export class Application {
  private logger = new Logger();

  private DEV_MODE: boolean;
  private PORT: string;
  private corsOriginList: string[];
  private ADMIN_USER: string;
  private ADMIN_PASSWORD: string;
  private REDIS_PORT: string;
  private REDIS_HOST: string;
  constructor(private server: NestExpressApplication) {
    this.server = server;
    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
    this.PORT = process.env.PORT || '5000';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];
    this.ADMIN_USER = process.env.ADMIN_USER || 'admin';
    this.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1234';

    this.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
    this.REDIS_PORT = process.env.REDIS_PORT || '6379';
  }

  /*
   * doc 문서 접근 set
   */
  private setUpBasicAuth() {
    this.server.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: { [this.ADMIN_USER]: this.ADMIN_PASSWORD },
      }),
    );
  }

  /**
   * Swagger set
   */
  private setUpOpenAPIMidleware() {
    SwaggerModule.setup(
      'docs/v1',
      this.server,
      SwaggerModule.createDocument(
        this.server,
        new DocumentBuilder()
          .setTitle('STOP_RIGHT_THERE - API')
          .setDescription('stop right there')
          .setVersion('v1')
          .addBearerAuth()
          .build(),
        { extraModels: [] },
      ),
    );
  }

  private setAPIversioning() {
    this.server.enableVersioning({
      type: VersioningType.URI,
    });
  }
  private async setUpSession() {
    const redisClient = Redis.createClient();
    const RedisStore = connectRedis(session);
    this.server.use(
      session({
        store: new RedisStore({
          host: this.REDIS_HOST,
          port: Number(this.REDIS_PORT),
          client: redisClient,
        }),
        secret: 'SECRET',
        saveUninitialized: false,
        resave: false,
        // store: new (RedisStore(session))({
        //   client: redisClient,
        // }),
        cookie: {
          httpOnly: true,
          secure: true,
          maxAge: 30000, //세션이 redis에 저장되는 기간은 maxAge로 조절한다.(ms)
        },
      }),
    );
    this.server.use(passport.initialize());
    this.server.use(passport.session());
  }
  /**
   * global middleware set
   */
  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      //
      origin: this.corsOriginList,
      credentials: true,
    });

    this.server.setGlobalPrefix('api');

    this.server.use(cookieParser());
    this.setUpBasicAuth();
    this.setUpOpenAPIMidleware();
    this.setAPIversioning();
    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
      new SuccessInterceptor(),
    );

    this.server.useGlobalFilters(
      new HttpApiExceptionFilter(),
      new UnauthorizedExceptionFilter(),
    );
  }
  async boostrap() {
    await this.setUpSession();
    await this.setUpGlobalMiddleware();

    await this.server.listen(this.PORT);
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }
  errorLog(error: string) {
    this.logger.error(`🆘 Server error ${error}`);
  }
}
