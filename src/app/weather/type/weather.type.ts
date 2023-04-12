export interface IWeatherGetDTO {
  long: number;
  lat: number;
  date: Date;
}

export interface IOpenWeatherMapResponse {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  clouds: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
}
