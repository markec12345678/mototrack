import { ReturnModelType } from '@typegoose/typegoose';
import { ChallengeModel, UserChallengeProgressModel } from './challenge.model.js';
import { Challenge } from '@markec/community.entities.challenge';
import { User } from './user.js';

class Unauthorized extends Error { constructor(msg = 'Unauthorized') { super(msg); this.name = 'Unauthorized'; } }
class NotFound extends Error { constructor(msg = 'Not found') { super(msg); this.name = 'NotFound'; } }

/**
 * Options for listing challenges.
 */
export type ListChallengesOptions = {
  status?: 'active' | 'past';
};

/**
 * Repository for managing challenges and user challenge progress.
 */
export class ChallengeRepository {
  constructor(
    private challengeModel: ReturnModelType<typeof ChallengeModel>,
    private userChallengeProgressModel: ReturnModelType<typeof UserChallengeProgressModel>
  ) {}

  /**
   * Retrieves a list of challenges, optionally filtered by status, with user-specific progress.
   * @param status - Filter challenges by 'active' or 'past'.
   * @param user - The user for whom to show challenge progress.
   * @returns A promise that resolves to an array of Challenge entities.
   */
  async listChallenges(status?: 'active' | 'past', user?: User): Promise<Challenge[]> {
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const allChallenges = await this.challengeModel.find(filter).exec();
    let userProgress: UserChallengeProgressModel[] = [];
    if (user) {
      userProgress = await this.userChallengeProgressModel.find({ userId: user.id }).exec();
    }

    const challengesWithProgress: Challenge[] = allChallenges.map((challengeDoc) => {
      const progressDoc = userProgress.find((p) => p.challengeId === challengeDoc.id);
      const challengeObject = challengeDoc.toObject();

      return new Challenge(
        challengeObject.id,
        challengeObject.name,
        challengeObject.description,
        challengeObject.icon,
        challengeObject.points,
        challengeObject.status,
        challengeObject.endsAt,
        challengeObject.participants,
        progressDoc?.joined || false,
        progressDoc?.progressPct || 0
      );
    });

    return challengesWithProgress;
  }

  /**
   * Allows a user to join a specific challenge.
   * @param challengeId - The ID of the challenge to join.
   * @param user - The user attempting to join the challenge.
   * @throws {Unauthorized} if no user is provided.
   * @throws {NotFound} if the challenge does not exist.
   */
  async joinChallenge(challengeId: string, user: User): Promise<void> {
    if (!user) throw new Unauthorized();

    const challenge = await this.challengeModel.findOne({ id: challengeId }).exec();
    if (!challenge) throw new NotFound(`Challenge with ID ${challengeId} not found.`);

    await this.userChallengeProgressModel.findOneAndUpdate(
      { userId: user.id, challengeId },
      { $set: { joined: true, progressPct: 0 } }, // Assume initial progress is 0
      { upsert: true, new: true }
    );

    // Increment participant count if they weren't already participating
    const existingParticipation = await this.userChallengeProgressModel.findOne({ userId: user.id, challengeId });
    if (!existingParticipation || !existingParticipation.joined) { // Only increment if they are joining for the first time
      await this.challengeModel.findOneAndUpdate({ id: challengeId }, { $inc: { participants: 1 } });
    }
  }
}