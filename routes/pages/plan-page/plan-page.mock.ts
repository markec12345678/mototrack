import { Waypoint } from '@markec/routes.entities.waypoint';

export const mockWaypointsLjubljanaMariborLoop: Waypoint[] = [
  Waypoint.from({ id: `wp-1`, name: `Ljubljana - Tivoli`, lat: 46.0569, lng: 14.5058 }),
  Waypoint.from({ id: `wp-2`, name: `Trojane`, lat: 46.1897, lng: 14.8747 }),
  Waypoint.from({ id: `wp-3`, name: `Celje`, lat: 46.2311, lng: 15.2677 }),
  Waypoint.from({ id: `wp-4`, name: `Maribor - Lent`, lat: 46.5547, lng: 15.6459 }),
];

export const mockWaypointsSocaValley: Waypoint[] = [
  Waypoint.from({ id: `sv-1`, name: `Nova Gorica`, lat: 45.9564, lng: 13.6481 }),
  Waypoint.from({ id: `sv-2`, name: `Tolmin`, lat: 46.1853, lng: 13.7322 }),
  Waypoint.from({ id: `sv-3`, name: `Bovec`, lat: 46.3378, lng: 13.5522 }),
  Waypoint.from({ id: `sv-4`, name: `Vršič Pass`, lat: 46.4378, lng: 13.7447 }),
];

export const mockWaypointsEmpty: Waypoint[] = [];
