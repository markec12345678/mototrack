import type React from 'react';
import type { LatLng } from '@markec/maps.entities.lat-lng';

export type MapLibre3DProps = {
  /**
   * Map center coordinates. Defaults to the Stelvio Pass, Italy.
   */
  center?: LatLng;

  /**
   * Initial zoom level. Defaults to 12.
   */
  zoom?: number;

  /**
   * Camera pitch in degrees (0 = flat, 85 = near-horizontal). Defaults to 60.
   */
  pitch?: number;

  /**
   * Camera bearing in degrees (0 = north). Defaults to 0.
   */
  bearing?: number;

  /**
   * Optional route polyline rendered as a glowing line on the map.
   */
  route?: LatLng[];

  /**
   * Height of the map container. Defaults to `100%`.
   */
  height?: string;

  /**
   * Additional class name for the root container.
   */
  className?: string;

  /**
   * Inline styles for the root container.
   */
  style?: React.CSSProperties;
};
