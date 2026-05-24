import { WeatherSnapshot } from '@markec/weather.entities.weather-snapshot';
import type { WeatherCheckResult } from './weather-check-result-type.js';

const now = Math.floor(Date.now() / 1000);

export const mockSafeSnapshot = WeatherSnapshot.from({ id: 'safe', tempC: 18.4, feelsLikeC: 17.1, windKmh: 14, windDirDeg: 225, gustKmh: 22, humidity: 52, visibilityKm: 18, precipMmH: 0, wmoCode: 1, label: 'Pretežno jasno', icon: '⛅', ts: now });

export const mockDangerousSnapshot = WeatherSnapshot.from({ id: 'danger', tempC: 9.2, feelsLikeC: 4.8, windKmh: 72, windDirDeg: 310, gustKmh: 95, humidity: 88, visibilityKm: 0.4, precipMmH: 8.2, wmoCode: 95, label: 'Nevihta', icon: '⛈️', ts: now });

export const mockStormSnapshot = WeatherSnapshot.from({ id: 'storm', tempC: 5.1, feelsLikeC: 1.3, windKmh: 85, windDirDeg: 280, gustKmh: 110, humidity: 95, visibilityKm: 0.2, precipMmH: 15.4, wmoCode: 99, label: 'Nevihta s točo', icon: '⛈️', ts: now });

export const mockFogSnapshot = WeatherSnapshot.from({ id: 'fog', tempC: 11.0, feelsLikeC: 10.2, windKmh: 8, windDirDeg: 90, gustKmh: undefined, humidity: 98, visibilityKm: 0.3, precipMmH: 0.1, wmoCode: 45, label: 'Megla', icon: '🌫️', ts: now });

export const mockSafeResult: WeatherCheckResult = {
  isDangerous: false,
  reason: 'Pogoji so varni za vožnjo',
  snapshot: mockSafeSnapshot,
};

export const mockDangerousResult: WeatherCheckResult = {
  isDangerous: true,
  reason: 'Nevarna vremenska situacija: nevihta',
  snapshot: mockDangerousSnapshot,
};
