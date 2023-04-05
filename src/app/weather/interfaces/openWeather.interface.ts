export interface OpenWeatherData {
  dt: number; //UTC
  temp: number; //kelvin
  pressure: number; //hPa
  humidity: number; //%
  clouds: number; //%
  wind_speed: number; //m/s
}
