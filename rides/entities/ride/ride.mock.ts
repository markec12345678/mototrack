import { TrackPoint } from '@markec/rides.entities.track-point';
import { Ride } from './ride.js';
import type { PlainRide } from './ride.js';

/**
 * A small mountain loop track with realistic GPS data.
 * Points are spaced ~30 s apart, elevation rises then falls.
 */
const defaultTrack: TrackPoint[] = [
  TrackPoint.from({ lat: 46.0, lng: 14.0, ts: 1_700_000_000_000, speed: 0, elevation: 300, accuracy: 5, heading: 0 }),
  TrackPoint.from({ lat: 46.002, lng: 14.003, ts: 1_700_000_030_000, speed: 6.5, elevation: 320, accuracy: 5, heading: 45 }),
  TrackPoint.from({ lat: 46.005, lng: 14.007, ts: 1_700_000_060_000, speed: 7.2, elevation: 345, accuracy: 4, heading: 50 }),
  TrackPoint.from({ lat: 46.009, lng: 14.010, ts: 1_700_000_090_000, speed: 8.1, elevation: 370, accuracy: 4, heading: 40 }),
  TrackPoint.from({ lat: 46.013, lng: 14.012, ts: 1_700_000_120_000, speed: 9.4, elevation: 390, accuracy: 5, heading: 20 }),
  TrackPoint.from({ lat: 46.016, lng: 14.009, ts: 1_700_000_150_000, speed: 11.2, elevation: 400, accuracy: 4, heading: 330 }),
  TrackPoint.from({ lat: 46.018, lng: 14.005, ts: 1_700_000_180_000, speed: 12.8, elevation: 395, accuracy: 5, heading: 290 }),
  TrackPoint.from({ lat: 46.016, lng: 14.001, ts: 1_700_000_210_000, speed: 10.5, elevation: 375, accuracy: 4, heading: 220 }),
  TrackPoint.from({ lat: 46.012, lng: 13.998, ts: 1_700_000_240_000, speed: 9.0, elevation: 350, accuracy: 5, heading: 210 }),
  TrackPoint.from({ lat: 46.006, lng: 13.997, ts: 1_700_000_270_000, speed: 7.8, elevation: 325, accuracy: 4, heading: 190 }),
  TrackPoint.from({ lat: 46.001, lng: 13.999, ts: 1_700_000_300_000, speed: 5.0, elevation: 302, accuracy: 5, heading: 160 }),
  TrackPoint.from({ lat: 46.0, lng: 14.0, ts: 1_700_000_330_000, speed: 0, elevation: 300, accuracy: 5, heading: 0 }),
];

/**
 * Build a mock Ride, optionally overriding any PlainRide fields.
 */
export function mockRide(overrides: Partial<PlainRide> = {}): Ride {
  const metrics = Ride.computeMetrics(defaultTrack);

  return Ride.from({
    id: 'ride-mock-001',
    userId: 'user-mock-001',
    startedAt: metrics.startedAt,
    endedAt: metrics.endedAt,
    distanceKm: metrics.distanceKm,
    durationSec: metrics.durationSec,
    maxSpeedKmh: metrics.maxSpeedKmh,
    avgSpeedKmh: metrics.avgSpeedKmh,
    climbM: metrics.climbM,
    descentM: metrics.descentM,
    twistinessScore: metrics.twistinessScore,
    track: defaultTrack.map((p) => p.toObject()),
    name: 'Morning Mountain Loop',
    notes: 'Lovely weather, light traffic on the descent.',
    ...overrides,
  });
}

/**
 * Build an array of mock Rides for list views and testing.
 */
export function mockRides(): Ride[] {
  return [
    mockRide(),
    mockRide({
      id: 'ride-mock-002',
      name: 'Evening Gravel Run',
      notes: 'Gravel section was rough after the rain.',
      distanceKm: 22.4,
      durationSec: 4200,
      maxSpeedKmh: 48.2,
      avgSpeedKmh: 19.2,
      climbM: 310,
      descentM: 310,
      twistinessScore: 6.5,
    }),
    mockRide({
      id: 'ride-mock-003',
      name: 'Flat Sprint',
      notes: undefined,
      distanceKm: 8.1,
      durationSec: 1080,
      maxSpeedKmh: 55.0,
      avgSpeedKmh: 27.0,
      climbM: 12,
      descentM: 12,
      twistinessScore: 1.2,
    }),
  ];
}
