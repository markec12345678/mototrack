import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { IconicTour, mockIconicTours } from '@markec/balkan-roads.entities.iconic-tour';

/**
 * GraphQL query to list all iconic tours.
 * Matches the schema: listTours(options: ListToursOptions): [IconicTour!]!
 */
export const LIST_TOURS_QUERY = gql`
  query ListIconicTours($country: String, $difficulty: String) {
    listTours(options: { country: $country, difficulty: $difficulty }) {
      id
      name
      country
      flag
      distanceKm
      rating
      difficulty
      description
      waypoints {
        lat
        lng
        name
      }
    }
  }
`;

/**
 * GraphQL query to fetch a single iconic tour by ID.
 * Matches the schema: getTour(options: GetTourOptions!): IconicTour
 */
export const GET_TOUR_QUERY = gql`
  query GetIconicTour($id: String!) {
    getTour(options: { id: $id }) {
      id
      name
      country
      flag
      distanceKm
      rating
      difficulty
      description
      waypoints {
        lat
        lng
        name
      }
    }
  }
`;

export type UseIconicToursOptions = {
  /**
   * Filter tours by country ISO code (e.g. "SI", "HR").
   */
  country?: string;

  /**
   * Filter tours by difficulty level (e.g. "Easy", "Hard").
   */
  difficulty?: string;

  /**
   * Provide mock data to bypass GraphQL and use seed-data fallback.
   * When set, the GraphQL query is skipped entirely.
   */
  mockData?: IconicTour[];
};

export type UseIconicToursResult = {
  /**
   * The list of iconic tours returned by the query or mock data.
   */
  tours: IconicTour[];

  /**
   * Whether the query is currently in flight.
   */
  loading: boolean;

  /**
   * Any error that occurred during the query.
   */
  error: Error | undefined;

  /**
   * Retrieve a single tour by its ID from the currently loaded tours list.
   * Returns undefined if the tour is not found.
   */
  getTour: (id: string) => IconicTour | undefined;
};

type RawTour = {
  id: string;
  name: string;
  country: string;
  flag: string;
  distanceKm: number;
  rating: number;
  difficulty: string;
  description: string;
  waypoints: Array<{ lat: number; lng: number; name?: string }>;
};

/**
 * useIconicTours — fetches the list of iconic Balkan motorcycle tours.
 *
 * Backed by a GraphQL query (listTours). When mockData is provided in options,
 * the network call is skipped and the mock data is returned immediately,
 * making the hook fully testable without an Apollo server.
 *
 * Falls back to seed data when the GraphQL response is empty.
 *
 * @param options - Optional filters (country, difficulty) and mockData override.
 * @returns tours, loading, error, and a getTour(id) helper.
 */
export function useIconicTours(options?: UseIconicToursOptions): UseIconicToursResult {
  const { country, difficulty, mockData } = options ?? {};

  const { data, loading, error } = useQuery<{ listTours: RawTour[] }>(LIST_TOURS_QUERY, {
    variables: { country, difficulty },
    skip: !!mockData,
  });

  const tours = useMemo<IconicTour[]>(() => {
    if (mockData) {
      return mockData;
    }

    const raw = data?.listTours;

    if (!raw || raw.length === 0) {
      return mockIconicTours();
    }

    return raw.map((item) => IconicTour.from(item));
  }, [mockData, data]);

  const getTour = useMemo(
    () =>
      (id: string): IconicTour | undefined =>
        tours.find((t) => t.id === id),
    [tours]
  );

  return {
    tours,
    loading: mockData ? false : loading,
    error: mockData ? undefined : (error as Error | undefined),
    getTour,
  };
}
