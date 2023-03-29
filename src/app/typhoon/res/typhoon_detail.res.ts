import { TyphoonDTO } from '@app/typhoon/dto/typhoon.dto';
import { TyphoonDetailDTO } from '@app/typhoon/dto/typhoon_detail.dto';
export class TyphoonDetailResponse extends TyphoonDTO {
  current_detail: TyphoonDetailDTO;
  historical_details: TyphoonDetailDTO[];
  predictions: any[];
  news: any[];
}
