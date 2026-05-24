import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { useOsrm } from './use-osrm.js';
import { mockOsrmRoute, mockShortRoute } from './use-osrm.mock.js';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockProvider>{children}</MockProvider>
);

it('returns undefined data and no error on initial render', () => {
  const { result } = renderHook(() => useOsrm(), { wrapper });

  expect(result.current.data).toBeUndefined();
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('immediately returns mockData when provided via options', () => {
  const { result } = renderHook(
    () => useOsrm({ mockData: mockOsrmRoute }),
    { wrapper }
  );

  expect(result.current.data).toBe(mockOsrmRoute);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('compute() sets data from mockData without a network call', async () => {
  const { result } = renderHook(
    () => useOsrm({ mockData: mockShortRoute }),
    { wrapper }
  );

  await act(async () => {
    await result.current.compute([
      new LatLng(46.5547, 15.6459),
      new LatLng(46.4201, 15.8701),
    ]);
  });

  expect(result.current.data).toBe(mockShortRoute);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('mockData result contains the correct distanceKm', () => {
  const { result } = renderHook(
    () => useOsrm({ mockData: mockOsrmRoute }),
    { wrapper }
  );

  expect(result.current.data?.distanceKm).toBe(87.4);
});

it('mockData result contains the correct number of steps', () => {
  const { result } = renderHook(
    () => useOsrm({ mockData: mockOsrmRoute }),
    { wrapper }
  );

  expect(result.current.data?.steps).toHaveLength(7);
});

it('mockData steps include Slovenian instructions', () => {
  const { result } = renderHook(
    () => useOsrm({ mockData: mockOsrmRoute }),
    { wrapper }
  );

  const instructions = result.current.data?.steps.map((s) => s.instruction) ?? [];
  expect(instructions[0]).toBe('Začnite pot');
  expect(instructions[instructions.length - 1]).toBe('Prispeli ste na cilj');
});

it('mockData geometry has at least 2 points', () => {
  const { result } = renderHook(
    () => useOsrm({ mockData: mockOsrmRoute }),
    { wrapper }
  );

  expect((result.current.data?.geometry.length ?? 0) >= 2).toBe(true);
});

it('compute() sets an error when fewer than 2 waypoints are provided', async () => {
  const { result } = renderHook(() => useOsrm(), { wrapper });

  await act(async () => {
    await result.current.compute([new LatLng(46.0511, 14.5051)]);
  });

  expect(result.current.error).toBeDefined();
  expect(typeof result.current.error).toBe('string');
});

it('compute() exposes a callable function', () => {
  const { result } = renderHook(() => useOsrm(), { wrapper });
  expect(typeof result.current.compute).toBe('function');
});

it('mockData durationSec is a positive number', () => {
  const { result } = renderHook(
    () => useOsrm({ mockData: mockOsrmRoute }),
    { wrapper }
  );

  expect((result.current.data?.durationSec ?? 0) > 0).toBe(true);
});

it('each step in mockData has a valid location', () => {
  const { result } = renderHook(
    () => useOsrm({ mockData: mockOsrmRoute }),
    { wrapper }
  );

  const steps = result.current.data?.steps ?? [];
  for (const step of steps) {
    expect(typeof step.location.lat).toBe('number');
    expect(typeof step.location.lng).toBe('number');
  }
});
