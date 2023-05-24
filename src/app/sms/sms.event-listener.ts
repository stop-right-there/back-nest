import { WeatherService } from '@app/weather/provider/weather.service';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TyphoonPredictionDTO } from './../typhoon/dto/typhoon_prediction.dto';
import { SmsService } from './provider/sms.service';
@Injectable()
export class SmsListener {
  private readonly logger = new Logger(SmsListener.name);
  constructor(
    private readonly smsService: SmsService,
    private readonly weatherService: WeatherService,
  ) {}

  /**
   * 태풍 발생시(업데이트) 흐름
   * 1. 예측을 진행한다.
   * 2. 예측을 진행한 결과(위도 경도)를 기반으로 지역을 찾는다.
   *    - 지역은 각 예측 정보의 위도 경도를 이용하여 찾는다.
   * 3. 해당지역에 있는 유저를 찾는다.
   * 4. 해당지역에 있는 유저에게 문자를 보낸다.
   *
   * ---
   * 태풍 예측 정보가 담겨있다.
   */
  @OnEvent('typhoon.sms')
  async handleTyphoonSmsEvent(event: {
    name: string;
    tyhoon_predictions: TyphoonPredictionDTO[];
  }) {
    this.logger.log('TyphoonSmsEvent');
    const { tyhoon_predictions, name } = event;
    tyhoon_predictions
      .slice(0, tyhoon_predictions.length - 1)
      .forEach(async (typhoonPrediction, i) => {
        const typhoonPrediction1 = typhoonPrediction;
        const typhoonPrediction2 = tyhoon_predictions[i + 1];
        const overpassCoords = [
          typhoonPrediction1.central_latitude,
          typhoonPrediction1.central_longitude,
          typhoonPrediction2.central_latitude,
          typhoonPrediction2.central_longitude,
        ];
        const cities = await this.weatherService.getCitiesByOverpass(
          overpassCoords,
        );
        cities.forEach(async (city) => {
          const users = await this.smsService.getUserListByCity(city);
          users.forEach(async (user) => {
            //     await this.smsService.sendSms(
            //       user.phone,
            //       `
            //     ${typhoonPrediction1.observation_date}~${typhoonPrediction2.observation_date}에
            //     ${user.city}에 태풍위험이 예측되었습니다.
            //     태풍에 대비하여 주의하시기 바랍니다.
            //     1. 비닐하우스, 창고, 배수구 등 외부 시설물을 고정시키고, 물건을 실내로 옮기세요.
            //     2. 특히, 비닐하우스는 태풍이 지나가면 날아가기 쉽습니다.
            //     3. 태풍이 지나가는 동안은 외출을 삼가하시고, 태풍이 지나간 후에도 피해가 없는지 확인하시기 바랍니다.
            //     4. 태풍이 지나간 후에는 피해가 없는지 확인하시기 바랍니다.
            //   `,
            //     );

            //테스트용
            if (user)
              console.log(`
        [SRT] 태풍 경보 알림
        ${typhoonPrediction1.prediction_date}~${typhoonPrediction2.prediction_date}에
        ${user.city}에 태풍(${name})위험이 예측되었습니다.(기준 일자 : ${typhoonPrediction1.observation_date})
        태풍에 대비하여 주의하시기 바랍니다.
        1. 비닐하우스, 창고, 배수구 등 외부 시설물을 고정시키고, 물건을 실내로 옮기세요.
        2. 특히, 비닐하우스는 태풍이 지나가면 날아가기 쉽습니다.
        3. 태풍이 지나가는 동안은 외출을 삼가하시고, 태풍이 지나간 후에도 피해가 없는지 확인하시기 바랍니다.
        4. 태풍이 지나간 후에는 피해가 없는지 확인하시기 바랍니다.
      `);
          });
        });
      });
    // await this.smsService.sendSms('01073616616');
  }
}
