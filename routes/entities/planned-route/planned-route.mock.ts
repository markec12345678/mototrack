import { PlannedRoute, type PlainPlannedRoute } from './planned-route.js';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

const BASE_MOCK: PlainPlannedRoute = {
  id: 'route-001',
  userId: 'user-abc',
  name: 'Vršič Pass Loop',
  waypoints: [
    { id: 'wp-1', name: 'Kranjska Gora', lat: 46.4839, lng: 13.7836 },
    { id: 'wp-2', name: 'Vršič Pass', lat: 46.4328, lng: 13.7447 },
    { id: 'wp-3', name: 'Bovec', lat: 46.3378, lng: 13.5523 },
  ],
  mode: 'twisty',
  geometry: [
    { lat: 46.4839, lng: 13.7836 },
    { lat: 46.4700, lng: 13.7700 },
    { lat: 46.4500, lng: 13.7550 },
    { lat: 46.4328, lng: 13.7447 },
    { lat: 46.4000, lng: 13.6800 },
    { lat: 46.3700, lng: 13.6100 },
    { lat: 46.3378, lng: 13.5523 },
  ],
  distanceKm: 52.4,
  durationSec: 4800,
  notes: 'Scenic mountain pass with 50 hairpin turns. Best in summer.',
  createdAt: 1710000000,
};

/**
 * Create a mock PlannedRoute with optional property overrides.
 */
export function mockPlannedRoute(overrides: Partial<PlainPlannedRoute> = {}): PlannedRoute {
  return PlannedRoute.from({ ...BASE_MOCK, id: generateId(), ...overrides });
}

/**
 * Create an array of mock PlannedRoute instances.
 */
export function mockPlannedRoutes(): PlannedRoute[] {
  return [
    PlannedRoute.from({ ...BASE_MOCK, id: generateId() }),
    PlannedRoute.from({
      id: generateId(),
      userId: 'user-abc',
      name: 'Soča Valley Gravel',
      waypoints: [
        { id: 'wp-4', name: 'Tolmin', lat: 46.1875, lng: 13.7322 },
        { id: 'wp-5', name: 'Kobarid', lat: 46.2472, lng: 13.5781 },
      ],
      mode: 'offroad',
      geometry: [
        { lat: 46.1875, lng: 13.7322 },
        { lat: 46.2100, lng: 13.6700 },
        { lat: 46.2472, lng: 13.5781 },
      ],
      distanceKm: 28.1,
      durationSec: 3600,
      notes: 'Gravel track along the Soča river.',
      createdAt: 1710086400,
    }),
    PlannedRoute.from({
      id: generateId(),
      userId: undefined,
      name: 'Ljubljana Ring Road',
      waypoints: [
        { id: 'wp-6', name: 'Ljubljana Center', lat: 46.0569, lng: 14.5058 },
        { id: 'wp-7', name: 'Šmarna Gora', lat: 46.1189, lng: 14.4631 },
      ],
      mode: 'paved',
      geometry: [
        { lat: 46.0569, lng: 14.5058 },
        { lat: 46.0800, lng: 14.4900 },
        { lat: 46.1189, lng: 14.4631 },
      ],
      distanceKm: 18.7,
      durationSec: 1800,
      notes: undefined,
      createdAt: 1710172800,
    }),
  ];
}
