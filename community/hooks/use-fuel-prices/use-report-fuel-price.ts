import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { FuelPriceReport } from '@markec/community.entities.fuel-price-report';
import { type FuelPriceInput } from './use-fuel-prices.js';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const REPORT_FUEL_PRICE_MUTATION = gql`
  mutation ReportFuelPrice($input: FuelPriceInputOptions!) {
    reportFuelPrice(input: $input) {
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
 * Return value of the useReportFuelPrice hook.
 */
export type UseReportFuelPriceResult = {
  /**
   * Call this function to submit a new fuel price report.
   * @param input - The fuel price data to report.
   * @returns The newly created FuelPriceReport.
   */
  report: (input: FuelPriceInput) => Promise<FuelPriceReport>;
  /** Whether the mutation is in flight. */
  loading: boolean;
  /** Error from the mutation, if any. */
  error: Error | undefined;
  /** The most recently reported FuelPriceReport, if available. */
  reportedPrice: FuelPriceReport | undefined;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useReportFuelPrice — submits a new community fuel price report via GraphQL mutation.
 *
 * @returns report function, loading state, error, and the last reported price.
 */
export function useReportFuelPrice(): UseReportFuelPriceResult {
  const [reportMutation, { loading, error, data }] = useMutation<{
    reportFuelPrice: FuelPriceReport;
  }>(REPORT_FUEL_PRICE_MUTATION);

  const report = async (input: FuelPriceInput): Promise<FuelPriceReport> => {
    const result = await reportMutation({ variables: { input } });
    if (!result.data) throw new Error('No data returned from reportFuelPrice mutation');
    return FuelPriceReport.from(result.data.reportFuelPrice);
  };

  const reportedPrice = data?.reportFuelPrice
    ? FuelPriceReport.from(data.reportFuelPrice)
    : undefined;

  return {
    report,
    loading,
    error,
    reportedPrice,
  };
}
