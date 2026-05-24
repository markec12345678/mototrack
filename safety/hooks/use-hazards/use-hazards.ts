import { useMemo, useCallback, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { type PlainLatLng } from '@markec/maps.entities.lat-lng';

// ─── GraphQL Operations ───────────────────────────────────────────────────────

const LIST_HAZARDS_QUERY = gql`
  query ListHazards($options: ListHazardsOptions) {
    listHazards(options: $options) {
      id
      type
      lat
      lng
      reportedAt
      reportedBy
      confirmedCount
    }
  }
`;

const REPORT_HAZARD_MUTATION = gql`
  mutation ReportHazard($options: ReportHazardOptions!) {
    reportHazard(options: $options) {
      id
      type
      lat
      lng
      reportedAt
      reportedBy
      confirmedCount
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Plain hazard data shape - mirrors the GraphQL Hazard type.
 * Defined locally to avoid importing the entity package index,
 * which pulls in the Typegoose model and crashes in JSDom test environments.
 */
export type PlainHazard = {
  id: string;
  type: string;
  lat: number;
  lng: number;
  reportedAt: number;
  reportedBy?: string;
  confirmedCount: number;
};

export type ReportHazardInput = {
  /** Hazard type identifier (e.g. "pothole", "oil", "animal", "accident"). */
  type: string;
  /** Latitude of the hazard location. */
  lat: number;
  /** Longitude of the hazard location. */
  lng: number;
};

export type UseHazardsOptions = {
  /** Provide mock data to skip the GraphQL query (useful for testing and seed fallback). */
  mockData?: PlainHazard[];
};

export type UseHazardsResult = {
  /** Hazards near the last queried location. */
  hazards: PlainHazard[];
  /** True while the query is in flight. */
  loading: boolean;
  /** Error from the query, if any. */
  error: Error | undefined;
  /**
   * Fetch hazards near a given location within an optional radius.
   * Calling this triggers a new query with the provided coordinates.
   */
  listNear: (latlng: PlainLatLng, radiusKm?: number) => void;
  /**
   * Report a new hazard at the given location.
   * Returns the newly created PlainHazard on success.
   */
  report: (input: ReportHazardInput) => Promise<PlainHazard | undefined>;
  /**
   * Confirm an existing hazard by ID.
   * Optimistically increments the confirmedCount in the Apollo cache.
   */
  confirm: (id: string) => void;
  /** Whether a report mutation is in progress. */
  reporting: boolean;
};

type QueryVars = {
  lat: number;
  lng: number;
  radiusKm?: number;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useHazards - manages road hazard data for the MotoTrack safety module.
 *
 * Provides three core operations:
 * - listNear(latlng, radiusKm) - query hazards near a coordinate
 * - report(input) - submit a new hazard report via GraphQL mutation
 * - confirm(id) - optimistically confirm an existing hazard in the Apollo cache
 *
 * Accepts optional mockData to bypass GraphQL for testing and seed fallback.
 *
 * @param options - Optional configuration including mockData for seed fallback.
 * @returns UseHazardsResult containing hazards, loading/error state, and action functions.
 */
export function useHazards(options?: UseHazardsOptions): UseHazardsResult {
  const hasMock = Boolean(options?.mockData);

  const [queryVars, setQueryVars] = useState<QueryVars | null>(null);

  const { data, loading, error, client } = useQuery<{ listHazards: PlainHazard[] }>(
    LIST_HAZARDS_QUERY,
    {
      skip: hasMock || queryVars === null,
      variables: queryVars
        ? {
            options: {
              lat: queryVars.lat,
              lng: queryVars.lng,
              radiusKm: queryVars.radiusKm,
            },
          }
        : undefined,
    }
  );

  const [reportMutation, { loading: reporting }] = useMutation<
    { reportHazard: PlainHazard },
    { options: ReportHazardInput }
  >(REPORT_HAZARD_MUTATION);

  const hazards = useMemo<PlainHazard[]>(() => {
    if (hasMock) return options?.mockData ?? [];
    return data?.listHazards ?? [];
  }, [data, hasMock, options?.mockData]);

  const listNear = useCallback((latlng: PlainLatLng, radiusKm?: number) => {
    setQueryVars({ lat: latlng.lat, lng: latlng.lng, radiusKm });
  }, []);

  const report = useCallback(
    async (input: ReportHazardInput): Promise<PlainHazard | undefined> => {
      const result = await reportMutation({ variables: { options: input } });
      return result.data?.reportHazard;
    },
    [reportMutation]
  );

  const confirm = useCallback(
    (id: string) => {
      if (!client) return;
      const cacheId = client.cache.identify({ __typename: 'Hazard', id });
      if (!cacheId) return;
      client.cache.modify({
        id: cacheId,
        fields: {
          confirmedCount: (existing: number) => existing + 1,
        },
      });
    },
    [client]
  );

  return {
    hazards,
    loading: !hasMock && loading,
    error: !hasMock ? error : undefined,
    listNear,
    report,
    confirm,
    reporting,
  };
}
