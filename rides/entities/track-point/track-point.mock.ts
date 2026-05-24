import { TrackPoint } from './track-point.js';
import type { PlainTrackPoint } from './track-point.js';

const BASE_TS = 1_700_000_000_000; // 2023-11-14T22:13:20.000Z

/** A small set of GPS coordinates tracing a short mountain road loop. */
const RAW_POINTS: PlainTrackPoint[] = [
  {
    lat: 46.227638,
    lng: 14.357338,
    ts: BASE_TS,
    speed: 12.5,
    elevation: 420,
    accuracy: 4,
    heading: 45,
  },
  {
    lat: 46.228102,
    lng: 14.358901,
    ts: BASE_TS + 5_000,
    speed: 14.2,
    elevation: 425,
    accuracy: 3,
    heading: 52,
  },
  {
    lat: 46.229015,
    lng: 14.360512,
    ts: BASE_TS + 10_000,
    speed: 11.8,
    elevation: 431,
    accuracy: 5,
    heading: 60,
  },
  {
    lat: 46.229874,
    lng: 14.362100,
    ts: BASE_TS + 15_000,
    speed: 9.3,
    elevation: 438,
    accuracy: 4,
    heading: 68,
  },
  {
    lat: 46.230501,
    lng: 14.363780,
    ts: BASE_TS + 20_000,
    speed: 10.1,
    elevation: 445,
    accuracy: 3,
    heading: 72,
  },
];

/**
 * Returns an array of mock TrackPoint instances.
 * Pass a partial override to customise individual fields on every point.
 */
export function mockTrackPoints(override: Partial<PlainTrackPoint> = {}): TrackPoint[] {
  return RAW_POINTS.map((raw) => TrackPoint.from({ ...raw, ...override }));
}

/**
 * Returns a single mock TrackPoint.
 * Pass a partial override to customise individual fields.
 */
export function mockTrackPoint(override: Partial<PlainTrackPoint> = {}): TrackPoint {
  return TrackPoint.from({ ...RAW_POINTS[0], ...override });
}
