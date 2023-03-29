import { TyphoonAroundWeatherDTO } from './typhoon_arount_weather.dto';

// AI 서버 보내기용
export class TyphoonPredictionDTO {
  typhoon_id: number;
  name: string;
  start_date: string;
  end_date?: string;
  observation_date: string;
  around_weathers: TyphoonAroundWeatherDTO[];
}
