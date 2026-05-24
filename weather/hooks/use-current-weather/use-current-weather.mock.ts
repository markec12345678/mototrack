import { WeatherSnapshot } from '@markec/weather.entities.weather-snapshot';

/**
 * Mock WeatherSnapshot instances for use in tests and compositions.
 */
export const weatherSnapshotMock: Record<string, WeatherSnapshot> = {
  sunny: {
    tempC: 24.5,
    feelsLikeC: 23.1,
    windKmh: 12.4,
    windDirDeg: 220,
    gustKmh: 18.0,
    humidity: 45,
    visibilityKm: 25,
    precipMmH: 0,
    wmoCode: 0,
    label: 'Jasno',
    icon: '☀️',
    ts: 1718000000,
  } as WeatherSnapshot,

  rainy: {
    tempC: 14.2,
    feelsLikeC: 12.8,
    windKmh: 28.6,
    windDirDeg: 310,
    gustKmh: 42.0,
    humidity: 88,
    visibilityKm: 8,
    precipMmH: 3.4,
    wmoCode: 61,
    label: 'Dež',
    icon: '🌧️',
    ts: 1718003600,
  } as WeatherSnapshot,

  cloudy: {
    tempC: 18.0,
    feelsLikeC: 17.3,
    windKmh: 9.0,
    windDirDeg: 180,
    gustKmh: 14.0,
    humidity: 65,
    visibilityKm: 15,
    precipMmH: 0,
    wmoCode: 3,
    label: 'Oblačno',
    icon: '☁️',
    ts: 1718007200,
  } as WeatherSnapshot,

  stormy: {
    tempC: 11.5,
    feelsLikeC: 9.0,
    windKmh: 55.0,
    windDirDeg: 270,
    gustKmh: 80.0,
    humidity: 95,
    visibilityKm: 3,
    precipMmH: 12.0,
    wmoCode: 95,
    label: 'Nevihta',
    icon: '⛈️',
    ts: 1718010800,
  } as WeatherSnapshot,
};
