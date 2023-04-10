import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { OpenWeatherData } from '../interfaces/openWeather.interface';
import { weatherMock } from '../mock/weather.mock';

@Injectable()
export class WeatherService {
  private weatherAPIKey = process.env.OPEN_WEATHER_API_KEY;
  private readonly weatherData = weatherMock;
  private readonly logger = new Logger(WeatherService.name);
  constructor(private httpService: HttpService) {}

  async getCity(lat: number, lon: number) {
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${this.weatherAPIKey}`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      const data = {
        city: response.data[0].name,
        country: response.data[0].country,
      };
      return data;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`, error.stack);
    }
  }
  async getWeatherData({
    lat,
    lon,
    date,
  }: {
    lat: number;
    lon: number;
    date: Date;
  }) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&start_date=${date}&end_date=${date}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,rain,showers,weathercode,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      const data = response.data;
      const cityData = await this.getCity(lat, lon); //도시 받아오기
      const city = cityData.city;
      const key = date + '-' + city;
      data.key = key;
      return data;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`, error.stack);
    }
  }
  /*
  async getWeatherData({
    lat,
    lon,
    start_date,
    period,
    end_date,
  }: {
    lat: number;
    lon: number;
    start_date?: Date;
    period?: number;
    end_date?: Date;
  }) {
    if (start_date && period)
      end_date = new Date(start_date.getTime() + period * 24 * 60 * 60 * 1000);
    if (end_date && period)
      start_date = new Date(end_date.getTime() - period * 24 * 60 * 60 * 1000);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&start_date=${start_date}&end_date=${end_date}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,rain,showers,weathercode,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      const result = {};
      const data = response.data;
      const cityData = await this.getCity(lat, lon); //도시 받아오기
      const city = cityData.city;
      data.hourly.time.forEach((datetime, i) => {
        const key = datetime.split('T')[0] + '-' + city;
        const temperature_2m = data.hourly.temperature_2m[i];
        const relativehumidity_2m = data.hourly.relativehumidity_2m[i];
        const apparent_temperature = data.hourly.apparent_temperature[i];
        const precipitation_probability =
          data.hourly.precipitation_probability[i];
        const rain = data.hourly.rain[i];
        const showers = data.hourly.showers[i];
        const weathercode = data.hourly.weathercode[i];
        const cloudcover = data.hourly.cloudcover[i];
        const cloudcover_low = data.hourly.cloudcover_low[i];
        const cloudcover_mid = data.hourly.cloudcover_mid[i];
        const cloudcover_high = data.hourly.cloudcover_high[i];

        if (!result[key]) result[key] = [];
        result[key].push({
          time: datetime,
          temperature_2m: temperature_2m,
          relativehumidity_2m: relativehumidity_2m,
          apparent_temperature: apparent_temperature,
          precipitation_probability: precipitation_probability,
          rain: rain,
          showers: showers,
          weathercode: weathercode,
          cloudcover: cloudcover,
          cloudcover_low: cloudcover_low,
          cloudcover_mid: cloudcover_mid,
          cloudcover_high: cloudcover_high,
        });
      });
      return result;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`, error.stack);
    }
  }
*/
  //open-weather map

  async getCurrentOpenWeatherMap(
    lat: number,
    lon: number,
  ): Promise<OpenWeatherData> {
    //현재날씨
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${this.weatherAPIKey}`;

    try {
      const response = await this.httpService.axiosRef.get(url);
      const data = {
        dt: response.data.current.dt,
        temp: response.data.current.temp,
        pressure: response.data.current.pressure,
        humidity: response.data.current.humidity,
        clouds: response.data.current.clouds,
        wind_speed: response.data.current.wind_speed,
      };
      return data;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`, error.stack);
    }
  }

  async getPastOpenWeatherMap(
    lat: number,
    lon: number,
    time: string,
  ): Promise<OpenWeatherData> {
    //과거날씨
    const url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${time}&appid=${this.weatherAPIKey}`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      const data = {
        dt: response.data.current.dt,
        temp: response.data.current.temp,
        pressure: response.data.current.pressure,
        humidity: response.data.current.humidity,
        clouds: response.data.current.clouds,
        wind_speed: response.data.current.wind_speed,
      };
      return data;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`, error.stack);
    }
  }
}