import * as React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { mockRides, mockRide } from './use-rides.mock.js';
import { useRides } from './use-rides.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should return mock rides when mockData is provided', () => {
  const { result } = renderHook(() => useRides({ mockData: mockRides }), { wrapper });

  expect(result.current.rides).toHaveLength(mockRides.length);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return the correct ride ids from mock data', () => {
  const { result } = renderHook(() => useRides({ mockData: mockRides }), { wrapper });

  expect(result.current.rides[0].id).toBe('ride-001');
  expect(result.current.rides[1].id).toBe('ride-002');
  expect(result.current.rides[2].id).toBe('ride-003');
});

it('should return ride names from mock data', () => {
  const { result } = renderHook(() => useRides({ mockData: mockRides }), { wrapper });

  expect(result.current.rides[0].name).toBe('Morning Alpine Run');
  expect(result.current.rides[1].name).toBe('Quick Country Loop');
});

it('should return an empty rides array when mockData is an empty array', () => {
  const { result } = renderHook(() => useRides({ mockData: [] }), { wrapper });

  expect(result.current.rides).toHaveLength(0);
  expect(result.current.loading).toBe(false);
});

it('should expose a refetch function', () => {
  const { result } = renderHook(() => useRides({ mockData: mockRides }), { wrapper });

  expect(typeof result.current.refetch).toBe('function');
});

it('should expose a createRide function', () => {
  const { result } = renderHook(() => useRides({ mockData: mockRides }), { wrapper });

  expect(typeof result.current.createRide).toBe('function');
});

it('should expose a deleteRide function', () => {
  const { result } = renderHook(() => useRides({ mockData: mockRides }), { wrapper });

  expect(typeof result.current.deleteRide).toBe('function');
});

it('should not throw when refetch is called in mock mode', () => {
  const { result } = renderHook(() => useRides({ mockData: mockRides }), { wrapper });

  expect(() => {
    act(() => {
      result.current.refetch();
    });
  }).not.toThrow();
});

it('should return correct distanceKm for the first mock ride', () => {
  const { result } = renderHook(() => useRides({ mockData: [mockRide] }), { wrapper });

  expect(result.current.rides[0].distanceKm).toBe(8.4);
});

it('should return correct twistinessScore for the first mock ride', () => {
  const { result } = renderHook(() => useRides({ mockData: [mockRide] }), { wrapper });

  expect(result.current.rides[0].twistinessScore).toBe(7.2);
});

it('should enter loading state when no mockData is provided', () => {
  const { result } = renderHook(() => useRides(), { wrapper });

  expect(result.current.loading).toBe(true);
  expect(result.current.rides).toHaveLength(0);
});
