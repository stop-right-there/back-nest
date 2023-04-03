import { parceGDACS } from '@common/util/parseGDACS';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TyphoonScheduler {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger(TyphoonScheduler.name);

  async observeTyphoon() {
    this.logger.log('태풍 불러오기');
    // gdacs.org 에서 태풍 정보를 가져옵니다.
    const { data } = await this.httpService.axiosRef.get(
      'https://www.gdacs.org/datareport/resources/TC/',
    );
    // 가져온 데이터를 파싱합니다.
    const gdacsTyphoonList = parceGDACS(data);
    console.log(gdacsTyphoonList);

    // const todayGMT = new Date().toUTCString();
    // const todayTyphoonList = gdacsTyphoonList.filter((typhoon) => {
    //   const { date } = typhoon;
    //   const typhoonUTCdate = new Date(
    //     Date.UTC(date[2], date[0] - 1, date[1], date[3], date[4]),
    //   ).toUTCString();
    //   console.log(typhoonUTCdate);
    // });
  }
}
