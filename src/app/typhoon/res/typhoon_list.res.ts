import { TyphoonDetailDTO } from '@app/typhoon/dto/typhoon_detail.dto';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { TyphoonDTO } from './../dto/typhoon.dto';
@ApiExtraModels(TyphoonDTO)
export class TyphoonListResponseItem extends TyphoonDTO {
  @ApiProperty({})
  current_detail: TyphoonDetailDTO;
  @ApiProperty({
    isArray: true,
    type: () => TyphoonDetailDTO,
  })
  historical_details: TyphoonDetailDTO[];
  @ApiProperty({
    isArray: true,
  })
  predictions: any[];
}
// export type TyphoonListResponse = ({
//   current_detail: TyphoonDetailDTO;
//   historical_details: TyphoonDetailDTO[];
//   predictions: any[];
// } & TyphoonDTO)[];
