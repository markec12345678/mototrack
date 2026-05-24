import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useFuelPrices } from './use-fuel-prices.js';
import { mockFuelPriceReports } from './use-fuel-prices.mock.js';

// ─── Wrapper ──────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

it('returns reports from mock data without network call', () => {
  const { result } = renderHook(
    () => useFuelPrices({ mockData: mockFuelPriceReports }),
    { wrapper }
  );

  expect(result.current.reports).toHaveLength(mockFuelPriceReports.length);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('computes country averages from mock reports', () => {
  const { result } = renderHook(
    () => useFuelPrices({ mockData: mockFuelPriceReports }),
    { wrapper }
  );

  const { countryAverages } = result.current;

  expect(countryAverages.length).toBeGreaterThan(0);

  const slovenia = countryAverages.find((a) => a.country === 'Slovenia');
  expect(slovenia).toBeDefined();
  expect(slovenia?.reportCount).toBe(2);
  expect(slovenia?.avgPetrolEur).toBeCloseTo(1.594, 2);
  expect(slovenia?.avgDieselEur).toBeCloseTo(1.484, 2);
});

it('computes correct averages for a single-report country', () => {
  const { result } = renderHook(
    () => useFuelPrices({ mockData: mockFuelPriceReports }),
    { wrapper }
  );

  const serbia = result.current.countryAverages.find((a) => a.country === 'Serbia');
  expect(serbia).toBeDefined();
  expect(serbia?.reportCount).toBe(1);
  expect(serbia?.avgPetrolEur).toBeCloseTo(1.389, 3);
  expect(serbia?.avgDieselEur).toBeCloseTo(1.289, 3);
});

it('returns empty reports and averages when mock data is empty', () => {
  const { result } = renderHook(
    () => useFuelPrices({ mockData: [] }),
    { wrapper }
  );

  expect(result.current.reports).toHaveLength(0);
  expect(result.current.countryAverages).toHaveLength(0);
  expect(result.current.loading).toBe(false);
});

it('filters mock data to a single country when country option is provided', () => {
  const slovenianReports = mockFuelPriceReports.filter(
    (r) => r.country === 'Slovenia'
  );

  const { result } = renderHook(
    () => useFuelPrices({ country: 'Slovenia', mockData: slovenianReports }),
    { wrapper }
  );

  expect(result.current.reports).toHaveLength(2);
  expect(result.current.countryAverages).toHaveLength(1);
  expect(result.current.countryAverages[0].country).toBe('Slovenia');
});

it('exposes a refetch function', () => {
  const { result } = renderHook(
    () => useFuelPrices({ mockData: mockFuelPriceReports }),
    { wrapper }
  );

  expect(typeof result.current.refetch).toBe('function');
});

it('each report has the expected shape', () => {
  const { result } = renderHook(
    () => useFuelPrices({ mockData: mockFuelPriceReports }),
    { wrapper }
  );

  const first = result.current.reports[0];
  expect(first.id).toBeDefined();
  expect(first.country).toBeDefined();
  expect(first.brand).toBeDefined();
  expect(typeof first.petrolEur).toBe('number');
  expect(typeof first.dieselEur).toBe('number');
  expect(typeof first.confirms).toBe('number');
});

it('lastReportedAt in country average reflects the most recent report', () => {
  const { result } = renderHook(
    () => useFuelPrices({ mockData: mockFuelPriceReports }),
    { wrapper }
  );

  const slovenia = result.current.countryAverages.find((a) => a.country === 'Slovenia');
  const slovenianReports = mockFuelPriceReports.filter((r) => r.country === 'Slovenia');
  const maxAt = Math.max(...slovenianReports.map((r) => r.reportedAt));

  expect(slovenia?.lastReportedAt).toBe(maxAt);
});
