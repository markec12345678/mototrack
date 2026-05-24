import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Bike, PlainBike } from '@markec/garage.entities.bike';

// ─── GraphQL Documents ────────────────────────────────────────────────────────

const LIST_BIKES_QUERY = gql`
  query ListBikes {
    listBikes {
      id
      userId
      name
      model
      year
      mileageKm
      tankL
      consumptionLPer100
      currentFuelL
      color
      primary
    }
  }
`;

const SAVE_BIKE_MUTATION = gql`
  mutation SaveBike($input: BikeInput!) {
    saveBike(input: $input) {
      id
      userId
      name
      model
      year
      mileageKm
      tankL
      consumptionLPer100
      currentFuelL
      color
      primary
    }
  }
`;

const DELETE_BIKE_MUTATION = gql`
  mutation DeleteBike($id: ID!) {
    deleteBike(id: $id)
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type BikeInput = {
  id?: string;
  name: string;
  model: string;
  year: number;
  mileageKm: number;
  tankL: number;
  consumptionLPer100: number;
  currentFuelL: number;
  color: string;
  primary?: boolean;
};

export type UseBikesOptions = {
  /**
   * Provide mock data to skip the GraphQL query and return this data directly.
   * Useful for testing and Storybook compositions.
   */
  mockData?: Bike[];
};

export type UseBikesResult = {
  /**
   * The list of bikes fetched from the server.
   */
  bikes: Bike[];

  /**
   * Whether the query is currently loading.
   */
  loading: boolean;

  /**
   * Any error that occurred during the query.
   */
  error: Error | undefined;

  /**
   * Re-fetch the list of bikes from the server.
   */
  refetch: () => void;

  /**
   * Save (create or update) a bike.
   * Pass an id in the input to update an existing bike.
   */
  save: (input: BikeInput) => Promise<Bike | undefined>;

  /**
   * Delete a bike by its ID.
   * Returns true if the deletion was successful.
   */
  deleteBike: (id: string) => Promise<boolean>;

  /**
   * Returns the primary bike for the current user, or undefined if none is set.
   */
  getPrimary: () => Bike | undefined;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useBikes — manages the full lifecycle of a user's bikes.
 *
 * Provides list, save, delete, and getPrimary operations backed by GraphQL.
 * Pass `options.mockData` to bypass the network call and return mock data directly.
 *
 * @param options - Optional configuration including mockData for testing.
 * @returns An object containing bikes, loading/error state, and CRUD helpers.
 */
export function useBikes(options?: UseBikesOptions): UseBikesResult {
  const isMock = Boolean(options?.mockData);

  const queryResult = useQuery<{ listBikes: PlainBike[] }>(LIST_BIKES_QUERY, {
    skip: isMock,
  });

  const [saveBikeMutation] = useMutation<{ saveBike: PlainBike }, { input: BikeInput }>(
    SAVE_BIKE_MUTATION,
    { refetchQueries: [{ query: LIST_BIKES_QUERY }] }
  );

  const [deleteBikeMutation] = useMutation<{ deleteBike: boolean }, { id: string }>(
    DELETE_BIKE_MUTATION,
    { refetchQueries: [{ query: LIST_BIKES_QUERY }] }
  );

  const bikes = useMemo<Bike[]>(() => {
    if (isMock) return options?.mockData ?? [];
    return (queryResult.data?.listBikes ?? []).map((plain) => Bike.from(plain));
  }, [isMock, options?.mockData, queryResult.data]);

  const save = async (input: BikeInput): Promise<Bike | undefined> => {
    const result = await saveBikeMutation({ variables: { input } });
    const plain = result.data?.saveBike;
    return plain ? Bike.from(plain) : undefined;
  };

  const deleteBike = async (id: string): Promise<boolean> => {
    const result = await deleteBikeMutation({ variables: { id } });
    return result.data?.deleteBike ?? false;
  };

  const getPrimary = (): Bike | undefined => {
    return bikes.find((bike) => bike.primary);
  };

  if (isMock) {
    return {
      bikes,
      loading: false,
      error: undefined,
      refetch: () => {},
      save,
      deleteBike,
      getPrimary,
    };
  }

  return {
    bikes,
    loading: queryResult.loading,
    error: queryResult.error,
    refetch: queryResult.refetch,
    save,
    deleteBike,
    getPrimary,
  };
}
