import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { MaintenanceItem, PlainMaintenanceItem } from '@markec/garage.entities.maintenance-item';

// ─── Fragments ────────────────────────────────────────────────────────────────

const MAINTENANCE_ITEM_FIELDS = gql`
  fragment MaintenanceItemFields on MaintenanceItem {
    id
    bikeId
    name
    intervalKm
    intervalDays
    lastServiceKm
    lastServiceAt
    history {
      atKm
      atDate
      note
    }
  }
`;

// ─── Queries ──────────────────────────────────────────────────────────────────

const LIST_MAINTENANCE = gql`
  query ListMaintenance($bikeId: ID!) {
    listMaintenance(bikeId: $bikeId) {
      ...MaintenanceItemFields
    }
  }
  ${MAINTENANCE_ITEM_FIELDS}
`;

// ─── Mutations ────────────────────────────────────────────────────────────────

const SAVE_MAINTENANCE = gql`
  mutation SaveMaintenance($input: MaintenanceInput!) {
    saveMaintenance(input: $input) {
      ...MaintenanceItemFields
    }
  }
  ${MAINTENANCE_ITEM_FIELDS}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type MaintenanceHistoryItemInput = {
  atKm: number;
  atDate: number;
  note?: string;
};

export type SaveMaintenanceInput = {
  id?: string;
  name: string;
  intervalKm: number;
  intervalDays: number;
  lastServiceKm: number;
  lastServiceAt: number;
  history?: MaintenanceHistoryItemInput[];
};

type MaintenanceMutationInput = SaveMaintenanceInput & { bikeId: string };

export type UseMaintenanceOptions = {
  /**
   * Optional mock data for testing — skips the GraphQL query when provided.
   */
  mockData?: MaintenanceItem[];
};

export type UseMaintenanceResult = {
  /**
   * The list of maintenance items for the bike.
   */
  items: MaintenanceItem[];

  /**
   * Whether the query is currently loading.
   */
  loading: boolean;

  /**
   * Any error that occurred during the query.
   */
  error: Error | undefined;

  /**
   * Refetch the maintenance list.
   */
  refetch: () => void;

  /**
   * Save (create or update) a maintenance item.
   */
  save: (input: SaveMaintenanceInput) => Promise<MaintenanceItem | undefined>;

  /**
   * Mark a maintenance item as serviced by recording a history entry
   * and updating lastServiceKm / lastServiceAt.
   */
  markServiced: (
    itemId: string,
    atKm: number,
    atDate: number,
    note?: string
  ) => Promise<MaintenanceItem | undefined>;

  /**
   * Whether a save or markServiced mutation is in flight.
   */
  saving: boolean;
};

/**
 * useMaintenance — manages the maintenance schedule for a single bike.
 *
 * @param bikeId - The ID of the bike whose maintenance items to manage.
 * @param options - Optional configuration, including mockData for testing.
 * @returns An object with list data, loading/error state, and save/markServiced actions.
 */
export function useMaintenance(
  bikeId: string,
  options?: UseMaintenanceOptions
): UseMaintenanceResult {
  const isMock = Boolean(options?.mockData);

  // ─── Query ─────────────────────────────────────────────────────────────────

  const queryResult = useQuery<{ listMaintenance: PlainMaintenanceItem[] }>(
    LIST_MAINTENANCE,
    {
      variables: { bikeId },
      skip: isMock,
    }
  );

  const items = useMemo<MaintenanceItem[]>(() => {
    if (isMock) return options?.mockData ?? [];
    const raw = queryResult.data?.listMaintenance;
    if (!raw) return [];
    return raw.map((plain) => MaintenanceItem.from(plain));
  }, [isMock, options?.mockData, queryResult.data]);

  // ─── Mutation ──────────────────────────────────────────────────────────────

  const [saveMaintenanceMutation, { loading: saving }] = useMutation<
    { saveMaintenance: PlainMaintenanceItem },
    { input: MaintenanceMutationInput }
  >(SAVE_MAINTENANCE);

  // ─── Actions ───────────────────────────────────────────────────────────────

  const save = async (
    input: SaveMaintenanceInput
  ): Promise<MaintenanceItem | undefined> => {
    const result = await saveMaintenanceMutation({
      variables: {
        input: {
          ...input,
          bikeId,
        },
      },
      refetchQueries: [{ query: LIST_MAINTENANCE, variables: { bikeId } }],
    });

    const plain = result.data?.saveMaintenance;
    return plain ? MaintenanceItem.from(plain) : undefined;
  };

  const markServiced = async (
    itemId: string,
    atKm: number,
    atDate: number,
    note?: string
  ): Promise<MaintenanceItem | undefined> => {
    const existing = items.find((item) => item.id === itemId);
    const existingHistory = existing?.history ?? [];
    const historyEntry: MaintenanceHistoryItemInput = { atKm, atDate, note };

    const result = await saveMaintenanceMutation({
      variables: {
        input: {
          id: itemId,
          bikeId,
          name: existing?.name ?? '',
          intervalKm: existing?.intervalKm ?? 0,
          intervalDays: existing?.intervalDays ?? 0,
          lastServiceKm: atKm,
          lastServiceAt: atDate,
          history: [...existingHistory, historyEntry],
        },
      },
      refetchQueries: [{ query: LIST_MAINTENANCE, variables: { bikeId } }],
    });

    const plain = result.data?.saveMaintenance;
    return plain ? MaintenanceItem.from(plain) : undefined;
  };

  return {
    items,
    loading: isMock ? false : queryResult.loading,
    error: isMock ? undefined : queryResult.error,
    refetch: queryResult.refetch,
    save,
    markServiced,
    saving,
  };
}
