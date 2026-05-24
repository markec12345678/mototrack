import { useState, useEffect, useCallback, useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { WeatherSnapshot } from '@markec/weather.entities.weather-snapshot';

const AUTO_REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const GET_CURRENT_WEATHER = gql`
  query GetCurrentWeather($location: LocationOptions!) {
    getCurrentWeather(location: $location) {
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
`;

export type LocationOptions = {
  lat: number;
  lng: number;
};

export type UseCurrentWeatherOptions = {
  /**
   * Optional mock data for testing — skips the GraphQL query when provided.
   */
  mockData?: WeatherSnapshot;
};

export type UseCurrentWeatherResult = {
  /**
   * The latest weather snapshot, or undefined while loading.
   */
  snapshot: WeatherSnapshot | undefined;

  /**
   * True while the query is in-flight.
   */
  isLoading: boolean;

  /**
   * Error message if the query failed, otherwise undefined.
   */
  error: string | undefined;

  /**
   * Manually trigger a weather refresh.
   */
  refresh: () => void;
};

/**
 * Hook that fetches the current weather for a given location via the
 * `getCurrentWeather` GraphQL query. Automatically re-fetches every 10 minutes.
 *
 * @param location - Latitude and longitude of the target location.
 * @param options - Optional configuration, including `mockData` for testing.
 * @returns An object containing `snapshot`, `isLoading`, `error`, and `refresh`.
 */
export function useCurrentWeather(
  location: LocationOptions,
  options?: UseCurrentWeatherOptions
): UseCurrentWeatherResult {
  const isMock = !!options?.mockData;

  const { data, loading, error, refetch } = useQuery<{
    getCurrentWeather: WeatherSnapshot;
  }>(GET_CURRENT_WEATHER, {
    variables: { location },
    skip: isMock,
    pollInterval: AUTO_REFRESH_INTERVAL_MS,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    if (isMock) {
      setRefreshKey((k) => k + 1);
      return;
    }
    refetch();
  }, [isMock, refetch]);

  const snapshot = useMemo<WeatherSnapshot | undefined>(() => {
    if (isMock) return options?.mockData;
    if (!data?.getCurrentWeather) return undefined;
    return data.getCurrentWeather;
  }, [data, isMock, options?.mockData, refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    snapshot,
    isLoading: isMock ? false : loading,
    error: isMock ? undefined : error?.message,
    refresh,
  };
}
