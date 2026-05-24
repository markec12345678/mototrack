import { describe, it, expect } from 'vitest';
import { Achievement, AchievementProgress } from './achievement.js';
import { SEEDED_ACHIEVEMENTS } from './achievement-seed.js';
import {
  mockAchievement,
  mockAchievements,
  mockAchievementProgress,
  mockAchievementProgressList,
} from './achievement.mock.js';

describe('Achievement', () => {
  it('has a static from() method', () => {
    expect(Achievement.from).toBeTruthy();
  });

  it('creates an Achievement from a plain object', () => {
    const achievement = Achievement.from({
      id: 'test-id',
      name: 'Test Achievement',
      description: 'A test achievement.',
      icon: '🏆',
      threshold: 10,
      metric: 'rides',
    });

    expect(achievement.id).toBe('test-id');
    expect(achievement.name).toBe('Test Achievement');
    expect(achievement.description).toBe('A test achievement.');
    expect(achievement.icon).toBe('🏆');
    expect(achievement.threshold).toBe(10);
    expect(achievement.metric).toBe('rides');
  });

  it('serializes to a plain object via toObject()', () => {
    const plain = {
      id: 'test-id',
      name: 'Test Achievement',
      description: 'A test achievement.',
      icon: '🏆',
      threshold: 10,
      metric: 'rides',
    };
    const achievement = Achievement.from(plain);
    expect(achievement.toObject()).toEqual(plain);
  });

  it('round-trips through from() and toObject()', () => {
    const original = mockAchievement(0);
    const roundTripped = Achievement.from(original.toObject());
    expect(roundTripped.toObject()).toEqual(original.toObject());
  });
});

describe('SEEDED_ACHIEVEMENTS', () => {
  it('contains exactly 12 achievements', () => {
    expect(SEEDED_ACHIEVEMENTS).toHaveLength(12);
  });

  it('includes Vršič Conqueror as the first achievement', () => {
    expect(SEEDED_ACHIEVEMENTS[0].name).toBe('Vršič Conqueror');
    expect(SEEDED_ACHIEVEMENTS[0].metric).toBe('vrsic_crossings');
  });

  it('includes 1000 km Klub', () => {
    const found = SEEDED_ACHIEVEMENTS.find((a) => a.id === '1000-km-klub');
    expect(found).toBeDefined();
    expect(found?.threshold).toBe(1000);
    expect(found?.metric).toBe('km');
  });

  it('includes Transfăgărășan', () => {
    const found = SEEDED_ACHIEVEMENTS.find((a) => a.id === 'transfagarasan');
    expect(found).toBeDefined();
    expect(found?.name).toBe('Transfăgărășan');
  });

  it('includes Stroški pod kontrolo as the last achievement', () => {
    const last = SEEDED_ACHIEVEMENTS[SEEDED_ACHIEVEMENTS.length - 1];
    expect(last.name).toBe('Stroški pod kontrolo');
  });

  it('every achievement has a non-empty id, name, description, icon, and metric', () => {
    for (const achievement of SEEDED_ACHIEVEMENTS) {
      expect(achievement.id).toBeTruthy();
      expect(achievement.name).toBeTruthy();
      expect(achievement.description).toBeTruthy();
      expect(achievement.icon).toBeTruthy();
      expect(achievement.metric).toBeTruthy();
      expect(achievement.threshold).toBeGreaterThan(0);
    }
  });
});

describe('AchievementProgress', () => {
  it('has a static from() method', () => {
    expect(AchievementProgress.from).toBeTruthy();
  });

  it('creates an AchievementProgress from a plain object', () => {
    const progress = AchievementProgress.from({
      id: 'prog-1',
      userId: 'user-1',
      achievementId: 'vrsic-conqueror',
      name: 'Vršič Conqueror',
      description: 'Complete a ride that crosses the Vršič mountain pass.',
      icon: '🏔️',
      unlocked: true,
      progressPct: 100,
      unlockedAt: 1_710_000_000_000,
    });

    expect(progress.id).toBe('prog-1');
    expect(progress.userId).toBe('user-1');
    expect(progress.achievementId).toBe('vrsic-conqueror');
    expect(progress.unlocked).toBe(true);
    expect(progress.progressPct).toBe(100);
    expect(progress.unlockedAt).toBe(1_710_000_000_000);
  });

  it('serializes to a plain object via toObject()', () => {
    const progress = mockAchievementProgress({ unlocked: true, progressPct: 100, unlockedAt: 1_710_000_000_000 });
    const obj = progress.toObject();
    expect(obj.id).toBeDefined();
    expect(obj.unlocked).toBe(true);
    expect(obj.progressPct).toBe(100);
    expect(obj.unlockedAt).toBe(1_710_000_000_000);
  });

  it('handles missing unlockedAt gracefully', () => {
    const progress = AchievementProgress.from({
      id: 'prog-2',
      userId: 'user-2',
      achievementId: '1000-km-klub',
      name: '1000 km Klub',
      description: 'Accumulate 1 000 km.',
      icon: '🛣️',
      unlocked: false,
      progressPct: 50,
    });

    expect(progress.unlockedAt).toBeUndefined();
    expect(progress.toObject().unlockedAt).toBeUndefined();
  });

  it('round-trips through from() and toObject()', () => {
    const original = mockAchievementProgress();
    const roundTripped = AchievementProgress.from(original.toObject());
    expect(roundTripped.toObject()).toEqual(original.toObject());
  });
});

describe('mockAchievements()', () => {
  it('returns 12 achievements', () => {
    expect(mockAchievements()).toHaveLength(12);
  });

  it('applies partial overrides by index', () => {
    const overrides = [{ name: 'Custom Name' } as Partial<Achievement>];
    const achievements = mockAchievements(overrides);
    expect(achievements[0].name).toBe('Custom Name');
    expect(achievements[1].name).toBe('1000 km Klub');
  });
});

describe('mockAchievementProgressList()', () => {
  it('returns 12 progress records', () => {
    expect(mockAchievementProgressList()).toHaveLength(12);
  });

  it('marks unlocked achievements correctly', () => {
    const list = mockAchievementProgressList('test-user');
    const unlocked = list.filter((p) => p.unlocked);
    expect(unlocked.length).toBeGreaterThan(0);
    for (const p of unlocked) {
      expect(p.progressPct).toBe(100);
    }
  });

  it('assigns the correct userId to all records', () => {
    const list = mockAchievementProgressList('rider-42');
    for (const p of list) {
      expect(p.userId).toBe('rider-42');
    }
  });
});
