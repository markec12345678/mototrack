import { TrackPoint, type PlainTrackPoint } from '@markec/rides.entities.track-point';

export type PlainRide = {
  /**
   * Unique identifier for the ride.
   */
  id: string;

  /**
   * ID of the user who recorded the ride.
   */
  userId: string;

  /**
   * Epoch ms when the ride started.
   */
  startedAt: number;

  /**
   * Epoch ms when the ride ended.
   */
  endedAt: number;

  /**
   * Total distance in kilometres.
   */
  distanceKm: number;

  /**
   * Total duration in seconds.
   */
  durationSec: number;

  /**
   * Maximum speed recorded in km/h.
   */
  maxSpeedKmh: number;

  /**
   * Average speed in km/h.
   */
  avgSpeedKmh: number;

  /**
   * Total elevation gain in metres.
   */
  climbM: number;

  /**
   * Total elevation loss in metres.
   */
  descentM: number;

  /**
   * Twistiness score from 0 (straight) to 10 (very twisty).
   */
  twistinessScore: number;

  /**
   * Ordered array of GPS track points.
   */
  track: PlainTrackPoint[];

  /**
   * Optional human-readable name for the ride.
   */
  name?: string;

  /**
   * Optional free-text notes about the ride.
   */
  notes?: string;
};

export type RideMetrics = {
  distanceKm: number;
  durationSec: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  climbM: number;
  descentM: number;
  twistinessScore: number;
  startedAt: number;
  endedAt: number;
};

/**
 * Compute the bearing in degrees between two lat/lng points.
 */
