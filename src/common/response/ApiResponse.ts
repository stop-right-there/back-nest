import { apiResponeStatus } from '@common/response/ApiStatusResponse';
import { ApiProperty } from '@nestjs/swagger';

export interface IApiResponse<T> {
  is_success: boolean;
  message: string;

  result?: T;
}

export class ApiResponse<T> implements IApiResponse<T> {
  @ApiProperty({ description: '성공여부' })
  readonly is_success: boolean;

  @ApiProperty({ description: '메세지' })
  readonly message: string;

  @ApiProperty({ description: '코드' })
  readonly code?: number;

  @ApiProperty({
    description: '결과',
  })
  readonly result?: T;
  constructor(
    { is_success, message }: IApiResponse<any> = {
      is_success: apiResponeStatus.SUCCESS.is_success,
      message: apiResponeStatus.SUCCESS.message,
    },
    result?: T,
  ) {
    this.is_success = is_success;
    this.message = message;
    this.result = result;
  }
}
