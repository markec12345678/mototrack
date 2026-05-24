import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { RouteRating } from '@markec/community.entities.route-rating';

/**
 * Input for rating a community route.
 */
export type RateRouteInput = {
  /** The ID of the route to rate. */
  routeId: string;
  /** Overall quality score (1-5). */
  quality: number;
  /** Scenery score (1-5). */
  scenery: number;
  /** Twistiness score (1-5). */
  twistiness: number;
  /** Difficulty score (1-5). */
  difficulty: number;
  /** Optional comment about the route. */
  comment?: string;
};

/**
 * Result of the useRateRoute hook.
 */
export type UseRateRouteResult = {
  /** Call this function with rating input to submit a route rating. */
  rateRoute: (input: RateRouteInput) => Promise<RouteRating | null>;
  /** Whether the mutation is in flight. */
  loading: boolean;
  /** Any error that occurred during the mutation. */
  error: Error | undefined;
  /** The last successfully submitted rating. */
  data: RouteRating | null;
};

const RATE_ROUTE_MUTATION = gql`
  mutation RateRoute($input: RateRouteOptions!) {
    rateRoute(input: $input) {
      id
      routeId
      userId
      quality
      scenery
      twistiness
      difficulty
      comment
      createdAt
    }
  }
`;

/**
 * Hook for rating a community route.
 *
 * @returns An object with the rateRoute function, loading state, error, and the last submitted rating data.
 */
export function useRateRoute(): UseRateRouteResult {
  const [rateRouteMutation, { loading, error, data }] = useMutation<{
    rateRoute: RouteRating;
  }>(RATE_ROUTE_MUTATION);

  const rateRoute = async (input: RateRouteInput): Promise<RouteRating | null> => {
    try {
      const result = await rateRouteMutation({
        variables: { input },
      });
      return result.data?.rateRoute ?? null;
    } catch {
      return null;
    }
  };

  return {
    rateRoute,
    loading,
    error,
    data: data?.rateRoute ?? null,
  };
}
