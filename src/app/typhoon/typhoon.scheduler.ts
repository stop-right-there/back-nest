import { parceGDACS_HTML } from '@common/util/parseGDACS_HTML';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';

/**
 * @description 태풍 정보를 가져오는 스케줄러
 * @class TyphoonScheduler
 * @classdesc 태풍 정보를 가져오는 스케줄러
 * @memberof Typhoon
 *
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
   * observeTyphoon은 GDACS 사이트에 업데이트된 태풍을 감시만 합니다.
   * 새로운 스케줄이 필요할경우 새로운 함수가 필요합니다.
   */
  @Cron('1 * * * * *')
  async observeTyphoon() {
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

    // 추후 조건을 수정해야합니다.
    // DB 정보와 비교하여 업데이트되었을 경우에만 이벤트를 발생시켜야 합니다.
    // 비교는 todayTyphoonList 요소들의 date값과 DB에 저장된 가장 최근의 정보의 date와 비교합니다.
    // 현재는 DB가 구축되지 않았으므로 모든 태풍이 업데이트 되었다고 가정합니다.

    // 조건을 추가해야합니다.
    // DB에 이미 태풍이 저장되어있는지 확인합니다.
    // 만약 있다면 태풍 update 이벤트를 실행시킵니다.
    // 만약 없다면 태풍 create 이벤트를 실행시킵니다.
    // 코드는 DB가 구축되면 추가예정입니다.
    if (todayTyphoonList.length > 0) {
      this.logger.log('GDACS 태풍정보 업데이트 되었음');

      todayTyphoonList.map((typhoon) => {
        this.eventEmitter.emit('typhoon.updated', typhoon);
      });
    }
  }
}
