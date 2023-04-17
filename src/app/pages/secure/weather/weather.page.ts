import { Component, OnInit } from '@angular/core';
import {
  Geolocation,
  GeolocationPluginPermissions,
  Position,
} from '@capacitor/geolocation';
import { WeatherApiType } from 'src/app/constants/wather-api-type';
import { OpenWeatherMapService } from 'src/app/services/weather/api/openweathermap-service';
import { WeatherFakeService } from 'src/app/services/weather/api/weatherfake-service';
import { WeatherService } from 'src/app/services/weather/weather-service';
import { environment } from 'src/environments/environment';
import { CurrentWeather } from '../../../services/weather/weather-api';
import { HttpClient } from '@angular/common/http';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
  PlatformOptions,
} from 'capacitor-native-settings-joan';

/**
 *
 * Factory to instance api wather service
 *
 * @param httpClient
 * @returns Corresponding service
 */
const weatherApiServiceFactory = (httpClient: HttpClient) => {
  const api = environment.weatherApi;
  if (api == WeatherApiType.OpenWeatherMap)
    return new OpenWeatherMapService(httpClient);

  if (api == WeatherApiType.WatherFake) return new WeatherFakeService();

  throw Error('Weather API Not implemented');
};

@Component({
  selector: 'app-account',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  providers: [
    {
      provide: WeatherService,
      useFactory: weatherApiServiceFactory,
      deps: [HttpClient],
    },
  ],
})
export class WeatherPage implements OnInit {
  currentWeather: CurrentWeather;
  currentPosition: Position;
  loading: boolean = true;
  grantedLocation: boolean = true;
  locationServicesFailed = false;
  errorLoadingWeatherInfo = false;

  constructor(private watherService: WeatherService) {}

  ngOnInit() {
    this.loadWeatherInfo();
  }

  private restartIndicators() {
    this.locationServicesFailed = false;
    this.grantedLocation = true;
    this.errorLoadingWeatherInfo = false;
    this.loading = true;
  }

  /**
   * Load weather info
   * @returns
   */
  private async loadWeatherInfo() {
    this.restartIndicators();

    try {
      await this.checkLocationPermissions();
    } catch (error) {
      this.locationServicesFailed = true;
      this.loading = false;
      return;
    }

    if (!this.grantedLocation) {
      this.loading = false;
      return;
    }

    this.currentPosition = await this.getCurrentPosition();

    if (!this.currentPosition) {
      this.locationServicesFailed = true;
      this.loading = false;
      return;
    }

    const coords = this.currentPosition.coords;
    this.watherService
      .getCurrentWeather(coords.latitude, coords.longitude)
      .subscribe({
        complete: () => {
          this.loading = false;
        },
        next: (data) => {
          this.currentWeather = data;
        },
        error: () => {
          this.loading = false;
          this.errorLoadingWeatherInfo = true;
        },
      });
  }

  /**
   *
   * @returns current Location Position, null if cannot get it
   */
  private async getCurrentPosition() {
    return Geolocation.getCurrentPosition().catch((err) => null);
  }

  /**
   * Method to open Location Service configuration
   */
  openSettingsTurnOnLocation = async () => {
    await this.openSettings(SettingsType.LocationService);
    this.loadWeatherInfo();
  };

  /**
   * Method to open Application Configuration
   */
  openSettingsApp = async () => {
    await this.openSettings(SettingsType.AppSettings);
    this.loadWeatherInfo();
  };

  retryLoadWeatherInfo() {
    this.loadWeatherInfo();
  }

  /**
   * Check location GPS service permissions
   */
  private async checkLocationPermissions() {
    const permissions: GeolocationPluginPermissions = {
      permissions: ['location'],
    };
    const { location } = await Geolocation.requestPermissions(permissions);
    if (location == 'denied') {
      this.grantedLocation = false;
    }
    if (location == 'granted') {
      this.grantedLocation = true;
    }
  }

  /**
   * Open APP Settings
   */
  private openSettings(settingsType: SettingsType) {
    const platFormOptions = this.getSpecificOpenSettings(settingsType);
    return NativeSettings.open(platFormOptions);
  }

  private getSpecificOpenSettings(settingsType: SettingsType): PlatformOptions {
    if (settingsType == SettingsType.AppSettings) {
      return {
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App,
      };
    }
    if (settingsType == SettingsType.LocationService) {
      return {
        optionAndroid: AndroidSettings.Location,
        optionIOS: IOSSettings.LocationServices,
      };
    }
  }
}

export enum SettingsType {
  LocationService,
  AppSettings,
}
