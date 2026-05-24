import { describe, it, expect, vi } from 'vitest';
import { TrackPoint } from './track-point.js';
import { mockTrackPoint, mockTrackPoints } from './track-point.mock.js';

describe('TrackPoint.from()', () => {
  it('creates a TrackPoint from a plain object', () => {
    const point = TrackPoint.from({
      lat: 46.227638,
      lng: 14.357338,
      ts: 1_700_000_000_000,
      speed: 12.5,
      elevation: 420,
      accuracy: 4,
      heading: 45,
    });

    expect(point).toBeInstanceOf(TrackPoint);
    expect(point.lat).toBe(46.227638);
    expect(point.lng).toBe(14.357338);
    expect(point.ts).toBe(1_700_000_000_000);
    expect(point.speed).toBe(12.5);
    expect(point.elevation).toBe(420);
    expect(point.accuracy).toBe(4);
    expect(point.heading).toBe(45);
  });

  it('handles missing optional fields gracefully', () => {
    const point = TrackPoint.from({ lat: 10, lng: 20, ts: 1000 });

    expect(point.speed).toBeUndefined();
    expect(point.elevation).toBeUndefined();
    expect(point.accuracy).toBeUndefined();
    expect(point.heading).toBeUndefined();
  });
});

describe('TrackPoint.toObject()', () => {
  it('serializes back to a plain object', () => {
    const plain = {
      lat: 46.227638,
      lng: 14.357338,
      ts: 1_700_000_000_000,
      speed: 12.5,
      elevation: 420,
      accuracy: 4,
      heading: 45,
    };

    const point = TrackPoint.from(plain);
    expect(point.toObject()).toEqual(plain);
  });
});

describe('TrackPoint.toLatLng()', () => {
  it('returns a plain { lat, lng } object', () => {
    const point = mockTrackPoint();
    const latLng = point.toLatLng();

    expect(latLng).toEqual({ lat: point.lat, lng: point.lng });
    expect(Object.keys(latLng)).toHaveLength(2);
  });
});

describe('TrackPoint.distanceKmTo()', () => {
  it('returns 0 when comparing a point to itself', () => {
    const point = mockTrackPoint();
    expect(point.distanceKmTo(point)).toBe(0);
  });

  it('calculates a positive distance between two different points', () => {
    const [a, b] = mockTrackPoints();
    const dist = a.distanceKmTo(b);

    expect(dist).toBeGreaterThan(0);
  });

  it('is symmetric - distance A to B equals distance B to A', () => {
    const [a, b] = mockTrackPoints();
    expect(a.distanceKmTo(b)).toBeCloseTo(b.distanceKmTo(a), 10);
  });

  it('calculates a known distance within acceptable tolerance', () => {
    // Ljubljana (46.0569 N, 14.5058 E) to Maribor (46.5547 N, 15.6459 E)
    // Haversine straight-line distance is approximately 103.6 km
    const ljubljana = TrackPoint.from({ lat: 46.0569, lng: 14.5058, ts: 0 });
    const maribor = TrackPoint.from({ lat: 46.5547, lng: 15.6459, ts: 0 });

    expect(ljubljana.distanceKmTo(maribor)).toBeCloseTo(103.6, 0);
  });
});

describe('TrackPoint.isStale()', () => {
  it('returns false for a recent point', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const point = TrackPoint.from({ lat: 0, lng: 0, ts: now - 1_000 });
    expect(point.isStale(5_000)).toBe(false);

    vi.useRealTimers();
  });

  it('returns true for an old point', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const point = TrackPoint.from({ lat: 0, lng: 0, ts: now - 10_000 });
    expect(point.isStale(5_000)).toBe(true);

    vi.useRealTimers();
  });

  it('returns false when age equals maxAgeMs exactly', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const point = TrackPoint.from({ lat: 0, lng: 0, ts: now - 5_000 });
    // Date.now() - ts === 5000, which is NOT > 5000
    expect(point.isStale(5_000)).toBe(false);

    vi.useRealTimers();
  });
});

describe('mockTrackPoints()', () => {
  it('returns an array of TrackPoint instances', () => {
    const points = mockTrackPoints();

    expect(points.length).toBeGreaterThan(0);
    points.forEach((p) => expect(p).toBeInstanceOf(TrackPoint));
  });

  it('applies partial overrides to every point', () => {
    const points = mockTrackPoints({ speed: 99 });
    points.forEach((p) => expect(p.speed).toBe(99));
  });
});
