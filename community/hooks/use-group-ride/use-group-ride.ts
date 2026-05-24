import { useCallback, useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { GroupRide } from '@markec/community.entities.group-ride';
import { createGroupRideChatConnection, GroupRideChatConnection } from './use-group-ride-chat.js';

export type GroupRideParticipantStatus = 'pripravljen' | 'na-poti' | 'odmor' | 'konec';

// ─── GraphQL ─────────────────────────────────────────────────────────────────

const LIST_GROUP_RIDES = gql`
  query ListGroupRides {
    listGroupRides {
      id
      name
      startAt
      routeId
      host {
        id
        displayName
      }
      meetingPoint {
        lat
        lng
        label
      }
      participants {
        id
        displayName
        status
      }
    }
  }
`;

const CREATE_GROUP_RIDE = gql`
  mutation CreateGroupRide($input: CreateGroupRideOptions!) {
    createGroupRide(input: $input) {
      id
      name
      startAt
      routeId
      host {
        id
        displayName
      }
      meetingPoint {
        lat
        lng
        label
      }
      participants {
        id
        displayName
        status
      }
    }
  }
`;

// ─── Input types ──────────────────────────────────────────────────────────────

export type GroupRideMeetingPointInput = {
  lat: number;
  lng: number;
  label: string;
};

export type CreateGroupRideInput = {
  name: string;
  startAt: number;
  meetingPoint: GroupRideMeetingPointInput;
  routeId?: string;
};

// ─── Options ─────────────────────────────────────────────────────────────────

export type UseGroupRideOptions = {
  /**
   * Provide mock data to skip the GraphQL query and return a static result.
   * Useful for testing and Storybook compositions.
   */
  mockData?: GroupRide[];
};

// ─── Return type ─────────────────────────────────────────────────────────────

export type UseGroupRideResult = {
  /**
   * List of currently active group rides.
   */
  rides: GroupRide[];

  /**
   * Whether the list query is in flight.
   */
  loading: boolean;

  /**
   * Error from the list query, if any.
   */
  error: Error | undefined;

  /**
   * Refetch the list of active group rides.
   */
  refetch: () => void;

  /**
   * Create a new group ride.
   * @param input - The ride creation payload.
   * @returns The newly created GroupRide.
   */
  create: (input: CreateGroupRideInput) => Promise<GroupRide>;

  /**
   * Join an existing group ride with an initial participant status.
   * Falls back to a REST POST when the GraphQL mutation is unavailable.
   * @param id - The ride ID to join.
   * @param status - Initial participant status.
   */
  join: (id: string, status: GroupRideParticipantStatus) => Promise<void>;

  /**
   * Update the caller's participant status in a ride.
   * Falls back to a REST PATCH when the GraphQL mutation is unavailable.
   * @param id - The ride ID.
   * @param status - New participant status.
   */
  updateStatus: (id: string, status: GroupRideParticipantStatus) => Promise<void>;

  /**
   * Open a Socket.io-backed chat connection for a given ride.
   * Connects to the WebSocket path /group-rides/:id.
   * Returns a wrapper with sendMessage / onMessage helpers and a REST fallback.
   * @param id - The ride ID.
   */
  chat: (id: string) => GroupRideChatConnection;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useGroupRide — primary hook for managing group rides.
 *
 * Provides:
 * - rides        — reactive list of active rides (GraphQL query)
 * - create       — create a new ride (GraphQL mutation)
 * - join         — join a ride with an initial status (REST fallback)
 * - updateStatus — update participant status in a ride (REST fallback)
 * - chat         — factory that opens a Socket.io chat connection for a ride
 *
 * @param options - Optional configuration including mock data for testing.
 */
export function useGroupRide(options?: UseGroupRideOptions): UseGroupRideResult {
  const { mockData } = options ?? {};

  const { data, loading, error, refetch } = useQuery<{ listGroupRides: GroupRide[] }>(
    LIST_GROUP_RIDES,
    { skip: !!mockData }
  );

  const [createGroupRideMutation] = useMutation<
    { createGroupRide: GroupRide },
    { input: CreateGroupRideInput }
  >(CREATE_GROUP_RIDE);

  const rides = useMemo<GroupRide[]>(() => {
    if (mockData) return mockData;
    return data?.listGroupRides ?? [];
  }, [mockData, data]);

  const create = useCallback(
    async (input: CreateGroupRideInput): Promise<GroupRide> => {
      const result = await createGroupRideMutation({ variables: { input } });
      if (!result.data) throw new Error('Failed to create group ride');
      return result.data.createGroupRide;
    },
    [createGroupRideMutation]
  );

  const join = useCallback(
    async (id: string, status: GroupRideParticipantStatus): Promise<void> => {
      await fetch(`/api/group-rides/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      refetch();
    },
    [refetch]
  );

  const updateStatus = useCallback(
    async (id: string, status: GroupRideParticipantStatus): Promise<void> => {
      await fetch(`/api/group-rides/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      refetch();
    },
    [refetch]
  );

  const chat = useCallback((id: string): GroupRideChatConnection => {
    return createGroupRideChatConnection(id);
  }, []);

  return {
    rides,
    loading: mockData ? false : loading,
    error: mockData ? undefined : error,
    refetch,
    create,
    join,
    updateStatus,
    chat,
  };
}
