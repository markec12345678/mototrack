import type { SlotRegistry } from '@bitdev/harmony.harmony';

export interface TileProvider {
  /**
   * Unique key to identify the tile provider.
   */
  key: string;

  /**
   * User-friendly label for the tile provider, displayed in the UI.
   */
  label: string;

  /**
   * URL template for fetching map tiles (e.g., 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').
   * Supports Leaflet-style placeholders for subdomains ({s}), zoom ({z}), x-coordinate ({x}), and y-coordinate ({y}).
   */
  urlTemplate: string;

  /**
   * Attribution string to be displayed on the map, acknowledging the tile source.
   */
  attribution: string;

  /**
   * Optional. The maximum zoom level supported by this tile provider.
   * If not specified, a default maximum zoom may be applied by the map component.
   */
  maxZoom?: number;
}

export type TileProviderSlot = SlotRegistry<TileProvider[]>;