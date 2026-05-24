import { LeaderboardEntry } from '@markec/community.entities.leaderboard-entry';

export const mockLeaderboardEntries: LeaderboardEntry[] = [
  LeaderboardEntry.from({
    rank: 1,
    userId: `user-001`,
    displayName: `Luka Horvat`,
    country: `🇸🇮 SI`,
    km: 1248,
    rides: 9,
    points: 3120,
    me: false,
  }),
  LeaderboardEntry.from({
    rank: 2,
    userId: `user-002`,
    displayName: `Marco Bianchi`,
    country: `🇮🇹 IT`,
    km: 1105,
    rides: 7,
    points: 2760,
    me: false,
  }),
  LeaderboardEntry.from({
    rank: 3,
    userId: `user-003`,
    displayName: `Carlos Ruiz`,
    country: `🇪🇸 ES`,
    km: 987,
    rides: 6,
    points: 2468,
    me: true,
  }),
  LeaderboardEntry.from({
    rank: 4,
    userId: `user-004`,
    displayName: `Jan Novák`,
    country: `🇨🇿 CZ`,
    km: 834,
    rides: 5,
    points: 2085,
    me: false,
  }),
  LeaderboardEntry.from({
    rank: 5,
    userId: `user-005`,
    displayName: `Tomáš Kováč`,
    country: `🇸🇰 SK`,
    km: 712,
    rides: 4,
    points: 1780,
    me: false,
  }),
];

export const mockLeaderboardEntriesNoMe: LeaderboardEntry[] = mockLeaderboardEntries.map(
  (e) =>
    LeaderboardEntry.from({
      rank: e.rank,
      userId: e.userId,
      displayName: e.displayName,
      country: e.country,
      km: e.km,
      rides: e.rides,
      points: e.points,
      me: false,
    })
);
