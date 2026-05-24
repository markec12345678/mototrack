/**
 * Earth's mean radius in kilometres.
 */
const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export type PlainLatLng = {
  /**
   * Latitude in decimal degrees (−90 … +90).
   */
  lat: number;

  /**
   * Longitude in decimal degrees (−180 … +180).
   */
  lng: number;
};

/**
 * Bounding box returned by `LatLng.bbox`.
 */
export type BoundingBox = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
};

/**
 * Immutable geographic coordinate value object.
 *
 * Provides static helpers for common geodesic calculations:
 * - `haversineKm`  – great-circle distance in kilometres
 * - `bearingDeg`   – initial bearing in degrees (0 = North)
 * - `interpolate`  – linear interpolation between two points
 * - `bbox`         – axis-aligned bounding box for a set of points
 */
export class LatLng {
  constructor(
    /**
     * Latitude in decimal degrees (−90 … +90).
     */
    readonly lat: number,

    /**
     * Longitude in decimal degrees (−180 … +180).
     */
    readonly lng: number,
  ) {}

  // ---------------------------------------------------------------------------
  // Serialisation
  // ---------------------------------------------------------------------------

  /**
   * Serialize the coordinate into a plain object.
   */
  toObject(): PlainLatLng {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }

  /**
   * Human-readable string representation, e.g. `"(48.8566, 2.3522)"`.
   */
  toString(): string {
    return `(${this.lat}, ${this.lng})`;
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Create a `LatLng` from a plain object.
   */
  static from({ lat = 0, lng = 0 }: Partial<PlainLatLng> = {}): LatLng {
    return new LatLng(lat, lng);
  }

  // ---------------------------------------------------------------------------
  // Static helpers
  // ---------------------------------------------------------------------------

  /**
   * Calculate the great-circle distance between two coordinates using the
   * Haversine formula.
   *
   * @returns Distance in kilometres.
   */
  static haversineKm(a: LatLng, b: LatLng): number {
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);

    const h =
      sinDLat * sinDLat +
      Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;

    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
  }

  /**
   * Calculate the initial bearing (forward azimuth) from `a` to `b`.
   *
   * @returns Bearing in degrees, clockwise from North (0 … 360).
   */
  static bearingDeg(a: LatLng, b: LatLng): number {
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const dLng = toRad(b.lng - a.lng);

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  }

  /**
   * Linearly interpolate between two coordinates.
   *
   * @param t - Interpolation factor in the range [0, 1].
   *            `0` returns `a`, `1` returns `b`.
   * @returns A new `LatLng` at the interpolated position.
   */
  static interpolate(a: LatLng, b: LatLng, t: number): LatLng {
    const clamped = Math.min(1, Math.max(0, t));
    return new LatLng(
      a.lat + (b.lat - a.lat) * clamped,
      a.lng + (b.lng - a.lng) * clamped,
    );
  }

  /**
   * Compute the axis-aligned bounding box that encloses all given points.
   *
   * @param points - One or more `LatLng` coordinates.
   * @returns A `BoundingBox` with `minLat`, `minLng`, `maxLat`, `maxLng`.
   * @throws {Error} When the `points` array is empty.
   */
  static bbox(points: LatLng[]): BoundingBox {
    if (points.length === 0) {
      throw new Error('LatLng.bbox requires at least one point.');
    }

    let minLat = Infinity;
    let minLng = Infinity;
    let maxLat = -Infinity;
    let maxLng = -Infinity;

    for (const p of points) {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    }

    return { minLat, minLng, maxLat, maxLng };
  }
}
