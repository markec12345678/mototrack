import type { LatLng } from '@markec/maps.entities.lat-lng';

export type DraggableWaypoint = {
  /**
   * Unique identifier for this waypoint.
   */
  id: string;

  /**
   * Geographic position of the waypoint.
   */
  latlng: LatLng;
};
