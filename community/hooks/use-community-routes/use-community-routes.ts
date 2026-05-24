import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { CommunityRoute } from '@markec/community.entities.community-route';

/**
 * Filter options for listing community routes.
 */
export type ListCommunityRoutesFilter = {
  /** Filter by country code or name. */
  country?: string;
  /** Filter by difficulty level (e.g. "easy", "medium", "hard"). */
  difficulty?: string;
};

/**
 * Options accepted by the useCommunityRoutes hook.
 */
export type UseCommunityRoutesOptions = {
  /** Provide mock data to skip the GraphQL query (useful in tests and compositions). */
  mockData?: CommunityRoute[];
};

/**
 * Return value of the useCommunityRoutes hook.
 */
export type UseCommunityRoutesResult = {
  /** The list of community routes. */
  routes: CommunityRoute[];
  /** Whether the query is in flight. */
  loading: boolean;
  /** Any error that occurred during the query. */
  error: Error | undefined;
  /** Re-fetch the list of routes. */
  refetch: () => void;
};

const LIST_COMMUNITY_ROUTES_QUERY = gql`
  query ListCommunityRoutes($options: ListCommunityRoutesOptions) {
    listCommunityRoutes(options: $options) {
      id
      name
      author
      country
      distanceKm
      durationSec
      difficulty
      rating
      likes
      geometry {
        lat
        lng
      }
    }
  }
`;

/**
 * Hook for fetching a list of community routes with optional filtering.
 *
 * @param filter - Optional filter to narrow results by country or difficulty.
 * @param options - Optional hook options, including mockData for testing.
 * @returns An object with routes, loading state, error, and a refetch function.
 */
export function useCommunityRoutes(
  filter?: ListCommunityRoutesFilter,
  options?: UseCommunityRoutesOptions
): UseCommunityRoutesResult {
  const { data, loading, error, refetch } = useQuery<{
    listCommunityRoutes: CommunityRoute[];
  }>(LIST_COMMUNITY_ROUTES_QUERY, {
    variables: { options: filter },
    skip: !!options?.mockData,
  });

  const routes = useMemo(() => {
    if (options?.mockData) return options.mockData;
    return data?.listCommunityRoutes ?? [];
  }, [data, options?.mockData]);

  if (options?.mockData) {
    return {
      routes: options.mockData,
      loading: false,
      error: undefined,
      refetch: () => {},
    };
  }

  return {
    routes,
    loading,
    error,
    refetch: () => { refetch(); },
  };
}
