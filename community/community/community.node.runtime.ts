import { SymphonyPlatformAspect } from '@bitdev/symphony.symphony-platform';
import type { SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import {
  MototrackPlatformAspect,
  type MototrackPlatformNode,
} from '@markec/mototrack-platform.mototrack-platform';
import { getModelForClass } from '@typegoose/typegoose';
import type { CommunityConfig } from './community-config.js';
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
import {
  CommunityRepository,
  type CreateFuelReportOptions,
  type CreateGroupRideOptions,
  type CreateRouteRatingOptions,
  type ListChallengesOptions,
  type ListCommunityRoutesOptions,
  type ListFuelPricesOptions,
  type ListLeaderboardOptions,
} from './community.repository.js';
import { createCommunityGqlSchema } from './community.graphql.js';
import {
  achievementSeed,
  challengeSeed,
  communityRouteSeed,
  DEMO_USER,
  feedSeed,
  fuelReportSeed,
  groupRideSeed,
  leaderboardSeed,
} from './community.seeds.js';
import {
  startGroupRideChatServer,
  type ChatServerHandle,
} from './group-ride-chat-server.js';

export class CommunityNode {
  private chatServer?: ChatServerHandle;
  private _seeded = false;

  async seedOnce(opts: {
    leaderboardModel: any; achievementModel: any; challengeModel: any;
    feedModel: any; routeModel: any; fuelModel: any; groupRideModel: any;
    chatPort: number;
    leaderboardSeed: unknown[]; achievementSeed: unknown[]; challengeSeed: unknown[];
    feedSeed: unknown[]; communityRouteSeed: unknown[]; fuelReportSeed: unknown[]; groupRideSeed: unknown[];
    startGroupRideChatServer: (cfg: { port: number }) => ChatServerHandle;
  }) {
    if (this._seeded) return;
    this._seeded = true;
    const collections: Array<[any, unknown[]]> = [
      [opts.leaderboardModel, opts.leaderboardSeed],
      [opts.achievementModel, opts.achievementSeed],
      [opts.challengeModel, opts.challengeSeed],
      [opts.feedModel, opts.feedSeed],
      [opts.routeModel, opts.communityRouteSeed],
      [opts.fuelModel, opts.fuelReportSeed],
      [opts.groupRideModel, opts.groupRideSeed],
    ];
    for (const [model, docs] of collections) {
      const existing = await model.find({}).limit(1);
      if (existing.length === 0 && docs.length > 0) {
        await model.insertMany(docs);
      }
    }
    if (!this.chatServer) {
      this.chatServer = opts.startGroupRideChatServer({ port: opts.chatPort });
    }
  }

  constructor(
    private config: CommunityConfig,
    private repository: CommunityRepository
  ) {}

  /**
   * ── Public runtime API (used by resolvers + other aspects) ─────────────
   */
  async getLeaderboard(options: ListLeaderboardOptions) {
    return this.repository.listLeaderboard(options);
  }

  async listAchievements(userId?: string) {
    return this.repository.listAchievementsForUser(userId ?? DEMO_USER);
  }

  async listChallenges(options: ListChallengesOptions = {}) {
    return this.repository.listChallenges(options);
  }

  async listFeed() {
    return this.repository.listFeed();
  }

  async listCommunityRoutes(options: ListCommunityRoutesOptions = {}) {
    return this.repository.listCommunityRoutes(options);
  }

  async listFuelPrices(options: ListFuelPricesOptions = {}) {
    return this.repository.listFuelPrices(options);
  }

  async listGroupRides() {
    return this.repository.listGroupRides();
  }

  async joinChallenge(id: string) {
    return this.repository.joinChallenge(id);
  }

  async rateRoute(userId: string, input: Omit<CreateRouteRatingOptions, 'userId'>) {
    return this.repository.createRouteRating({ ...input, userId });
  }

  async reportFuelPrice(input: CreateFuelReportOptions) {
    return this.repository.createFuelReport(input);
  }

  async createGroupRide(input: CreateGroupRideOptions) {
    return this.repository.createGroupRide(input);
  }

  getChatServer(): ChatServerHandle | undefined {
    return this.chatServer;
  }

  static dependencies = [SymphonyPlatformAspect, MototrackPlatformAspect];

  static defaultConfig: CommunityConfig = {
    groupRideChatPort: 3050,
  };

  static async provider(
    [symphonyPlatform, mototrackPlatform]: [SymphonyPlatformNode, MototrackPlatformNode],
    config: CommunityConfig
  ) {
    const leaderboardModel = getModelForClass(LeaderboardEntryModel);
    const achievementModel = getModelForClass(AchievementProgressModel);
    const challengeModel = getModelForClass(ChallengeModel);
    const feedModel = getModelForClass(FeedItemModel);
    const routeModel = getModelForClass(CommunityRouteModel);
    const ratingModel = getModelForClass(RouteRatingModel);
    const fuelModel = getModelForClass(FuelPriceReportModel);
    const groupRideModel = getModelForClass(GroupRideModel);

    const repository = new CommunityRepository(
      leaderboardModel,
      achievementModel,
      challengeModel,
      feedModel,
      routeModel,
      ratingModel,
      fuelModel,
      groupRideModel
    );

    const community = new CommunityNode(config, repository);
    const gqlSchema = createCommunityGqlSchema(community);

    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    // Lazy-seed community data on first GraphQL request via the repository.
    // This avoids coupling to SymphonyPlatform.registerOnStart.
    void community.seedOnce({
      leaderboardModel, achievementModel, challengeModel,
      feedModel, routeModel, fuelModel, groupRideModel,
      chatPort: config.groupRideChatPort ?? 3050,
      leaderboardSeed, achievementSeed, challengeSeed,
      feedSeed, communityRouteSeed, fuelReportSeed, groupRideSeed,
      startGroupRideChatServer,
    }).catch((err: unknown) => { console.warn('[community] seed error:', err); });

    return community;
  }
}

export default CommunityNode;
