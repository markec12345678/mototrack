import { WeatherSnapshot } from '@markec/weather.entities.weather-snapshot';

/**
 * Mock WeatherSnapshot instances for testing useCrosswind in various scenarios.
 */

/**
 * Calm conditions — crosswind will be near 0 km/h regardless of heading.
 * Wind: 5 km/h from North (0°).
 */
const calm: WeatherSnapshot = {
  tempC: 22,
  feelsLikeC: 21,
  windKmh: 5,
  windDirDeg: 0,
  gustKmh: 8,
  humidity: 55,
  visibilityKm: 20,
  precipMmH: 0,
  wmoCode: 0,
  label: 'Jasno',
  icon: '☀️',
  ts: 1700000000,
} as WeatherSnapshot;

/**
 * Moderate crosswind — ~28 km/h cross component when heading North (0°).
 * Wind: 30 km/h from East (90°).
 */
const moderate: WeatherSnapshot = {
  tempC: 18,
  feelsLikeC: 16,
  windKmh: 30,
  windDirDeg: 90,
  gustKmh: 40,
  humidity: 60,
  visibilityKm: 15,
  precipMmH: 0,
  wmoCode: 1,
  label: 'Pretežno jasno',
  icon: '⛅',
  ts: 1700000100,
} as WeatherSnapshot;

/**
 * Strong crosswind — ~50 km/h cross component when heading North (0°).
 * Wind: 50 km/h from East (90°). Triggers single audio beep.
 */
const strong: WeatherSnapshot = {
  tempC: 14,
  feelsLikeC: 10,
  windKmh: 50,
  windDirDeg: 90,
  gustKmh: 65,
  humidity: 70,
  visibilityKm: 10,
  precipMmH: 0.2,
  wmoCode: 3,
  label: 'Oblačno',
  icon: '☁️',
  ts: 1700000200,
} as WeatherSnapshot;

/**
 * Dangerous crosswind — ~70 km/h cross component when heading North (0°).
 * Wind: 70 km/h from East (90°). Triggers repeating beep + 'USTAVI SE!' flash.
 */
const dangerous: WeatherSnapshot = {
  tempC: 10,
  feelsLikeC: 4,
  windKmh: 70,
  windDirDeg: 90,
  gustKmh: 90,
  humidity: 80,
  visibilityKm: 6,
  precipMmH: 1.5,
  wmoCode: 61,
  label: 'Dež',
  icon: '🌧️',
  ts: 1700000300,
} as WeatherSnapshot;

/**
 * Diagonal wind — 45° offset from heading, partial crosswind.
 * Wind: 40 km/h from NE (45°), heading North (0°).
 * Cross component ≈ 28 km/h (moderate).
 */
const diagonal: WeatherSnapshot = {
  tempC: 16,
  feelsLikeC: 13,
  windKmh: 40,
  windDirDeg: 45,
  gustKmh: 55,
  humidity: 65,
  visibilityKm: 12,
  precipMmH: 0,
  wmoCode: 2,
  label: 'Delno oblačno',
  icon: '⛅',
  ts: 1700000400,
} as WeatherSnapshot;

export const crosswindMock = {
  calm,
  moderate,
  strong,
  dangerous,
  diagonal,
};
