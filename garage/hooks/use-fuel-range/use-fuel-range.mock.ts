import { FuelRange } from './use-fuel-range.js';

/**
 * Mock FuelRange values for use in tests and compositions.
 */
export const fuelRangeMock: Record<string, FuelRange> = {
  /** Healthy tank — well above the refuel threshold. */
  ok: {
    tankL: 20,
    currentFuelL: 14,
    consumptionLPer100: 5.5,
    rangeKm: 255,
    percent: 70,
    status: 'ok',
    refuelThresholdKm: 50,
  },

  /** Low fuel — range is at the warn boundary. */
  warn: {
    tankL: 20,
    currentFuelL: 2.5,
    consumptionLPer100: 5.5,
    rangeKm: 45,
    percent: 13,
    status: 'warn',
    refuelThresholdKm: 50,
  },

  /** Empty tank — no range remaining. */
  empty: {
    tankL: 20,
    currentFuelL: 0,
    consumptionLPer100: 5.5,
    rangeKm: 0,
    percent: 0,
    status: 'empty',
    refuelThresholdKm: 50,
  },

  /** Full tank — 100 % fuel level. */
  full: {
    tankL: 18,
    currentFuelL: 18,
    consumptionLPer100: 6.0,
    rangeKm: 300,
    percent: 100,
    status: 'ok',
    refuelThresholdKm: 50,
  },

  /** Custom threshold — warn triggered at 80 km. */
  customThreshold: {
    tankL: 20,
    currentFuelL: 4,
    consumptionLPer100: 5.5,
    rangeKm: 73,
    percent: 20,
    status: 'warn',
    refuelThresholdKm: 80,
  },
};
