import { baseApiResponeStatus } from '@common/response/baseApiResponeStatus';
import { BaseApiResponse } from '@common/response/BaseApiResponse';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const status_code = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => {
        if (data instanceof BaseApiResponse) {
          return { ...data, status_code };
        } else {
          return {
            is_success: baseApiResponeStatus.SUCCESS.is_success,
            message: baseApiResponeStatus.SUCCESS.message,
            result: data,
            status_code,
          };
        }
      }),
    );
  }
}
