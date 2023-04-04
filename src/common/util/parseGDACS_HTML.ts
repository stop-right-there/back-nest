import { GDASCTyphoonUpdatedEvent } from '@app/typhoon/event/typhoon-updated.envent';
import cheerio from 'cheerio';

/**
 * @param html
 *
 * @returns ExtractedData[]
 * @description  GDACS 사이트에서 태풍 정보를 추출합니다.
 * @example   const extractedData = parceGDACS(html);
 */
export const parceGDACS_HTML = (html: string): GDASCTyphoonUpdatedEvent[] => {
  const $ = cheerio.load(html);
  const dates = [];
  const ids = [];
  $('pre')
    .contents()
    .each((_, element) => {
      const isTextNode = element.type === 'text';
      const isAnchorTag = element.type === 'tag' && element.name === 'a';
      if (isTextNode) {
        const text = element.data.replace('<dir>', '').trim();
        dates.push(
          text
            .replaceAll('/', ',')
            .replaceAll('  ', ' ')
            .replaceAll(' ', ',')
            .replaceAll(':', ',')
            .split(','),
        );
      }
      if (isAnchorTag) {
        const id = $(element).text().trim();
        if (!isNaN(Number(id))) ids.push(Number(id));
      }
    });

  const extractedData: GDASCTyphoonUpdatedEvent[] = ids.map((id, index) => {
    const dateData = dates[index];
    const date = new Date(
      Date.UTC(
        dateData[2],
        dateData[0] - 1,
        dateData[1],
        dateData[3],
        dateData[4],
      ),
    );

    return {
      id,
      date,
    };
  });

  return extractedData;
};
