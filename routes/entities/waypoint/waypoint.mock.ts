import { Waypoint } from './waypoint.js';
import type { PlainWaypoint } from './waypoint.js';

export function mockWaypoint(overrides: Partial<PlainWaypoint> = {}): Waypoint {
  return Waypoint.from({
    id: 'wp-mock-0001',
    name: 'Eiffel Tower',
    lat: 48.8584,
    lng: 2.2945,
    ...overrides,
  });
}

export function mockWaypoints(overrides: Partial<PlainWaypoint>[] = []): Waypoint[] {
  const defaults: PlainWaypoint[] = [
    {
      id: 'wp-mock-0001',
      name: 'Eiffel Tower',
      lat: 48.8584,
      lng: 2.2945,
    },
    {
      id: 'wp-mock-0002',
      name: 'Louvre Museum',
      lat: 48.8606,
      lng: 2.3376,
    },
    {
      id: 'wp-mock-0003',
      name: 'Notre-Dame Cathedral',
      lat: 48.853,
      lng: 2.3499,
    },
    {
      id: 'wp-mock-0004',
      name: undefined,
      lat: 48.8738,
      lng: 2.295,
    },
  ];

  return defaults.map((d, i) => Waypoint.from({ ...d, ...(overrides[i] ?? {}) }));
}
