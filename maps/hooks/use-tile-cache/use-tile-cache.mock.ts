import { CacheStats, CacheTilesResult } from './use-tile-cache.js';

/**
 * Mock CacheStats objects for use in tests and compositions.
 */
export const mockCacheStats: Record<string, CacheStats> = {
  empty: {
    tilesCached: 0,
    bytes: 0,
    oldest: null,
    newest: null,
  },
  small: {
    tilesCached: 128,
    bytes: 2_097_152, // 2 MB
    oldest: Date.now() - 86_400_000 * 3, // 3 days ago
    newest: Date.now() - 3_600_000,       // 1 hour ago
  },
  large: {
    tilesCached: 4_096,
    bytes: 134_217_728, // 128 MB
    oldest: Date.now() - 86_400_000 * 30, // 30 days ago
    newest: Date.now() - 60_000,           // 1 minute ago
  },
};

/**
 * Mock CacheTilesResult objects for use in tests and compositions.
 */
export const mockCacheTilesResult: Record<string, CacheTilesResult> = {
  small: {
    tilesCached: 64,
    bytes: 1_048_576, // 1 MB
  },
  large: {
    tilesCached: 1_024,
    bytes: 33_554_432, // 32 MB
  },
};

/**
 * A sample route (Ljubljana → Bled, Slovenia) for use in tests and compositions.
 */
export const mockRoute = [
  { lat: 46.0569, lng: 14.5058 }, // Ljubljana
  { lat: 46.0833, lng: 14.3167 }, // Medvode
  { lat: 46.1667, lng: 14.1833 }, // Škofja Loka
  { lat: 46.3683, lng: 14.1097 }, // Bled
];
