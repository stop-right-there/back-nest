import { parceGDACS_HTML } from '@common/util/parseGDACS_HTML';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { aresWeatherURL, IAresWeatherResponse } from './type/aerisweather.type';

/**
 * @description 태풍 정보를 가져오는 스케줄러
 * @class TyphoonScheduler
 * @classdesc 태풍 정보를 가져오는 스케줄러
 * @memberof Typhoon
 *
 * 스케줄러
 * 매시간 0분에 GDACS와 aerisweather 사이트에서 태풍 정보를 가져옵니다.
 *
 * 경우의수
 * GDACS aerisweather 모두 태풍 정보가 없을때
 * GDACS만 태풍 정보가 있을때
 * aerisweather만 태풍 정보가 있을때
 * GDACS aerisweather 모두 태풍 정보가 있을때
 *
 * ### GDACS aerisweather 모두 태풍 정보가 없을때
 * 1.현재 발표된 태풍이 없으므로 이벤트를 실행하지않습니다.
 *
 * ### GDACS만 태풍 정보가 있을때
 * GDACS만 태풍정보가 있을경우 아직 arisweather에서 태풍정보를 제공하지 않은 상태입니다.
 * 따라서 GDACS 태풍정보가 가장 최근에 업데이트된 태풍정보입니다.
 *
 * 1. GDACS 태풍정보를 가져옵니다.
 * 2. 가져온 태풍정보 (gdacs_id)를 기반으로 GDACSupdated 이벤트를 실행합니다.
 * - 이벤트
 * - 1. DB에 태풍이 있나 조회합니다.
 * - 2. 조회결과가 없다면 태풍을 생성하여 저장합니다.
 * - 3. 조회결과가 있다면 태풍을 업데이트합니다.
 *    - GDACS에서는 태풍정보를 일부만 제공하므로,
 *      주변날씨를 저장하여 예측하는 용도로 사용합니다.
 *
 *
 * ### aerisweather만 태풍 정보가 있을때
 * aerisweather만 태풍정보가 있을경우 아직 GDACS에서 태풍정보를 제공하지 않은 상태입니다.
 * 따라서 aerisweather 태풍정보가 가장 최근에 업데이트된 태풍정보입니다.
 *
 * 1. aerisweather 태풍정보를 가져옵니다.
 * 2. 가져온 태풍정보 (id)를 기반으로 aerisweatherupdated 이벤트를 실행합니다.
 * 3. 받은 태풍 정보를 바탕으로 DB에 태풍이 있나 조회합니다.
 * 4. 조회결과가 없다면 태풍을 생성하여 저장합니다.
 * 5. 조회결과가 있다면 태풍을 업데이트합니다.
 *   - aerisweather에서는 태풍정보를 디테일하게 제공하므로 더 자세한 정보를 저장하기위해 있는 정보들을 업데이트 합니다.
 */
@Injectable()
export class TyphoonScheduler {
  constructor(
    private readonly httpService: HttpService,
    private eventEmitter: EventEmitter2,
  ) {}
  private readonly logger = new Logger(TyphoonScheduler.name);

  /**
   * 매시간 0분에 GDACS 사이트에서 태풍 정보를 가져옵니다.
   * 만약, 현재~36시간 이내에 태풍이 발생했다면, 태풍 정보를 가져옵니다.
   * 그리고 가져온 태풍들을 기반으로 이벤트를 실행시킵니다.
   * observeTyphoon은 GDACS 사이트에 업데이트된 태풍을 감시합니다.
   */
  @Cron('0 0 * * * *')
  async observeGDACSTyphoon() {
    this.logger.log('태풍 불러오기');

    // gdacs.org 에서 태풍 정보를 가져옵니다.
    const { data: html } = await this.httpService.axiosRef.get(
      'https://www.gdacs.org/datareport/resources/TC/',
    );

    // 가져온 데이터를 파싱합니다.
    const gdacsTyphoonList = parceGDACS_HTML(html);

    // 현재시간과 비교하기위해 UTC + 0으로 변환합니다.
    const todayGMT = new Date();
    const todayTyphoonList = gdacsTyphoonList.filter((typhoon) => {
      const { date } = typhoon;
      return (
        // 태풍이 현재보다 이전이고 36시간 지나지 않았을때
        todayGMT.getTime() - date.getTime() < 36 * 60 * 60 * 1000
      );
    });
    if (todayTyphoonList.length > 0) {
      this.logger.log('GDACS 태풍정보 업데이트 되었음');
      todayTyphoonList.map((typhoon) => {
        this.eventEmitter.emit('typhoon.GDACS.updated', typhoon);
      });
    }
  }

  /**
   * 태풍 정보를 가져오는 스케줄러입니다.
   * aerisweather 사이트에서 태풍 정보를 가져옵니다.
   */
  @Cron('0 0 * * * *')
  async observeAresWeatherTyphoon() {
    const aerisData = await await this.httpService.axiosRef.get(
      aresWeatherURL({
        client_id: process.env.AERIS_CLIENT_ID,
        client_secret: process.env.AERIS_CLIENT_SECRET,
      }),
    );
    const res = aerisData.data as IAresWeatherResponse;

    const { response } = res;
    response.map((typhoon) => {
      this.eventEmitter.emit('typhoon.aerisweather.updated', typhoon);
    });
  }
}
