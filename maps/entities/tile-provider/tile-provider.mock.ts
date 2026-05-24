import { TileProvider, BUILT_IN_PROVIDERS } from './tile-provider.js';
import type { PlainTileProvider } from './tile-provider.js';

/**
 * Returns all built-in TileProvider instances as TileProvider objects.
 * Supports partial override of any provider properties.
 */
export function mockTileProviders(overrides: Partial<PlainTileProvider> = {}): TileProvider[] {
  return BUILT_IN_PROVIDERS.map((plain) =>
    TileProvider.from({ ...plain, ...overrides })
  );
}

/**
 * Returns a single mock TileProvider (CARTO Voyager / streets).
 * Supports partial override of properties.
 */
export function mockTileProvider(overrides: Partial<PlainTileProvider> = {}): TileProvider {
  return TileProvider.from({
    key: 'carto-voyager',
    label: 'Streets (CARTO Voyager)',
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
    ...overrides,
  });
}

/**
 * Returns a mock CARTO Dark Matter TileProvider.
 */
export function mockDarkTileProvider(overrides: Partial<PlainTileProvider> = {}): TileProvider {
  return TileProvider.from({
    key: 'carto-dark',
    label: 'Dark (CARTO Dark Matter)',
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
    ...overrides,
  });
}

/**
 * Returns a mock Esri World Imagery (satellite) TileProvider.
 */
export function mockSatelliteTileProvider(overrides: Partial<PlainTileProvider> = {}): TileProvider {
  return TileProvider.from({
    key: 'esri-satellite',
    label: 'Satellite (Esri World Imagery)',
    urlTemplate:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
    subdomains: [],
    ...overrides,
  });
}

/**
 * Returns a mock OpenTopoMap (terrain) TileProvider.
 */
export function mockTopoTileProvider(overrides: Partial<PlainTileProvider> = {}): TileProvider {
  return TileProvider.from({
    key: 'opentopomap',
    label: 'Terrain (OpenTopoMap)',
    urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 17,
    subdomains: ['a', 'b', 'c'],
    ...overrides,
  });
}
