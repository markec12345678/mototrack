import type { FuelRangeData } from './fuel-range-indicator.js';

export const mockFuelOk: FuelRangeData = {
  tankL: 18,
  currentFuelL: 13.5,
  consumptionLPer100: 5.8,
  rangeKm: 233,
  percent: 75,
  status: 'ok',
  refuelThresholdKm: 50,
};

export const mockFuelWarn: FuelRangeData = {
  tankL: 18,
  currentFuelL: 5.4,
  consumptionLPer100: 5.8,
  rangeKm: 93,
  percent: 30,
  status: 'warn',
  refuelThresholdKm: 50,
};

export const mockFuelEmpty: FuelRangeData = {
  tankL: 18,
  currentFuelL: 1.8,
  consumptionLPer100: 5.8,
  rangeKm: 31,
  percent: 10,
  status: 'empty',
  refuelThresholdKm: 50,
};
