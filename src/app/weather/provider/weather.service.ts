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
    dateString,
    city_name,
  }: {
    lat: number;
    lon: number;
    dateString: string;
    city_name: string;
  }) {
    console.log(lat, lon, dateString);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&start_date=${dateString}&end_date=${dateString}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,rain,showers,weathercode,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      const data = response.data;
      data.city = city_name;
      /*
      const key = date + '-' + city_name;
      data.key = key;
      */
      return data;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`, error.stack);
    }
  }
  //over-pass api
  async getCitiesByOverpass(coords: number[]): Promise<any> {
    const [east, south, west, north] = coords;
    if (coords.length != 4) return []; //잘못된 coords 조건일때 빈 배열 반환
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];node[place=city](${east},${south},${west},${north});out%20meta;`;
    console.log(url);

    try {
      const response = await this.httpService.axiosRef.get(url);
      const cities = response.data.elements.map((e) => {
        return e.tags.name;
      });
      return cities;
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`, error.stack);
    }
  }

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

  async getDateRange(start_date: Date, end_date: Date) {
    const dateRange = [];
    const currentDate = new Date(start_date);
    while (currentDate <= end_date) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateRange;
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
