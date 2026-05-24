import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

/**
 * A single lat/lng coordinate along the route.
 */
export type LatLng = {
  lat: number;
  lng: number;
};

/**
 * A weather snapshot at a specific point along the route.
 */
export type RouteWeatherSnapshot = {
  tempC: number;
  feelsLikeC: number;
  windKmh: number;
  windDirDeg: number;
  gustKmh: number | null;
  humidity: number;
  visibilityKm: number;
  precipMmH: number;
  wmoCode: number;
  label: string;
  icon: string;
  ts: number;
};

/**
 * A location returned from the GraphQL API.
 */
export type RouteLocation = {
  lat: number;
  lng: number;
};

/**
 * A single route weather sample — location, ETA, and weather snapshot.
 */
export type RouteWeather = {
  location: RouteLocation;
  etaMin: number;
  snapshot: RouteWeatherSnapshot;
};

/**
 * Options for the useRouteWeather hook.
 */
export type UseRouteWeatherOptions = {
  /**
   * Provide mock data to skip the GraphQL query entirely (useful for testing).
   */
  mockData?: RouteWeather[];
};

const GET_WEATHER_ALONG_ROUTE = gql`
  query GetWeatherAlongRoute($geometry: [LocationOptions!]!, $samples: Int) {
    getWeatherAlongRoute(geometry: $geometry, samples: $samples) {
      location {
        lat
        lng
      }
      etaMin
      snapshot {
        tempC
        feelsLikeC
        windKmh
        windDirDeg
        gustKmh
        humidity
        visibilityKm
        precipMmH
        wmoCode
        label
        icon
        ts
      }
    }
  }
`;

/**
 * Samples evenly-spaced points from a route geometry array.
 * Always includes the first and last point.
 */
function sampleRoute(route: LatLng[], samples: number): LatLng[] {
  if (route.length === 0) return [];
  if (route.length <= samples) return route;

  const result: LatLng[] = [];
  const step = (route.length - 1) / (samples - 1);

  for (let i = 0; i < samples; i++) {
    const index = Math.round(i * step);
    result.push(route[index]);
  }

  return result;
}

/**
 * A React hook that fetches weather data along a route using GraphQL.
 *
 * @param route - Array of lat/lng coordinates representing the route geometry.
 * @param samples - Number of evenly-spaced sample points to request. Defaults to 5.
 * @param options - Optional configuration including mockData for testing.
 * @returns An object containing the array of RouteWeather samples, loading state, and error.
 */
export function useRouteWeather(
  route: LatLng[],
  samples: number = 5,
  options?: UseRouteWeatherOptions
) {
  const sampledGeometry = useMemo(
    () => sampleRoute(route, samples),
    [route, samples]
  );

  const skip = !!options?.mockData || sampledGeometry.length === 0;

  const { data, loading, error, refetch } = useQuery<{
    getWeatherAlongRoute: RouteWeather[];
  }>(GET_WEATHER_ALONG_ROUTE, {
    variables: {
      geometry: sampledGeometry,
      samples,
    },
    skip,
  });

  const routeWeather = useMemo<RouteWeather[]>(() => {
    if (options?.mockData) return options.mockData;
    return data?.getWeatherAlongRoute ?? [];
  }, [data, options?.mockData]);

  if (options?.mockData) {
    return {
      routeWeather: options.mockData,
      loading: false,
      error: undefined,
      refetch: async () => {},
    };
  }

  return {
    routeWeather,
    loading,
    error,
    refetch,
  };
}
