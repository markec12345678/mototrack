import { describe, it, expect } from 'vitest';
import { LeaderboardEntry } from './leaderboard-entry.js';
import { mockLeaderboardEntry, mockLeaderboardEntries } from './leaderboard-entry.mock.js';

describe('LeaderboardEntry', () => {
  it('should have a static from() method', () => {
    expect(LeaderboardEntry.from).toBeTruthy();
  });

  it('should create a LeaderboardEntry from a plain object', () => {
    const entry = LeaderboardEntry.from({
      rank: 1,
      userId: 'user-abc',
      displayName: 'Test Rider',
      country: 'US',
      km: 5000,
      rides: 100,
      points: 3000,
      me: true,
    });

    expect(entry).toBeInstanceOf(LeaderboardEntry);
    expect(entry.rank).toBe(1);
    expect(entry.userId).toBe('user-abc');
    expect(entry.displayName).toBe('Test Rider');
    expect(entry.country).toBe('US');
    expect(entry.km).toBe(5000);
    expect(entry.rides).toBe(100);
    expect(entry.points).toBe(3000);
    expect(entry.me).toBe(true);
  });

  it('should default me to false when not provided', () => {
    const entry = LeaderboardEntry.from({
      rank: 2,
      userId: 'user-xyz',
      displayName: 'Another Rider',
      country: 'GB',
      km: 2000,
      rides: 50,
      points: 1500,
    });

    expect(entry.me).toBe(false);
  });

  it('should expose id as a virtual property returning userId', () => {
    const entry = LeaderboardEntry.from({
      rank: 1,
      userId: 'user-virtual-id',
      displayName: 'Virtual Rider',
      country: 'AU',
      km: 1000,
      rides: 20,
      points: 500,
    });

    expect(entry.id).toBe('user-virtual-id');
  });

  it('should serialize to a plain object via toObject()', () => {
    const plain = {
      rank: 3,
      userId: 'user-serialize',
      displayName: 'Serialize Rider',
      country: 'CA',
      km: 3500.75,
      rides: 80,
      points: 2200,
      me: false,
    };

    const entry = LeaderboardEntry.from(plain);
    const obj = entry.toObject();

    expect(obj.id).toBe('user-serialize');
    expect(obj.rank).toBe(3);
    expect(obj.userId).toBe('user-serialize');
    expect(obj.displayName).toBe('Serialize Rider');
    expect(obj.country).toBe('CA');
    expect(obj.km).toBe(3500.75);
    expect(obj.rides).toBe(80);
    expect(obj.points).toBe(2200);
    expect(obj.me).toBe(false);
  });

  it('should handle safe destructuring with default empty values', () => {
    const entry = LeaderboardEntry.from({} as any);

    expect(entry.rank).toBe(0);
    expect(entry.userId).toBe('');
    expect(entry.displayName).toBe('');
    expect(entry.country).toBe('');
    expect(entry.km).toBe(0);
    expect(entry.rides).toBe(0);
    expect(entry.points).toBe(0);
    expect(entry.me).toBe(false);
  });

  it('should create a single mock entry using mockLeaderboardEntry()', () => {
    const entry = mockLeaderboardEntry();

    expect(entry).toBeInstanceOf(LeaderboardEntry);
    expect(entry.rank).toBe(1);
    expect(entry.displayName).toBe('Alex Rider');
  });

  it('should allow overriding mock entry properties', () => {
    const entry = mockLeaderboardEntry({ rank: 10, displayName: 'Custom Rider', country: 'NL' });

    expect(entry.rank).toBe(10);
    expect(entry.displayName).toBe('Custom Rider');
    expect(entry.country).toBe('NL');
  });

  it('should create multiple mock entries using mockLeaderboardEntries()', () => {
    const entries = mockLeaderboardEntries();

    expect(entries).toHaveLength(5);
    entries.forEach((entry) => expect(entry).toBeInstanceOf(LeaderboardEntry));
  });

  it('should allow overriding individual mock entries in the list', () => {
    const entries = mockLeaderboardEntries([{ displayName: 'Override First' }]);

    expect(entries[0].displayName).toBe('Override First');
    expect(entries[1].displayName).toBe('Maria Biker');
  });
});
