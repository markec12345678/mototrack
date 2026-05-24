import { Achievement, AchievementProgress } from './achievement.js';
import { SEEDED_ACHIEVEMENTS } from './achievement-seed.js';

/**
 * Returns all 12 seeded Achievement definitions, with optional partial overrides.
 */
export function mockAchievements(overrides: Partial<Achievement>[] = []): Achievement[] {
  return SEEDED_ACHIEVEMENTS.map((achievement, index) => {
    const override = overrides[index];
    if (!override) return achievement;
    return Achievement.from({ ...achievement.toObject(), ...override });
  });
}

/**
 * Returns a single mock Achievement by index (0–11), with optional partial override.
 */
export function mockAchievement(
  index = 0,
  override: Partial<{ id: string; name: string; description: string; icon: string; threshold: number; metric: string }> = {},
): Achievement {
  const base = SEEDED_ACHIEVEMENTS[index % SEEDED_ACHIEVEMENTS.length];
  return Achievement.from({ ...base.toObject(), ...override });
}

/**
 * Generates a mock AchievementProgress record for a given user, with optional partial override.
 */
export function mockAchievementProgress(
  override: Partial<{
    id: string;
    userId: string;
    achievementId: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progressPct: number;
    unlockedAt: number;
  }> = {},
): AchievementProgress {
  const base = SEEDED_ACHIEVEMENTS[0];
  return AchievementProgress.from({
    id: override.id ?? 'progress-001',
    userId: override.userId ?? 'user-abc',
    achievementId: override.achievementId ?? base.id,
    name: override.name ?? base.name,
    description: override.description ?? base.description,
    icon: override.icon ?? base.icon,
    unlocked: override.unlocked ?? false,
    progressPct: override.progressPct ?? 42,
    unlockedAt: override.unlockedAt,
  });
}

/**
 * Returns a list of mock AchievementProgress records for a user,
 * one per seeded achievement, with realistic progress values.
 */
export function mockAchievementProgressList(userId = 'user-abc'): AchievementProgress[] {
  const progressValues = [100, 73, 60, 33, 80, 100, 40, 17, 55, 100, 30, 8];
  const unlockedAts = [1_710_000_000_000, undefined, undefined, undefined, undefined, 1_712_000_000_000, undefined, undefined, undefined, 1_714_000_000_000, undefined, undefined];

  return SEEDED_ACHIEVEMENTS.map((achievement, index) => {
    const pct = progressValues[index] ?? 0;
    const unlocked = pct >= 100;
    return AchievementProgress.from({
      id: `progress-${userId}-${achievement.id}`,
      userId,
      achievementId: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      unlocked,
      progressPct: pct,
      unlockedAt: unlocked ? unlockedAts[index] : undefined,
    });
  });
}
