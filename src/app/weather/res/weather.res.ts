export class WeatherResponse {
  city: string;
  city_kr: string;
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
    relativehumidity_2m: number;
    apparent_temperature: number;
    precipitation_probability: number;
    rain: number;
    showers: number;
    weathercode: number;
    cloudcover: number;
    cloudcover_low: number;
    cloudcover_mid: number;
    cloudcover_high: number;
  };
  hourly: {
    time: Date[];
  };
  temperature_2m: number[];
  relativehumidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  rain: number[];
  showers: number[];
  weathercode: number[];
  cloudcover: number[];
  cloudcover_low: number[];
  cloudcover_mid: number[];
  cloudcover_high: number[];
}
