import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Challenge } from '@markec/community.entities.challenge';

/**
 * GraphQL query for listing challenges, optionally filtered by status.
 */
const LIST_CHALLENGES_QUERY = gql`
  query ListChallenges($options: ListChallengesOptions) {
    listChallenges(options: $options) {
      id
      name
      description
      icon
      points
      status
      endsAt
      participants
      joined
      progressPct
    }
  }
`;

/**
 * GraphQL mutation for joining a challenge by ID.
 */
const JOIN_CHALLENGE_MUTATION = gql`
  mutation JoinChallenge($id: String!) {
    joinChallenge(id: $id)
  }
`;

export type UseChallengesOptions = {
  /**
   * Optional mock data to bypass GraphQL fetching — useful in tests and compositions.
   */
  mockData?: Challenge[];
};

export type UseChallengesResult = {
  /**
   * All challenges returned by the query (active + past).
   */
  challenges: Challenge[];

  /**
   * Returns only challenges with status "active".
   */
  listActive: () => Challenge[];

  /**
   * Returns only challenges with status "past" or "completed".
   */
  listPast: () => Challenge[];

  /**
   * Joins a challenge by its ID. Returns true on success.
   */
  join: (id: string) => Promise<boolean>;

  /**
   * Whether the initial challenges query is loading.
   */
  loading: boolean;

  /**
   * Error from the challenges query, if any.
   */
  error: Error | undefined;

  /**
   * Re-fetches the challenges list.
   */
  refetch: () => void;

  /**
   * Whether the join mutation is in flight.
   */
  joining: boolean;

  /**
   * Error from the join mutation, if any.
   */
  joinError: Error | undefined;
};

/**
 * A React hook for managing community challenges.
 *
 * Provides methods to list active challenges, list past challenges,
 * and join a challenge by ID. Supports mock data for testing and compositions.
 *
 * @param options - Optional configuration including mockData for bypassing GraphQL.
 * @returns An object with challenges data, listActive, listPast, join, and query state.
 */
export function useChallenges(options?: UseChallengesOptions): UseChallengesResult {
  const hasMock = Boolean(options?.mockData);

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery<{ listChallenges: Challenge[] }>(LIST_CHALLENGES_QUERY, {
    skip: hasMock,
  });

  const [joinMutation, { loading: joining, error: joinError }] = useMutation<
    { joinChallenge: boolean },
    { id: string }
  >(JOIN_CHALLENGE_MUTATION);

  const challenges = useMemo<Challenge[]>(() => {
    if (hasMock) return options?.mockData ?? [];
    return data?.listChallenges ?? [];
  }, [data, hasMock, options?.mockData]);

  const listActive = (): Challenge[] =>
    challenges.filter((c) => c.status === 'active');

  const listPast = (): Challenge[] =>
    challenges.filter((c) => c.status === 'past' || c.status === 'completed');

  const join = async (id: string): Promise<boolean> => {
    const result = await joinMutation({ variables: { id } });
    return result.data?.joinChallenge ?? false;
  };

  return {
    challenges,
    listActive,
    listPast,
    join,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
    joining,
    joinError,
  };
}
