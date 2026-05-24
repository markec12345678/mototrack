import { gql } from 'graphql-tag';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { CommunityNode } from './community.node.runtime.js';

type SessionUser = {
  id: string;
  username?: string;
  displayName?: string;
};

type GqlContext = {
  session?: {
    user?: SessionUser;
  };
};

/**
 * Creates the GraphQL schema for the Community aspect API.
 */
export function createCommunityGqlSchema(communityNode: CommunityNode): GqlSchema {
  return {
    typeDefs: gql`
      type LeaderboardEntry {
        rank: Int!
        userId: String!
        displayName: String!
        country: String!
        km: Float!
        rides: Int!
        points: Int!
        me: Boolean
      }

      type AchievementProgress {
        id: String!
        name: String!
        description: String!
        icon: String!
        unlocked: Boolean!
        progressPct: Float!
        unlockedAt: Float
      }

      type Challenge {
        id: String!
        name: String!
        description: String!
        icon: String!
        points: Int!
        status: String!
        endsAt: Float!
        participants: Int!
        joined: Boolean
        progressPct: Float
      }

      type FeedActor {
        id: String!
        displayName: String!
        country: String!
      }

      type FeedItem {
        id: String!
        kind: String!
        actor: FeedActor!
        payload: String!
        at: Float!
      }

      type LatLng {
        lat: Float!
        lng: Float!
      }

      type CommunityRoute {
        id: String!
        name: String!
        author: String!
        country: String!
        distanceKm: Float!
        durationSec: Int!
        difficulty: String!
        rating: Float!
        likes: Int!
        geometry: [LatLng!]!
      }

      type RouteRating {
        id: String!
        routeId: String!
        userId: String!
        quality: Int!
        scenery: Int!
        twistiness: Int!
        difficulty: Int!
        comment: String
        createdAt: Float!
      }

      type FuelPriceReport {
        id: String!
        country: String!
        brand: String!
        petrolEur: Float!
        dieselEur: Float!
        location: String!
        reportedAt: Float!
        confirms: Int!
      }

      type GroupRideHost {
        id: String!
        displayName: String!
      }

      type GroupRideMeetingPoint {
        lat: Float!
        lng: Float!
        label: String!
      }

      type GroupRideParticipant {
        id: String!
        displayName: String!
        status: String!
      }

      type GroupRide {
        id: String!
        name: String!
        host: GroupRideHost!
        startAt: Float!
        meetingPoint: GroupRideMeetingPoint!
        participants: [GroupRideParticipant!]!
        routeId: String
      }

      input GetLeaderboardOptions {
        period: String!
        sortBy: String!
        limit: Int
      }

      input ListChallengesOptions {
        status: String
      }

      input ListCommunityRoutesOptions {
        country: String
        difficulty: String
      }

      input ListFuelPricesOptions {
        country: String
      }

      input RateRouteOptions {
        routeId: String!
        quality: Int!
        scenery: Int!
        twistiness: Int!
        difficulty: Int!
        comment: String
      }

      input FuelPriceInputOptions {
        country: String!
        brand: String!
        petrolEur: Float!
        dieselEur: Float!
        location: String!
      }

      input GroupRideMeetingPointInput {
        lat: Float!
        lng: Float!
        label: String!
      }

      input CreateGroupRideOptions {
        name: String!
        startAt: Float!
        meetingPoint: GroupRideMeetingPointInput!
        routeId: String
      }

      type Query {
        getLeaderboard(options: GetLeaderboardOptions): [LeaderboardEntry!]!
        listAchievements: [AchievementProgress!]!
        listChallenges(options: ListChallengesOptions): [Challenge!]!
        listFeed: [FeedItem!]!
        listCommunityRoutes(options: ListCommunityRoutesOptions): [CommunityRoute!]!
        listFuelPrices(options: ListFuelPricesOptions): [FuelPriceReport!]!
        listGroupRides: [GroupRide!]!
      }

      type Mutation {
        joinChallenge(id: String!): Boolean!
        rateRoute(input: RateRouteOptions!): RouteRating!
        reportFuelPrice(input: FuelPriceInputOptions!): FuelPriceReport!
        createGroupRide(input: CreateGroupRideOptions!): GroupRide!
      }
    `,
    resolvers: {
      Query: {
        getLeaderboard: async (
          _req: unknown,
          args: { options?: { period?: string; sortBy?: string; limit?: number } }
        ) => {
          const opts = args.options ?? {};
          return communityNode.getLeaderboard({
            period: opts.period ?? 'weekly',
            sortBy: opts.sortBy ?? 'km',
            limit: opts.limit,
          });
        },
        listAchievements: async (_req: unknown, _args: unknown, context: any) => {
          const userId = context?.session?.user?.id;
          return communityNode.listAchievements(userId);
        },
        listChallenges: async (
          _req: unknown,
          args: { options?: { status?: string } }
        ) => {
          return communityNode.listChallenges(args.options ?? {});
        },
        listFeed: async () => {
          return communityNode.listFeed();
        },
        listCommunityRoutes: async (
          _req: unknown,
          args: { options?: { country?: string; difficulty?: string } }
        ) => {
          return communityNode.listCommunityRoutes(args.options ?? {});
        },
        listFuelPrices: async (
          _req: unknown,
          args: { options?: { country?: string } }
        ) => {
          return communityNode.listFuelPrices(args.options ?? {});
        },
        listGroupRides: async () => {
          return communityNode.listGroupRides();
        },
      },
      Mutation: {
        joinChallenge: async (_req: unknown, args: { id: string }, context: any) => {
          const user = context?.session?.user;
          if (!user) throw new Unauthorized();
          return communityNode.joinChallenge(args.id);
        },
        rateRoute: async (
          _req: unknown,
          args: {
            input: {
              routeId: string;
              quality: number;
              scenery: number;
              twistiness: number;
              difficulty: number;
              comment?: string;
            };
          },
          context: any
        ) => {
          const user = context?.session?.user;
          if (!user) throw new Unauthorized();
          return communityNode.rateRoute(user.id, args.input);
        },
        reportFuelPrice: async (
          _req: unknown,
          args: {
            input: {
              country: string;
              brand: string;
              petrolEur: number;
              dieselEur: number;
              location: string;
            };
          },
          context: any
        ) => {
          const user = context?.session?.user;
          if (!user) throw new Unauthorized();
          return communityNode.reportFuelPrice(args.input);
        },
        createGroupRide: async (
          _req: unknown,
          args: {
            input: {
              name: string;
              startAt: number;
              meetingPoint: { lat: number; lng: number; label: string };
              routeId?: string;
            };
          },
          context: any
        ) => {
          const user = context?.session?.user;
          if (!user) throw new Unauthorized();
          return communityNode.createGroupRide({
            name: args.input.name,
            startAt: args.input.startAt,
            meetingPoint: args.input.meetingPoint,
            routeId: args.input.routeId,
            hostId: user.id,
            hostDisplayName: user.displayName ?? user.username ?? 'Unknown',
          });
        },
      },
    },
  };
}
