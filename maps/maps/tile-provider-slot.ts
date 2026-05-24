import { SlotRegistry } from '@bitdev/harmony.harmony';

/**
 * Tile provider registration shape — any aspect may contribute a custom
 * tile style (raster URL template) that will be selectable inside MotoMap.
 */
export type TileProviderEntry = {
  /**
   * Stable unique key for the provider (e.g. 'carto-dark').
   */
  key: string;

  /**
   * Human-readable label shown in the tile-style picker.
   */
  label: string;

  /**
   * Leaflet/MapLibre raster URL template (with {z}/{x}/{y} placeholders).
   */
  urlTemplate: string;

  /**
   * HTML attribution string required by the tile provider.
   */
  attribution: string;

  /**
   * Optional maximum zoom level supported by the provider.
   */
  maxZoom?: number;

  /**
   * Optional list of subdomains to round-robin between (e.g. ['a','b','c']).
   */
  subdomains?: string[];
};

export type TileProviderSlot = SlotRegistry<TileProviderEntry[]>;
