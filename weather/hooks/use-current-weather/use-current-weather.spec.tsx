import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useCurrentWeather } from './use-current-weather.js';
import { weatherSnapshotMock } from './use-current-weather.mock.js';

const defaultLocation = { lat: 46.0569, lng: 14.5058 };

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should return mock snapshot immediately when mockData is provided', () => {
  const { result } = renderHook(
    () => useCurrentWeather(defaultLocation, { mockData: weatherSnapshotMock.sunny }),
    { wrapper }
  );

  expect(result.current.snapshot?.tempC).toBe(24.5);
  expect(result.current.snapshot?.icon).toBe('☀️');
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return rainy snapshot when rainy mockData is provided', () => {
  const { result } = renderHook(
    () => useCurrentWeather(defaultLocation, { mockData: weatherSnapshotMock.rainy }),
    { wrapper }
  );

  expect(result.current.snapshot?.wmoCode).toBe(61);
  expect(result.current.snapshot?.label).toBe('Dež');
  expect(result.current.snapshot?.precipMmH).toBe(3.4);
});

it('should return undefined snapshot and isLoading true when no mockData and query is pending', () => {
  const { result } = renderHook(
    () => useCurrentWeather(defaultLocation),
    { wrapper }
  );

  expect(result.current.isLoading).toBe(true);
  expect(result.current.snapshot).toBeUndefined();
});

it('should expose a refresh function', () => {
  const { result } = renderHook(
    () => useCurrentWeather(defaultLocation, { mockData: weatherSnapshotMock.cloudy }),
    { wrapper }
  );

  expect(typeof result.current.refresh).toBe('function');
});

it('should not throw when refresh is called in mock mode', () => {
  const { result } = renderHook(
    () => useCurrentWeather(defaultLocation, { mockData: weatherSnapshotMock.sunny }),
    { wrapper }
  );

  expect(() => {
    act(() => {
      result.current.refresh();
    });
  }).not.toThrow();
});

it('should return no error in mock mode', () => {
  const { result } = renderHook(
    () => useCurrentWeather(defaultLocation, { mockData: weatherSnapshotMock.stormy }),
    { wrapper }
  );

  expect(result.current.error).toBeUndefined();
});

it('should return correct snapshot fields for stormy mock', () => {
  const { result } = renderHook(
    () => useCurrentWeather(defaultLocation, { mockData: weatherSnapshotMock.stormy }),
    { wrapper }
  );

  expect(result.current.snapshot?.windKmh).toBe(55.0);
  expect(result.current.snapshot?.gustKmh).toBe(80.0);
  expect(result.current.snapshot?.humidity).toBe(95);
});
