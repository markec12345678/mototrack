import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useBikes } from './use-bikes.js';
import { mockBikes, mockBikeKtm, mockBikeYamaha } from './use-bikes.mock.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

// ─── list ─────────────────────────────────────────────────────────────────────

it('should return mock bikes when mockData is provided', () => {
  const { result } = renderHook(() => useBikes({ mockData: mockBikes }), { wrapper });

  expect(result.current.bikes).toHaveLength(3);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return an empty list when mockData is an empty array', () => {
  const { result } = renderHook(() => useBikes({ mockData: [] }), { wrapper });

  expect(result.current.bikes).toHaveLength(0);
});

it('should return bikes with correct fields', () => {
  const { result } = renderHook(() => useBikes({ mockData: mockBikes }), { wrapper });

  const first = result.current.bikes[0];
  expect(first.id).toBe('bike-001');
  expect(first.name).toBe('KTM Adventure');
  expect(first.model).toBe('KTM 890 Adventure');
  expect(first.year).toBe(2022);
  expect(first.primary).toBe(true);
});

// ─── getPrimary ───────────────────────────────────────────────────────────────

it('should return the primary bike via getPrimary()', () => {
  const { result } = renderHook(() => useBikes({ mockData: mockBikes }), { wrapper });

  const primary = result.current.getPrimary();
  expect(primary).toBeDefined();
  expect(primary?.id).toBe('bike-001');
  expect(primary?.primary).toBe(true);
});

it('should return undefined from getPrimary() when no bike is primary', () => {
  const noPrimaryBikes = [
    { ...mockBikeKtm, primary: false },
    { ...mockBikeYamaha, primary: false },
  ];

  const { result } = renderHook(() => useBikes({ mockData: noPrimaryBikes as any }), { wrapper });

  expect(result.current.getPrimary()).toBeUndefined();
});

// ─── loading / error state ────────────────────────────────────────────────────

it('should start in loading state when no mockData is provided', () => {
  const { result } = renderHook(() => useBikes(), { wrapper });

  // Apollo MockedProvider with no mocks → loading initially
  expect(result.current.loading).toBe(true);
});

it('should expose a refetch function', () => {
  const { result } = renderHook(() => useBikes({ mockData: mockBikes }), { wrapper });

  expect(typeof result.current.refetch).toBe('function');
});

// ─── save ─────────────────────────────────────────────────────────────────────

it('should expose a save function', () => {
  const { result } = renderHook(() => useBikes({ mockData: mockBikes }), { wrapper });

  expect(typeof result.current.save).toBe('function');
});

// ─── deleteBike ───────────────────────────────────────────────────────────────

it('should expose a deleteBike function', () => {
  const { result } = renderHook(() => useBikes({ mockData: mockBikes }), { wrapper });

  expect(typeof result.current.deleteBike).toBe('function');
});

// ─── no options ───────────────────────────────────────────────────────────────

it('should work without any options argument', () => {
  const { result } = renderHook(() => useBikes(), { wrapper });

  expect(result.current.bikes).toHaveLength(0);
  expect(typeof result.current.getPrimary).toBe('function');
  expect(typeof result.current.save).toBe('function');
  expect(typeof result.current.deleteBike).toBe('function');
});
