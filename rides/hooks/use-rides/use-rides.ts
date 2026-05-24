import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Ride } from '@markec/rides.entities.ride';

/**
 * Plain ride shape returned directly from the GraphQL API.
 */
type PlainRide = {
  id: string;
  userId: string;
  startedAt: number;
  endedAt: number;
  distanceKm: number;
  durationSec: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  climbM: number;
  descentM: number;
  twistinessScore: number;
  name?: string;
  notes?: string;
  track: Array<{
    lat: number;
    lng: number;
    ts: number;
    speed?: number;
    elevation?: number;
    accuracy?: number;
    heading?: number;
  }>;
};

const LIST_RIDES_QUERY = gql`
  query ListRides($options: ListRidesOptions) {
    listRides(options: $options) {
      id
      userId
      startedAt
      endedAt
      distanceKm
      durationSec
      maxSpeedKmh
      avgSpeedKmh
      climbM
      descentM
      twistinessScore
      name
      notes
      track {
        lat
        lng
        ts
        speed
        elevation
        accuracy
        heading
      }
    }
  }
`;

const CREATE_RIDE_MUTATION = gql`
  mutation CreateRide($input: CreateRideInput!) {
    createRide(input: $input) {
      id
      userId
      startedAt
      endedAt
      distanceKm
      durationSec
      maxSpeedKmh
      avgSpeedKmh
      climbM
      descentM
      twistinessScore
      name
      notes
      track {
        lat
        lng
        ts
        speed
        elevation
        accuracy
        heading
      }
    }
  }
`;

const DELETE_RIDE_MUTATION = gql`
  mutation DeleteRide($id: ID!) {
    deleteRide(id: $id)
  }
`;

/**
 * Input shape for creating a new ride, matching the CreateRideInput GraphQL type.
 */
export type CreateRideInput = {
  name?: string;
  notes?: string;
  startedAt: number;
  endedAt: number;
  track: Array<{
    lat: number;
    lng: number;
    ts: number;
    speed?: number;
    elevation?: number;
    accuracy?: number;
    heading?: number;
  }>;
};

/**
 * Optional filter options forwarded to the listRides query.
 */
export type ListRidesOptions = {
  limit?: number;
  offset?: number;
  from?: number;
  to?: number;
};

/**
 * Options accepted by useRides.
 */
export type UseRidesOptions = {
  /**
   * Provide mock rides to bypass the GraphQL query.
   * Useful in compositions and unit tests.
   */
  mockData?: Ride[];

  /**
   * Optional filter options forwarded to the listRides query.
   */
  listOptions?: ListRidesOptions;
};

/**
 * Return value of the useRides hook.
 */
export type UseRidesResult = {
  /** The list of Ride entities returned by the query (or mock data). */
  rides: Ride[];

  /** True while the query is in flight. */
  loading: boolean;

  /** Apollo error, if any. */
  error: Error | undefined;

  /** Re-executes the listRides query. */
  refetch: () => void;

  /** Creates a new ride via the createRide mutation. Returns the created Ride entity. */
  createRide: (input: CreateRideInput) => Promise<Ride | undefined>;

  /** Deletes a ride by ID via the deleteRide mutation. Returns true on success. */
  deleteRide: (id: string) => Promise<boolean>;
};

/**
 * useRides — GraphQL hook for the rides aspect node runtime.
 *
 * Fetches the rides list via the listRides query and exposes createRide
 * and deleteRide mutations. Accepts an optional mockData array for
 * compositions and tests — when provided the GraphQL query is skipped.
 *
 * @param options - Optional configuration including mockData and listOptions.
 * @returns UseRidesResult with rides, loading, error, refetch, createRide, deleteRide.
 */
export function useRides(options?: UseRidesOptions): UseRidesResult {
  const { mockData, listOptions } = options ?? {};
  const isMock = Boolean(mockData);

  const queryResult = useQuery<{ listRides: PlainRide[] }>(LIST_RIDES_QUERY, {
    variables: listOptions ? { options: listOptions } : undefined,
    skip: isMock,
  });

  const rides = useMemo(() => {
    if (isMock) return mockData ?? [];
    const raw = queryResult.data?.listRides;
    if (!raw) return [];
    return raw.map((r) => Ride.from(r));
  }, [isMock, mockData, queryResult.data]);

  const [createRideMutation] = useMutation<{ createRide: PlainRide }>(CREATE_RIDE_MUTATION);
  const [deleteRideMutation] = useMutation<{ deleteRide: boolean }>(DELETE_RIDE_MUTATION);

  const createRide = async (input: CreateRideInput): Promise<Ride | undefined> => {
    const result = await createRideMutation({ variables: { input } });
    if (!result.data?.createRide) return undefined;
    return Ride.from(result.data.createRide);
  };

  const deleteRide = async (id: string): Promise<boolean> => {
    const result = await deleteRideMutation({ variables: { id } });
    return result.data?.deleteRide ?? false;
  };

  const refetch = () => {
    if (!isMock) {
      queryResult.refetch();
    }
  };

  if (isMock) {
    return {
      rides: mockData ?? [],
      loading: false,
      error: undefined,
      refetch,
      createRide,
      deleteRide,
    };
  }

  return {
    rides,
    loading: queryResult.loading,
    error: queryResult.error,
    refetch,
    createRide,
    deleteRide,
  };
}
