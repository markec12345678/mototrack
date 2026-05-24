import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { LeaderboardEntry, PlainLeaderboardEntry } from '@markec/community.entities.leaderboard-entry';

/**
 * GraphQL query for fetching the leaderboard.
 * Accepts period, sortBy, and an optional limit.
 */
const GET_LEADERBOARD_QUERY = gql`
  query GetLeaderboard($period: String!, $sortBy: String!, $limit: Int) {
    getLeaderboard(options: { period: $period, sortBy: $sortBy, limit: $limit }) {
      rank
      userId
      displayName
      country
      km
      rides
      points
      me
    }
  }
`;

export type UseLeaderboardOptions = {
  /**
   * Maximum number of entries to return.
   */
  limit?: number;

  /**
   * Provide mock data to skip the GraphQL query and return immediately.
   * Useful for testing and Storybook compositions.
   */
  mockData?: LeaderboardEntry[];
};

export type UseLeaderboardResult = {
  /**
   * The list of leaderboard entries.
   */
  entries: LeaderboardEntry[];

  /**
   * Whether the query is currently loading.
   */
  loading: boolean;

  /**
   * Any error that occurred during the query.
   */
  error: Error | undefined;

  /**
   * Refetch the leaderboard data.
   */
  refetch: () => void;
};

/**
 * A React hook for fetching the community leaderboard via GraphQL.
 *
 * @param period - The time period for the leaderboard (e.g. "weekly", "monthly", "alltime").
 * @param sortBy - The field to sort by (e.g. "points", "km", "rides").
 * @param options - Optional configuration including limit and mockData for testing.
 * @returns An object containing the leaderboard entries, loading state, error, and refetch function.
 */
export function useLeaderboard(
  period: string,
  sortBy: string,
  options?: UseLeaderboardOptions
): UseLeaderboardResult {
  const { limit, mockData } = options ?? {};

  const { data, loading, error, refetch } = useQuery<{
    getLeaderboard: PlainLeaderboardEntry[];
  }>(GET_LEADERBOARD_QUERY, {
    variables: { period, sortBy, limit },
    skip: !!mockData,
  });

  const entries = useMemo<LeaderboardEntry[]>(() => {
    if (mockData) return mockData;
    if (!data?.getLeaderboard) return [];
    return data.getLeaderboard.map((entry) => LeaderboardEntry.from(entry));
  }, [data, mockData]);

  if (mockData) {
    return {
      entries: mockData,
      loading: false,
      error: undefined,
      refetch: () => {},
    };
  }

  return {
    entries,
    loading,
    error,
    refetch: () => { refetch(); },
  };
}
