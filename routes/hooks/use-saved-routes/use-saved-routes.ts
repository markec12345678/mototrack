import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { PlannedRoute } from '@markec/routes.entities.planned-route';

// ─── GraphQL Documents ────────────────────────────────────────────────────────

const LIST_SAVED_ROUTES = gql`
  query ListSavedRoutes {
    listSavedRoutes {
      id
      userId
      name
      waypoints {
        id
        name
        lat
        lng
      }
      mode
      geometry {
        lat
        lng
      }
      distanceKm
      durationSec
      notes
      createdAt
    }
  }
`;

const SAVE_ROUTE = gql`
  mutation SaveRoute($options: SaveRouteInputOptions) {
    saveRoute(options: $options) {
      id
      userId
      name
      waypoints {
        id
        name
        lat
        lng
      }
      mode
      geometry {
        lat
        lng
      }
      distanceKm
      durationSec
      notes
      createdAt
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Input for saving or updating a route.
 */
export type SaveRouteInput = {
  name: string;
  waypoints: Array<{
    id: string;
    name?: string | null;
    lat: number;
    lng: number;
  }>;
  mode: string;
  geometry: Array<{ lat: number; lng: number }>;
  distanceKm: number;
  durationSec: number;
  notes?: string | null;
};

/**
 * Options for the useSavedRoutes hook.
 */
export type UseSavedRoutesOptions = {
  /**
   * Provide mock data to bypass the GraphQL query entirely.
   * Useful in compositions and unit tests.
   */
  mockData?: PlannedRoute[];
};

/**
 * Return value of the useSavedRoutes hook.
 */
export type UseSavedRoutesResult = {
  /** Saved routes fetched from the server (or mock data). */
  routes: PlannedRoute[];
  /** True while the list query is in-flight. */
  loading: boolean;
  /** Error from the list query, if any. */
  error: Error | undefined;
  /** Refetch the saved-routes list. */
  refetch: () => void;
  /**
   * Persist a new route to the library.
   * Resolves with the saved PlannedRoute on success.
   */
  save: (input: SaveRouteInput) => Promise<PlannedRoute | undefined>;
  /** Loading state for the save mutation. */
  saving: boolean;
  /**
   * Delete a route by id.
   * NOTE: The current GraphQL schema has no deleteSavedRoute mutation,
   * so this performs an optimistic client-side removal only.
   */
  deleteRoute: (id: string) => void;
  /**
   * Update an existing route (re-saves with the same name).
   * Resolves with the updated PlannedRoute on success.
   */
  update: (input: SaveRouteInput) => Promise<PlannedRoute | undefined>;
};

// ─── Raw GQL shape ────────────────────────────────────────────────────────────

type RawSavedRoute = {
  id: string;
  userId?: string | null;
  name: string;
  waypoints: Array<{ id: string; name?: string | null; lat: number; lng: number }>;
  mode: string;
  geometry: Array<{ lat: number; lng: number }>;
  distanceKm: number;
  durationSec: number;
  notes?: string | null;
  createdAt: number;
};

/**
 * Converts a raw GQL response into a shape compatible with PlainPlannedRoute.
 * Casts mode to the RouteMode union and strips null values to undefined.
 */
function rawToPlain(r: RawSavedRoute) {
  return {
    id: r.id,
    userId: r.userId ?? undefined,
    name: r.name,
    waypoints: r.waypoints.map((wp) => ({ ...wp, name: wp.name ?? undefined })),
    mode: r.mode as 'paved' | 'twisty' | 'offroad',
    geometry: r.geometry,
    distanceKm: r.distanceKm,
    durationSec: r.durationSec,
    notes: r.notes ?? undefined,
    createdAt: r.createdAt,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useSavedRoutes — GraphQL hook for the user's route library.
 *
 * Fetches the list of saved routes and exposes save, deleteRoute, and update
 * mutation helpers. Pass mockData in options to bypass the network entirely,
 * which is useful for compositions and unit tests.
 *
 * @param options - Optional configuration including mockData for offline use.
 * @returns An object containing routes, loading/error state, and mutation helpers.
 */
export function useSavedRoutes(options?: UseSavedRoutesOptions): UseSavedRoutesResult {
  const isMock = Boolean(options?.mockData);

  // ── Query ──────────────────────────────────────────────────────────────────
  const queryResult = useQuery<{ listSavedRoutes: RawSavedRoute[] }>(LIST_SAVED_ROUTES, {
    skip: isMock,
  });

  const routes = useMemo<PlannedRoute[]>(() => {
    if (isMock) return options?.mockData ?? [];
    const raw = queryResult.data?.listSavedRoutes ?? [];
    return raw.map((r) => PlannedRoute.from(rawToPlain(r)));
  }, [isMock, options?.mockData, queryResult.data]);

  // ── Save mutation ──────────────────────────────────────────────────────────
  const [saveRouteMutation, { loading: saving }] = useMutation<
    { saveRoute: RawSavedRoute },
    { options: SaveRouteInput }
  >(SAVE_ROUTE, {
    refetchQueries: [{ query: LIST_SAVED_ROUTES }],
  });

  const save = async (input: SaveRouteInput): Promise<PlannedRoute | undefined> => {
    const result = await saveRouteMutation({ variables: { options: input } });
    const raw = result.data?.saveRoute;
    return raw ? PlannedRoute.from(rawToPlain(raw)) : undefined;
  };

  // ── Delete (client-side only — no schema mutation available) ───────────────
  const deleteRoute = (_id: string): void => {
    // The GraphQL schema does not expose a deleteSavedRoute mutation.
    // Consumers should handle optimistic removal in their own state layer.
  };

  // ── Update (re-save) ───────────────────────────────────────────────────────
  const update = async (input: SaveRouteInput): Promise<PlannedRoute | undefined> => {
    return save(input);
  };

  // ── Refetch ────────────────────────────────────────────────────────────────
  const refetch = (): void => {
    if (!isMock) {
      queryResult.refetch();
    }
  };

  return {
    routes,
    loading: isMock ? false : queryResult.loading,
    error: isMock ? undefined : queryResult.error,
    refetch,
    save,
    saving,
    deleteRoute,
    update,
  };
}
