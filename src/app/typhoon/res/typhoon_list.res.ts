import { TyphoonDetailDTO } from '@app/typhoon/dto/typhoon_detail.dto';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { TyphoonPredictionDTO } from '../dto/typhoon_prediction.dto';
import { TyphoonDTO } from './../dto/typhoon.dto';

export class TyphoonDetailResponse extends TyphoonDetailDTO {
  @ApiProperty({
    name: 'predictions_circle',
    description: '예측',
    type: () => TyphoonPredictionDTO,
    isArray: true,
  })
  predictions_circle?: TyphoonPredictionDTO[];
  @ApiProperty({
    name: 'predictions_grid',
    description: '예측',
    type: () => TyphoonPredictionDTO,
    isArray: true,
  })
  predictions_grid?: TyphoonPredictionDTO[];
  @ApiProperty({
    name: 'predictions_circle_with_weather_prediction',
    description: '예측',
    type: () => TyphoonPredictionDTO,
    isArray: true,
  })
  predictions_circle_with_weather_prediction?: TyphoonPredictionDTO[];
  @ApiProperty({
    name: 'predictions_grid_with_weather_prediction',
    description: '예측',
    type: () => TyphoonPredictionDTO,
    isArray: true,
  })
  predictions_grid_with_weather_prediction?: TyphoonPredictionDTO[];
}

@ApiExtraModels(TyphoonDTO, TyphoonDetailResponse)
export class TyphoonListResponseItem extends TyphoonDTO {
  @ApiProperty({
    name: 'current_detail',
    type: () => TyphoonDetailResponse,
  })
  current_detail: TyphoonDetailResponse;

  @ApiProperty({
    name: 'historical_details',
    isArray: true,
    type: () => TyphoonDetailResponse,
  })
  historical_details: TyphoonDetailResponse[];

  @ApiProperty({
    isArray: true,
  })
  predictions?: any[];
}
// export type TyphoonListResponse = ({
//   current_detail: TyphoonDetailDTO;
//   historical_details: TyphoonDetailDTO[];
//   predictions: any[];
// } & TyphoonDTO)[];
