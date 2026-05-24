import { describe, it, expect } from 'vitest';
import { Challenge } from './challenge.js';
import { mockChallenge, mockChallenges } from './challenge.mock.js';

describe('Challenge', () => {
  it('has a Challenge.from() static method', () => {
    expect(Challenge.from).toBeTruthy();
  });

  it('creates a Challenge instance from a plain object', () => {
    const plain = {
      id: 'test-001',
      name: 'Test Challenge',
      description: 'A test challenge.',
      icon: '🏁',
      points: 100,
      status: 'active',
      endsAt: 1_700_000_000_000,
      participants: 10,
      joined: false,
      progressPct: 0,
    };

    const challenge = Challenge.from(plain);

    expect(challenge).toBeInstanceOf(Challenge);
    expect(challenge.id).toBe('test-001');
    expect(challenge.name).toBe('Test Challenge');
    expect(challenge.description).toBe('A test challenge.');
    expect(challenge.icon).toBe('🏁');
    expect(challenge.points).toBe(100);
    expect(challenge.status).toBe('active');
    expect(challenge.endsAt).toBe(1_700_000_000_000);
    expect(challenge.participants).toBe(10);
    expect(challenge.joined).toBe(false);
    expect(challenge.progressPct).toBe(0);
  });

  it('applies default values for optional fields when missing', () => {
    const challenge = Challenge.from({
      id: 'defaults-001',
      name: 'Defaults Challenge',
      description: 'Testing defaults.',
      icon: '⭐',
      points: 50,
      status: 'active',
      endsAt: 0,
      participants: 0,
    });

    expect(challenge.joined).toBe(false);
    expect(challenge.progressPct).toBe(0);
  });

  it('serializes to a plain object via toObject()', () => {
    const plain = {
      id: 'serial-001',
      name: 'Serialization Test',
      description: 'Checks toObject.',
      icon: '🔧',
      points: 75,
      status: 'completed',
      endsAt: 1_600_000_000_000,
      participants: 5,
      joined: true,
      progressPct: 100,
    };

    const challenge = Challenge.from(plain);
    const obj = challenge.toObject();

    expect(obj).toEqual(plain);
  });

  it('toObject() includes the id property', () => {
    const challenge = Challenge.from({
      id: 'id-check-001',
      name: 'ID Check',
      description: 'Ensures id is in toObject.',
      icon: '🆔',
      points: 0,
      status: 'active',
      endsAt: 0,
      participants: 0,
    });

    expect(challenge.toObject()).toHaveProperty('id', 'id-check-001');
  });

  it('mockChallenges() returns 4 seeded challenges', () => {
    const challenges = mockChallenges();

    expect(challenges).toHaveLength(4);
    expect(challenges[0].name).toBe('Balkanski Tour');
    expect(challenges[1].name).toBe('Vršič 50 Serpentin');
    expect(challenges[2].name).toBe('Marec Na Motorju');
    expect(challenges[3].name).toBe('Jutranja Serija');
  });

  it('mockChallenges() applies per-index overrides', () => {
    const challenges = mockChallenges([{ points: 999 }]);

    expect(challenges[0].points).toBe(999);
    expect(challenges[1].points).toBe(350);
  });

  it('mockChallenge() returns a single Challenge instance', () => {
    const challenge = mockChallenge({ name: 'Custom Challenge' });

    expect(challenge).toBeInstanceOf(Challenge);
    expect(challenge.name).toBe('Custom Challenge');
  });

  it('all seeded challenges have valid status values', () => {
    const validStatuses = ['active', 'upcoming', 'completed'];
    const challenges = mockChallenges();

    for (const challenge of challenges) {
      expect(validStatuses).toContain(challenge.status);
    }
  });

  it('seeded challenges with joined=true have progressPct > 0', () => {
    const challenges = mockChallenges();
    const joined = challenges.filter((c) => c.joined);

    for (const challenge of joined) {
      expect(challenge.progressPct).toBeGreaterThan(0);
    }
  });
});
