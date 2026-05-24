import { useMemo } from 'react';
import { Bike } from '@markec/garage.entities.bike';

/**
 * Fuel status derived from the current range and the refuel threshold.
 * - 'ok'    — range is comfortably above the refuel threshold
 * - 'warn'  — range is at or below the refuel threshold
 * - 'empty' — tank is effectively empty (range ≤ 0)
 */
export type FuelStatus = 'ok' | 'warn' | 'empty';

/**
 * The full result returned by useFuelRange.
 */
export type FuelRange = {
  /** Total tank capacity in litres. */
  tankL: number;
  /** Current fuel level in litres. */
  currentFuelL: number;
  /** Fuel consumption in litres per 100 km. */
  consumptionLPer100: number;
  /** Estimated remaining range in kilometres. */
  rangeKm: number;
  /** Fuel level as a percentage of the tank (0–100). */
  percent: number;
  /** Derived status based on remaining range vs. refuel threshold. */
  status: FuelStatus;
  /** Distance threshold (km) below which a refuel is recommended. */
  refuelThresholdKm: number;
};

export type UseFuelRangeOptions = {
  /**
   * Provide mock data to bypass live computation and return a fixed result.
   * Useful for testing and Storybook/Bit compositions.
   */
  mockData?: FuelRange;
  /**
   * Distance in km below which the status switches to 'warn'.
   * Defaults to 50 km.
   */
  refuelThresholdKm?: number;
};

const DEFAULT_REFUEL_THRESHOLD_KM = 50;

/**
 * Computes fuel-range metrics for a given bike.
 *
 * Given a Bike entity (or mock data), the hook derives:
 * - rangeKm   — how far the bike can travel on the current fuel
 * - percent   — current fuel as a percentage of the full tank
 * - status    — 'ok' | 'warn' | 'empty' based on remaining range
 * - refuelThresholdKm — the km threshold used for the warn boundary
 *
 * @param bike - The bike whose fuel data is used for the computation.
 *   Pass undefined while the bike is loading.
 * @param options - Optional configuration including mockData and refuelThresholdKm.
 * @returns A FuelRange object with all computed metrics.
 */
export function useFuelRange(
  bike: Bike | undefined,
  options: UseFuelRangeOptions = {}
): FuelRange {
  const { mockData, refuelThresholdKm = DEFAULT_REFUEL_THRESHOLD_KM } = options;

  const result = useMemo<FuelRange>(() => {
    if (mockData) return mockData;

    const tankL = bike?.tankL ?? 0;
    const currentFuelL = bike?.currentFuelL ?? 0;
    const consumptionLPer100 = bike?.consumptionLPer100 ?? 0;

    const rangeKm =
      consumptionLPer100 > 0
        ? Math.round((currentFuelL / consumptionLPer100) * 100)
        : 0;

    const percent =
      tankL > 0 ? Math.min(100, Math.round((currentFuelL / tankL) * 100)) : 0;

    let status: FuelStatus = 'ok';
    if (rangeKm <= 0) {
      status = 'empty';
    } else if (rangeKm <= refuelThresholdKm) {
      status = 'warn';
    }

    return {
      tankL,
      currentFuelL,
      consumptionLPer100,
      rangeKm,
      percent,
      status,
      refuelThresholdKm,
    };
  }, [bike, mockData, refuelThresholdKm]);

  return result;
}
