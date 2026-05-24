import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useIconicTours } from './use-iconic-tours.js';
import { mockTours, mockSingleTour } from './use-iconic-tours.mock.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should return mock tours when mockData is provided', () => {
  const { result } = renderHook(() => useIconicTours({ mockData: mockTours }), { wrapper });

  expect(result.current.tours).toHaveLength(mockTours.length);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return the correct tour via getTour(id)', () => {
  const { result } = renderHook(() => useIconicTours({ mockData: mockTours }), { wrapper });

  const found = result.current.getTour(mockSingleTour.id);
  expect(found).toBeDefined();
  expect(found?.id).toBe(mockSingleTour.id);
  expect(found?.name).toBe(mockSingleTour.name);
});

it('should return undefined from getTour when id does not exist', () => {
  const { result } = renderHook(() => useIconicTours({ mockData: mockTours }), { wrapper });

  const found = result.current.getTour('non-existent-id-xyz');
  expect(found).toBeUndefined();
});

it('should return an empty tours array when mockData is an empty array', () => {
  const { result } = renderHook(() => useIconicTours({ mockData: [] }), { wrapper });

  expect(result.current.tours).toHaveLength(0);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should expose tours with required fields', () => {
  const { result } = renderHook(() => useIconicTours({ mockData: mockTours }), { wrapper });

  const [first] = result.current.tours;
  expect(typeof first.id).toBe('string');
  expect(typeof first.name).toBe('string');
  expect(typeof first.country).toBe('string');
  expect(typeof first.distanceKm).toBe('number');
  expect(typeof first.rating).toBe('number');
  expect(typeof first.difficulty).toBe('string');
});

it('should filter tours by country when mockData is pre-filtered', () => {
  const slovenianTours = mockTours.filter((t) => t.country === 'SI');
  const { result } = renderHook(() => useIconicTours({ mockData: slovenianTours }), { wrapper });

  result.current.tours.forEach((tour) => {
    expect(tour.country).toBe('SI');
  });
});

it('should return a stable getTour reference across renders', () => {
  const { result, rerender } = renderHook(() => useIconicTours({ mockData: mockTours }), { wrapper });

  const firstGetTour = result.current.getTour;
  rerender();
  expect(result.current.getTour).toBe(firstGetTour);
});
