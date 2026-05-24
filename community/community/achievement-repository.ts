import { ReturnModelType } from '@typegoose/typegoose';
import { AchievementModel, AchievementProgressModel } from './achievement.model.js';
import { Achievement } from '@markec/community.entities.achievement';
import { User } from './user.js';

/**
 * Repository for managing achievements and user achievement progress.
 */
export class AchievementRepository {
  constructor(
    private achievementModel: ReturnModelType<typeof AchievementModel>,
    private achievementProgressModel: ReturnModelType<typeof AchievementProgressModel>
  ) {}

  /**
   * Retrieves a list of achievements with progress for a specific user.
   * @param user - The user for whom to list achievements.
   * @returns A promise that resolves to an array of Achievement entities.
   */
  async listAchievements(user: User): Promise<Achievement[]> {
    const allAchievements = await this.achievementModel.find({}).exec();
    const userProgress = await this.achievementProgressModel.find({ userId: user.id }).exec();

    const achievementsWithProgress: Achievement[] = allAchievements.map((achievementDoc) => {
      const progressDoc = userProgress.find((p) => p.achievementId === achievementDoc.id);
      const achievementObject = achievementDoc.toObject();

      return new Achievement(
        achievementObject.id,
        achievementObject.name,
        achievementObject.description,
        achievementObject.icon,
        (achievementObject as any).threshold ?? 0,
        (achievementObject as any).metric ?? 'km',
      );
    });

    return achievementsWithProgress;
  }

  /**
   * Updates or creates achievement progress for a user.
   * @param userId - The ID of the user.
   * @param achievementId - The ID of the achievement.
   * @param unlocked - Whether the achievement is unlocked.
   * @param progressPct - The percentage progress.
   * @param unlockedAt - Timestamp when the achievement was unlocked.
   */
  async upsertAchievementProgress(
    userId: string,
    achievementId: string,
    unlocked: boolean,
    progressPct: number,
    unlockedAt?: number
  ): Promise<void> {
    await this.achievementProgressModel.findOneAndUpdate(
      { userId, achievementId },
      { $set: { unlocked, progressPct, unlockedAt } },
      { upsert: true, new: true }
    );
  }
}