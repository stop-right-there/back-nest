import cheerio from 'cheerio';

interface ExtractedData {
  date: number[];
  number: number;
}

/**
 * @param html
 *
 * @returns ExtractedData[]
 * @description  GDACS 사이트에서 태풍 정보를 추출합니다.
 * @example   const extractedData = parceGDACS(html);
 */
export const parceGDACS = (html: string) => {
  const $ = cheerio.load(html);
  const extractedData: ExtractedData[] = [];

  $('pre')
    .contents()
    .each((_, element) => {
      if (element.type === 'text') {
        const dateString =
          element.data
            .trim()
            .match(/(\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2} (?:AM|PM))/)?.[0] ||
          '';
        const numberString =
          $(element).next('a').text().trim().match(/(\d+)/)?.[0] || '';

        if (dateString && numberString) {
          extractedData.push({
            // date: dateString
            //   .split(' ')[0]
            //   .split('/')
            //   .map((v) => parseInt(v)),
            //dateString은  10/6/2020 12:51 PM 으로 , [mm,dd,yyyy,hh,mm] 형태로 변환 이때 12시간제를 24시간제로 변환해야함,
            date: dateString
              .split(' ')[0]
              .split('/')
              .map((v) => parseInt(v))
              .concat(
                dateString
                  .split(' ')[1]
                  .split(':')
                  .map((v) => parseInt(v)),
              ),

            number: parseInt(numberString, 10),
          });
        }
      }
    });
  return extractedData;
};
