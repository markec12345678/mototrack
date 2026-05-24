import { describe, it, expect } from 'vitest';
import { LatLng } from './lat-lng.js';
import { mockLatLng, mockLatLngs } from './lat-lng.mock.js';

// ---------------------------------------------------------------------------
// Construction & serialisation
// ---------------------------------------------------------------------------

describe('LatLng.from', () => {
  it('creates an instance from a plain object', () => {
    const point = LatLng.from({ lat: 48.8566, lng: 2.3522 });
    expect(point.lat).toBe(48.8566);
    expect(point.lng).toBe(2.3522);
  });

  it('defaults lat and lng to 0 when called with no arguments', () => {
    const point = LatLng.from();
    expect(point.lat).toBe(0);
    expect(point.lng).toBe(0);
  });
});

describe('LatLng#toObject', () => {
  it('serialises to a plain object with lat and lng', () => {
    const point = LatLng.from({ lat: 51.5074, lng: -0.1278 });
    expect(point.toObject()).toEqual({ lat: 51.5074, lng: -0.1278 });
  });
});

describe('LatLng#toString', () => {
  it('returns a human-readable string', () => {
    const point = LatLng.from({ lat: 48.8566, lng: 2.3522 });
    expect(point.toString()).toBe('(48.8566, 2.3522)');
  });
});

// ---------------------------------------------------------------------------
// haversineKm
// ---------------------------------------------------------------------------

describe('LatLng.haversineKm', () => {
  it('returns 0 for identical points', () => {
    const paris = LatLng.from({ lat: 48.8566, lng: 2.3522 });
    expect(LatLng.haversineKm(paris, paris)).toBe(0);
  });

  it('calculates the Paris → London distance (~341 km)', () => {
    const paris = LatLng.from({ lat: 48.8566, lng: 2.3522 });
    const london = LatLng.from({ lat: 51.5074, lng: -0.1278 });
    const km = LatLng.haversineKm(paris, london);
    expect(km).toBeGreaterThan(330);
    expect(km).toBeLessThan(350);
  });

  it('is symmetric (a→b equals b→a)', () => {
    const [paris, london] = mockLatLngs();
    const ab = LatLng.haversineKm(paris, london);
    const ba = LatLng.haversineKm(london, paris);
    expect(ab).toBeCloseTo(ba, 6);
  });
});

// ---------------------------------------------------------------------------
// bearingDeg
// ---------------------------------------------------------------------------

describe('LatLng.bearingDeg', () => {
  it('returns ~0° when moving due North', () => {
    const a = LatLng.from({ lat: 0, lng: 0 });
    const b = LatLng.from({ lat: 10, lng: 0 });
    expect(LatLng.bearingDeg(a, b)).toBeCloseTo(0, 0);
  });

  it('returns ~90° when moving due East', () => {
    const a = LatLng.from({ lat: 0, lng: 0 });
    const b = LatLng.from({ lat: 0, lng: 10 });
    expect(LatLng.bearingDeg(a, b)).toBeCloseTo(90, 0);
  });

  it('returns ~180° when moving due South', () => {
    const a = LatLng.from({ lat: 10, lng: 0 });
    const b = LatLng.from({ lat: 0, lng: 0 });
    expect(LatLng.bearingDeg(a, b)).toBeCloseTo(180, 0);
  });

  it('returns ~270° when moving due West', () => {
    const a = LatLng.from({ lat: 0, lng: 10 });
    const b = LatLng.from({ lat: 0, lng: 0 });
    expect(LatLng.bearingDeg(a, b)).toBeCloseTo(270, 0);
  });

  it('returns a value in [0, 360)', () => {
    const bearing = LatLng.bearingDeg(
      LatLng.from({ lat: 48.8566, lng: 2.3522 }),
      LatLng.from({ lat: 35.6762, lng: 139.6503 }),
    );
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThan(360);
  });
});

// ---------------------------------------------------------------------------
// interpolate
// ---------------------------------------------------------------------------

describe('LatLng.interpolate', () => {
  const a = LatLng.from({ lat: 0, lng: 0 });
  const b = LatLng.from({ lat: 10, lng: 20 });

  it('returns a at t=0', () => {
    const result = LatLng.interpolate(a, b, 0);
    expect(result.lat).toBeCloseTo(0);
    expect(result.lng).toBeCloseTo(0);
  });

  it('returns b at t=1', () => {
    const result = LatLng.interpolate(a, b, 1);
    expect(result.lat).toBeCloseTo(10);
    expect(result.lng).toBeCloseTo(20);
  });

  it('returns the midpoint at t=0.5', () => {
    const result = LatLng.interpolate(a, b, 0.5);
    expect(result.lat).toBeCloseTo(5);
    expect(result.lng).toBeCloseTo(10);
  });

  it('clamps t below 0 to 0', () => {
    const result = LatLng.interpolate(a, b, -1);
    expect(result.lat).toBeCloseTo(0);
    expect(result.lng).toBeCloseTo(0);
  });

  it('clamps t above 1 to 1', () => {
    const result = LatLng.interpolate(a, b, 2);
    expect(result.lat).toBeCloseTo(10);
    expect(result.lng).toBeCloseTo(20);
  });
});

// ---------------------------------------------------------------------------
// bbox
// ---------------------------------------------------------------------------

describe('LatLng.bbox', () => {
  it('throws when given an empty array', () => {
    expect(() => LatLng.bbox([])).toThrow();
  });

  it('returns a degenerate bbox for a single point', () => {
    const point = LatLng.from({ lat: 48.8566, lng: 2.3522 });
    const box = LatLng.bbox([point]);
    expect(box.minLat).toBe(48.8566);
    expect(box.maxLat).toBe(48.8566);
    expect(box.minLng).toBe(2.3522);
    expect(box.maxLng).toBe(2.3522);
  });

  it('encloses all points', () => {
    const points = mockLatLngs();
    const box = LatLng.bbox(points);
    for (const p of points) {
      expect(p.lat).toBeGreaterThanOrEqual(box.minLat);
      expect(p.lat).toBeLessThanOrEqual(box.maxLat);
      expect(p.lng).toBeGreaterThanOrEqual(box.minLng);
      expect(p.lng).toBeLessThanOrEqual(box.maxLng);
    }
  });

  it('computes correct min/max values', () => {
    const points = [
      LatLng.from({ lat: 10, lng: 20 }),
      LatLng.from({ lat: -5, lng: 100 }),
      LatLng.from({ lat: 50, lng: -30 }),
    ];
    const box = LatLng.bbox(points);
    expect(box.minLat).toBe(-5);
    expect(box.maxLat).toBe(50);
    expect(box.minLng).toBe(-30);
    expect(box.maxLng).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

describe('mockLatLng', () => {
  it('returns a LatLng instance', () => {
    expect(mockLatLng()).toBeInstanceOf(LatLng);
  });

  it('applies overrides', () => {
    const point = mockLatLng({ lat: 99 });
    expect(point.lat).toBe(99);
  });
});

describe('mockLatLngs', () => {
  it('returns an array of LatLng instances', () => {
    const points = mockLatLngs();
    expect(points.length).toBeGreaterThan(0);
    for (const p of points) {
      expect(p).toBeInstanceOf(LatLng);
    }
  });
});
