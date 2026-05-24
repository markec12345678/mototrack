import { Hazard } from './hazard.js';
import type { PlainHazard } from './hazard.js';

/**
 * Seed array of 8 example hazards across the Balkans region.
 */
export const hazardSeed: PlainHazard[] = [
  {
    id: 'hazard-001',
    type: 'accident',
    lat: 43.8563,
    lng: 18.4131,
    reportedAt: 1717000000000,
    reportedBy: 'user_sarajevo',
    confirmedCount: 12,
  },
  {
    id: 'hazard-002',
    type: 'flood',
    lat: 44.8048,
    lng: 20.4781,
    reportedAt: 1717010000000,
    reportedBy: 'user_belgrade',
    confirmedCount: 34,
  },
  {
    id: 'hazard-003',
    type: 'landslide',
    lat: 42.6629,
    lng: 21.1655,
    reportedAt: 1717020000000,
    reportedBy: 'user_pristina',
    confirmedCount: 7,
  },
  {
    id: 'hazard-004',
    type: 'roadblock',
    lat: 41.9981,
    lng: 21.4254,
    reportedAt: 1717030000000,
    reportedBy: 'user_skopje',
    confirmedCount: 19,
  },
  {
    id: 'hazard-005',
    type: 'fire',
    lat: 42.4304,
    lng: 19.2594,
    reportedAt: 1717040000000,
    reportedBy: 'user_podgorica',
    confirmedCount: 5,
  },
  {
    id: 'hazard-006',
    type: 'fog',
    lat: 43.3438,
    lng: 17.8078,
    reportedAt: 1717050000000,
    reportedBy: 'user_mostar',
    confirmedCount: 22,
  },
  {
    id: 'hazard-007',
    type: 'ice',
    lat: 45.8150,
    lng: 15.9819,
    reportedAt: 1717060000000,
    reportedBy: 'user_zagreb',
    confirmedCount: 41,
  },
  {
    id: 'hazard-008',
    type: 'debris',
    lat: 42.6977,
    lng: 23.3219,
    reportedAt: 1717070000000,
    reportedBy: 'user_sofia',
    confirmedCount: 3,
  },
];

/**
 * Returns an array of mock Hazard entities.
 * Optionally override individual hazard properties.
 */
export function mockHazards(overrides: Partial<PlainHazard>[] = []): Hazard[] {
  return hazardSeed.map((seed, index) => {
    const override = overrides[index] ?? {};
    return Hazard.from({ ...seed, ...override });
  });
}

/**
 * Returns a single mock Hazard entity with optional property overrides.
 */
export function mockHazard(override: Partial<PlainHazard> = {}): Hazard {
  return Hazard.from({ ...hazardSeed[0], ...override });
}
