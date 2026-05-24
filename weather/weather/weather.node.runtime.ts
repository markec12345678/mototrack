import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import type { WeatherSnapshot } from '@markec/weather.entities.weather-snapshot';
import type { ForecastDay } from '@markec/weather.entities.forecast-day';
import { WeatherService, type LocationInput, type RouteWeather } from './weather-service.js';
import { createWeatherGqlSchema } from './weather.graphql.js';
import type { WeatherConfig } from './weather-config.js';

export class WeatherNode {
  constructor(
    private config: WeatherConfig,
    private weatherService: WeatherService
  ) {}

  /**
   * Current weather snapshot for the provided location.
   */
  async getCurrentWeather(location: LocationInput): Promise<WeatherSnapshot> {
    return this.weatherService.getCurrentWeather(location);
  }

  /**
   * Weather samples along a planned route geometry.
   */
  async getWeatherAlongRoute(
    geometry: LocationInput[],
    samples?: number
  ): Promise<RouteWeather[]> {
    return this.weatherService.getWeatherAlongRoute(geometry, samples ?? 5);
  }

  /**
   * Multi-day forecast for the provided location.
   */
  async getForecast(location: LocationInput): Promise<ForecastDay[]> {
    return this.weatherService.getForecast(location);
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig: WeatherConfig = {};

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformNode],
    config: WeatherConfig
  ) {
    const weatherService = new WeatherService(
      config.apiBaseUrl,
      config.snapshotCacheTtlMs
    );
    const weather = new WeatherNode(config, weatherService);
    const gqlSchema = createWeatherGqlSchema(weather);

    symphonyPlatform.registerBackendServer([
      {
        gql: gqlSchema,
      },
    ]);

    return weather;
  }
}

export default WeatherNode;
