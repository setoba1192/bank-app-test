import { Observable } from 'rxjs';

export interface WeatherApi {
  getCurrentWeather: (
    lat: number,
    long: number,
    ciudad: string
  ) => Observable<CurrentWeather>;
}

export interface CurrentWeather {
  temperature: string;
  feelsLike?: string;
  description: string;
  icon: string;
  city: string;
}
