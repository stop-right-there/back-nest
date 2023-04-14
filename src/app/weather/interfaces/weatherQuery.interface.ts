export interface WeatherQuery {
  lat: number;
  lon: number;
  start_date: string;
  end_date: string;
  period: number;
  city: string;
  forecast_days: number;
}
