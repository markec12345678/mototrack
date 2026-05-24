export type PlainTrackPoint = {
  /**
   * Latitude in decimal degrees.
   */
  lat: number;

  /**
   * Longitude in decimal degrees.
   */
  lng: number;

  /**
   * Timestamp as epoch milliseconds.
   */
  ts: number;

  /**
   * Speed in metres per second. Optional.
   */
  speed?: number;

  /**
   * Elevation in metres above sea level. Optional.
   */
  elevation?: number;

  /**
   * GPS accuracy in metres. Optional.
   */
  accuracy?: number;

  /**
   * Heading in degrees (0–360, clockwise from north). Optional.
   */
  heading?: number;
};

/** Minimal lat/lng pair returned by toLatLng(). */
export type LatLng = {
  lat: number;
  lng: number;
};

/** Earth's mean radius in kilometres, used for the Haversine formula. */
const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export class TrackPoint {
  constructor(
    /**
     * Latitude in decimal degrees.
     */
    readonly lat: number,

    /**
     * Longitude in decimal degrees.
     */
    readonly lng: number,

    /**
     * Timestamp as epoch milliseconds.
     */
    readonly ts: number,

    /**
     * Speed in metres per second.
     */
    readonly speed: number | undefined,

    /**
     * Elevation in metres above sea level.
     */
    readonly elevation: number | undefined,

    /**
     * GPS accuracy in metres.
     */
    readonly accuracy: number | undefined,

    /**
     * Heading in degrees (0–360, clockwise from north).
     */
    readonly heading: number | undefined,
  ) {}

  /**
   * Returns a plain { lat, lng } object suitable for mapping libraries.
   */
  toLatLng(): LatLng {
    return { lat: this.lat, lng: this.lng };
  }

  /**
   * Calculates the great-circle distance in kilometres to another TrackPoint
   * using the Haversine formula.
   */
  distanceKmTo(other: TrackPoint): number {
    const dLat = toRadians(other.lat - this.lat);
    const dLng = toRadians(other.lng - this.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(this.lat)) *
        Math.cos(toRadians(other.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
  }

  /**
   * Returns true when the point's timestamp is older than `maxAgeMs`
   * milliseconds relative to the current wall-clock time.
   */
  isStale(maxAgeMs: number): boolean {
    return Date.now() - this.ts > maxAgeMs;
  }

  /**
   * Serializes the TrackPoint into a plain object.
   */
  toObject(): PlainTrackPoint {
    return {
      lat: this.lat,
      lng: this.lng,
      ts: this.ts,
      speed: this.speed,
      elevation: this.elevation,
      accuracy: this.accuracy,
      heading: this.heading,
    };
  }

  /**
   * Creates a TrackPoint from a plain object.
   */
  static from(plain: PlainTrackPoint): TrackPoint {
    const {
      lat = 0,
      lng = 0,
      ts = 0,
      speed,
      elevation,
      accuracy,
      heading,
    } = plain;

    return new TrackPoint(lat, lng, ts, speed, elevation, accuracy, heading);
  }
}
