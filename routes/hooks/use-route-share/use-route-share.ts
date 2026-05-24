import { useState, useCallback } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { PlannedRoute, type RouteMode } from '@markec/routes.entities.planned-route';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const SHARE_ROUTE_MUTATION = gql`
  mutation ShareRoute($options: SaveRouteInputOptions!) {
    shareRoute(options: $options) {
      code
      qrUrl
      expiresAt
    }
  }
`;

const LOAD_SHARED_ROUTE_QUERY = gql`
  query LoadSharedRoute($options: LoadSharedRouteOptions) {
    loadSharedRoute(options: $options) {
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

export type SharedRouteDetails = {
  /** Short share code, e.g. MTXXXX */
  code: string;
  /** QR code data URL */
  qrUrl: string;
  /** Unix timestamp (seconds) when the share link expires */
  expiresAt: number;
};

export type ShareRouteInput = {
  name: string;
  waypoints: Array<{ id: string; name?: string | null; lat: number; lng: number }>;
  mode: string;
  geometry: Array<{ lat: number; lng: number }>;
  distanceKm: number;
  durationSec: number;
  notes?: string | null;
};

export type UseRouteShareOptions = {
  /** Provide mock data to bypass the GraphQL query in tests */
  mockData?: PlannedRoute;
};

export type UseRouteShareResult = {
  /**
   * Share a route. Returns SharedRouteDetails with a code, QR data URL, and expiry.
   */
  share: (route: ShareRouteInput) => Promise<SharedRouteDetails>;
  /**
   * Load a shared route by its share code.
   */
  load: (code: string) => Promise<PlannedRoute | null>;
  /** Whether a share or load operation is in progress */
  loading: boolean;
  /** Last error from share or load, if any */
  error: Error | undefined;
};

type PlainSavedRoute = {
  id: string;
  userId?: string | null;
  name: string;
  waypoints: Array<{ id: string; name?: string | null; lat: number; lng: number }>;
  mode: RouteMode;
  geometry: Array<{ lat: number; lng: number }>;
  distanceKm: number;
  durationSec: number;
  notes?: string | null;
  createdAt: number;
};

type ShareRouteMutationResult = {
  shareRoute: SharedRouteDetails;
};

type LoadSharedRouteQueryResult = {
  loadSharedRoute: PlainSavedRoute | null;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useRouteShare — share and load routes via short codes and QR data URLs.
 *
 * @param options.mockData - Optional mock PlannedRoute returned by `load()` in tests.
 * @returns share(route), load(code), loading, error
 */
export function useRouteShare(options?: UseRouteShareOptions): UseRouteShareResult {
  const [loadCode, setLoadCode] = useState<string | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);

  const [shareRouteMutation, { loading: shareLoading }] = useMutation<
    ShareRouteMutationResult,
    { options: ShareRouteInput }
  >(SHARE_ROUTE_MUTATION);

  const { data: loadData, loading: loadLoading } = useQuery<LoadSharedRouteQueryResult>(
    LOAD_SHARED_ROUTE_QUERY,
    {
      variables: { options: { code: loadCode } },
      skip: !loadCode || !!options?.mockData,
    }
  );

  const share = useCallback(
    async (route: ShareRouteInput): Promise<SharedRouteDetails> => {
      setError(undefined);
      try {
        const result = await shareRouteMutation({
          variables: { options: route },
        });
        if (!result.data) {
          throw new Error('No data returned from shareRoute mutation');
        }
        return result.data.shareRoute;
      } catch (err) {
        const wrapped = err instanceof Error ? err : new Error(String(err));
        setError(wrapped);
        throw wrapped;
      }
    },
    [shareRouteMutation]
  );

  const load = useCallback(
    async (code: string): Promise<PlannedRoute | null> => {
      setError(undefined);

      if (options?.mockData) {
        return options.mockData;
      }

      setLoadCode(code);

      if (loadData?.loadSharedRoute) {
        return PlannedRoute.from(loadData.loadSharedRoute);
      }

      return null;
    },
    [options?.mockData, loadData]
  );

  return {
    share,
    load,
    loading: shareLoading || loadLoading,
    error,
  };
}
