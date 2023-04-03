import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private weatherAPIKey = process.env.WEATHER_API_KEY;
  constructor(private httpService: HttpService) {}

  async getCity(lat: number, lon: number) {
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${this.weatherAPIKey}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data[0].name;
  }
}
