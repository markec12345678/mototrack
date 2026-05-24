import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useRouteWeather } from './use-route-weather.js';
import { mockRouteWeather, mockRouteWeatherSingle } from './use-route-weather.mock.js';

const sampleRoute = [
  { lat: 46.0569, lng: 14.5058 },
  { lat: 46.2, lng: 14.8 },
  { lat: 46.35, lng: 15.1 },
  { lat: 46.5, lng: 15.4 },
  { lat: 46.65, lng: 15.65 },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockProvider>{children}</MockProvider>
);

it('should return mock data immediately when mockData is provided', () => {
  const { result } = renderHook(
    () => useRouteWeather(sampleRoute, 5, { mockData: mockRouteWeather }),
    { wrapper }
  );

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
  expect(result.current.routeWeather).toHaveLength(5);
});

it('should return the correct number of route weather samples from mock data', () => {
  const { result } = renderHook(
    () => useRouteWeather(sampleRoute, 5, { mockData: mockRouteWeather }),
    { wrapper }
  );

  expect(result.current.routeWeather).toHaveLength(mockRouteWeather.length);
});

it('should return correct location data for the first sample', () => {
  const { result } = renderHook(
    () => useRouteWeather(sampleRoute, 5, { mockData: mockRouteWeather }),
    { wrapper }
  );

  const first = result.current.routeWeather[0];
  expect(first.location.lat).toBe(46.0569);
  expect(first.location.lng).toBe(14.5058);
});

it('should return correct snapshot fields for a sample', () => {
  const { result } = renderHook(
    () => useRouteWeather(sampleRoute, 5, { mockData: mockRouteWeather }),
    { wrapper }
  );

  const first = result.current.routeWeather[0];
  expect(first.snapshot.tempC).toBe(18.5);
  expect(first.snapshot.icon).toBe('🌤️');
  expect(first.snapshot.label).toBe('Mostly clear');
});

it('should return etaMin values for each sample', () => {
  const { result } = renderHook(
    () => useRouteWeather(sampleRoute, 5, { mockData: mockRouteWeather }),
    { wrapper }
  );

  expect(result.current.routeWeather[0].etaMin).toBe(0);
  expect(result.current.routeWeather[4].etaMin).toBe(50.0);
});

it('should return a single sample when mockData has one entry', () => {
  const { result } = renderHook(
    () => useRouteWeather(sampleRoute, 1, { mockData: mockRouteWeatherSingle }),
    { wrapper }
  );

  expect(result.current.routeWeather).toHaveLength(1);
  expect(result.current.routeWeather[0].snapshot.tempC).toBe(18.5);
});

it('should return loading true and empty routeWeather when no mockData and route is provided', () => {
  const { result } = renderHook(
    () => useRouteWeather(sampleRoute, 5),
    { wrapper }
  );

  expect(result.current.loading).toBe(true);
  expect(result.current.routeWeather).toHaveLength(0);
});

it('should return empty routeWeather when route is empty', () => {
  const { result } = renderHook(
    () => useRouteWeather([], 5),
    { wrapper }
  );

  expect(result.current.loading).toBe(false);
  expect(result.current.routeWeather).toHaveLength(0);
});

it('should use default samples of 5', () => {
  const { result } = renderHook(
    () => useRouteWeather(sampleRoute, undefined, { mockData: mockRouteWeather }),
    { wrapper }
  );

  expect(result.current.routeWeather).toHaveLength(5);
});
