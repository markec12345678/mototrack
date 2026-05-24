import { describe, it, expect } from 'vitest';
import { TrackPoint } from '@markec/rides.entities.track-point';
import { Ride } from './ride.js';
import { mockRide, mockRides } from './ride.mock.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTrack(): TrackPoint[] {
  return [
    TrackPoint.from({ lat: 46.0, lng: 14.0, ts: 1_700_000_000_000, speed: 0, elevation: 100, accuracy: 5, heading: 0 }),
    TrackPoint.from({ lat: 46.01, lng: 14.01, ts: 1_700_000_060_000, speed: 8.0, elevation: 120, accuracy: 5, heading: 45 }),
    TrackPoint.from({ lat: 46.02, lng: 14.02, ts: 1_700_000_120_000, speed: 10.0, elevation: 115, accuracy: 5, heading: 90 }),
  ];
}

// ---------------------------------------------------------------------------
// Ride.from
// ---------------------------------------------------------------------------

describe('Ride.from', () => {
  it('creates a Ride instance from a plain object', () => {
    const ride = mockRide();
    expect(ride).toBeInstanceOf(Ride);
  });

  it('preserves all scalar fields', () => {
    const ride = mockRide({ id: 'test-id', userId: 'user-42', name: 'Test Ride' });
    expect(ride.id).toBe('test-id');
    expect(ride.userId).toBe('user-42');
    expect(ride.name).toBe('Test Ride');
  });

  it('defaults missing optional fields gracefully', () => {
    const ride = Ride.from({
      id: 'x',
      userId: 'u',
      startedAt: 0,
      endedAt: 0,
      distanceKm: 0,
      durationSec: 0,
      maxSpeedKmh: 0,
      avgSpeedKmh: 0,
      climbM: 0,
      descentM: 0,
      twistinessScore: 0,
      track: [],
    });
    expect(ride.name).toBeUndefined();
    expect(ride.notes).toBeUndefined();
    expect(ride.track).toHaveLength(0);
  });

  it('converts plain track points into TrackPoint instances', () => {
    const ride = mockRide();
    expect(ride.track.length).toBeGreaterThan(0);
    expect(ride.track[0]).toBeInstanceOf(TrackPoint);
  });
});

// ---------------------------------------------------------------------------
// Ride.computeMetrics
// ---------------------------------------------------------------------------

describe('Ride.computeMetrics', () => {
  it('returns zero metrics for an empty track', () => {
    const metrics = Ride.computeMetrics([]);
    expect(metrics.distanceKm).toBe(0);
    expect(metrics.durationSec).toBe(0);
    expect(metrics.maxSpeedKmh).toBe(0);
    expect(metrics.avgSpeedKmh).toBe(0);
    expect(metrics.climbM).toBe(0);
    expect(metrics.descentM).toBe(0);
    expect(metrics.twistinessScore).toBe(0);
  });

  it('computes positive distance for a multi-point track', () => {
    const metrics = Ride.computeMetrics(makeTrack());
    expect(metrics.distanceKm).toBeGreaterThan(0);
  });

  it('computes correct duration from timestamps', () => {
    const metrics = Ride.computeMetrics(makeTrack());
    // 2 minutes = 120 seconds
    expect(metrics.durationSec).toBe(120);
  });

  it('computes climb and descent from elevation changes', () => {
    const metrics = Ride.computeMetrics(makeTrack());
    // +20 m climb, -5 m descent
    expect(metrics.climbM).toBe(20);
    expect(metrics.descentM).toBe(5);
  });

  it('converts max speed from m/s to km/h', () => {
    const metrics = Ride.computeMetrics(makeTrack());
    // max speed in track is 10 m/s → 36 km/h
    expect(metrics.maxSpeedKmh).toBeCloseTo(36, 0);
  });

  it('keeps twistinessScore within 0–10', () => {
    const metrics = Ride.computeMetrics(makeTrack());
    expect(metrics.twistinessScore).toBeGreaterThanOrEqual(0);
    expect(metrics.twistinessScore).toBeLessThanOrEqual(10);
  });

  it('sets startedAt and endedAt from track timestamps', () => {
    const metrics = Ride.computeMetrics(makeTrack());
    expect(metrics.startedAt).toBe(1_700_000_000_000);
    expect(metrics.endedAt).toBe(1_700_000_120_000);
  });
});

// ---------------------------------------------------------------------------
// toObject
// ---------------------------------------------------------------------------

describe('Ride.toObject', () => {
  it('returns a plain object with an id field', () => {
    const ride = mockRide({ id: 'obj-test' });
    const plain = ride.toObject();
    expect(plain.id).toBe('obj-test');
  });

  it('round-trips through Ride.from without data loss', () => {
    const original = mockRide();
    const restored = Ride.from(original.toObject());
    expect(restored.id).toBe(original.id);
    expect(restored.distanceKm).toBe(original.distanceKm);
    expect(restored.track).toHaveLength(original.track.length);
  });

  it('serializes track points as plain objects', () => {
    const ride = mockRide();
    const plain = ride.toObject();
    expect(typeof plain.track[0].lat).toBe('number');
  });
});

// ---------------------------------------------------------------------------
// toGpx
// ---------------------------------------------------------------------------

describe('Ride.toGpx', () => {
  it('returns a string starting with the XML declaration', () => {
    const gpx = mockRide().toGpx();
    expect(gpx.startsWith('<?xml version="1.0"')).toBe(true);
  });

  it('contains GPX 1.1 namespace', () => {
    const gpx = mockRide().toGpx();
    expect(gpx).toContain('http://www.topografix.com/GPX/1/1');
  });

  it('contains a <trkseg> element', () => {
    const gpx = mockRide().toGpx();
    expect(gpx).toContain('<trkseg>');
  });

  it('contains one <trkpt> per track point', () => {
    const ride = mockRide();
    const gpx = ride.toGpx();
    const count = (gpx.match(/<trkpt /g) ?? []).length;
    expect(count).toBe(ride.track.length);
  });

  it('includes the ride name in the GPX metadata', () => {
    const ride = mockRide({ name: 'Epic Climb' });
    expect(ride.toGpx()).toContain('<name>Epic Climb</name>');
  });

  it('escapes special characters in the ride name', () => {
    const ride = mockRide({ name: 'Ride & <Fun>' });
    const gpx = ride.toGpx();
    expect(gpx).toContain('Ride &amp; &lt;Fun&gt;');
  });

  it('includes elevation elements when elevation data is present', () => {
    const gpx = mockRide().toGpx();
    expect(gpx).toContain('<ele>');
  });
});

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

describe('mockRides', () => {
  it('returns an array of Ride instances', () => {
    const rides = mockRides();
    expect(rides.length).toBeGreaterThan(0);
    rides.forEach((r) => expect(r).toBeInstanceOf(Ride));
  });

  it('each mock ride has a unique id', () => {
    const ids = mockRides().map((r) => r.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