function bearingDeg(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLng = toRad(lng2 - lng1);
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const y = Math.sin(dLng) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/**
 * Absolute angular difference between two bearings (0–180).
 */
function angleDiff(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

export class Ride {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly startedAt: number,
    readonly endedAt: number,
    readonly distanceKm: number,
    readonly durationSec: number,
    readonly maxSpeedKmh: number,
    readonly avgSpeedKmh: number,
    readonly climbM: number,
    readonly descentM: number,
    readonly twistinessScore: number,
    readonly track: TrackPoint[],
    readonly name?: string,
    readonly notes?: string
  ) {}

  /**
   * Derive all ride metrics from an ordered array of TrackPoints.
   *
   * - Distance: sum of haversine distances between consecutive points.
   * - Duration: difference between last and first timestamp (seconds).
   * - Max / avg speed: derived from the `speed` field (m/s → km/h).
   * - Climb / descent: accumulated positive / negative elevation deltas.
   * - Twistiness: mean absolute bearing change, normalised to 0–10.
   */
  static computeMetrics(track: TrackPoint[]): RideMetrics {
    if (track.length === 0) {
      return {
        distanceKm: 0,
        durationSec: 0,
        maxSpeedKmh: 0,
        avgSpeedKmh: 0,
        climbM: 0,
        descentM: 0,
        twistinessScore: 0,
        startedAt: 0,
        endedAt: 0,
      };
    }

    const sorted = [...track].sort((a, b) => a.ts - b.ts);

    let distanceKm = 0;
    let climbM = 0;
    let descentM = 0;
    let maxSpeedMs = 0;
    const bearingChanges: number[] = [];

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];

      // Distance
      distanceKm += prev.distanceKmTo(curr);

      // Elevation
      if (prev.elevation != null && curr.elevation != null) {
        const delta = curr.elevation - prev.elevation;
        if (delta > 0) climbM += delta;
        else descentM += Math.abs(delta);
      }

      // Speed
      if (curr.speed != null && curr.speed > maxSpeedMs) {
        maxSpeedMs = curr.speed;
      }

      // Bearing change for twistiness
      if (i >= 2) {
        const pprev = sorted[i - 2];
        const b1 = bearingDeg(pprev.lat, pprev.lng, prev.lat, prev.lng);
        const b2 = bearingDeg(prev.lat, prev.lng, curr.lat, curr.lng);
        bearingChanges.push(angleDiff(b1, b2));
      }
    }

    // Also check first point speed
    if (sorted[0].speed != null && sorted[0].speed > maxSpeedMs) {
      maxSpeedMs = sorted[0].speed ?? 0;
    }

    const startedAt = sorted[0].ts;
    const endedAt = sorted[sorted.length - 1].ts;
    const durationSec = Math.round((endedAt - startedAt) / 1000);

    const maxSpeedKmh = maxSpeedMs * 3.6;
    const avgSpeedKmh =
      durationSec > 0 ? (distanceKm / durationSec) * 3600 : 0;

    // Twistiness: mean bearing change normalised from [0,180] → [0,10]
    const meanBearingChange =
      bearingChanges.length > 0
        ? bearingChanges.reduce((s, v) => s + v, 0) / bearingChanges.length
        : 0;
    const twistinessScore = Math.min(10, (meanBearingChange / 180) * 10 * 6);

    return {
      distanceKm: Math.round(distanceKm * 1000) / 1000,
      durationSec,
      maxSpeedKmh: Math.round(maxSpeedKmh * 10) / 10,
      avgSpeedKmh: Math.round(avgSpeedKmh * 10) / 10,
      climbM: Math.round(climbM),
      descentM: Math.round(descentM),
      twistinessScore: Math.round(twistinessScore * 10) / 10,
      startedAt,
      endedAt,
    };
  }

  /**
   * Serialize the ride into a plain object suitable for JSON transport.
   */
  toObject(): PlainRide {
    return {
      id: this.id,
      userId: this.userId,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      distanceKm: this.distanceKm,
      durationSec: this.durationSec,
      maxSpeedKmh: this.maxSpeedKmh,
      avgSpeedKmh: this.avgSpeedKmh,
      climbM: this.climbM,
      descentM: this.descentM,
      twistinessScore: this.twistinessScore,
      track: this.track.map((p) => p.toObject()),
      name: this.name,
      notes: this.notes,
    };
  }

  /**
   * Export the ride as a GPX 1.1 XML string.
   * Each TrackPoint becomes a `<trkpt>` element with optional
   * `<ele>`, `<time>`, and `<extensions>` (speed, heading, accuracy).
   */
  toGpx(): string {
    const esc = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const rideName = this.name ?? `Ride ${this.id}`;
    const creatorTs = new Date(this.startedAt).toISOString();

    const trkpts = this.track
      .map((p) => {
        const time = new Date(p.ts).toISOString();
        const ele =
          p.elevation != null ? `\n        <ele>${p.elevation}</ele>` : '';
        const timeEl = `\n        <time>${time}</time>`;

        const extParts: string[] = [];
        if (p.speed != null)
          extParts.push(`          <gpxtpx:speed>${p.speed}</gpxtpx:speed>`);
        if (p.heading != null)
          extParts.push(
            `          <gpxtpx:course>${p.heading}</gpxtpx:course>`
          );
        if (p.accuracy != null)
          extParts.push(
            `          <gpxtpx:accuracy>${p.accuracy}</gpxtpx:accuracy>`
          );

        const extensions =
          extParts.length > 0
            ? `\n        <extensions>\n          <gpxtpx:TrackPointExtension>\n${extParts.join('\n')}\n          </gpxtpx:TrackPointExtension>\n        </extensions>`
            : '';

        return `      <trkpt lat="${p.lat}" lon="${p.lng}">${ele}${timeEl}${extensions}\n      </trkpt>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"
  creator="markec-rides"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${esc(rideName)}</name>
    <time>${creatorTs}</time>
  </metadata>
  <trk>
    <name>${esc(rideName)}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;
  }

  /**
   * Create a Ride instance from a plain object.
   */
  static from(plain: PlainRide): Ride {
    const {
      id = '',
      userId = '',
      startedAt = 0,
      endedAt = 0,
      distanceKm = 0,
      durationSec = 0,
      maxSpeedKmh = 0,
      avgSpeedKmh = 0,
      climbM = 0,
      descentM = 0,
      twistinessScore = 0,
      track = [],
      name,
      notes,
    } = plain;

    return new Ride(
      id,
      userId,
      startedAt,
      endedAt,
      distanceKm,
      durationSec,
      maxSpeedKmh,
      avgSpeedKmh,
      climbM,
      descentM,
      twistinessScore,
      track.map((p) => TrackPoint.from(p)),
      name,
      notes
    );
  }
}
