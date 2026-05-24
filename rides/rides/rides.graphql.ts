import { gql } from 'graphql-tag';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { RidesNode } from './rides.node.runtime.js';

export function createRidesGqlSchema(ridesNode: RidesNode): GqlSchema {
  return {
    typeDefs: gql`
      type TrackPoint {
        lat: Float!
        lng: Float!
        ts: Float!
        speed: Float
        elevation: Float
        accuracy: Float
        heading: Float
      }

      input TrackPointInput {
        lat: Float!
        lng: Float!
        ts: Float!
        speed: Float
        elevation: Float
        accuracy: Float
        heading: Float
      }

      type Ride {
        id: ID!
        userId: ID!
        startedAt: Float!
        endedAt: Float!
        distanceKm: Float!
        durationSec: Int!
        maxSpeedKmh: Float!
        avgSpeedKmh: Float!
        climbM: Float!
        descentM: Float!
        twistinessScore: Float!
        track: [TrackPoint!]!
        name: String
        notes: String
      }

      input CreateRideInput {
        name: String
        notes: String
        startedAt: Float!
        endedAt: Float!
        track: [TrackPointInput!]!
      }

      type RideStats {
        totalKm: Float!
        totalRides: Int!
        totalDurationSec: Int!
        totalClimbM: Float!
        maxSpeedKmh: Float!
        longestRideKm: Float!
        avgKmPerWeek: Float!
        streakDays: Int!
      }

      input ListRidesOptions {
        limit: Int
        offset: Int
        from: Float
        to: Float
      }

      type Query {
        listRides(options: ListRidesOptions): [Ride!]!
        getRide(id: ID!): Ride
        getRideStats(period: String!): RideStats!
      }

      type Mutation {
        createRide(input: CreateRideInput!): Ride!
        deleteRide(id: ID!): Boolean!
      }
    `,
    resolvers: {
      Query: {
        listRides: async (_root, { options }, context) => {
          const user = context.session?.user;
          if (!user) throw new Unauthorized();
          return ridesNode.listRides(user.id, options ?? {});
        },
        getRide: async (_root, { id }, context) => {
          const user = context.session?.user;
          if (!user) throw new Unauthorized();
          return ridesNode.getRide(user.id, id);
        },
        getRideStats: async (_root, { period }, context) => {
          const user = context.session?.user;
          if (!user) throw new Unauthorized();
          return ridesNode.getRideStats(user.id, period);
        },
      },
      Mutation: {
        createRide: async (_root, { input }, context) => {
          const user = context.session?.user;
          if (!user) throw new Unauthorized();
          return ridesNode.createRide(user.id, input);
        },
        deleteRide: async (_root, { id }, context) => {
          const user = context.session?.user;
          if (!user) throw new Unauthorized();
          return ridesNode.deleteRide(user.id, id);
        },
      },
    },
  };
}
