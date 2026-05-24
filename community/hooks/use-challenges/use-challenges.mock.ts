import { Challenge } from '@markec/community.entities.challenge';

const now = Date.now();
const day = 86_400_000;

/**
 * Mock challenge data for use in tests and compositions.
 */
export const mockChallenges: Challenge[] = [
  {
    id: 'challenge-1',
    name: 'Balkanski Tour',
    description: 'Ride through 5 Balkan countries in a single season.',
    icon: '🏍️',
    points: 500,
    status: 'active',
    endsAt: now + 30 * day,
    participants: 142,
    joined: true,
    progressPct: 60,
  },
  {
    id: 'challenge-2',
    name: 'Vršič 50 Serpentin',
    description: 'Conquer all 50 hairpin bends of the legendary Vršič Pass.',
    icon: '⛰️',
    points: 300,
    status: 'active',
    endsAt: now + 14 * day,
    participants: 87,
    joined: false,
    progressPct: 0,
  },
  {
    id: 'challenge-3',
    name: 'Marec Na Motorju',
    description: 'Log at least one ride every day during March.',
    icon: '📅',
    points: 200,
    status: 'past',
    endsAt: now - 5 * day,
    participants: 310,
    joined: true,
    progressPct: 100,
  },
  {
    id: 'challenge-4',
    name: 'Jutranja Serija',
    description: 'Complete 10 morning rides before 8 AM.',
    icon: '🌅',
    points: 150,
    status: 'completed',
    endsAt: now - 20 * day,
    participants: 55,
    joined: true,
    progressPct: 100,
  },
] as Challenge[];

export const mockActiveChallenges: Challenge[] = mockChallenges.filter(
  (c) => c.status === 'active'
);

export const mockPastChallenges: Challenge[] = mockChallenges.filter(
  (c) => c.status === 'past' || c.status === 'completed'
);
