import { WeatherSnapshot } from './weather-snapshot.js';
import type { PlainWeatherSnapshot } from './weather-snapshot.js';

const BASE_TS = 1718000000; // fixed Unix timestamp for deterministic mocks

/**
 * Returns a single mock WeatherSnapshot, optionally overriding any field.
 */
export function mockWeatherSnapshot(
  overrides: Partial<PlainWeatherSnapshot> = {},
): WeatherSnapshot {
  const defaults: PlainWeatherSnapshot = {
    id: new Date(BASE_TS * 1000).toISOString(),
    tempC: 22.4,
    feelsLikeC: 21.1,
    windKmh: 14,
    windDirDeg: 270,
    gustKmh: 28,
    humidity: 58,
    visibilityKm: 24,
    precipMmH: 0,
    wmoCode: 1,
    label: 'Pretežno jasno',
    icon: '🌤️',
    ts: BASE_TS,
  };

  return WeatherSnapshot.from({ ...defaults, ...overrides });
}

/**
 * Returns an array of mock WeatherSnapshot objects covering
 * a variety of WMO weather conditions.
 */
export function mockWeatherSnapshots(): WeatherSnapshot[] {
  return [
    mockWeatherSnapshot({
      id: new Date((BASE_TS + 0) * 1000).toISOString(),
      wmoCode: 0,
      label: 'Jasno',
      icon: '☀️',
      tempC: 28.5,
      feelsLikeC: 27.0,
      humidity: 40,
      precipMmH: 0,
      ts: BASE_TS + 0,
    }),
    mockWeatherSnapshot({
      id: new Date((BASE_TS + 3600) * 1000).toISOString(),
      wmoCode: 2,
      label: 'Delno oblačno',
      icon: '⛅',
      tempC: 19.3,
      feelsLikeC: 18.5,
      humidity: 65,
      precipMmH: 0,
      ts: BASE_TS + 3600,
    }),
    mockWeatherSnapshot({
      id: new Date((BASE_TS + 7200) * 1000).toISOString(),
      wmoCode: 63,
      label: 'Zmeren dež',
      icon: '🌧️',
      tempC: 13.1,
      feelsLikeC: 11.4,
      windKmh: 22,
      gustKmh: 40,
      humidity: 88,
      precipMmH: 3.2,
      ts: BASE_TS + 7200,
    }),
    mockWeatherSnapshot({
      id: new Date((BASE_TS + 10800) * 1000).toISOString(),
      wmoCode: 95,
      label: 'Nevihta',
      icon: '⛈️',
      tempC: 11.0,
      feelsLikeC: 9.2,
      windKmh: 45,
      gustKmh: 72,
      humidity: 95,
      precipMmH: 8.5,
      ts: BASE_TS + 10800,
    }),
    mockWeatherSnapshot({
      id: new Date((BASE_TS + 14400) * 1000).toISOString(),
      wmoCode: 73,
      label: 'Zmeren sneg',
      icon: '❄️',
      tempC: -3.2,
      feelsLikeC: -7.1,
      windKmh: 18,
      gustKmh: 30,
      humidity: 92,
      precipMmH: 1.1,
      ts: BASE_TS + 14400,
    }),
    mockWeatherSnapshot({
      id: new Date((BASE_TS + 18000) * 1000).toISOString(),
      wmoCode: 45,
      label: 'Megla',
      icon: '🌫️',
      tempC: 8.0,
      feelsLikeC: 6.5,
      windKmh: 4,
      gustKmh: undefined,
      humidity: 99,
      visibilityKm: 0.3,
      precipMmH: 0,
      ts: BASE_TS + 18000,
    }),
  ];
}
