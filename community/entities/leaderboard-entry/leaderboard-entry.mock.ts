import { LeaderboardEntry } from './leaderboard-entry.js';
import type { PlainLeaderboardEntry } from './leaderboard-entry.js';

export function mockLeaderboardEntries(
  overrides: Partial<PlainLeaderboardEntry>[] = [],
): LeaderboardEntry[] {
  const defaults: PlainLeaderboardEntry[] = [
    {
      rank: 1,
      userId: 'user-001',
      displayName: 'Alex Rider',
      country: 'DE',
      km: 12450.5,
      rides: 312,
      points: 9870,
      me: false,
    },
    {
      rank: 2,
      userId: 'user-002',
      displayName: 'Maria Biker',
      country: 'ES',
      km: 10320.0,
      rides: 278,
      points: 8540,
      me: true,
    },
    {
      rank: 3,
      userId: 'user-003',
      displayName: 'Luca Moto',
      country: 'IT',
      km: 9875.3,
      rides: 245,
      points: 7920,
      me: false,
    },
    {
      rank: 4,
      userId: 'user-004',
      displayName: 'Sophie Wheels',
      country: 'FR',
      km: 8640.8,
      rides: 210,
      points: 6750,
      me: false,
    },
    {
      rank: 5,
      userId: 'user-005',
      displayName: 'Jan Roadster',
      country: 'PL',
      km: 7200.1,
      rides: 188,
      points: 5430,
      me: false,
    },
  ];

  return defaults.map((entry, index) =>
    LeaderboardEntry.from({ ...entry, ...(overrides[index] ?? {}) }),
  );
}

export function mockLeaderboardEntry(
  overrides: Partial<PlainLeaderboardEntry> = {},
): LeaderboardEntry {
  return LeaderboardEntry.from({
    rank: 1,
    userId: 'user-001',
    displayName: 'Alex Rider',
    country: 'DE',
    km: 12450.5,
    rides: 312,
    points: 9870,
    me: false,
    ...overrides,
  });
}
