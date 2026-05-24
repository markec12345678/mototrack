import { RouteWeather } from './use-route-weather.js';

/**
 * A single mock RouteWeather sample for testing and compositions.
 */
const mockSnapshot = {
  tempC: 18.5,
  feelsLikeC: 17.2,
  windKmh: 22.0,
  windDirDeg: 270,
  gustKmh: 31.0,
  humidity: 64,
  visibilityKm: 10.0,
  precipMmH: 0.0,
  wmoCode: 1,
  label: 'Mostly clear',
  icon: '🌤️',
  ts: 1718000000,
};

/**
 * Five evenly-spaced mock RouteWeather samples along a sample route.
 */
export const mockRouteWeather: RouteWeather[] = [
  {
    location: { lat: 46.0569, lng: 14.5058 },
    etaMin: 0,
    snapshot: { ...mockSnapshot, tempC: 18.5, label: 'Mostly clear', icon: '🌤️', wmoCode: 1 },
  },
  {
    location: { lat: 46.2, lng: 14.8 },
    etaMin: 12.5,
    snapshot: { ...mockSnapshot, tempC: 16.1, windKmh: 28.0, label: 'Partly cloudy', icon: '⛅', wmoCode: 2 },
  },
  {
    location: { lat: 46.35, lng: 15.1 },
    etaMin: 25.0,
    snapshot: { ...mockSnapshot, tempC: 14.3, windKmh: 35.0, precipMmH: 0.4, label: 'Light rain', icon: '🌧️', wmoCode: 61 },
  },
  {
    location: { lat: 46.5, lng: 15.4 },
    etaMin: 37.5,
    snapshot: { ...mockSnapshot, tempC: 13.0, windKmh: 40.0, precipMmH: 1.2, label: 'Rain', icon: '🌧️', wmoCode: 63 },
  },
  {
    location: { lat: 46.65, lng: 15.65 },
    etaMin: 50.0,
    snapshot: { ...mockSnapshot, tempC: 15.8, windKmh: 18.0, precipMmH: 0.0, label: 'Cloudy', icon: '☁️', wmoCode: 3 },
  },
];

/**
 * A minimal single-point mock for simple unit tests.
 */
export const mockRouteWeatherSingle: RouteWeather[] = [
  {
    location: { lat: 46.0569, lng: 14.5058 },
    etaMin: 0,
    snapshot: mockSnapshot,
  },
];
