import type { LeaderboardEntry } from '@markec/community.entities.leaderboard-entry';

export const mockLeaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: `user-001`,
    displayName: `Luka Horvat`,
    country: `SI`,
    km: 4820,
    rides: 87,
    points: 12450,
    me: false,
  },
  {
    rank: 2,
    userId: `user-002`,
    displayName: `Marko Petrović`,
    country: `RS`,
    km: 4310,
    rides: 74,
    points: 11200,
    me: false,
  },
  {
    rank: 3,
    userId: `user-003`,
    displayName: `Ivan Kovač`,
    country: `HR`,
    km: 3980,
    rides: 68,
    points: 10750,
    me: false,
  },
  {
    rank: 4,
    userId: `user-004`,
    displayName: `Nikola Dimitrov`,
    country: `MK`,
    km: 3540,
    rides: 61,
    points: 9800,
    me: false,
  },
  {
    rank: 5,
    userId: `user-005`,
    displayName: `Aris Papadopoulos`,
    country: `GR`,
    km: 3210,
    rides: 55,
    points: 8950,
    me: false,
  },
  {
    rank: 6,
    userId: `user-006`,
    displayName: `Bogdan Ionescu`,
    country: `RO`,
    km: 2980,
    rides: 49,
    points: 8100,
    me: false,
  },
  {
    rank: 7,
    userId: `user-007`,
    displayName: `Emir Begić`,
    country: `BA`,
    km: 2750,
    rides: 44,
    points: 7600,
    me: false,
  },
  {
    rank: 8,
    userId: `user-008`,
    displayName: `Arben Krasniqi`,
    country: `AL`,
    km: 2490,
    rides: 40,
    points: 6900,
    me: false,
  },
  {
    rank: 9,
    userId: `user-009`,
    displayName: `Stefan Georgiev`,
    country: `BG`,
    km: 2230,
    rides: 36,
    points: 6200,
    me: false,
  },
  {
    rank: 10,
    userId: `user-010`,
    displayName: `Dario Vuković`,
    country: `ME`,
    km: 1980,
    rides: 31,
    points: 5500,
    me: false,
  },
];

export const mockLeaderboardEntriesWithMe: LeaderboardEntry[] = mockLeaderboardEntries.map(
  (entry) => ({
    ...entry,
    me: entry.rank === 5,
  })
);

export const mockLeaderboardEntriesTopMe: LeaderboardEntry[] = mockLeaderboardEntries.map(
  (entry) => ({
    ...entry,
    me: entry.rank === 1,
  })
);
