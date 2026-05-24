import { Challenge } from './challenge.js';
import type { PlainChallenge } from './challenge.js';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

const seedChallenges: PlainChallenge[] = [
  {
    id: 'balkanski-tour-001',
    name: 'Balkanski Tour',
    description:
      'Complete a multi-day motorcycle tour through the Balkans, covering at least 1,000 km across three or more countries.',
    icon: '🏔️',
    points: 500,
    status: 'active',
    endsAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    participants: 214,
    joined: false,
    progressPct: 0,
  },
  {
    id: 'vrsic-50-serpentin-002',
    name: 'Vršič 50 Serpentin',
    description:
      'Conquer all 50 hairpin bends of the legendary Vršič Pass in Slovenia in a single ride.',
    icon: '🌀',
    points: 350,
    status: 'active',
    endsAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
    participants: 87,
    joined: true,
    progressPct: 42,
  },
  {
    id: 'marec-na-motorju-003',
    name: 'Marec Na Motorju',
    description:
      'Log at least one ride every day during the month of March to celebrate the start of the riding season.',
    icon: '🌱',
    points: 200,
    status: 'upcoming',
    endsAt: Date.now() + 60 * 24 * 60 * 60 * 1000,
    participants: 312,
    joined: false,
    progressPct: 0,
  },
  {
    id: 'jutranja-serija-004',
    name: 'Jutranja Serija',
    description:
      'Complete 10 morning rides (before 9 AM) within a single month to earn the Early Rider badge.',
    icon: '🌅',
    points: 150,
    status: 'active',
    endsAt: Date.now() + 21 * 24 * 60 * 60 * 1000,
    participants: 156,
    joined: true,
    progressPct: 70,
  },
];

export function mockChallenges(overrides: Partial<PlainChallenge>[] = []): Challenge[] {
  return seedChallenges.map((seed, index) => {
    const override = overrides[index] ?? {};
    return Challenge.from({ ...seed, ...override });
  });
}

export function mockChallenge(override: Partial<PlainChallenge> = {}): Challenge {
  const base = seedChallenges[0];
  return Challenge.from({
    ...base,
    id: generateId(),
    ...override,
  });
}
