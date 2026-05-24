import { describe, it, expect } from 'vitest';
import { Hazard } from './hazard.js';
import { mockHazard, mockHazards, hazardSeed } from './hazard.mock.js';

describe('Hazard.from()', () => {
  it('creates a Hazard instance from a plain object', () => {
    const hazard = Hazard.from(hazardSeed[0]);
    expect(hazard).toBeInstanceOf(Hazard);
  });

  it('assigns all properties correctly', () => {
    const hazard = Hazard.from(hazardSeed[0]);
    expect(hazard.id).toBe('hazard-001');
    expect(hazard.type).toBe('accident');
    expect(hazard.lat).toBe(43.8563);
    expect(hazard.lng).toBe(18.4131);
    expect(hazard.reportedAt).toBe(1717000000000);
    expect(hazard.reportedBy).toBe('user_sarajevo');
    expect(hazard.confirmedCount).toBe(12);
  });

  it('handles missing optional reportedBy gracefully', () => {
    const hazard = Hazard.from({ ...hazardSeed[0], reportedBy: undefined });
    expect(hazard.reportedBy).toBeUndefined();
  });

  it('defaults numeric fields to 0 when missing', () => {
    const hazard = Hazard.from({
      id: 'test-id',
      type: 'fog',
      lat: 0,
      lng: 0,
      reportedAt: 0,
      confirmedCount: 0,
    });
    expect(hazard.lat).toBe(0);
    expect(hazard.lng).toBe(0);
    expect(hazard.confirmedCount).toBe(0);
  });
});

describe('Hazard.toObject()', () => {
  it('serializes back to a plain object', () => {
    const hazard = Hazard.from(hazardSeed[1]);
    const plain = hazard.toObject();
    expect(plain.id).toBe('hazard-002');
    expect(plain.type).toBe('flood');
    expect(plain.lat).toBe(44.8048);
    expect(plain.lng).toBe(20.4781);
    expect(plain.confirmedCount).toBe(34);
  });

  it('round-trips through from() and toObject() without data loss', () => {
    const original = hazardSeed[3];
    const plain = Hazard.from(original).toObject();
    expect(plain).toEqual(original);
  });
});

describe('mockHazard()', () => {
  it('returns a single Hazard instance', () => {
    const hazard = mockHazard();
    expect(hazard).toBeInstanceOf(Hazard);
  });

  it('applies overrides correctly', () => {
    const hazard = mockHazard({ type: 'fire', confirmedCount: 99 });
    expect(hazard.type).toBe('fire');
    expect(hazard.confirmedCount).toBe(99);
  });
});

describe('mockHazards()', () => {
  it('returns 8 Hazard instances matching the seed', () => {
    const hazards = mockHazards();
    expect(hazards).toHaveLength(8);
    hazards.forEach((h) => expect(h).toBeInstanceOf(Hazard));
  });

  it('applies per-index overrides', () => {
    const hazards = mockHazards([{ type: 'ice' }]);
    expect(hazards[0].type).toBe('ice');
    expect(hazards[1].type).toBe('flood');
  });

  it('covers all Balkan cities in the seed', () => {
    const hazards = mockHazards();
    const reporters = hazards.map((h) => h.reportedBy);
    expect(reporters).toContain('user_sarajevo');
    expect(reporters).toContain('user_belgrade');
    expect(reporters).toContain('user_sofia');
    expect(reporters).toContain('user_zagreb');
  });
});
