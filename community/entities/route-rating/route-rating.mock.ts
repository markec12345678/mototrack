import { RouteRating } from './route-rating.js';
import type { PlainRouteRating } from './route-rating.js';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function mockRouteRatings(overrides: Partial<PlainRouteRating> = {}): RouteRating[] {
  return [
    RouteRating.from({
      id: generateId(),
      routeId: 'route-001',
      userId: 'user-abc',
      quality: 5,
      scenery: 5,
      twistiness: 4,
      difficulty: 3,
      comment: 'Absolutely stunning road through the mountains!',
      createdAt: Date.now() - 86_400_000,
      ...overrides,
    }),
    RouteRating.from({
      id: generateId(),
      routeId: 'route-002',
      userId: 'user-def',
      quality: 4,
      scenery: 3,
      twistiness: 5,
      difficulty: 4,
      comment: 'Very twisty and technical, loved every corner.',
      createdAt: Date.now() - 172_800_000,
      ...overrides,
    }),
    RouteRating.from({
      id: generateId(),
      routeId: 'route-003',
      userId: 'user-ghi',
      quality: 3,
      scenery: 4,
      twistiness: 2,
      difficulty: 1,
      comment: undefined,
      createdAt: Date.now() - 259_200_000,
      ...overrides,
    }),
  ];
}

export function mockRouteRating(overrides: Partial<PlainRouteRating> = {}): RouteRating {
  return RouteRating.from({
    id: generateId(),
    routeId: 'route-001',
    userId: 'user-abc',
    quality: 5,
    scenery: 5,
    twistiness: 4,
    difficulty: 3,
    comment: 'Absolutely stunning road through the mountains!',
    createdAt: Date.now(),
    ...overrides,
  });
}
