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
  WEATHER_QUERY_FAIL: {
    is_success: false,
    message:
      'WEATHER_QUERY_FAIL: need query start_date / end_date / period  or only forecast_days',
  },
  CITY_QUERY_FAIL: {
    is_success: false,
    message: 'CITY_QUERY_FAIL: lat, lon queries are all needed',
  },
  CITIES_QUERY_FAIL: {
    is_success: false,
    message: 'CITIES_QUERY_FAIL:need 4 coords',
  },
};
