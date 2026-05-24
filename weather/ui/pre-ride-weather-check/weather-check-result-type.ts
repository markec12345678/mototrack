import type { WeatherSnapshot } from '@markec/weather.entities.weather-snapshot';

export type WeatherCheckResult = {
  /**
   * Whether the current weather conditions are considered dangerous for riding.
   */
  isDangerous: boolean;

  /**
   * Human-readable reason explaining why conditions are dangerous (or safe).
   */
  reason: string;

  /**
   * The raw weather snapshot used to compute the result.
   */
  snapshot: WeatherSnapshot | null;
};
