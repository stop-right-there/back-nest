import { baseApiResponeStatus } from '@common/response/baseApiResponeStatus';

export interface IBaseApiResponse<T> {
  is_success: boolean;
  message: string;

  result?: T;
}

export class BaseApiResponse<T> implements IBaseApiResponse<T> {
  readonly is_success: boolean;

  readonly message: string;

  readonly code?: number;

  readonly result?: T;
  constructor(
    { is_success, message }: IBaseApiResponse<any> = {
      is_success: baseApiResponeStatus.SUCCESS.is_success,
      message: baseApiResponeStatus.SUCCESS.message,
    },
    result?: T,
  ) {
    this.is_success = is_success;
    this.message = message;
    this.result = result;
  }
}
