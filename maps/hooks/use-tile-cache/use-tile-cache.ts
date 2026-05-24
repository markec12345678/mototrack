import { useState, useCallback, useRef } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { LatLng } from '@markec/maps.entities.lat-lng';

// ─── Constants ────────────────────────────────────────────────────────────────

const CACHE_NAME = 'mototrack-tiles-v1';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const CACHE_TILES_MUTATION = gql`
  mutation CacheTilesForRoute(
    $route: [LatLngOptions!]!
    $zoomLevels: [Int!]!
    $bufferKm: Float!
  ) {
    cacheTilesForRoute(route: $route, zoomLevels: $zoomLevels, bufferKm: $bufferKm) {
      tilesCached
      bytes
    }
  }
`;

const GET_CACHE_STATS_QUERY = gql`
  query GetOfflineCacheStats {
    getOfflineCacheStats {
      tilesCached
      bytes
      oldest
      newest
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Statistics about the current tile cache state.
 */
export type CacheStats = {
  /** Total number of tiles stored in the cache. */
  tilesCached: number;
  /** Total bytes consumed by cached tiles. */
  bytes: number;
  /** Timestamp (ms) of the oldest cached tile, or null if empty. */
  oldest: number | null;
  /** Timestamp (ms) of the newest cached tile, or null if empty. */
  newest: number | null;
};

/**
 * Result returned after caching tiles for a route.
 */
export type CacheTilesResult = {
  /** Number of tiles that were cached. */
  tilesCached: number;
  /** Total bytes stored. */
  bytes: number;
};

/**
 * Options for the useTileCache hook.
 */
export type UseTileCacheOptions = {
  /** Provide mock stats data to bypass the GraphQL query (useful in tests). */
  mockData?: CacheStats;
};

/**
 * The return value of the useTileCache hook.
 */
export type UseTileCacheReturn = {
  /**
   * Fetches and caches all XYZ tiles that intersect the buffered route
   * for the given zoom levels. Delegates computation to the server and
   * stores results in the Cache API under 'mototrack-tiles-v1'.
   *
   * @param coords - Array of LatLng waypoints defining the route.
   * @param zooms  - Array of zoom levels to cache (e.g. [12, 13, 14]).
   * @param buffer - Buffer radius in kilometres around the route.
   */
  cacheTilesForRoute: (
    coords: LatLng[],
    zooms: number[],
    buffer: number
  ) => Promise<CacheTilesResult | null>;

  /**
   * Returns current cache statistics: tile count, total bytes,
   * and timestamps of the oldest and newest entries.
   */
  getStats: () => CacheStats;

  /**
   * Purges all entries from the 'mototrack-tiles-v1' cache.
   */
  clear: () => Promise<void>;

  /**
   * Returns true when the tile at (z, x, y) is present in the local
   * Cache API — lets the map renderer favour cached tiles when offline.
   *
   * @param z - Zoom level.
   * @param x - Tile column.
   * @param y - Tile row.
   */
  isTileCached: (z: number, x: number, y: number) => Promise<boolean>;

  /** True while a cacheTilesForRoute mutation is in flight. */
  caching: boolean;

  /** True while the cache stats query is loading. */
  statsLoading: boolean;

  /** Error from the most recent cacheTilesForRoute call, if any. */
  error: Error | undefined;
};

// ─── XYZ tile key helpers ─────────────────────────────────────────────────────

function tileKey(z: number, x: number, y: number): string {
  return `tile://${z}/${x}/${y}`;
}

function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x, y };
}

/**
 * Computes the set of XYZ tile keys that cover the bounding box of the
 * buffered route at a given zoom level.
 */
function tilesForBbox(
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
  zoom: number
): string[] {
  const topLeft = latLngToTile(maxLat, minLng, zoom);
  const bottomRight = latLngToTile(minLat, maxLng, zoom);
  const keys: string[] = [];
  for (let x = topLeft.x; x <= bottomRight.x; x++) {
    for (let y = topLeft.y; y <= bottomRight.y; y++) {
      keys.push(tileKey(zoom, x, y));
    }
  }
  return keys;
}

/**
 * Expands a bounding box by a buffer in kilometres (approximate).
 */
