export interface OpenMeteoData {
  temperature_2m: number; //celsius
  relativehumidity_2m: number; //%
  apparent_temperature: number; //celsius
  rain: number; //mm/hour
  weathercode: number; //WMO code
  cloudcover: number; //%
  cloudcover_low: number; //%
  cloudcover_mid: number; //%
  cloudcover_high: number; //%
}

export interface IBuildUrl {
  lat: number;
  lon: number;
  dateString: string;
}
