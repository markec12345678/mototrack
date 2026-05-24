import { CommunityRoute } from '@markec/community.entities.community-route';
import { RouteRating } from '@markec/community.entities.route-rating';

export const mockRoutes: CommunityRoute[] = [
  CommunityRoute.from({
    id: 'route-001',
    name: 'Skrita Logarska',
    author: 'marko_rides',
    country: 'SI',
    distanceKm: 87.4,
    durationSec: 6300,
    difficulty: 'medium',
    rating: 4.8,
    likes: 142,
    geometry: [
      { lat: 46.3897, lng: 14.6303 },
      { lat: 46.4012, lng: 14.6521 },
      { lat: 46.4231, lng: 14.6789 },
    ],
  }),
  CommunityRoute.from({
    id: 'route-002',
    name: 'Durmitor Zanka',
    author: 'crna_gora_moto',
    country: 'ME',
    distanceKm: 134.2,
    durationSec: 10800,
    difficulty: 'hard',
    rating: 4.6,
    likes: 98,
    geometry: [
      { lat: 43.1522, lng: 19.0139 },
      { lat: 43.1734, lng: 19.0456 },
      { lat: 43.1901, lng: 19.0712 },
    ],
  }),
  CommunityRoute.from({
    id: 'route-003',
    name: 'Plitvicka Jezera',
    author: 'hrvatska_moto',
    country: 'HR',
    distanceKm: 62.1,
    durationSec: 4500,
    difficulty: 'easy',
    rating: 4.9,
    likes: 211,
    geometry: [
      { lat: 44.8654, lng: 15.582 },
      { lat: 44.8801, lng: 15.6012 },
      { lat: 44.8923, lng: 15.6234 },
    ],
  }),
  CommunityRoute.from({
    id: 'route-004',
    name: 'Pirin Enduro',
    author: 'balkan_rider',
    country: 'BG',
    distanceKm: 109.7,
    durationSec: 9000,
    difficulty: 'hard',
    rating: 4.3,
    likes: 67,
    geometry: [
      { lat: 41.7407, lng: 23.4804 },
      { lat: 41.7612, lng: 23.5021 },
      { lat: 41.7834, lng: 23.5289 },
    ],
  }),
];

export const mockRouteRating: RouteRating = RouteRating.from({
  id: 'rating-001',
  routeId: 'route-001',
  userId: 'user-123',
  quality: 5,
  scenery: 5,
  twistiness: 4,
  difficulty: 3,
  comment: 'Absolutely stunning route through the valley!',
  createdAt: 1718000000000,
});
