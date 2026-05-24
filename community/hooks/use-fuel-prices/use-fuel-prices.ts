import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { FuelPriceReport } from '@markec/community.entities.fuel-price-report';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const LIST_FUEL_PRICES_QUERY = gql`
  query ListFuelPrices($country: String) {
    listFuelPrices(options: { country: $country }) {
      id
      country
      brand
      petrolEur
      dieselEur
      location
      reportedAt
      confirms
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Aggregated average fuel prices for a single country, computed client-side
 * from all reports for that country.
 */
export type CountryAverage = {
  /** ISO country name or code. */
  country: string;
  /** Average petrol price in EUR across all reports for this country. */
  avgPetrolEur: number;
  /** Average diesel price in EUR across all reports for this country. */
  avgDieselEur: number;
  /** Number of individual reports used to compute the averages. */
  reportCount: number;
  /** Timestamp (ms) of the most recent report for this country. */
  lastReportedAt: number;
};

/**
 * Input for reporting a new fuel price.
 */
export type FuelPriceInput = {
  country: string;
  brand: string;
  petrolEur: number;
  dieselEur: number;
  location: string;
};

/**
 * Options accepted by useFuelPrices for testability.
 */
export type UseFuelPricesOptions = {
  /** Optional country filter applied to the query. */
  country?: string;
  /** Provide mock data to skip the network query entirely. */
  mockData?: FuelPriceReport[];
};

/**
 * Return value of the useFuelPrices hook.
 */
export type UseFuelPricesResult = {
  /** Raw list of fuel price reports. */
  reports: FuelPriceReport[];
  /** Country-level averages computed client-side from the reports. */
  countryAverages: CountryAverage[];
  /** Whether the initial query is in flight. */
  loading: boolean;
  /** Error from the query, if any. */
  error: Error | undefined;
  /** Re-fetch the list from the server. */
  refetch: () => void;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function computeCountryAverages(reports: FuelPriceReport[]): CountryAverage[] {
  const grouped = new Map<
    string,
    { petrolSum: number; dieselSum: number; count: number; lastAt: number }
  >();

  for (const r of reports) {
    const existing = grouped.get(r.country);
    if (existing) {
      existing.petrolSum += r.petrolEur;
      existing.dieselSum += r.dieselEur;
      existing.count += 1;
      if (r.reportedAt > existing.lastAt) existing.lastAt = r.reportedAt;
    } else {
      grouped.set(r.country, {
        petrolSum: r.petrolEur,
        dieselSum: r.dieselEur,
        count: 1,
        lastAt: r.reportedAt,
      });
    }
  }

  return Array.from(grouped.entries()).map(([country, agg]) => ({
    country,
    avgPetrolEur: Math.round((agg.petrolSum / agg.count) * 1000) / 1000,
    avgDieselEur: Math.round((agg.dieselSum / agg.count) * 1000) / 1000,
    reportCount: agg.count,
    lastReportedAt: agg.lastAt,
  }));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useFuelPrices — fetches community fuel price reports and computes
 * country-level averages client-side.
 *
 * @param options - Optional country filter and/or mock data for testing.
 * @returns reports, countryAverages, loading, error, and refetch.
 */
export function useFuelPrices(options?: UseFuelPricesOptions): UseFuelPricesResult {
  const { country, mockData } = options ?? {};

  const { data, loading, error, refetch } = useQuery<{
    listFuelPrices: FuelPriceReport[];
  }>(LIST_FUEL_PRICES_QUERY, {
    variables: { country },
    skip: !!mockData,
  });

  const rawReports: FuelPriceReport[] = useMemo(() => {
    if (mockData) return mockData;
    return data?.listFuelPrices ?? [];
  }, [mockData, data]);

  const reports = useMemo(
    () => rawReports.map((r) => FuelPriceReport.from(r)),
    [rawReports]
  );

  const countryAverages = useMemo(() => computeCountryAverages(reports), [reports]);

  return {
    reports,
    countryAverages,
    loading: mockData ? false : loading,
    error: mockData ? undefined : error,
    refetch: () => { refetch(); },
  };
}
