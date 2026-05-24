import type { LatLng } from '@markec/maps.entities.lat-lng';

export type MapMarker = {
  /**
   * Geographic position of the marker.
   */
  latlng: LatLng;

  /**
   * Optional custom icon URL string.
   */
  icon?: string;

  /**
   * Optional popup content to show when the marker is clicked.
   */
  popup?: string;
};
