import * as React from 'react';
import {
  MototrackPlatformAspect,
  type MototrackPlatformBrowser,
} from '@markec/mototrack-platform.mototrack-platform';
import { MapPage } from '@markec/maps.pages.map-page';
import type { LatLng } from '@markec/maps.entities.lat-lng';
import type { MapsConfig } from './maps-config.js';
import {
  type TileProviderEntry,
  type TileProviderSlot,
} from './tile-provider-slot.js';
import type { CacheStats, CacheTilesForRouteResult } from './cache-types.js';

/**
 * default tile cache name — kept in sync with @markec/maps.hooks.use-tile-cache.
 */
const TILE_CACHE_NAME = 'mototrack-tiles-v1';

/**
 * Browser runtime for the maps aspect. Registers the /map route, the
 * 'Zemljevid' navigation item and provides the TileProvider extension slot
 * along with offline tile cache APIs.
 */
export class MapsBrowser {
  constructor(
    private config: Required<MapsConfig>,
    private tileProviderSlot: TileProviderSlot
  ) {}

  /**
   * register one or more tile providers into the picker shown inside MotoMap.
   */
  registerTileProvider(providers: TileProviderEntry[]) {
    this.tileProviderSlot.register(providers);
    return this;
  }

  /**
   * list every tile provider contributed by other aspects.
   */
  listTileProviders(): TileProviderEntry[] {
    return this.tileProviderSlot.flatValues();
  }

  /**
   * pre-cache map tiles along the given route for offline use.
   * Delegates to the browser's Cache API (the same cache used by the
   * use-tile-cache hook). Safely no-ops outside a browser environment.
   */
  async cacheTilesForRoute(
    route: LatLng[],
    zoomLevels: number[],
    bufferKm: number
  ): Promise<CacheTilesForRouteResult> {
    if (typeof caches === 'undefined' || route.length === 0) {
      return { tilesCached: 0, bytes: 0 };
    }

    const provider = this.listTileProviders()[0];
    const urlTemplate =
      provider?.urlTemplate ??
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
    const subdomains = provider?.subdomains ?? ['a', 'b', 'c', 'd'];

    const cache = await caches.open(TILE_CACHE_NAME);
    const tiles = computeTilesForRoute(route, zoomLevels, bufferKm);

    let tilesCached = 0;
    let bytes = 0;

    await Promise.all(
      tiles.map(async (tile, index) => {
        const subdomain = subdomains[index % subdomains.length];
        const url = urlTemplate
          .replace('{s}', subdomain)
          .replace('{z}', String(tile.z))
          .replace('{x}', String(tile.x))
          .replace('{y}', String(tile.y))
          .replace('{r}', '');

        try {
          const response = await fetch(url, { mode: 'cors' });
          if (!response.ok) return;
          const clone = response.clone();
          await cache.put(url, response);
          const blob = await clone.blob();
          bytes += blob.size;
          tilesCached += 1;
        } catch {
          /* ignore network errors for individual tiles */
        }
      })
    );

    return { tilesCached, bytes };
  }

  /**
   * report aggregate statistics about the offline tile cache.
   */
  async getOfflineCacheStats(): Promise<CacheStats> {
    if (typeof caches === 'undefined') {
      return { tilesCached: 0, bytes: 0 };
    }

    const cache = await caches.open(TILE_CACHE_NAME);
    const requests = await cache.keys();

    let bytes = 0;
    let oldest: number | undefined;
    let newest: number | undefined;

    await Promise.all(
      requests.map(async (request) => {
        const response = await cache.match(request);
        if (!response) return;
        const blob = await response.blob();
        bytes += blob.size;
        const dateHeader = response.headers.get('date');
        if (!dateHeader) return;
        const timestamp = Date.parse(dateHeader);
        if (Number.isNaN(timestamp)) return;
        if (oldest === undefined || timestamp < oldest) oldest = timestamp;
        if (newest === undefined || timestamp > newest) newest = timestamp;
      })
    );

    return {
      tilesCached: requests.length,
      bytes,
      oldest,
      newest,
    };
  }

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig: MapsConfig = {
    mapPath: '/map',
    navigationLabel: 'Zemljevid',
  };

  static async provider(
    [mototrackPlatform]: [MototrackPlatformBrowser],
    config: MapsConfig,
    [tileProviderSlot]: [TileProviderSlot]
  ) {
    const resolvedConfig: Required<MapsConfig> = {
      mapPath: config.mapPath ?? '/map',
      navigationLabel: config.navigationLabel ?? 'Zemljevid',
    };

    const maps = new MapsBrowser(resolvedConfig, tileProviderSlot);

    mototrackPlatform.registerRoute([
      {
        path: resolvedConfig.mapPath,
        component: () => <MapPage redirectTo="/login" />,
      },
    ]);

    mototrackPlatform.registerNavigationItem([
      {
        key: 'map',
        label: resolvedConfig.navigationLabel,
        icon: '🗺️',
        path: resolvedConfig.mapPath,
        order: 1,
        primary: true,
      },
    ]);

    return maps;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type Tile = { z: number; x: number; y: number };

function lonLatToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const n = 2 ** zoom;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { x, y };
}

function computeTilesForRoute(
  route: LatLng[],
  zoomLevels: number[],
  bufferKm: number
): Tile[] {
  const tiles = new Map<string, Tile>();
  const kmPerDegLat = 111;

  zoomLevels.forEach((zoom) => {
    route.forEach((point) => {
      const kmPerDegLng = Math.max(
        1,
        kmPerDegLat * Math.cos((point.lat * Math.PI) / 180)
      );
      const deltaLat = bufferKm / kmPerDegLat;
      const deltaLng = bufferKm / kmPerDegLng;

      const { x: xMin, y: yMax } = lonLatToTile(
        point.lat - deltaLat,
        point.lng - deltaLng,
        zoom
      );
      const { x: xMax, y: yMin } = lonLatToTile(
        point.lat + deltaLat,
        point.lng + deltaLng,
        zoom
      );

      for (let x = xMin; x <= xMax; x += 1) {
        for (let y = yMin; y <= yMax; y += 1) {
          const key = `${zoom}/${x}/${y}`;
          if (!tiles.has(key)) tiles.set(key, { z: zoom, x, y });
        }
      }
    });
  });

  return Array.from(tiles.values());
}

export default MapsBrowser;
