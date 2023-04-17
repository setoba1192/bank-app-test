import { CurrentWeather, WeatherApi } from "./weather-api";
import { Observable } from 'rxjs';

export abstract class WeatherService implements WeatherApi {

  getCurrentWeather : (lat: number, long: number, ciudad?: string) => Observable<CurrentWeather>;

  constructor() {}
}
