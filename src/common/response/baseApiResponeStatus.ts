import { BaseApiResponse } from '@common/response/BaseApiResponse';
//   is_success: boolean;
//   code?: number;
//   message: string;
// }
// interface ResErr {
//   [index: string]: ErrObj;

export const baseApiResponeStatus: Record<string, BaseApiResponse<any>> = {
  SUCCESS: { is_success: true, message: '성공' },
  FAIL: { is_success: false, message: '실패' },
};
