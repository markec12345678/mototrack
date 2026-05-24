export type PlainWaypoint = {
  /**
   * unique identifier for the waypoint.
   */
  id: string;

  /**
   * human-readable label for the waypoint.
   */
  name?: string;

  /**
   * latitude coordinate.
   */
  lat: number;

  /**
   * longitude coordinate.
   */
  lng: number;
};

export type LatLng = {
  /**
   * latitude coordinate.
   */
  lat: number;

  /**
   * longitude coordinate.
   */
  lng: number;
};

export class Waypoint {
  constructor(
    /**
     * unique identifier for the waypoint.
     */
    readonly id: string,

    /**
     * human-readable label for the waypoint.
     */
    readonly name: string | undefined,

    /**
     * latitude coordinate.
     */
    readonly lat: number,

    /**
     * longitude coordinate.
     */
    readonly lng: number,
  ) {}

  /**
   * serialize a Waypoint into a plain object.
   */
  toObject(): PlainWaypoint {
    return {
      id: this.id,
      name: this.name,
      lat: this.lat,
      lng: this.lng,
    };
  }

  /**
   * create a Waypoint from a plain object.
   */
  static from(plain: PlainWaypoint): Waypoint {
    const { id = '', name, lat = 0, lng = 0 } = plain;
    return new Waypoint(id, name, lat, lng);
  }

  /**
   * create a Waypoint from a LatLng coordinate pair,
   * generating a browser-safe unique id.
   */
  static fromLatLng(latlng: LatLng, label?: string): Waypoint {
    const id = `wp-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
    return new Waypoint(id, label, latlng.lat, latlng.lng);
  }
}
