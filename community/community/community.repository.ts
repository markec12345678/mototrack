import type { ReturnModelType } from '@typegoose/typegoose';
import {
  AchievementProgressModel,
  ChallengeModel,
  CommunityRouteModel,
  FeedItemModel,
  FuelPriceReportModel,
  GroupRideModel,
  LeaderboardEntryModel,
  RouteRatingModel,
} from './community.model.js';

export type ListLeaderboardOptions = {
  period: string;
  sortBy: string;
  limit?: number;
};

export type ListChallengesOptions = {
  status?: string;
};

export type ListCommunityRoutesOptions = {
  country?: string;
  difficulty?: string;
};

export type ListFuelPricesOptions = {
  country?: string;
};

export type CreateRouteRatingOptions = {
  routeId: string;
  userId: string;
  quality: number;
  scenery: number;
  twistiness: number;
  difficulty: number;
  comment?: string;
};

export type CreateFuelReportOptions = {
  country: string;
  brand: string;
  petrolEur: number;
  dieselEur: number;
  location: string;
};

export type CreateGroupRideOptions = {
  name: string;
  hostId: string;
  hostDisplayName: string;
  startAt: number;
  meetingPoint: { lat: number; lng: number; label: string };
  routeId?: string;
};

export class CommunityRepository {
  constructor(
    private leaderboardModel: ReturnModelType<typeof LeaderboardEntryModel>,
    private achievementModel: ReturnModelType<typeof AchievementProgressModel>,
    private challengeModel: ReturnModelType<typeof ChallengeModel>,
    private feedModel: ReturnModelType<typeof FeedItemModel>,
    private routeModel: ReturnModelType<typeof CommunityRouteModel>,
    private ratingModel: ReturnModelType<typeof RouteRatingModel>,
    private fuelModel: ReturnModelType<typeof FuelPriceReportModel>,
    private groupRideModel: ReturnModelType<typeof GroupRideModel>
  ) {}

  /**
   * ── Leaderboard ────────────────────────────────────────────────────────
   */
  async listLeaderboard(options: ListLeaderboardOptions): Promise<LeaderboardEntryModel[]> {
    const period = options.period || 'weekly';
    const sortField = options.sortBy === 'rides' || options.sortBy === 'points' ? options.sortBy : 'km';
    const docs = await this.leaderboardModel
      .find({ period })
      .sort({ [sortField]: -1 })
      .limit(options.limit ?? 50);
    return docs.map((d) => d.toObject());
  }

  /**
   * ── Achievements ───────────────────────────────────────────────────────
   */
  async listAchievementsForUser(userId: string): Promise<AchievementProgressModel[]> {
    const docs = await this.achievementModel.find({ userId }).sort({ unlocked: -1, progressPct: -1 });
    return docs.map((d) => d.toObject());
  }

  /**
   * ── Challenges ─────────────────────────────────────────────────────────
   */
  async listChallenges(options: ListChallengesOptions = {}): Promise<ChallengeModel[]> {
    const filter: Record<string, unknown> = {};
    if (options.status) filter.status = options.status;
    const docs = await this.challengeModel.find(filter).sort({ endsAt: 1 });
    return docs.map((d) => d.toObject());
  }

  async joinChallenge(id: string): Promise<boolean> {
    const challenge = await this.challengeModel.findOne({ id });
    if (!challenge) return false;
    challenge.joined = true;
    challenge.participants = (challenge.participants ?? 0) + 1;
    await challenge.save();
    return true;
  }

  /**
   * ── Feed ───────────────────────────────────────────────────────────────
   */
  async listFeed(limit = 50): Promise<FeedItemModel[]> {
    const docs = await this.feedModel.find({}).sort({ at: -1 }).limit(limit);
    return docs.map((d) => d.toObject());
  }

  /**
   * ── Community routes ───────────────────────────────────────────────────
   */
  async listCommunityRoutes(options: ListCommunityRoutesOptions = {}): Promise<CommunityRouteModel[]> {
    const filter: Record<string, unknown> = {};
    if (options.country) filter.country = options.country;
    if (options.difficulty) filter.difficulty = options.difficulty;
    const docs = await this.routeModel.find(filter).sort({ rating: -1, likes: -1 });
    return docs.map((d) => d.toObject());
  }

  async createRouteRating(options: CreateRouteRatingOptions): Promise<RouteRatingModel> {
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    const created = await this.ratingModel.create({ id, createdAt, ...options });
    return created.toObject();
  }

  /**
   * ── Fuel prices ────────────────────────────────────────────────────────
   */
  async listFuelPrices(options: ListFuelPricesOptions = {}): Promise<FuelPriceReportModel[]> {
    const filter: Record<string, unknown> = {};
    if (options.country) filter.country = options.country;
    const docs = await this.fuelModel.find(filter).sort({ reportedAt: -1 });
    return docs.map((d) => d.toObject());
  }

  async createFuelReport(options: CreateFuelReportOptions): Promise<FuelPriceReportModel> {
    const id = crypto.randomUUID();
    const reportedAt = Date.now();
    const created = await this.fuelModel.create({
      id,
      reportedAt,
      confirms: 0,
      ...options,
    });
    return created.toObject();
  }

  /**
   * ── Group rides ────────────────────────────────────────────────────────
   */
  async listGroupRides(): Promise<GroupRideModel[]> {
    const docs = await this.groupRideModel.find({}).sort({ startAt: 1 });
    return docs.map((d) => d.toObject());
  }

  async findGroupRide(id: string): Promise<GroupRideModel | undefined> {
    const doc = await this.groupRideModel.findOne({ id });
    return doc ? doc.toObject() : undefined;
  }

  async createGroupRide(options: CreateGroupRideOptions): Promise<GroupRideModel> {
    const id = crypto.randomUUID();
    const created = await this.groupRideModel.create({
      id,
      name: options.name,
      host: { id: options.hostId, displayName: options.hostDisplayName },
      startAt: options.startAt,
      meetingPoint: options.meetingPoint,
      participants: [
        {
          id: options.hostId,
          displayName: options.hostDisplayName,
          status: 'pripravljen',
        },
      ],
      routeId: options.routeId,
    });
    return created.toObject();
  }
}
