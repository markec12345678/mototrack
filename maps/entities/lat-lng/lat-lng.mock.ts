import { LatLng } from './lat-lng.js';
import type { PlainLatLng } from './lat-lng.js';

/**
 * Return a single mock `LatLng`, optionally overriding any property.
 */
export function mockLatLng(overrides: Partial<PlainLatLng> = {}): LatLng {
  return LatLng.from({
    lat: 48.8566,
    lng: 2.3522,
    ...overrides,
  });
}

/**
 * Return a collection of well-known city coordinates useful for
 * development and testing.
 */
export function mockLatLngs(): LatLng[] {
  return [
    // Paris
    LatLng.from({ lat: 48.8566, lng: 2.3522 }),
    // London
    LatLng.from({ lat: 51.5074, lng: -0.1278 }),
    // New York
    LatLng.from({ lat: 40.7128, lng: -74.006 }),
    // Tokyo
    LatLng.from({ lat: 35.6762, lng: 139.6503 }),
    // Sydney
    LatLng.from({ lat: -33.8688, lng: 151.2093 }),
  ];
}
