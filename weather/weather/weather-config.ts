export type WeatherConfig = {
  /**
   * Open-Meteo forecast API base URL.
   */
  apiBaseUrl?: string;

  /**
   * Cache TTL in milliseconds for current weather snapshots. Defaults to 5 minutes.
   */
  snapshotCacheTtlMs?: number;
};
