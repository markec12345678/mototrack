import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { BalkanRoad, PlainBalkanRoad } from '@markec/balkan-roads.entities.balkan-road';

/**
 * Options for filtering roads returned by the hook.
 */
export type UseBalkanRoadsOptions = {
  /**
   * ISO country code to filter roads by (e.g. "SI", "HR", "ME").
   */
  country?: string;

  /**
   * Difficulty level to filter roads by (e.g. "Easy", "Moderate", "Hard", "Expert").
   */
  difficulty?: string;

  /**
   * Provide mock data to skip the GraphQL query and return seed data directly.
   * Useful for testing and Storybook-style compositions.
   */
  mockData?: BalkanRoad[];
};

/**
 * Return value of the useBalkanRoads hook.
 */
export type UseBalkanRoadsResult = {
  /**
   * The list of Balkan roads matching the applied filters.
   */
  roads: BalkanRoad[];

  /**
   * Whether the GraphQL query is currently in flight.
   */
  loading: boolean;

  /**
   * Any error that occurred during the query, or undefined.
   */
  error: Error | undefined;

  /**
   * Re-execute the query against the server.
   */
  refetch: () => void;
};

export const LIST_ROADS_QUERY = gql`
  query ListRoads($options: ListRoadsOptions) {
    listRoads(options: $options) {
      id
      name
      country
      flag
      lengthKm
      rating
      difficulty
      type
      description
    }
  }
`;

/**
 * A React hook that fetches Balkan motorcycle roads from a GraphQL API.
 *
 * Supports filtering by country and difficulty. Falls back to seed data
 * when mockData is provided, making it fully testable without a live server.
 *
 * @param options - Optional filters (country, difficulty) and mockData for testing.
 * @returns An object containing roads, loading state, error, and a refetch function.
 */
export function useBalkanRoads(options?: UseBalkanRoadsOptions): UseBalkanRoadsResult {
  const { country, difficulty, mockData } = options ?? {};

  const queryVariables = useMemo(() => {
    const vars: Record<string, string> = {};
    if (country) vars.country = country;
    if (difficulty) vars.difficulty = difficulty;
    return vars;
  }, [country, difficulty]);

  const { data, loading, error, refetch } = useQuery<{ listRoads: PlainBalkanRoad[] }>(
    LIST_ROADS_QUERY,
    {
      variables: { options: queryVariables },
      skip: !!mockData,
    }
  );

  const roads = useMemo(() => {
    if (mockData) return mockData;
    return (data?.listRoads ?? []).map((plain) => BalkanRoad.from(plain));
  }, [mockData, data]);

  if (mockData) {
    return {
      roads: mockData,
      loading: false,
      error: undefined,
      refetch: () => {},
    };
  }

  return {
    roads,
    loading,
    error,
    refetch: () => { refetch(); },
  };
}
