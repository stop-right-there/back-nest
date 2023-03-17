import { ApiResponse } from '@common/response/ApiResponse';
//   is_success: boolean;
//   code?: number;
//   message: string;
// }
// interface ResErr {
//   [index: string]: ErrObj;

export const apiResponeStatus: Record<string, ApiResponse<any>> = {
  SUCCESS: { is_success: true, message: '성공' },
};
