import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useBalkanRoads } from './use-balkan-roads.js';
import { mockRoads, mockRoadsEasy, mockRoadsSlovenia } from './use-balkan-roads.mock.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should return mockData roads without querying GraphQL', () => {
  const { result } = renderHook(() => useBalkanRoads({ mockData: mockRoads }), { wrapper });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
  expect(result.current.roads).toHaveLength(mockRoads.length);
});

it('should return the correct road names from mockData', () => {
  const { result } = renderHook(() => useBalkanRoads({ mockData: mockRoads }), { wrapper });

  const names = result.current.roads.map((r) => r.name);
  expect(names).toContain('Vršič Pass');
  expect(names).toContain('Transfăgărășan');
  expect(names).toContain('Adriatic Coastal Road');
});

it('should return empty roads array when mockData is empty', () => {
  const { result } = renderHook(() => useBalkanRoads({ mockData: [] }), { wrapper });

  expect(result.current.roads).toHaveLength(0);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return filtered easy roads from mockData', () => {
  const { result } = renderHook(
    () => useBalkanRoads({ mockData: mockRoadsEasy, difficulty: 'Easy' }),
    { wrapper }
  );

  expect(result.current.roads.every((r) => r.difficulty === 'Easy')).toBe(true);
});

it('should return filtered Slovenian roads from mockData', () => {
  const { result } = renderHook(
    () => useBalkanRoads({ mockData: mockRoadsSlovenia, country: 'SI' }),
    { wrapper }
  );

  expect(result.current.roads.every((r) => r.country === 'SI')).toBe(true);
});

it('should expose a refetch function', () => {
  const { result } = renderHook(() => useBalkanRoads({ mockData: mockRoads }), { wrapper });

  expect(typeof result.current.refetch).toBe('function');
});

it('should return loading true when no mockData is provided (Apollo pending)', () => {
  const { result } = renderHook(() => useBalkanRoads(), { wrapper });

  expect(result.current.loading).toBe(true);
});

it('should return roads with correct entity fields', () => {
  const { result } = renderHook(() => useBalkanRoads({ mockData: mockRoads }), { wrapper });

  const first = result.current.roads[0];
  expect(first.id).toBeDefined();
  expect(first.name).toBeDefined();
  expect(first.country).toBeDefined();
  expect(first.flag).toBeDefined();
  expect(typeof first.lengthKm).toBe('number');
  expect(typeof first.rating).toBe('number');
  expect(first.difficulty).toBeDefined();
  expect(first.type).toBeDefined();
  expect(first.description).toBeDefined();
});
