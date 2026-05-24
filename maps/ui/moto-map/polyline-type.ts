import type { LatLng } from '@markec/maps.entities.lat-lng';

export type MapPolyline = {
  /**
   * Array of lat/lng points that form the polyline.
   */
  points: LatLng[];

  /**
   * Stroke color (CSS color string or hex).
   */
  color?: string;

  /**
   * Stroke weight in pixels.
   */
  weight?: number;

  /**
   * SVG dash array string, e.g. "6 4".
   */
  dashArray?: string;
};
