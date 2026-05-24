import * as React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useCrosswind, computeCrossKmh, classifyCrosswind } from './use-crosswind.js';
import { crosswindMock } from './use-crosswind.mock.js';

// ─── Pure utility tests ───────────────────────────────────────────────────────

describe('computeCrossKmh', () => {
  it('returns full wind speed when wind is exactly perpendicular (90° offset)', () => {
    const result = computeCrossKmh(50, 90, 0);
    expect(Math.round(result)).toBe(50);
  });

  it('returns 0 when wind is exactly aligned with heading (0° offset)', () => {
    const result = computeCrossKmh(50, 0, 0);
    expect(Math.round(result)).toBe(0);
  });

  it('returns 0 when wind is exactly opposite to heading (180° offset)', () => {
    const result = computeCrossKmh(50, 180, 0);
    expect(Math.round(result)).toBe(0);
  });

  it('returns ~35 km/h for 45° angle with 50 km/h wind', () => {
    const result = computeCrossKmh(50, 45, 0);
    expect(result).toBeGreaterThan(34);
    expect(result).toBeLessThan(36);
  });

  it('handles heading wrap-around correctly (350° heading, 80° wind)', () => {
    const result = computeCrossKmh(40, 80, 350);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(40);
  });

  it('returns non-negative value for any angle combination', () => {
    const result = computeCrossKmh(30, 270, 90);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});

describe('classifyCrosswind', () => {
  it('returns "none" for crosswind below 20 km/h', () => {
    expect(classifyCrosswind(0)).toBe('none');
    expect(classifyCrosswind(10)).toBe('none');
    expect(classifyCrosswind(19.9)).toBe('none');
  });

  it('returns "moderate" for crosswind between 20 and 39 km/h', () => {
    expect(classifyCrosswind(20)).toBe('moderate');
    expect(classifyCrosswind(30)).toBe('moderate');
    expect(classifyCrosswind(39.9)).toBe('moderate');
  });

  it('returns "strong" for crosswind between 40 and 59 km/h', () => {
    expect(classifyCrosswind(40)).toBe('strong');
    expect(classifyCrosswind(50)).toBe('strong');
    expect(classifyCrosswind(59.9)).toBe('strong');
  });

  it('returns "dangerous" for crosswind at or above 60 km/h', () => {
    expect(classifyCrosswind(60)).toBe('dangerous');
    expect(classifyCrosswind(80)).toBe('dangerous');
    expect(classifyCrosswind(120)).toBe('dangerous');
  });
});

// ─── Hook integration tests ───────────────────────────────────────────────────

describe('useCrosswind', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockProvider>{children}</MockProvider>
  );

  it('returns level "none" for calm wind conditions heading North', () => {
    const { result } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.calm }),
      { wrapper }
    );

    expect(result.current.level).toBe('none');
    expect(result.current.crossKmh).toBeLessThan(20);
  });

  it('returns level "moderate" for moderate crosswind heading North', () => {
    const { result } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.moderate }),
      { wrapper }
    );

    expect(result.current.level).toBe('moderate');
    expect(result.current.crossKmh).toBeGreaterThanOrEqual(20);
    expect(result.current.crossKmh).toBeLessThan(40);
  });

  it('returns level "strong" for strong crosswind heading North', () => {
    const { result } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.strong }),
      { wrapper }
    );

    expect(result.current.level).toBe('strong');
    expect(result.current.crossKmh).toBeGreaterThanOrEqual(40);
    expect(result.current.crossKmh).toBeLessThan(60);
  });

  it('returns level "dangerous" and dangerFlash for dangerous crosswind heading North', () => {
    const { result } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.dangerous }),
      { wrapper }
    );

    expect(result.current.level).toBe('dangerous');
    expect(result.current.crossKmh).toBeGreaterThanOrEqual(60);
    expect(result.current.dangerFlash).toBe(true);
  });

  it('returns audibleAlert true when level is dangerous', () => {
    const { result } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.dangerous }),
      { wrapper }
    );

    expect(result.current.audibleAlert).toBe(true);
  });

  it('returns audibleAlert false for calm conditions', () => {
    const { result } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.calm }),
      { wrapper }
    );

    expect(result.current.audibleAlert).toBe(false);
  });

  it('returns dangerFlash false for non-dangerous levels', () => {
    const { result } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.moderate }),
      { wrapper }
    );

    expect(result.current.dangerFlash).toBe(false);
  });

  it('computes partial crosswind correctly for diagonal wind', () => {
    const { result } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.diagonal }),
      { wrapper }
    );

    expect(result.current.level).toBe('moderate');
    expect(result.current.crossKmh).toBeGreaterThan(25);
    expect(result.current.crossKmh).toBeLessThan(35);
  });

  it('returns isLoading false when mockData is provided', () => {
    const { result } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.calm }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(false);
  });

  it('returns crossKmh near 0 when wind is aligned with heading', () => {
    const { result } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.calm }),
      { wrapper }
    );

    expect(result.current.crossKmh).toBeLessThan(5);
  });

  it('heading change affects crossKmh calculation', () => {
    const { result: resultNorth } = renderHook(
      () => useCrosswind(0, { mockData: crosswindMock.moderate }),
      { wrapper }
    );

    const { result: resultEast } = renderHook(
      () => useCrosswind(90, { mockData: crosswindMock.moderate }),
      { wrapper }
    );

    expect(resultNorth.current.crossKmh).toBeGreaterThan(resultEast.current.crossKmh);
  });
});
