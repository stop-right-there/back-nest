import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { IcityRes } from '../interfaces/getCityQuery.interface';
import { IBuildUrl, OpenMeteoData } from '../interfaces/openMeteo.interface';
import { OpenWeatherData } from '../interfaces/openWeather.interface';
import {
  IOpenWeatherMapResponse,
  IWeatherGetDTO,
} from '../interfaces/weather.interface';
import { weatherMock } from '../mock/weather.mock';

import { urlBuilder } from '../util/urlbuilder';

@Injectable()
export class WeatherService {
  private weatherAPIKey = process.env.OPEN_WEATHER_API_KEY;
  private readonly weatherData = weatherMock;
  private readonly logger = new Logger(WeatherService.name);
  constructor(private httpService: HttpService) {}

  async getCity(lat: number, lon: number): Promise<IcityRes> {
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${this.weatherAPIKey}`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      if (!response.data.length) {
        //빈배열일 경우: city, country가 아닐 경우
        const emptyData = {
          city: 'non-city',
          country: 'non-country',
        };
        return emptyData;
      }
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
  }: IBuildUrl & {
    city_name: string;
  }): Promise<OpenMeteoData> {
    const url = urlBuilder({ lat, lon, dateString });
    try {
      const response = await this.httpService.axiosRef.get(url);
      const data = response.data;
      return { ...data, city: city_name, date: dateString };
    } catch (error) {
      this.logger.error(`Error occurred: ${error.message}`, error.stack);
    }
  }

  //over-pass api
  async getCitiesByOverpass(coords: number[]): Promise<string[]> {
    const [south, west, north, east] = coords;
    if (coords.length != 4) return []; //잘못된 coords 조건일때 빈 배열 반환
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];node[place=city](${south},${west},${north},${east});out%20meta;`;
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

  async getDateRange(start_date: Date, end_date: Date) {
    const dateRange = [];
    const currentDate = new Date(start_date);
    while (currentDate <= end_date) {
      dateRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateRange;
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

  async getTyphoonWeatherData({ lat, long, date }: IWeatherGetDTO) {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString();
    const day = date.getUTCDate().toString();
    const hour = date.getUTCHours().toString();
    const { data } = await this.httpService.axiosRef.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(
        4,
      )}&longitude=${long.toFixed(4)}&start_date=${year}-${
        month.length === 1 ? '0' + month : month
      }-${day.length === 1 ? '0' + day : day}&end_date=${year}-${
        month.length === 1 ? '0' + month : month
      }-${
        day.length === 1 ? '0' + day : day
      }&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,surface_pressure,cloudcover,cloudcover_low,cloudcover_mid,cloudcover_high,windspeed_10m,windspeed_80m,windspeed_120m,windspeed_180m,winddirection_10m,winddirection_120m,windgusts_10m,direct_normal_irradiance`,
    );

    const { hourly } = data;
    // hourly 정보에서 필요한 정보만 추출합니다.
    const {
      temperature_2m,
      relativehumidity_2m,
      pressure_msl,
      cloudcover,
      cloudcover_low,
      cloudcover_mid,
      direct_normal_irradiance,
      apparent_temperature,
      windspeed_10m,
      windspeed_120m,
      winddirection_10m,
      winddirection_120m,
      windgusts_10m,
    } = hourly;
    return {
      temperature_2m: temperature_2m[Number(hour)] as number,
      relativehumidity_2m: relativehumidity_2m[Number(hour)] as number,
      apparent_temperature: apparent_temperature[Number(hour)] as number,
      pressure_msl: pressure_msl[Number(hour)] as number,
      cloudcover: cloudcover[Number(hour)] as number,
      cloudcover_low: cloudcover_low[Number(hour)] as number,
      cloudcover_mid: cloudcover_mid[Number(hour)] as number,
      direct_normal_irradiance: direct_normal_irradiance[
        Number(hour)
      ] as number,
      windspeed_10m: windspeed_10m[Number(hour)] as number,
      windspeed_100m: windspeed_120m[Number(hour)] as number,
      winddirection_10m: winddirection_10m[Number(hour)] as number,
      winddirection_100m: winddirection_120m[Number(hour)] as number,
      windgusts_10m: windgusts_10m[Number(hour)] as number,
    };
  }

  async getTyphoonWeatherOpenWeatherMap({ date, long, lat }: IWeatherGetDTO) {
    const { data: openWeatherMapRes } = await this.httpService.axiosRef.get(
      `https://api.openweathermap.org/data/3.0/onecall/timemachine?dt=${
        date.getTime() / 1000
      }&lat=${lat}&lon=${long}&appid=${
        process.env.OPEN_WEATHER_API_KEY
      }&type=hour`,
    );
    const { data: weatherData }: { data: IOpenWeatherMapResponse[] } =
      openWeatherMapRes;
    return weatherData[0];
  }

  async getTyphoonWeatherDataPast({ lat, long, date }: IWeatherGetDTO) {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString();
    const day = date.getUTCDate().toString();
    const hour = date.getUTCHours().toString();
    // console.log(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${long}&start_date=${year}-${
    //   month.length === 1 ? '0' + month : month
    // }-${day.length === 1 ? '0' + day : day}&end_date=${year}-${
    //   month.length === 1 ? '0' + month : month
    // }-${
    //   day.length === 1 ? '0' + day : day
    // }&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,cloudcover,cloudcover_low,cloudcover_mid,direct_normal_irradiance,windspeed_10m,windspeed_100m,winddirection_10m,winddirection_100m,windgusts_10m`)

    try {
      const { data } = await this.httpService.axiosRef.get(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${long}&start_date=${year}-${
          month.length === 1 ? '0' + month : month
        }-${day.length === 1 ? '0' + day : day}&end_date=${year}-${
          month.length === 1 ? '0' + month : month
        }-${
          day.length === 1 ? '0' + day : day
        }&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,cloudcover,cloudcover_low,cloudcover_mid,direct_normal_irradiance,windspeed_10m,windspeed_100m,winddirection_10m,winddirection_100m,windgusts_10m`,
      );

      const { hourly } = data;
      // hourly 정보에서 필요한 정보만 추출합니다.
      const {
        temperature_2m,
        relativehumidity_2m,
        pressure_msl,
        cloudcover,
        cloudcover_low,
        cloudcover_mid,
        direct_normal_irradiance,
        apparent_temperature,
        windspeed_10m,
        windspeed_100m,
        winddirection_10m,
        winddirection_100m,
        windgusts_10m,
      } = hourly;
      return {
        temperature_2m: temperature_2m[Number(hour)] as number,
        relativehumidity_2m: relativehumidity_2m[Number(hour)] as number,
        apparent_temperature: apparent_temperature[Number(hour)] as number,
        pressure_msl: pressure_msl[Number(hour)] as number,
        cloudcover: cloudcover[Number(hour)] as number,
        cloudcover_low: cloudcover_low[Number(hour)] as number,
        cloudcover_mid: cloudcover_mid[Number(hour)] as number,
        direct_normal_irradiance: direct_normal_irradiance[
          Number(hour)
        ] as number,
        windspeed_10m: windspeed_10m[Number(hour)] as number,
        windspeed_100m: windspeed_100m[Number(hour)] as number,
        winddirection_10m: winddirection_10m[Number(hour)] as number,
        winddirection_100m: winddirection_100m[Number(hour)] as number,
        windgusts_10m: windgusts_10m[Number(hour)] as number,
      };
    } catch (e) {
      console.log(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${long}&start_date=${year}-${
          month.length === 1 ? '0' + month : month
        }-${day.length === 1 ? '0' + day : day}&end_date=${year}-${
          month.length === 1 ? '0' + month : month
        }-${
          day.length === 1 ? '0' + day : day
        }&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,cloudcover,cloudcover_low,cloudcover_mid,direct_normal_irradiance,windspeed_10m,windspeed_100m,winddirection_10m,winddirection_100m,windgusts_10m`,
      );
    }
  }
}
