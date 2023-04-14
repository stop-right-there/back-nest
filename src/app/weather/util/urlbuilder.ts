import { IBuildUrl } from '../interfaces/openMeteo.interface';

export const urlBuilder = ({ lat, lon, dateString }: IBuildUrl) => {
  const now = new Date();
  const date = new Date(dateString);
  //historical(6개월 이전이면)
  if (date < new Date(now.setMonth(now.getMonth() - 6))) {
    return `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${dateString}&end_date=${dateString}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,weathercode,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high`;
  }
  //forecast&current
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&start_date=${dateString}&end_date=${dateString}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,rain,weathercode,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high`;
};
