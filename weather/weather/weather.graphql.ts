import { gql } from 'graphql-tag';
import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { WeatherNode } from './weather.node.runtime.js';

export type LocationOptionsInput = {
  lat: number;
  lng: number;
};

/**
 * Creates the GraphQL schema for the Weather aspect API.
 */
export function createWeatherGqlSchema(weatherNode: WeatherNode): GqlSchema {
  return {
    typeDefs: gql`
      input LocationOptions {
        lat: Float!
        lng: Float!
      }

      type WeatherSnapshot {
        tempC: Float!
        feelsLikeC: Float!
        windKmh: Float!
        windDirDeg: Float!
        gustKmh: Float
        humidity: Float!
        visibilityKm: Float!
        precipMmH: Float!
        wmoCode: Int!
        label: String!
        icon: String!
        ts: Int!
      }

      type Location {
        lat: Float!
        lng: Float!
      }

      type RouteWeather {
        location: Location!
        etaMin: Float!
        snapshot: WeatherSnapshot!
      }

      type ForecastDay {
        date: String!
        tempMinC: Float!
        tempMaxC: Float!
        precipMm: Float!
        windKmh: Float!
        wmoCode: Int!
        label: String!
        icon: String!
      }

      type Query {
        getCurrentWeather(location: LocationOptions!): WeatherSnapshot!
        getWeatherAlongRoute(geometry: [LocationOptions!]!, samples: Int): [RouteWeather!]!
        getForecast(location: LocationOptions!): [ForecastDay!]!
      }
    `,
    resolvers: {
      Query: {
        getCurrentWeather: async (
          _root: unknown,
          { location }: { location: LocationOptionsInput }
        ) => {
          const snapshot = await weatherNode.getCurrentWeather(location);
          return snapshot;
        },
        getWeatherAlongRoute: async (
          _root: unknown,
          {
            geometry,
            samples,
          }: { geometry: LocationOptionsInput[]; samples?: number | null }
        ) => {
          const result = await weatherNode.getWeatherAlongRoute(
            geometry,
            samples ?? undefined
          );
          return result;
        },
        getForecast: async (
          _root: unknown,
          { location }: { location: LocationOptionsInput }
        ) => {
          const days = await weatherNode.getForecast(location);
          return days;
        },
      },
    },
  };
}
