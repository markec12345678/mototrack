import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { BalkanRoadsNode } from './balkan-roads.node.runtime.js';

type ListRoadsArgs = {
  options?: {
    country?: string;
    difficulty?: string;
  };
};

type ListToursArgs = {
  options?: {
    country?: string;
    difficulty?: string;
  };
};

type GetTourArgs = {
  options: {
    id: string;
  };
};

/**
 * GraphQL schema for the Balkan Roads aspect.
 * Exposes BalkanRoad and IconicTour queries.
 */
export function createBalkanRoadsGqlSchema(balkanRoadsNode: BalkanRoadsNode): GqlSchema {
  return {
    typeDefs: gql`
      type BalkanRoad {
        id: String!
        name: String!
        country: String!
        flag: String!
        lengthKm: Float!
        rating: Float!
        difficulty: String!
        type: String!
        description: String!
      }

      type TourWaypoint {
        lat: Float!
        lng: Float!
        name: String
      }

      type IconicTour {
        id: String!
        name: String!
        country: String!
        flag: String!
        distanceKm: Float!
        rating: Float!
        difficulty: String!
        description: String!
        waypoints: [TourWaypoint!]!
      }

      input ListRoadsOptions {
        country: String
        difficulty: String
      }

      input ListToursOptions {
        country: String
        difficulty: String
      }

      input GetTourOptions {
        id: String!
      }

      type Query {
        listRoads(options: ListRoadsOptions): [BalkanRoad!]!
        listTours(options: ListToursOptions): [IconicTour!]!
        getTour(options: GetTourOptions!): IconicTour
      }
    `,
    resolvers: {
      Query: {
        listRoads: async (_root: unknown, args: ListRoadsArgs) => {
          return balkanRoadsNode.listRoads(args.options ?? {});
        },
        listTours: async (_root: unknown, args: ListToursArgs) => {
          return balkanRoadsNode.listTours(args.options ?? {});
        },
        getTour: async (_root: unknown, args: GetTourArgs) => {
          return balkanRoadsNode.getTour(args.options.id);
        },
      },
    },
  };
}
