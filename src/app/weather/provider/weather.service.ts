import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { weatherMock } from '../mock/weather.mock';

@Injectable()
export class WeatherService {
  private weatherAPIKey = process.env.WEATHER_API_KEY;
  private readonly weatherData = weatherMock;
  constructor(private httpService: HttpService) {}

  async getCity(lat: number, lon: number): Promise<string> {
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${this.weatherAPIKey}`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      return response.data[0].name;
    } catch (e) {
      throw new console.error('error');
    }
    //const response = await firstValueFrom(this.httpService.get(url));
  }

  async getWeatherData(
    lat: number,
    lon: number,
    start_date: string,
    end_date: string,
  ) {
    //console.log(city, start_date, end_date);
    const city = await this.getCity(lat, lon);
    //console.log(city);

    const data = [];
    const start = this.weatherData.hourly.time.findIndex(
      (t) => t.substring(0, 10) === start_date,
    );
    const end = this.weatherData.hourly.time.findIndex(
      (t) => t.substring(0, 10) === end_date,
    );
    //console.log(start, end);

    if (this.weatherData.city === city) {
      for (let index = start; index <= end; index++) {
        const result = {
          temperature_2m: this.weatherData.hourly.temperature_2m[index],
          relativehumidity_2m:
            this.weatherData.hourly.relativehumidity_2m[index],
          apparent_temperature:
            this.weatherData.hourly.apparent_temperature[index],
          precipitation_probability:
            this.weatherData.hourly.precipitation_probability[index],
          rain: this.weatherData.hourly.rain[index],
          showers: this.weatherData.hourly.showers[index],
          weathercode: this.weatherData.hourly.weathercode[index],
          cloudcover: this.weatherData.hourly.cloudcover[index],
          cloudcover_low: this.weatherData.hourly.cloudcover_low[index],
          cloudcover_mid: this.weatherData.hourly.cloudcover_mid[index],
          cloudcover_high: this.weatherData.hourly.cloudcover_high[index],
        };
        data.push(result);
      }
    }
    //console.log(data.length);

    if (data.length === 1) {
      //없으면 api 불러오기 -> 저장은 나중에

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&start_date=${start_date}&end_date=${end_date}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,rain,showers,weathercode,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high`;
      try {
        const response = await this.httpService.axiosRef.get(url);
        return response.data;
      } catch (e) {
        console.error(e); // 에러 출력
        throw new Error('Failed to retrieve weather data from API.'); // 예외 던지기
      }
    }
    return data;
  }
}
