import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { mockHazardSeeds } from './use-hazards.mock.js';
import { useHazards } from './use-hazards.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should return mock hazards when mockData is provided', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  expect(result.current.hazards).toHaveLength(mockHazardSeeds.length);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return the correct hazard id from mock data', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  expect(result.current.hazards[0].id).toBe('hz-001');
});

it('should return the correct hazard type from mock data', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  expect(result.current.hazards[0].type).toBe('pothole');
});

it('should return confirmedCount from mock data', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  expect(result.current.hazards[0].confirmedCount).toBe(7);
});

it('should start with empty hazards when no mockData and no query triggered', () => {
  const { result } = renderHook(() => useHazards(), { wrapper });

  expect(result.current.hazards).toHaveLength(0);
  expect(result.current.loading).toBe(false);
});

it('should expose listNear as a function', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  expect(typeof result.current.listNear).toBe('function');
});

it('should expose report as a function', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  expect(typeof result.current.report).toBe('function');
});

it('should expose confirm as a function', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  expect(typeof result.current.confirm).toBe('function');
});

it('should still return mock hazards after listNear is called', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  act(() => {
    result.current.listNear({ lat: 46.0569, lng: 14.5058 }, 10);
  });

  expect(result.current.hazards).toHaveLength(mockHazardSeeds.length);
});

it('should return reporting as false initially', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  expect(result.current.reporting).toBe(false);
});

it('should return hazards with lat and lng properties', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  const first = result.current.hazards[0];
  expect(typeof first.lat).toBe('number');
  expect(typeof first.lng).toBe('number');
});

it('should return hazards with reportedAt timestamp', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  expect(typeof result.current.hazards[0].reportedAt).toBe('number');
});

it('should return all 8 seed mock hazards', () => {
  const { result } = renderHook(() => useHazards({ mockData: mockHazardSeeds }), { wrapper });

  expect(result.current.hazards).toHaveLength(8);
});
