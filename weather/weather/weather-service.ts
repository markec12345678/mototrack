import { WeatherSnapshot } from '@markec/weather.entities.weather-snapshot';
import { ForecastDay } from '@markec/weather.entities.forecast-day';

const DEFAULT_API_BASE_URL = `https://api.open-meteo.com/v1/forecast`;
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

const CURRENT_FIELDS = [
  `temperature_2m`,
  `apparent_temperature`,
  `wind_speed_10m`,
  `wind_direction_10m`,
  `wind_gusts_10m`,
  `relative_humidity_2m`,
  `visibility`,
  `precipitation`,
  `weather_code`,
].join(`,`);

const DAILY_FIELDS = [
  `temperature_2m_min`,
  `temperature_2m_max`,
  `precipitation_sum`,
  `wind_speed_10m_max`,
  `weather_code`,
].join(`,`);

export type LocationInput = {
  lat: number;
  lng: number;
};

export type RouteWeather = {
  location: LocationInput;
  etaMin: number;
  snapshot: WeatherSnapshot;
};

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

function buildKey(lat: number, lng: number, suffix: string): string {
  const roundedLat = lat.toFixed(3);
  const roundedLng = lng.toFixed(3);
  return `${suffix}:${roundedLat},${roundedLng}`;
}

/**
 * Service responsible for talking to the Open-Meteo HTTP API,
 * mapping the response into our domain entities, caching
 * snapshots in-memory and being resilient to network failures.
 */
export class WeatherService {
  private snapshotCache = new Map<string, CacheEntry<WeatherSnapshot>>();
  private forecastCache = new Map<string, CacheEntry<ForecastDay[]>>();

  constructor(
    private apiBaseUrl: string = DEFAULT_API_BASE_URL,
    private cacheTtlMs: number = DEFAULT_CACHE_TTL_MS
  ) {}

  /**
   * Returns the current weather snapshot for the provided location.
   * Cached for `cacheTtlMs` per coordinate. Resilient to network
   * failures, returning a sensible fallback snapshot.
   */
  async getCurrentWeather(location: LocationInput): Promise<WeatherSnapshot> {
    const key = buildKey(location.lat, location.lng, `current`);
    const cached = this.snapshotCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    try {
      const url = `${this.apiBaseUrl}?latitude=${location.lat}&longitude=${location.lng}&current=${CURRENT_FIELDS}&timezone=auto`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo responded with status ${response.status}`);
      }

      const json = await response.json();
      const snapshot = WeatherSnapshot.fromOpenMeteoCurrent(json);

      this.snapshotCache.set(key, {
        value: snapshot,
        expiresAt: Date.now() + this.cacheTtlMs,
      });

      return snapshot;
    } catch (error) {
      if (cached) return cached.value;
      return this.buildFallbackSnapshot();
    }
  }

  /**
   * Samples weather along a route by evenly picking `samples` waypoints
   * from the provided geometry and querying current weather at each one.
   */
  async getWeatherAlongRoute(
    geometry: LocationInput[],
    samples = 5
  ): Promise<RouteWeather[]> {
    if (geometry.length === 0) return [];

    const count = Math.min(Math.max(samples, 1), geometry.length);
    const step = (geometry.length - 1) / Math.max(count - 1, 1);

    const indices: number[] = [];
    for (let i = 0; i < count; i += 1) {
      indices.push(Math.round(i * step));
    }

    const snapshots = await Promise.all(
      indices.map((idx) => this.getCurrentWeather(geometry[idx]))
    );

    const averageSpeedKmh = 60;
    const totalKm = Math.max(geometry.length * 0.5, 5);

    return indices.map((idx, i) => ({
      location: geometry[idx],
      etaMin: Math.round((totalKm / averageSpeedKmh) * 60 * (i / Math.max(count - 1, 1))),
      snapshot: snapshots[i],
    }));
  }

  /**
   * Returns a multi-day forecast for the provided location. Cached for
   * `cacheTtlMs` per coordinate.
   */
  async getForecast(location: LocationInput): Promise<ForecastDay[]> {
    const key = buildKey(location.lat, location.lng, `forecast`);
    const cached = this.forecastCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    try {
      const url = `${this.apiBaseUrl}?latitude=${location.lat}&longitude=${location.lng}&daily=${DAILY_FIELDS}&timezone=auto`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Open-Meteo responded with status ${response.status}`);
      }

      const json = await response.json();
      const days = ForecastDay.fromOpenMeteoDaily(json);

      this.forecastCache.set(key, {
        value: days,
        expiresAt: Date.now() + this.cacheTtlMs,
      });

      return days;
    } catch (error) {
      if (cached) return cached.value;
      return this.buildFallbackForecast();
    }
  }

  /**
   * A safe default snapshot — clear, calm, mild — used when the
   * upstream API is unreachable and no cached value exists.
   */
  private buildFallbackSnapshot(): WeatherSnapshot {
    const ts = Math.floor(Date.now() / 1000);
    return WeatherSnapshot.from({
      id: new Date(ts * 1000).toISOString(),
      tempC: 18,
      feelsLikeC: 18,
      windKmh: 6,
      windDirDeg: 0,
      gustKmh: 10,
      humidity: 55,
      visibilityKm: 20,
      precipMmH: 0,
      wmoCode: 0,
      label: `Jasno`,
      icon: `☀️`,
      ts,
    });
  }

  private buildFallbackForecast(): ForecastDay[] {
    const today = new Date();
    return Array.from({ length: 3 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return ForecastDay.from({
        date: date.toISOString().slice(0, 10),
        tempMinC: 14,
        tempMaxC: 22,
        precipMm: 0,
        windKmh: 8,
        wmoCode: 1,
        label: `Pretežno jasno`,
        icon: `⛅`,
      });
    });
  }
}
