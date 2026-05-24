import type { PlannedRoute } from '@markec/routes.entities.planned-route';

export const mockPlannedRoute: PlannedRoute = {
  id: `route-alpine-loop-2024`,
  name: `Alpine Loop 2024`,
  userId: `user-marco-46`,
  waypoints: [
    { id: `wp-1`, name: `Innsbruck`, lat: 47.2692, lng: 11.4041 },
    { id: `wp-2`, name: `Brenner Pass`, lat: 47.0016, lng: 11.5069 },
    { id: `wp-3`, name: `Bolzano`, lat: 46.4983, lng: 11.3548 },
  ],
  mode: `twisty`,
  geometry: [
    { lat: 47.2692, lng: 11.4041 },
    { lat: 47.1, lng: 11.45 },
    { lat: 47.0016, lng: 11.5069 },
    { lat: 46.7, lng: 11.43 },
    { lat: 46.4983, lng: 11.3548 },
  ],
  distanceKm: 248,
  durationSec: 10800,
  notes: `Stunning alpine scenery with tight switchbacks. Best ridden in summer.`,
  createdAt: 1720000000,
};

export const mockSharedRouteDetails = {
  code: `MT7X9K`,
  qrUrl: `https://storage.googleapis.com/bit-generated-images/images/image_a_clean_qr_code_on_a_dark_navy_0_1779627051957.png`,
  expiresAt: Math.floor(Date.now() / 1000) + 86400,
};

export const mockShortRoute: PlannedRoute = {
  id: `route-city-sprint`,
  name: `City Sprint`,
  userId: `user-marco-46`,
  waypoints: [
    { id: `wp-a`, name: `Start`, lat: 48.2082, lng: 16.3738 },
    { id: `wp-b`, name: `Finish`, lat: 48.2, lng: 16.4 },
  ],
  mode: `paved`,
  geometry: [
    { lat: 48.2082, lng: 16.3738 },
    { lat: 48.204, lng: 16.387 },
    { lat: 48.2, lng: 16.4 },
  ],
  distanceKm: 12,
  durationSec: 1800,
  notes: `Quick city loop.`,
  createdAt: 1720100000,
};
