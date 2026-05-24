import { Waypoint } from '@markec/routes.entities.waypoint';

export const mockWaypoints: Waypoint[] = [
  Waypoint.from({ id: `wp-1`, name: `Ljubljana - Kongresni trg`, lat: 46.05108, lng: 14.50513 }),
  Waypoint.from({ id: `wp-2`, name: `Trojane pocivalisce`, lat: 46.19424, lng: 14.87631 }),
  Waypoint.from({ id: `wp-3`, name: `Vransko`, lat: 46.24512, lng: 14.95083 }),
  Waypoint.from({ id: `wp-4`, name: `Celje - center`, lat: 46.23051, lng: 15.26380 }),
  Waypoint.from({ id: `wp-5`, name: `Maribor - Lent`, lat: 46.55472, lng: 15.64667 }),
];

export const mockTwoWaypoints: Waypoint[] = [
  Waypoint.from({ id: `wp-a`, name: `Start - Koper`, lat: 45.54694, lng: 13.72944 }),
  Waypoint.from({ id: `wp-b`, name: `End - Piran`, lat: 45.52861, lng: 13.56833 }),
];
