import { describe, it, expect } from 'vitest';
import { HAZARD_CONFIG } from './hazard-markers-layer.js';
import { MOCK_HAZARDS } from './hazard-markers-layer.mock.js';

describe(`HAZARD_CONFIG`, () => {
  it(`contains all expected hazard types`, () => {
    const expectedTypes = [`landslide`, `construction`, `ice`, `flood`, `animal`, `oil`, `pothole`, `camera`, `default`];
    expectedTypes.forEach((type) => {
      expect(HAZARD_CONFIG[type]).toBeTruthy();
    });
  });

  it(`entries have required fields`, () => {
    Object.values(HAZARD_CONFIG).forEach((cfg) => {
      expect(cfg.label).toBeTruthy();
      expect(cfg.emoji).toBeTruthy();
      expect(cfg.color).toBeTruthy();
      expect(cfg.bgColor).toBeTruthy();
    });
  });

  it(`default config has warning emoji`, () => {
    const fallback = HAZARD_CONFIG[`default`];
    expect(fallback).toBeTruthy();
    expect(fallback.emoji).toBe(`⚠️`);
  });

  it(`has exactly 9 entries including default`, () => {
    expect(Object.keys(HAZARD_CONFIG).length).toBe(9);
  });

  it(`ice config has correct color`, () => {
    expect(HAZARD_CONFIG[`ice`].color).toBe(`#1d4ed8`);
  });
});

describe(`MOCK_HAZARDS`, () => {
  it(`covers all 8 hazard types`, () => {
    const types = MOCK_HAZARDS.map((h) => h.type);
    const expectedTypes = [`ice`, `pothole`, `construction`, `animal`, `flood`, `oil`, `landslide`, `camera`];
    expectedTypes.forEach((type) => {
      expect(types.includes(type)).toBe(true);
    });
  });

  it(`have valid coordinates`, () => {
    MOCK_HAZARDS.forEach((h) => {
      expect(typeof h.lat).toBe(`number`);
      expect(typeof h.lng).toBe(`number`);
      expect(h.lat).toBeGreaterThan(0);
      expect(h.lng).toBeGreaterThan(0);
    });
  });

  it(`have confirmedCount as a non-negative number`, () => {
    MOCK_HAZARDS.forEach((h) => {
      expect(typeof h.confirmedCount).toBe(`number`);
      expect(h.confirmedCount).toBeGreaterThanOrEqual(0);
    });
  });

  it(`have reportedAt timestamps`, () => {
    MOCK_HAZARDS.forEach((h) => {
      expect(typeof h.reportedAt).toBe(`number`);
      expect(h.reportedAt).toBeGreaterThan(0);
    });
  });

  it(`have unique ids`, () => {
    const ids = MOCK_HAZARDS.map((h) => h.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
