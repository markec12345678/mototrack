import { gql } from 'graphql-tag';
import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { MapsNode } from './maps.node.runtime.js';

/**
 * GraphQL schema for the maps aspect. The heavy lifting (raster tile
 * caching) happens on the browser via the Cache API, so the node-side
 * resolvers are stateless infrastructure hooks that the browser may
 * mirror or extend.
 */
export function createMapsGqlSchema(mapsNode: MapsNode): GqlSchema {
  return {
    typeDefs: gql`
      type LatLng {
        lat: Float!
        lng: Float!
      }

      input LatLngOptions {
        lat: Float!
        lng: Float!
      }

      type TileProvider {
        key: String!
        label: String!
        urlTemplate: String!
        attribution: String!
        maxZoom: Int
      }

      input TileProviderOptions {
        key: String!
        label: String!
        urlTemplate: String!
        attribution: String!
        maxZoom: Int
      }

      type CacheStats {
        tilesCached: Int!
        bytes: Int!
        oldest: Float
        newest: Float
      }

      type CacheTilesForRouteResult {
        tilesCached: Int!
        bytes: Int!
      }

      type Query {
        getOfflineCacheStats: CacheStats!
      }

      type Mutation {
        registerTileProvider(provider: TileProviderOptions!): Boolean!
        cacheTilesForRoute(
          route: [LatLngOptions!]!
          zoomLevels: [Int!]!
          bufferKm: Float!
        ): CacheTilesForRouteResult!
      }
    `,
    resolvers: {
      Query: {
        getOfflineCacheStats: () => mapsNode.getOfflineCacheStats(),
      },
      Mutation: {
        registerTileProvider: (_req, { provider }) =>
          mapsNode.registerTileProvider(provider),
        cacheTilesForRoute: (_req, { route, zoomLevels, bufferKm }) =>
          mapsNode.cacheTilesForRoute(route, zoomLevels, bufferKm),
      },
    },
  };
}
