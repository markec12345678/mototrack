import { FeedItem } from '@markec/community.entities.feed-item';

const now = Date.now();

export const feedItemMocks: FeedItem[] = [
  FeedItem.from({
    id: 'feed-1',
    kind: 'ride_completed',
    actor: {
      id: 'user-1',
      displayName: 'Marco Bianchi',
      country: 'IT',
    },
    payload: JSON.stringify({
      distanceKm: 312,
      durationSec: 14400,
      routeName: 'Transfagarasan Highway',
    }),
    at: now - 1000 * 60 * 30,
  }),
  FeedItem.from({
    id: 'feed-2',
    kind: 'achievement_unlocked',
    actor: {
      id: 'user-2',
      displayName: 'Luka Horvat',
      country: 'SI',
    },
    payload: JSON.stringify({
      achievementName: 'Vrsic Conqueror',
      icon: '🏔️',
    }),
    at: now - 1000 * 60 * 60 * 2,
  }),
  FeedItem.from({
    id: 'feed-3',
    kind: 'group_ride_created',
    actor: {
      id: 'user-3',
      displayName: 'Carlos Ruiz',
      country: 'ES',
    },
    payload: JSON.stringify({
      rideName: 'Balkanski Tour Kickoff',
      meetingPoint: 'Ljubljana, Slovenia',
      participants: 7,
    }),
    at: now - 1000 * 60 * 60 * 5,
  }),
  FeedItem.from({
    id: 'feed-4',
    kind: 'challenge_joined',
    actor: {
      id: 'user-4',
      displayName: 'Jan Novak',
      country: 'CZ',
    },
    payload: JSON.stringify({
      challengeName: 'Vrsic 50 Serpentin',
      points: 500,
    }),
    at: now - 1000 * 60 * 60 * 8,
  }),
  FeedItem.from({
    id: 'feed-5',
    kind: 'route_rated',
    actor: {
      id: 'user-5',
      displayName: 'Tomas Kovac',
      country: 'SK',
    },
    payload: JSON.stringify({
      routeName: 'Durmitor Zanka',
      rating: 4.8,
      comment: 'Absolutely breathtaking twisties through the canyon!',
    }),
    at: now - 1000 * 60 * 60 * 12,
  }),
];
