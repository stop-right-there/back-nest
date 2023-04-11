export const aresWeatherURL = ({
  client_id,
  client_secret,
}: {
  client_id: string;
  client_secret: string;
}) =>
  `https://api.aerisapi.com/tropicalcyclones?p=&filter=all&limit=10&client_id=${client_id}&client_secret=${client_secret}`;

export interface IAresWeatherResponse {
  success: boolean;
  error: any;
  response: IAresWeatherData[];
}

export interface IAresWeatherData {
  id: string;
  profile: IAresWeatherTCProfile;
  position: IPosition;
  track: ITrack[];
  forecast: IForecast[];
  breakPointAlerts?: IBreakPointAlerts[];
  errorCone?: IErrorCone;
  relativeTo?: IRelativeTo;
}

export interface IAresWeatherTCProfile {
  name: string;
  year: number;
  basinOrigin: string;
  basinCurrent: string;
  basins: any[];
  event: number;
  isActive: boolean;
  lifespan: ILifespan;
  maxStormType: MaxStormType;
  maxStormCat: MaxStormCat;
  windSpeed: IWindSpeed;
  pressure: IPressure;
  productEvent: number;
  maxStormName: string;
  boundingBox: number[];
  tz: string;
}

export interface ILifespan {
  startTimestamp: number;
  startDateTimeISO: string;
  endTimestamp: number;
  endDateTimeISO: string;
}

export type MaxStormType = 'TD' | 'TS' | 'H' | 'TY';

export type MaxStormCat =
  | 'TD'
  | 'TS'
  | 'H1'
  | 'H2'
  | 'H3'
  | 'H4'
  | 'H5'
  | 'TY'
  | 'STY';
export interface IWindSpeed {
  maxKTS: number;
  maxKPH: number;
  maxMPH: number;
  maxTimestamp: number;
  maxDateTimeISO: string;
}

export interface IPressure {
  minMB?: number | null;
  minIN?: number | null;
  minTimestamp?: number;
  minDateTimeISO?: string;
}

export interface IPosition {
  timestamp: number;
  dateTimeISO: string;
  location: ILocation;
  loc: ILoc;
  details: IDetails;
}

export interface ILocation {
  type: string;
  coordinates: number[];
}
export interface ILoc {
  long: number;
  lat: number;
}
export interface IDetails {
  stormType: MaxStormType;
  stormCat: MaxStormCat;
  stormName: string;
  stormShortName: string;
  advisoryNumber: string | number;
  basin: string;
  movement: IMovement;
  windSpeedKTS: number;
  windSpeedKPH: number;
  windSpeedMPH: number;
  gustSpeedKTS: number;
  gustSpeedKPH: number;
  gustSpeedMPH: number;
  pressureMB?: number;
  pressureIN?: number;
  windRadii: IPositionDetailsWindRadii[];
}

export interface IMovement {
  direction: string;
  directionDEG: number;
  speedKTS: number;
  speedKPH: number;
  speedMPH: number;
}

export interface IPositionDetailsWindRadii {
  windSpeedKTS: number;
  windSpeedKPH: number;
  windSpeedMPH: number;
  quadrants: IWindRadii;
  windField?: any;
}

interface IQuadrantPosition {
  long: number;
  lat: number;
}

// interface IQuadrantDistance {
//   distanceKM: number;
//   distanceMI: number;
//   distanceNM: number;
// }

interface Quadrant {
  loc: IQuadrantPosition;
  distanceKM: number;
  distanceMI: number;
  distanceNM: number;
}

interface IWindRadii {
  ne: Quadrant;
  se: Quadrant;
  sw: Quadrant;
  nw: Quadrant;
}

interface ITrack {
  timestamp: number;
  dateTimeISO: string;
  location: ILocation;
  loc: ILoc;
  details: IDetails;
}

export interface IForecast {
  timestamp: number;
  dateTimeISO: string;
  location: ILocation;
  loc: ILoc;
  details: IDetails;
}

interface IErrorCone {
  Type: string;
  coordinates: number[];
}

interface IBreakPointAlerts {
  /**
TR.A = Tropical Storm Watch
TR.W = Tropical Storm Warning
HU.A = Hurricane Watch
HU.W = Hurricane Warning
*/
  alertType: string;
  coords: IErrorCone;
}

interface IRelativeTo {
  lat: number;
  long: number;
  bearing: number;
  bearingEng: string;
  distanceKM: number;
  distanceMI: number;
}
