import { SpeedCamera } from './speed-camera.js';
import type { PlainSpeedCamera, SpeedCameraType } from './speed-camera.js';

/**
 * Seed data: 20 known speed cameras across 10 Balkan countries.
 * Countries: Slovenia, Croatia, Serbia, Bulgaria, Romania,
 *            Bosnia & Herzegovina, North Macedonia, Montenegro, Albania, Greece.
 */
const seedCameras: PlainSpeedCamera[] = [
  // Slovenia (2)
  {
    id: 'sc-001',
    lat: 46.0419,
    lng: 14.4726,
    speedLimit: 50,
    type: 'fixed',
    country: 'Slovenia',
  },
  {
    id: 'sc-002',
    lat: 46.5547,
    lng: 15.6459,
    speedLimit: 130,
    type: 'section',
    country: 'Slovenia',
  },

  // Croatia (2)
  {
    id: 'sc-003',
    lat: 45.7942,
    lng: 15.9419,
    speedLimit: 50,
    type: 'fixed',
    country: 'Croatia',
  },
  {
    id: 'sc-004',
    lat: 45.5596,
    lng: 18.6758,
    speedLimit: 130,
    type: 'average',
    country: 'Croatia',
  },

  // Serbia (2)
  {
    id: 'sc-005',
    lat: 44.8016,
    lng: 20.4651,
    speedLimit: 60,
    type: 'fixed',
    country: 'Serbia',
  },
  {
    id: 'sc-006',
    lat: 44.7866,
    lng: 20.4489,
    speedLimit: 80,
    type: 'red-light',
    country: 'Serbia',
  },

  // Bulgaria (2)
  {
    id: 'sc-007',
    lat: 42.5897,
    lng: 23.5228,
    speedLimit: 90,
    type: 'fixed',
    country: 'Bulgaria',
  },
  {
    id: 'sc-008',
    lat: 42.6977,
    lng: 23.3219,
    speedLimit: 50,
    type: 'mobile',
    country: 'Bulgaria',
  },

  // Romania (2)
  {
    id: 'sc-009',
    lat: 44.4268,
    lng: 25.9783,
    speedLimit: 130,
    type: 'fixed',
    country: 'Romania',
  },
  {
    id: 'sc-010',
    lat: 44.4396,
    lng: 26.0963,
    speedLimit: 50,
    type: 'section',
    country: 'Romania',
  },

  // Bosnia & Herzegovina (2)
  {
    id: 'sc-011',
    lat: 43.8563,
    lng: 18.4131,
    speedLimit: 60,
    type: 'fixed',
    country: 'Bosnia & Herzegovina',
  },
  {
    id: 'sc-012',
    lat: 44.2033,
    lng: 17.9086,
    speedLimit: 100,
    type: 'average',
    country: 'Bosnia & Herzegovina',
  },

  // North Macedonia (2)
  {
    id: 'sc-013',
    lat: 41.9981,
    lng: 21.4254,
    speedLimit: 50,
    type: 'fixed',
    country: 'North Macedonia',
  },
  {
    id: 'sc-014',
    lat: 41.7453,
    lng: 21.7144,
    speedLimit: 120,
    type: 'section',
    country: 'North Macedonia',
  },

  // Montenegro (2)
  {
    id: 'sc-015',
    lat: 42.4304,
    lng: 19.2594,
    speedLimit: 50,
    type: 'fixed',
    country: 'Montenegro',
  },
  {
    id: 'sc-016',
    lat: 42.2917,
    lng: 18.8402,
    speedLimit: 80,
    type: 'mobile',
    country: 'Montenegro',
  },

  // Albania (2)
  {
    id: 'sc-017',
    lat: 41.3275,
    lng: 19.8187,
    speedLimit: 50,
    type: 'fixed',
    country: 'Albania',
  },
  {
    id: 'sc-018',
    lat: 41.1171,
    lng: 20.0822,
    speedLimit: 90,
    type: 'average',
    country: 'Albania',
  },

  // Greece (2)
  {
    id: 'sc-019',
    lat: 37.9838,
    lng: 23.7275,
    speedLimit: 50,
    type: 'fixed',
    country: 'Greece',
  },
  {
    id: 'sc-020',
    lat: 40.6401,
    lng: 22.9444,
    speedLimit: 120,
    type: 'section',
    country: 'Greece',
  },
];

/**
 * Returns mock SpeedCamera instances, optionally overriding individual fields.
 */
export function mockSpeedCameras(overrides: Partial<PlainSpeedCamera>[] = []): SpeedCamera[] {
  return seedCameras.map((seed, index) => {
    const override = overrides[index] ?? {};
    return SpeedCamera.from({ ...seed, ...override });
  });
}

/**
 * Returns a single mock SpeedCamera with optional overrides.
 */
export function mockSpeedCamera(overrides: Partial<PlainSpeedCamera> = {}): SpeedCamera {
  return SpeedCamera.from({ ...seedCameras[0], ...overrides });
}
