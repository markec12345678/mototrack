import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useExpenses } from './use-expenses.js';
import { expenseMocks } from './use-expenses.mock.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('returns mock expenses when mockData is provided', () => {
  const { result } = renderHook(() => useExpenses({ mockData: expenseMocks }), {
    wrapper,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
  expect(result.current.expenses).toHaveLength(expenseMocks.length);
});

it('returns the correct expense ids', () => {
  const { result } = renderHook(() => useExpenses({ mockData: expenseMocks }), {
    wrapper,
  });

  const ids = result.current.expenses.map((e) => e.id);
  expect(ids).toContain('exp-1');
  expect(ids).toContain('exp-2');
});

it('computes byCategory aggregation correctly', () => {
  const { result } = renderHook(() => useExpenses({ mockData: expenseMocks }), {
    wrapper,
  });

  const { byCategory } = result.current;
  expect(byCategory.length).toBeGreaterThan(0);

  const fuelEntry = byCategory.find((c) => c.category === 'fuel');
  expect(fuelEntry).toBeDefined();
  expect(fuelEntry?.count).toBe(2);
  expect(fuelEntry?.totalEur).toBeCloseTo(83.5);
});

it('sorts byCategory by totalEur descending', () => {
  const { result } = renderHook(() => useExpenses({ mockData: expenseMocks }), {
    wrapper,
  });

  const { byCategory } = result.current;
  for (let i = 0; i < byCategory.length - 1; i++) {
    expect(byCategory[i].totalEur).toBeGreaterThanOrEqual(byCategory[i + 1].totalEur);
  }
});

it('computes monthlyTotal with correct month keys', () => {
  const { result } = renderHook(() => useExpenses({ mockData: expenseMocks }), {
    wrapper,
  });

  const { monthlyTotal } = result.current;
  expect(monthlyTotal.length).toBeGreaterThan(0);

  for (const entry of monthlyTotal) {
    expect(entry.month).toMatch(/^\d{4}-\d{2}$/);
    expect(entry.totalEur).toBeGreaterThan(0);
  }
});

it('sorts monthlyTotal chronologically', () => {
  const { result } = renderHook(() => useExpenses({ mockData: expenseMocks }), {
    wrapper,
  });

  const { monthlyTotal } = result.current;
  for (let i = 0; i < monthlyTotal.length - 1; i++) {
    expect(monthlyTotal[i].month.localeCompare(monthlyTotal[i + 1].month)).toBeLessThanOrEqual(0);
  }
});

it('exposes a save function', () => {
  const { result } = renderHook(() => useExpenses({ mockData: expenseMocks }), {
    wrapper,
  });

  expect(typeof result.current.save).toBe('function');
});

it('exposes saving and saveError states', () => {
  const { result } = renderHook(() => useExpenses({ mockData: expenseMocks }), {
    wrapper,
  });

  expect(result.current.saving).toBe(false);
  expect(result.current.saveError).toBeUndefined();
});

it('exposes a refetch function', () => {
  const { result } = renderHook(() => useExpenses({ mockData: expenseMocks }), {
    wrapper,
  });

  expect(typeof result.current.refetch).toBe('function');
});

it('returns empty aggregations when no expenses provided', () => {
  const { result } = renderHook(() => useExpenses({ mockData: [] }), {
    wrapper,
  });

  expect(result.current.monthlyTotal).toHaveLength(0);
  expect(result.current.byCategory).toHaveLength(0);
});

it('filters mock data by bikeId when mockData is provided', () => {
  const bike1Expenses = expenseMocks.filter((e) => e.bikeId === 'bike-1');
  const { result } = renderHook(
    () => useExpenses({ bikeId: 'bike-1', mockData: bike1Expenses }),
    { wrapper }
  );

  const ids = result.current.expenses.map((e) => e.bikeId);
  for (const id of ids) {
    expect(id).toBe('bike-1');
  }
});
