import { ApiResponse } from '@common/response/ApiResponse';
import { apiResponeStatus } from '@common/response/ApiStatusResponse';
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
        if (data instanceof ApiResponse) {
          return { ...data, status_code };
        } else {
          return {
            is_success: apiResponeStatus.SUCCESS.is_success,
            message: apiResponeStatus.SUCCESS.message,
            result: data,
            status_code,
          };
        }
      }),
    );
  }
}
