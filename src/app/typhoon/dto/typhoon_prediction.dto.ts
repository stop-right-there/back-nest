import { TyphoonAroundWeatherCircleDTO } from './typhoon_arount_weather.dto';

// AI 서버 보내기용
export class TyphoonPredictionDTO {
  typhoon_id: number;
  name: string;
  start_date: string | Date;
  end_date?: string | Date;
  observation_date: string | Date;
  around_weathers_circle: TyphoonAroundWeatherCircleDTO[];
}
