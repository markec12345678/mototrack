import { PlannedRoute } from '@markec/routes.entities.planned-route';
import { SharedRouteDetails } from './use-route-share.js';

const mockWaypoints = [
  { id: 'wp-1', name: 'Ljubljana', lat: 46.0569, lng: 14.5058 },
  { id: 'wp-2', name: 'Bled', lat: 46.3683, lng: 14.1146 },
];

const mockGeometry = [
  { lat: 46.0569, lng: 14.5058 },
  { lat: 46.1, lng: 14.35 },
  { lat: 46.3683, lng: 14.1146 },
];

/**
 * A mock PlannedRoute for use in tests and compositions.
 */
export const mockPlannedRoute: PlannedRoute = PlannedRoute.from({
  id: 'route-mock-001',
  userId: 'user-001',
  name: 'Ljubljana → Bled',
  waypoints: mockWaypoints,
  mode: 'twisty',
  geometry: mockGeometry,
  distanceKm: 57.4,
  durationSec: 3240,
  notes: 'Scenic mountain route through the Julian Alps.',
  createdAt: 1_700_000_000,
});

/**
 * A mock SharedRouteDetails returned by the share() function.
 */
export const mockSharedRouteDetails: SharedRouteDetails = {
  code: 'MT4X2Z',
  qrUrl:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  expiresAt: 1_700_086_400,
};

/**
 * A mock ShareRouteInput matching the mockPlannedRoute.
 */
export const mockShareRouteInput = {
  name: 'Ljubljana → Bled',
  waypoints: mockWaypoints,
  mode: 'twisty',
  geometry: mockGeometry,
  distanceKm: 57.4,
  durationSec: 3240,
  notes: 'Scenic mountain route through the Julian Alps.',
};
