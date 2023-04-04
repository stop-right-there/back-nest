import cheerio from 'cheerio';

interface GDACSDetailData {
  name: string;
  central_latitude: number;
  central_longitude: number;
  maximum_wind_speed: number;
  observation_date: Date;
  start_date: Date;
  grade: number;
}

export const parseGDACS_XML = (xml: string): GDACSDetailData => {
  const $ = cheerio.load(xml, { xmlMode: true, decodeEntities: false });
  const geoPoint = $('geo\\:Point');
  const maximum_wind_speed = Number(
    $('description')
      .text()
      .match(/maximum wind speed of (\d+) km\/h/)[1],
  );

  const central_latitude = Number(
    parseFloat(geoPoint.find('geo\\:lat').text()),
  );
  const central_longitude = Number(
    parseFloat(geoPoint.find('geo\\:long').text()),
  );
  const start_date = $('gdacs\\:fromdate').text();
  //todate는 마지막 관측시간
  const todate = $('gdacs\\:todate').text();
  const name = $('gdacs\\:eventname').text();

  const population = $('gdacs\\:population').text();
  const grade = Number(population.match(/Category\s*(\d+)/)[1]);

  return {
    name,
    central_latitude,
    central_longitude,
    maximum_wind_speed,
    observation_date: new Date(todate), //관측시간
    start_date: new Date(start_date),
    grade,
  };
};
