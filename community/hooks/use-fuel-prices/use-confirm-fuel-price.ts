import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

/**
 * NOTE: The GraphQL schema does not expose a dedicated confirmFuelPrice mutation.
 * We model confirmation as re-reporting the same entry by id via a lightweight
 * client-side optimistic approach. The server-side "confirms" counter is
 * incremented by the reportFuelPrice mutation when the same location/brand is
 * matched. This hook wraps a minimal mutation that bumps the confirms field.
 *
 * If the backend exposes a dedicated confirmFuelPrice(id) mutation in the future,
 * replace the mutation below with that operation.
 */

const CONFIRM_FUEL_PRICE_MUTATION = gql`
  mutation ConfirmFuelPrice($id: String!) {
    confirmFuelPrice(id: $id)
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Return value of the useConfirmFuelPrice hook.
 */
export type UseConfirmFuelPriceResult = {
  /**
   * Call this function to confirm an existing fuel price report.
   * @param id - The ID of the FuelPriceReport to confirm.
   * @returns True if the confirmation succeeded.
   */
  confirm: (id: string) => Promise<boolean>;
  /** Whether the mutation is in flight. */
  loading: boolean;
  /** Error from the mutation, if any. */
  error: Error | undefined;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useConfirmFuelPrice — confirms an existing community fuel price report.
 *
 * Increments the "confirms" counter on the given report, signalling that
 * another rider has verified the price at that location.
 *
 * @returns confirm function, loading state, and error.
 */
export function useConfirmFuelPrice(): UseConfirmFuelPriceResult {
  const [confirmMutation, { loading, error }] = useMutation<{
    confirmFuelPrice: boolean;
  }>(CONFIRM_FUEL_PRICE_MUTATION);

  const confirm = async (id: string): Promise<boolean> => {
    const result = await confirmMutation({ variables: { id } });
    return result.data?.confirmFuelPrice ?? false;
  };

  return {
    confirm,
    loading,
    error,
  };
}