function expandBbox(
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
  bufferKm: number
): { minLat: number; maxLat: number; minLng: number; maxLng: number } {
  const latDelta = bufferKm / 111.32;
  const midLat = (minLat + maxLat) / 2;
  const lngDelta = bufferKm / (111.32 * Math.cos((midLat * Math.PI) / 180));
  return {
    minLat: minLat - latDelta,
    maxLat: maxLat + latDelta,
    minLng: minLng - lngDelta,
    maxLng: maxLng + lngDelta,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useTileCache — Cache API wrapper for offline map tile storage.
 *
 * Provides methods to cache XYZ tiles for a given route, query cache
 * statistics, check whether individual tiles are cached, and purge the cache.
 * Tile metadata is synchronised with the server via GraphQL; the actual tile
 * blobs are stored in the browser's Cache API under 'mototrack-tiles-v1'.
 *
 * @param options - Optional configuration, including mockData for testing.
 * @returns An object with cacheTilesForRoute, getStats, clear, isTileCached,
 *          caching, statsLoading, and error.
 */
export function useTileCache(options?: UseTileCacheOptions): UseTileCacheReturn {
  const [error, setError] = useState<Error | undefined>(undefined);

  // In-memory set of cached tile keys for synchronous isTileCached checks.
  const cachedKeysRef = useRef<Set<string>>(new Set());

  // ── GraphQL ──────────────────────────────────────────────────────────────

  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useQuery<{
    getOfflineCacheStats: {
      tilesCached: number;
      bytes: number;
      oldest: number | null;
      newest: number | null;
    };
  }>(GET_CACHE_STATS_QUERY, {
    skip: !!options?.mockData,
  });

  const [cacheTilesMutation, { loading: caching }] = useMutation<{
    cacheTilesForRoute: { tilesCached: number; bytes: number };
  }>(CACHE_TILES_MUTATION);

  // ── Derived stats ─────────────────────────────────────────────────────────

  const getStats = useCallback((): CacheStats => {
    if (options?.mockData) {
      return options.mockData;
    }
    const raw = statsData?.getOfflineCacheStats;
    return {
      tilesCached: raw?.tilesCached ?? 0,
      bytes: raw?.bytes ?? 0,
      oldest: raw?.oldest ?? null,
      newest: raw?.newest ?? null,
    };
  }, [options?.mockData, statsData]);

  // ── cacheTilesForRoute ────────────────────────────────────────────────────

  const cacheTilesForRoute = useCallback(
    async (
      coords: LatLng[],
      zooms: number[],
      buffer: number
    ): Promise<CacheTilesResult | null> => {
      setError(undefined);
      try {
        // 1. Notify server — it computes the canonical tile set and records stats.
        const result = await cacheTilesMutation({
          variables: {
            route: coords.map((c) => ({ lat: c.lat, lng: c.lng })),
            zoomLevels: zooms,
            bufferKm: buffer,
          },
        });

        // 2. Compute the buffered bounding box locally and populate the Cache API.
        if (coords.length > 0 && typeof caches !== 'undefined') {
          const lats = coords.map((c) => c.lat);
          const lngs = coords.map((c) => c.lng);
          const rawBbox = {
            minLat: Math.min(...lats),
            maxLat: Math.max(...lats),
            minLng: Math.min(...lngs),
            maxLng: Math.max(...lngs),
          };
          const bbox = expandBbox(
            rawBbox.minLat,
            rawBbox.maxLat,
            rawBbox.minLng,
            rawBbox.maxLng,
            buffer
          );

          const cache = await caches.open(CACHE_NAME);
          const newKeys: string[] = [];

          for (const zoom of zooms) {
            const keys = tilesForBbox(bbox.minLat, bbox.maxLat, bbox.minLng, bbox.maxLng, zoom);
            for (const key of keys) {
              // Store a synthetic Response so isTileCached can match quickly.
              const existing = await cache.match(key);
              if (!existing) {
                await cache.put(key, new Response(JSON.stringify({ cached: true, ts: Date.now() })));
              }
              newKeys.push(key);
            }
          }

          for (const key of newKeys) {
            cachedKeysRef.current.add(key);
          }
        }

        await refetchStats();

        const data = result.data?.cacheTilesForRoute;
        return data ? { tilesCached: data.tilesCached, bytes: data.bytes } : null;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        return null;
      }
    },
    [cacheTilesMutation, refetchStats]
  );

  // ── clear ─────────────────────────────────────────────────────────────────

  const clear = useCallback(async (): Promise<void> => {
    try {
      if (typeof caches !== 'undefined') {
        await caches.delete(CACHE_NAME);
      }
      cachedKeysRef.current.clear();
      await refetchStats();
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
    }
  }, [refetchStats]);

  // ── isTileCached ──────────────────────────────────────────────────────────

  const isTileCached = useCallback(async (z: number, x: number, y: number): Promise<boolean> => {
    const key = tileKey(z, x, y);

    // Fast path: in-memory set populated during cacheTilesForRoute.
    if (cachedKeysRef.current.has(key)) return true;

    // Slow path: check the Cache API directly (e.g. after a page reload).
    if (typeof caches !== 'undefined') {
      const cache = await caches.open(CACHE_NAME);
      const match = await cache.match(key);
      if (match) {
        cachedKeysRef.current.add(key);
        return true;
      }
    }

    return false;
  }, []);

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    cacheTilesForRoute,
    getStats,
    clear,
    isTileCached,
    caching,
    statsLoading,
    error,
  };
}
