import { Waypoint, type PlainWaypoint } from '@markec/routes.entities.waypoint';

/**
 * Route mode: paved roads, twisty mountain roads, or offroad tracks.
 */
export type RouteMode = 'paved' | 'twisty' | 'offroad';

/**
 * A lat/lng coordinate pair decoded from route geometry.
 */
export type LatLng = {
  lat: number;
  lng: number;
};

/**
 * Plain object representation of a PlannedRoute (= SavedRoute).
 */
export type PlainPlannedRoute = {
  id: string;
  userId?: string;
  name: string;
  waypoints: PlainWaypoint[];
  mode: RouteMode;
  geometry: LatLng[];
  distanceKm: number;
  durationSec: number;
  notes?: string;
  createdAt: number;
};

/**
 * PlannedRoute entity (also known as SavedRoute).
 * Represents a user-saved motorcycle route with full geometry,
 * waypoints, mode, distance, and duration.
 */
export class PlannedRoute {
  constructor(
    /**
     * Unique identifier of the route.
     */
    readonly id: string,

    /**
     * Optional user ID of the route owner.
     */
    readonly userId: string | undefined,

    /**
     * Human-readable name of the route.
     */
    readonly name: string,

    /**
     * Ordered list of waypoints along the route.
     */
    readonly waypoints: Waypoint[],

    /**
     * Riding mode: paved, twisty, or offroad.
     */
    readonly mode: RouteMode,

    /**
     * Decoded geometry as an array of lat/lng coordinates.
     */
    readonly geometry: LatLng[],

    /**
     * Total route distance in kilometres.
     */
    readonly distanceKm: number,

    /**
     * Estimated duration in seconds.
     */
    readonly durationSec: number,

    /**
     * Optional freeform notes about the route.
     */
    readonly notes: string | undefined,

    /**
     * Unix timestamp (seconds) when the route was created.
     */
    readonly createdAt: number,
  ) {}

  /**
   * Serialize the PlannedRoute into a plain object.
   */
  toObject(): PlainPlannedRoute {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      waypoints: this.waypoints.map((wp) => wp.toObject()),
      mode: this.mode,
      geometry: this.geometry,
      distanceKm: this.distanceKm,
      durationSec: this.durationSec,
      notes: this.notes,
      createdAt: this.createdAt,
    };
  }

  /**
   * Export the route as a GPX 1.1 XML string.
   * Includes all waypoints and a single track with the full geometry.
   */
  toGpx(): string {
    const escapeXml = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const createdAtIso = new Date(this.createdAt * 1000).toISOString();

    const waypointsXml = this.waypoints
      .map((wp) => {
        const nameTag = wp.name ? `\n      <name>${escapeXml(wp.name)}</name>` : '';
        return `  <wpt lat="${wp.lat}" lon="${wp.lng}">${nameTag}\n  </wpt>`;
      })
      .join('\n');

    const trackpointsXml = this.geometry
      .map((coord) => `      <trkpt lat="${coord.lat}" lon="${coord.lng}"/>`)
      .join('\n');

    const notesXml = this.notes
      ? `\n    <desc>${escapeXml(this.notes)}</desc>`
      : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"
     creator="MotoTrack"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(this.name)}</name>${notesXml}
    <time>${createdAtIso}</time>
  </metadata>
${waypointsXml}
  <trk>
    <name>${escapeXml(this.name)}</name>
    <type>${escapeXml(this.mode)}</type>
    <trkseg>
${trackpointsXml}
    </trkseg>
  </trk>
</gpx>`;
  }

  /**
   * Create a PlannedRoute from a plain object.
   */
  static from(plain: PlainPlannedRoute): PlannedRoute {
    const {
      id = '',
      userId,
      name = '',
      waypoints = [],
      mode = 'paved',
      geometry = [],
      distanceKm = 0,
      durationSec = 0,
      notes,
      createdAt = 0,
    } = plain;

    return new PlannedRoute(
      id,
      userId,
      name,
      waypoints.map((wp) => Waypoint.from(wp)),
      mode,
      geometry,
      distanceKm,
      durationSec,
      notes,
      createdAt,
    );
  }
}
