import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { RoutesNode } from './routes.node.runtime.js';

/**
 * GraphQL schema for the routes aspect.
 */
export function createRoutesGqlSchema(routesNode: RoutesNode): GqlSchema {
  return {
    typeDefs: gql`
      type LatLng {
        lat: Float!
        lng: Float!
      }

      input LatLngInput {
        lat: Float!
        lng: Float!
      }

      type Waypoint {
        id: String!
        name: String
        lat: Float!
        lng: Float!
      }

      input WaypointInput {
        id: String!
        name: String
        lat: Float!
        lng: Float!
      }

      type TurnStep {
        instruction: String!
        distanceM: Float!
        durationSec: Int!
        location: LatLng!
        modifier: String
      }

      type ComputedRoute {
        geometry: [LatLng!]!
        distanceKm: Float!
        durationSec: Int!
        steps: [TurnStep!]!
      }

      type SavedRoute {
        id: String!
        userId: String
        name: String!
        waypoints: [Waypoint!]!
        mode: String!
        geometry: [LatLng!]!
        distanceKm: Float!
        durationSec: Int!
        notes: String
        createdAt: Int!
      }

      type SharedRouteDetails {
        code: String!
        qrUrl: String!
        expiresAt: Int!
      }

      input ComputeRouteOptions {
        waypoints: [LatLngInput!]!
        mode: String!
      }

      input GenerateTwistyRouteOptions {
        start: LatLngInput!
        end: LatLngInput!
        twistiness: Float!
      }

      input GenerateRoundTripOptions {
        start: LatLngInput!
        distanceKm: Float!
        twistiness: Float!
        direction: String
      }

      input SaveRouteInputOptions {
        name: String!
        waypoints: [WaypointInput!]!
        mode: String!
        geometry: [LatLngInput!]!
        distanceKm: Float!
        durationSec: Int!
        notes: String
      }

      input LoadSharedRouteOptions {
        code: String!
      }

      type Query {
        listSavedRoutes: [SavedRoute!]!
        loadSharedRoute(options: LoadSharedRouteOptions): SavedRoute
      }

      type Mutation {
        computeRoute(options: ComputeRouteOptions): ComputedRoute!
        generateTwistyRoute(options: GenerateTwistyRouteOptions): ComputedRoute!
        generateRoundTrip(options: GenerateRoundTripOptions): ComputedRoute!
        saveRoute(options: SaveRouteInputOptions): SavedRoute!
        shareRoute(options: SaveRouteInputOptions): SharedRouteDetails!
      }
    `,
    resolvers: {
      Query: {
        listSavedRoutes: async (_req: unknown, _args: unknown, context: any) => {
          const userId = context?.session?.user?.id as string | undefined;
          return routesNode.listSavedRoutes(userId);
        },
        loadSharedRoute: async (_req: unknown, { options }: { options: { code: string } }) => {
          return routesNode.loadSharedRoute(options.code);
        },
      },
      Mutation: {
        computeRoute: async (_req: unknown, { options }: { options: any }) => {
          return routesNode.computeRoute(options);
        },
        generateTwistyRoute: async (_req: unknown, { options }: { options: any }) => {
          return routesNode.generateTwistyRoute(options);
        },
        generateRoundTrip: async (_req: unknown, { options }: { options: any }) => {
          return routesNode.generateRoundTrip(options);
        },
        saveRoute: async (_req: unknown, { options }: { options: any }, context: any) => {
          const userId = context?.session?.user?.id as string | undefined;
          return routesNode.saveRoute({ ...options, userId });
        },
        shareRoute: async (_req: unknown, { options }: { options: any }) => {
          return routesNode.shareRoute(options);
        },
      },
    },
  };
}
