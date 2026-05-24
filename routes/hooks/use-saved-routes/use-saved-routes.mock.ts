import { PlannedRoute } from '@markec/routes.entities.planned-route';

/**
 * A collection of mock PlannedRoute instances for use in tests and compositions.
 */
export const mockRoutes: PlannedRoute[] = [
  PlannedRoute.from({
    id: 'route-001',
    userId: 'user-42',
    name: 'Vršič Pass Loop',
    waypoints: [
      { id: 'wp-1', name: 'Kranjska Gora', lat: 46.4839, lng: 13.7864 },
      { id: 'wp-2', name: 'Vršič Pass', lat: 46.4378, lng: 13.7447 },
      { id: 'wp-3', name: 'Bovec', lat: 46.3382, lng: 13.5526 },
    ],
    mode: 'twisty',
    geometry: [
      { lat: 46.4839, lng: 13.7864 },
      { lat: 46.4608, lng: 13.7655 },
      { lat: 46.4378, lng: 13.7447 },
      { lat: 46.3900, lng: 13.6487 },
      { lat: 46.3382, lng: 13.5526 },
    ],
    distanceKm: 47.3,
    durationSec: 5400,
    notes: 'Spectacular alpine pass — best in summer. 50 hairpin bends on the north side.',
    createdAt: 1_710_000_000,
  }),
  PlannedRoute.from({
    id: 'route-002',
    userId: 'user-42',
    name: 'Soča Valley Cruise',
    waypoints: [
      { id: 'wp-4', name: 'Tolmin', lat: 46.1869, lng: 13.7322 },
      { id: 'wp-5', name: 'Kobarid', lat: 46.2466, lng: 13.5780 },
      { id: 'wp-6', name: 'Bovec', lat: 46.3382, lng: 13.5526 },
    ],
    mode: 'paved',
    geometry: [
      { lat: 46.1869, lng: 13.7322 },
      { lat: 46.2168, lng: 13.6551 },
      { lat: 46.2466, lng: 13.5780 },
      { lat: 46.2924, lng: 13.5653 },
      { lat: 46.3382, lng: 13.5526 },
    ],
    distanceKm: 31.8,
    durationSec: 2700,
    notes: 'Turquoise river alongside the whole route. Smooth tarmac.',
    createdAt: 1_712_500_000,
  }),
  PlannedRoute.from({
    id: 'route-003',
    userId: 'user-42',
    name: 'Nanos Plateau Offroad',
    waypoints: [
      { id: 'wp-7', name: 'Postojna', lat: 45.7742, lng: 14.2149 },
      { id: 'wp-8', name: 'Nanos Summit', lat: 45.7817, lng: 14.0594 },
      { id: 'wp-9', name: 'Vipava', lat: 45.8453, lng: 13.9614 },
    ],
    mode: 'offroad',
    geometry: [
      { lat: 45.7742, lng: 14.2149 },
      { lat: 45.7779, lng: 14.1372 },
      { lat: 45.7817, lng: 14.0594 },
      { lat: 45.8135, lng: 14.0104 },
      { lat: 45.8453, lng: 13.9614 },
    ],
    distanceKm: 22.6,
    durationSec: 3600,
    notes: 'Gravel forest tracks with panoramic views over the Vipava Valley.',
    createdAt: 1_715_000_000,
  }),
];

/**
 * A minimal mock result that mirrors the shape returned by useSavedRoutes,
 * useful for testing components that consume the hook.
 */
export const mockUseSavedRoutesResult = {
  routes: mockRoutes,
  loading: false,
  error: undefined,
  refetch: () => {},
  save: async () => mockRoutes[0],
  saving: false,
  deleteRoute: (_id: string) => {},
  update: async () => mockRoutes[0],
};
