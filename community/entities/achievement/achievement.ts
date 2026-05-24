/**
 * Plain object type for a single Achievement definition.
 */
export type PlainAchievement = {
  /**
   * Unique identifier for the achievement.
   */
  id: string;

  /**
   * Display name of the achievement.
   */
  name: string;

  /**
   * Human-readable description of how to unlock the achievement.
   */
  description: string;

  /**
   * Emoji or icon identifier representing the achievement.
   */
  icon: string;

  /**
   * The threshold value required to unlock this achievement.
   */
  threshold: number;

  /**
   * The metric key this achievement tracks (e.g. 'km', 'rides', 'streak').
   */
  metric: string;
};

/**
 * Plain object type for per-user AchievementProgress.
 */
export type PlainAchievementProgress = {
  /**
   * Unique identifier for this progress record.
   */
  id: string;

  /**
   * The user this progress belongs to.
   */
  userId: string;

  /**
   * The achievement definition id.
   */
  achievementId: string;

  /**
   * Display name of the achievement.
   */
  name: string;

  /**
   * Human-readable description.
   */
  description: string;

  /**
   * Emoji or icon identifier.
   */
  icon: string;

  /**
   * Whether the achievement has been unlocked.
   */
  unlocked: boolean;

  /**
   * Progress percentage (0–100).
   */
  progressPct: number;

  /**
   * Timestamp (ms) when the achievement was unlocked, or undefined.
   */
  unlockedAt?: number;
};

/**
 * Achievement entity representing a single achievement definition.
 */
export class Achievement {
  constructor(
    /**
     * Unique identifier for the achievement.
     */
    readonly id: string,

    /**
     * Display name of the achievement.
     */
    readonly name: string,

    /**
     * Human-readable description of how to unlock the achievement.
     */
    readonly description: string,

    /**
     * Emoji or icon identifier representing the achievement.
     */
    readonly icon: string,

    /**
     * The threshold value required to unlock this achievement.
     */
    readonly threshold: number,

    /**
     * The metric key this achievement tracks (e.g. 'km', 'rides', 'streak').
     */
    readonly metric: string,
  ) {}

  /**
   * Serialize the Achievement into a plain object.
   */
  toObject(): PlainAchievement {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      icon: this.icon,
      threshold: this.threshold,
      metric: this.metric,
    };
  }

  /**
   * Create an Achievement from a plain object.
   */
  static from(plain: PlainAchievement): Achievement {
    return new Achievement(
      plain.id,
      plain.name,
      plain.description,
      plain.icon,
      plain.threshold,
      plain.metric,
    );
  }
}

/**
 * AchievementProgress entity representing per-user progress toward an achievement.
 */
export class AchievementProgress {
  constructor(
    /**
     * Unique identifier for this progress record.
     */
    readonly id: string,

    /**
     * The user this progress belongs to.
     */
    readonly userId: string,

    /**
     * The achievement definition id.
     */
    readonly achievementId: string,

    /**
     * Display name of the achievement.
     */
    readonly name: string,

    /**
     * Human-readable description.
     */
    readonly description: string,

    /**
     * Emoji or icon identifier.
     */
    readonly icon: string,

    /**
     * Whether the achievement has been unlocked.
     */
    readonly unlocked: boolean,

    /**
     * Progress percentage (0–100).
     */
    readonly progressPct: number,

    /**
     * Timestamp (ms) when the achievement was unlocked, or undefined.
     */
    readonly unlockedAt?: number,
  ) {}

  /**
   * Serialize the AchievementProgress into a plain object.
   */
  toObject(): PlainAchievementProgress {
    return {
      id: this.id,
      userId: this.userId,
      achievementId: this.achievementId,
      name: this.name,
      description: this.description,
      icon: this.icon,
      unlocked: this.unlocked,
      progressPct: this.progressPct,
      unlockedAt: this.unlockedAt,
    };
  }

  /**
   * Create an AchievementProgress from a plain object.
   */
  static from(plain: PlainAchievementProgress): AchievementProgress {
    const {
      id = '',
      userId = '',
      achievementId = '',
      name = '',
      description = '',
      icon = '',
      unlocked = false,
      progressPct = 0,
      unlockedAt,
    } = plain;

    return new AchievementProgress(
      id,
      userId,
      achievementId,
      name,
      description,
      icon,
      unlocked,
      progressPct,
      unlockedAt,
    );
  }
}
