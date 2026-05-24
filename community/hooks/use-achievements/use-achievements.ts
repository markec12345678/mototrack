import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { AchievementProgress } from '@markec/community.entities.achievement';

/**
 * GraphQL query to list all achievement progress entries for the current user.
 */
export const LIST_ACHIEVEMENTS_QUERY = gql`
  query ListAchievements {
    listAchievements {
      id
      name
      description
      icon
      unlocked
      progressPct
      unlockedAt
    }
  }
`;

export type UseAchievementsOptions = {
  /**
   * Provide mock data to bypass the GraphQL query.
   * When set, the hook returns this data immediately without making a network request.
   */
  mockData?: AchievementProgress[];
};

export type UseAchievementsResult = {
  /**
   * The list of achievement progress entries for the current user.
   */
  achievements: AchievementProgress[];

  /**
   * Whether the query is currently loading.
   */
  loading: boolean;

  /**
   * Any error that occurred during the query.
   */
  error: Error | undefined;

  /**
   * Refetch the achievements from the server.
   */
  refetch: () => void;
};

/**
 * A React hook for fetching the current user's achievement progress.
 *
 * Queries the GraphQL `listAchievements` endpoint and returns a list of
 * AchievementProgress entities. Supports a mock fallback via `options.mockData`
 * to enable testing and composition previews without a live GraphQL server.
 *
 * @param options - Optional configuration including mock data for testing.
 * @returns An object containing achievements, loading state, error, and a refetch function.
 */
export function useAchievements(options?: UseAchievementsOptions): UseAchievementsResult {
  const isMock = Boolean(options?.mockData);

  const { data, loading, error, refetch } = useQuery<{ listAchievements: AchievementProgress[] }>(
    LIST_ACHIEVEMENTS_QUERY,
    { skip: isMock }
  );

  const achievements = useMemo(
    () => data?.listAchievements ?? [],
    [data]
  );

  if (isMock) {
    return {
      achievements: options?.mockData ?? [],
      loading: false,
      error: undefined,
      refetch: () => {},
    };
  }

  return {
    achievements,
    loading,
    error,
    refetch,
  };
}
