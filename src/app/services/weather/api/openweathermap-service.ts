import { Injectable } from '@angular/core';
import { CurrentWeather, WeatherApi } from '../weather-api';
import { Observable, map, of } from 'rxjs';
import { WeatherService } from '../weather-service';
import { HttpClient } from '@angular/common/http';

const API_KEY = 'c749e8a742df9950aa4d95cd3a817503';
const API_ICON = 'https://openweathermap.org/img/wn/';

@Injectable()
export class OpenWeatherMapService extends WeatherService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  public getCurrentWeather = (
    lat: number,
    long: number
  ): Observable<CurrentWeather> => {
    return this.httpClient.get<CurrentWeather>(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
    ).pipe(
      map((data: any)=>{
        const currentWeather : CurrentWeather = {
          city: data.name,
          description : data.weather[0].description,
          icon : API_ICON+data.weather[0].icon+'@4x.png',
          temperature : Math.round(data.main.temp)+'°C',
          feelsLike : Math.round(data.main.feels_like)+'°C'
        }
        return currentWeather;
      })
    );
  };
}
