import * as React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useFuelRange } from './use-fuel-range.js';
import { fuelRangeMock } from './use-fuel-range.mock.js';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockProvider>{children}</MockProvider>
);

// ─── Mock data bypass ─────────────────────────────────────────────────────────

it('returns mockData directly when provided', () => {
  const { result } = renderHook(
    () => useFuelRange(undefined, { mockData: fuelRangeMock.ok }),
    { wrapper }
  );

  expect(result.current.status).toBe('ok');
  expect(result.current.rangeKm).toBe(255);
  expect(result.current.percent).toBe(70);
});

// ─── Range computation ────────────────────────────────────────────────────────

it('computes rangeKm correctly from bike data', () => {
  const bike = {
    tankL: 20,
    currentFuelL: 10,
    consumptionLPer100: 5,
  } as any;

  const { result } = renderHook(() => useFuelRange(bike), { wrapper });

  // (10 / 5) * 100 = 200 km
  expect(result.current.rangeKm).toBe(200);
});

it('computes percent correctly from bike data', () => {
  const bike = {
    tankL: 20,
    currentFuelL: 10,
    consumptionLPer100: 5,
  } as any;

  const { result } = renderHook(() => useFuelRange(bike), { wrapper });

  // (10 / 20) * 100 = 50 %
  expect(result.current.percent).toBe(50);
});

it('returns zero rangeKm when consumptionLPer100 is 0', () => {
  const bike = {
    tankL: 20,
    currentFuelL: 10,
    consumptionLPer100: 0,
  } as any;

  const { result } = renderHook(() => useFuelRange(bike), { wrapper });

  expect(result.current.rangeKm).toBe(0);
});

it('caps percent at 100 when currentFuelL exceeds tankL', () => {
  const bike = {
    tankL: 10,
    currentFuelL: 15,
    consumptionLPer100: 5,
  } as any;

  const { result } = renderHook(() => useFuelRange(bike), { wrapper });

  expect(result.current.percent).toBe(100);
});

// ─── Status derivation ────────────────────────────────────────────────────────

it('returns status "ok" when range is above the threshold', () => {
  const bike = {
    tankL: 20,
    currentFuelL: 14,
    consumptionLPer100: 5.5,
  } as any;

  const { result } = renderHook(
    () => useFuelRange(bike, { refuelThresholdKm: 50 }),
    { wrapper }
  );

  expect(result.current.status).toBe('ok');
});

it('returns status "warn" when range is at or below the threshold', () => {
  const bike = {
    tankL: 20,
    currentFuelL: 2,
    consumptionLPer100: 5,
  } as any;

  // rangeKm = (2 / 5) * 100 = 40 km  ≤  50 km threshold
  const { result } = renderHook(
    () => useFuelRange(bike, { refuelThresholdKm: 50 }),
    { wrapper }
  );

  expect(result.current.status).toBe('warn');
});

it('returns status "empty" when currentFuelL is 0', () => {
  const bike = {
    tankL: 20,
    currentFuelL: 0,
    consumptionLPer100: 5,
  } as any;

  const { result } = renderHook(() => useFuelRange(bike), { wrapper });

  expect(result.current.status).toBe('empty');
});

// ─── Custom threshold ─────────────────────────────────────────────────────────

it('respects a custom refuelThresholdKm', () => {
  const bike = {
    tankL: 20,
    currentFuelL: 4,
    consumptionLPer100: 5,
  } as any;

  // rangeKm = 80 km — equals the custom threshold of 80 → 'warn'
  const { result } = renderHook(
    () => useFuelRange(bike, { refuelThresholdKm: 80 }),
    { wrapper }
  );

  expect(result.current.refuelThresholdKm).toBe(80);
  expect(result.current.status).toBe('warn');
});

// ─── Undefined bike ───────────────────────────────────────────────────────────

it('returns safe zero values when bike is undefined', () => {
  const { result } = renderHook(() => useFuelRange(undefined), { wrapper });

  expect(result.current.tankL).toBe(0);
  expect(result.current.currentFuelL).toBe(0);
  expect(result.current.consumptionLPer100).toBe(0);
  expect(result.current.rangeKm).toBe(0);
  expect(result.current.percent).toBe(0);
  expect(result.current.status).toBe('empty');
});

// ─── Passthrough fields ───────────────────────────────────────────────────────

it('passes through tankL, currentFuelL, consumptionLPer100 from bike', () => {
  const bike = {
    tankL: 18,
    currentFuelL: 9,
    consumptionLPer100: 6,
  } as any;

  const { result } = renderHook(() => useFuelRange(bike), { wrapper });

  expect(result.current.tankL).toBe(18);
  expect(result.current.currentFuelL).toBe(9);
  expect(result.current.consumptionLPer100).toBe(6);
});
