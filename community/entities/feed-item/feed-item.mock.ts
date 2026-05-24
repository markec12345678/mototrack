import { FeedItem } from './feed-item.js';
import type { PlainFeedItem } from './feed-item.js';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function mockFeedItem(overrides: Partial<PlainFeedItem> = {}): FeedItem {
  const defaults: PlainFeedItem = {
    id: uid(),
    kind: 'ride',
    actor: {
      id: uid(),
      displayName: 'Sam Rider',
      country: 'DE',
    },
    payload: JSON.stringify({ distanceKm: 142, durationSec: 5400, routeName: 'Alpine Loop' }),
    at: Date.now(),
  };

  return FeedItem.from({ ...defaults, ...overrides });
}

export function mockFeedItems(): FeedItem[] {
  const now = Date.now();

  return [
    mockFeedItem({
      kind: 'ride',
      actor: { id: 'user-1', displayName: 'Sam Rider', country: 'DE' },
      payload: JSON.stringify({ distanceKm: 142, durationSec: 5400, routeName: 'Alpine Loop' }),
      at: now - 1000 * 60 * 5,
    }),
    mockFeedItem({
      kind: 'achievement',
      actor: { id: 'user-2', displayName: 'Maria Cruz', country: 'ES' },
      payload: JSON.stringify({ achievementId: 'ach-iron-rider', achievementName: 'Iron Rider', icon: '🏅' }),
      at: now - 1000 * 60 * 30,
    }),
    mockFeedItem({
      kind: 'challenge',
      actor: { id: 'user-3', displayName: 'Luca Bianchi', country: 'IT' },
      payload: JSON.stringify({ challengeId: 'chal-1000km', challengeName: '1000 km in a Month', points: 500 }),
      at: now - 1000 * 60 * 60 * 2,
    }),
    mockFeedItem({
      kind: 'group_ride',
      actor: { id: 'user-4', displayName: 'Anna Müller', country: 'AT' },
      payload: JSON.stringify({ groupRideId: 'gr-weekend', name: 'Weekend Blast', startAt: now + 1000 * 60 * 60 * 48 }),
      at: now - 1000 * 60 * 60 * 5,
    }),
    mockFeedItem({
      kind: 'fuel_price',
      actor: { id: 'user-5', displayName: 'Pierre Dupont', country: 'FR' },
      payload: JSON.stringify({ brand: 'Total', petrolEur: 1.82, dieselEur: 1.74, location: 'Lyon' }),
      at: now - 1000 * 60 * 60 * 12,
    }),
  ].sort((a, b) => b.at - a.at);
}
