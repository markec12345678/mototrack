import { CommunityRoute } from './community-route.js';
import type { PlainCommunityRoute } from './community-route.js';

function generateId(seed: number): string {
  const hex = seed.toString(16).padStart(8, '0');
  return `route-${hex}-0000-4000-8000-000000000000`;
}

const SEEDED_ROUTES: PlainCommunityRoute[] = [
  {
    id: generateId(1),
    name: 'Skrita Logarska',
    author: 'MarkoP',
    country: 'SI',
    distanceKm: 87.4,
    durationSec: 9000,
    difficulty: 'hard',
    rating: 4.8,
    likes: 312,
    geometry: [
      { lat: 46.3955, lng: 14.6342 },
      { lat: 46.4012, lng: 14.6501 },
      { lat: 46.4198, lng: 14.6723 },
      { lat: 46.4401, lng: 14.6912 },
      { lat: 46.4589, lng: 14.7134 },
    ],
  },
  {
    id: generateId(2),
    name: 'Durmitor Zanka',
    author: 'NikolaM',
    country: 'ME',
    distanceKm: 134.2,
    durationSec: 14400,
    difficulty: 'expert',
    rating: 4.9,
    likes: 487,
    geometry: [
      { lat: 43.1522, lng: 19.0144 },
      { lat: 43.1634, lng: 19.0312 },
      { lat: 43.1789, lng: 19.0521 },
      { lat: 43.1923, lng: 19.0734 },
      { lat: 43.2101, lng: 19.0912 },
    ],
  },
  {
    id: generateId(3),
    name: 'Plitvička Jezera',
    author: 'IvanH',
    country: 'HR',
    distanceKm: 62.7,
    durationSec: 7200,
    difficulty: 'moderate',
    rating: 4.6,
    likes: 228,
    geometry: [
      { lat: 44.8654, lng: 15.5820 },
      { lat: 44.8712, lng: 15.5934 },
      { lat: 44.8801, lng: 15.6102 },
      { lat: 44.8934, lng: 15.6289 },
      { lat: 44.9056, lng: 15.6412 },
    ],
  },
  {
    id: generateId(4),
    name: 'Pirin Enduro',
    author: 'StoyanB',
    country: 'BG',
    distanceKm: 109.5,
    durationSec: 11700,
    difficulty: 'hard',
    rating: 4.7,
    likes: 391,
    geometry: [
      { lat: 41.7234, lng: 23.4812 },
      { lat: 41.7389, lng: 23.4967 },
      { lat: 41.7512, lng: 23.5134 },
      { lat: 41.7678, lng: 23.5312 },
      { lat: 41.7823, lng: 23.5489 },
    ],
  },
];

export function mockCommunityRoutes(
  overrides: Partial<PlainCommunityRoute>[] = [],
): CommunityRoute[] {
  return SEEDED_ROUTES.map((route, index) =>
    CommunityRoute.from({ ...route, ...(overrides[index] ?? {}) }),
  );
}

export function mockCommunityRoute(
  overrides: Partial<PlainCommunityRoute> = {},
): CommunityRoute {
  return CommunityRoute.from({ ...SEEDED_ROUTES[0], ...overrides });
}
