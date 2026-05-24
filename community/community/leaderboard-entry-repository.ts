import { ReturnModelType } from '@typegoose/typegoose';
import { LeaderboardEntryModel } from './leaderboard-entry.model.js';
import { LeaderboardEntry } from '@markec/community.entities.leaderboard-entry';

/**
 * Options for listing leaderboard entries.
 */
export type ListLeaderboardOptions = {
  period: 'week' | 'month' | 'year' | 'all';
  sortBy: 'km' | 'rides' | 'points';
  limit?: number;
};

/**
 * Repository for managing leaderboard entries.
 */
export class LeaderboardEntryRepository {
  constructor(private leaderboardEntryModel: ReturnModelType<typeof LeaderboardEntryModel>) {}

  /**
   * Retrieves a list of leaderboard entries based on specified criteria.
   * @param options - Options for filtering and sorting the leaderboard.
   * @returns A promise that resolves to an array of LeaderboardEntry.
   */
  async getLeaderboard(options: ListLeaderboardOptions): Promise<LeaderboardEntryModel[]> {
    const sort: Record<string, 1 | -1> = {};
    if (options.sortBy === 'km') sort.km = -1;
    if (options.sortBy === 'rides') sort.rides = -1;
    if (options.sortBy === 'points') sort.points = -1;

    let query = this.leaderboardEntryModel.find({}).sort(sort);

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const entries = await query.exec();
    return entries.map((entry) => entry.toObject());
  }
}