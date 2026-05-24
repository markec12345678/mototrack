import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * Result of the uselikeRoute hook.
 */
export type UseLikeRouteResult = {
  /** Call this function with a route ID to like it. */
  likeRoute: (id: string) => Promise<boolean>;
  /** Whether the mutation is in flight. */
  loading: boolean;
  /** Any error that occurred during the mutation. */
  error: Error | undefined;
};

/**
 * NOTE: The GraphQL schema does not expose a dedicated "like" mutation.
 * This hook uses the rateRoute mutation with a quality score of 5 to
 * express a "like" action, which is the closest available operation.
 * All other rating dimensions default to 3 (neutral).
 */
const LIKE_ROUTE_MUTATION = gql`
  mutation LikeRoute($input: RateRouteOptions!) {
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
 * Hook for liking a community route by its ID.
 * Internally submits a high-quality rating to express a like.
 *
 * @returns An object with the likeRoute function, loading state, and error.
 */
export function useLikeRoute(): UseLikeRouteResult {
  const [likeRouteMutation, { loading, error }] = useMutation(LIKE_ROUTE_MUTATION);

  const likeRoute = async (id: string): Promise<boolean> => {
    try {
      await likeRouteMutation({
        variables: {
          input: {
            routeId: id,
            quality: 5,
            scenery: 3,
            twistiness: 3,
            difficulty: 3,
          },
        },
      });
      return true;
    } catch {
      return false;
    }
  };

  return {
    likeRoute,
    loading,
    error,
  };
}
