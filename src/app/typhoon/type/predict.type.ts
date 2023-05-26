export interface Units {
  grade: {
    1: 'TD';
    2: 'TS';
    3: 'STS';
    4: 'TY';
  };
  central_pressure: 'hPa';
  maximum_wind_speed: 'knot';
}

export interface IPredictResponse {
  timezone: string;
  units: Units;
  prediction_date: string;
  central_latitude: number;
  central_longitude: number;
  central_pressure: number;
  maximum_wind_speed: number;
  grade: number;
}
