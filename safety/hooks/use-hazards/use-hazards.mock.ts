import type { PlainHazard } from './use-hazards.js';

/**
 * Seed mock hazard plain objects across Balkan roads.
 * Pass into useHazards({ mockData: mockHazardSeeds }) for testing and compositions.
 * Uses static timestamps to keep tests deterministic.
 */
export const mockHazardSeeds: PlainHazard[] = [
  {
    id: 'hz-001',
    type: 'pothole',
    lat: 46.0569,
    lng: 14.5058,
    reportedAt: 1717000000000,
    reportedBy: 'rider-42',
    confirmedCount: 7,
  },
  {
    id: 'hz-002',
    type: 'oil',
    lat: 45.8131,
    lng: 15.9772,
    reportedAt: 1717010000000,
    reportedBy: 'rider-17',
    confirmedCount: 3,
  },
  {
    id: 'hz-003',
    type: 'animal',
    lat: 43.8563,
    lng: 18.4131,
    reportedAt: 1717020000000,
    reportedBy: 'rider-88',
    confirmedCount: 1,
  },
  {
    id: 'hz-004',
    type: 'accident',
    lat: 44.8176,
    lng: 20.4569,
    reportedAt: 1717030000000,
    reportedBy: 'rider-55',
    confirmedCount: 12,
  },
  {
    id: 'hz-005',
    type: 'gravel',
    lat: 42.6977,
    lng: 23.3219,
    reportedAt: 1717040000000,
    confirmedCount: 0,
  },
  {
    id: 'hz-006',
    type: 'roadwork',
    lat: 44.4268,
    lng: 26.1025,
    reportedAt: 1717050000000,
    reportedBy: 'rider-99',
    confirmedCount: 5,
  },
  {
    id: 'hz-007',
    type: 'pothole',
    lat: 47.4979,
    lng: 19.0402,
    reportedAt: 1717060000000,
    reportedBy: 'rider-23',
    confirmedCount: 2,
  },
  {
    id: 'hz-008',
    type: 'flood',
    lat: 45.3271,
    lng: 14.4422,
    reportedAt: 1717070000000,
    reportedBy: 'rider-61',
    confirmedCount: 9,
  },
];
