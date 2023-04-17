import { Injectable } from '@angular/core';
import { CurrentWeather, WeatherApi } from '../weather-api';
import { Observable, of } from 'rxjs';
import { WeatherService } from '../weather-service';

@Injectable()
export class WeatherFakeService extends WeatherService {
  constructor() {
    super();
  }

  public getCurrentWeather = (
    lat: number,
    long: number,
    ciudad: string
  ): Observable<CurrentWeather> => {
    let test: CurrentWeather = {
      city: 'Fake',
      description: 'overcast clouds',
      temperature: '',
      icon: 'https://openweathermap.org/img/wn/10d@4x.png',
    };
    return of(test);
  };

}
