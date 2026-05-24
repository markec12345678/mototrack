import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useAchievements } from './use-achievements.js';
import { mockAchievements } from './use-achievements.mock.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should return mock data immediately without loading when mockData is provided', () => {
  const { result } = renderHook(() => useAchievements({ mockData: mockAchievements }), {
    wrapper,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
  expect(result.current.achievements).toHaveLength(mockAchievements.length);
});

it('should return the correct achievement ids from mock data', () => {
  const { result } = renderHook(() => useAchievements({ mockData: mockAchievements }), {
    wrapper,
  });

  const ids = result.current.achievements.map((a) => a.id);
  expect(ids).toContain('vrsic-conqueror');
  expect(ids).toContain('1000-km-klub');
  expect(ids).toContain('twisty-rider');
});

it('should return unlocked achievements correctly from mock data', () => {
  const { result } = renderHook(() => useAchievements({ mockData: mockAchievements }), {
    wrapper,
  });

  const unlocked = result.current.achievements.filter((a) => a.unlocked);
  expect(unlocked.length).toBeGreaterThan(0);
  unlocked.forEach((a) => {
    expect(a.progressPct).toBe(100);
  });
});

it('should return locked achievements with progressPct less than 100', () => {
  const { result } = renderHook(() => useAchievements({ mockData: mockAchievements }), {
    wrapper,
  });

  const locked = result.current.achievements.filter((a) => !a.unlocked);
  expect(locked.length).toBeGreaterThan(0);
  locked.forEach((a) => {
    expect(a.progressPct).toBeLessThan(100);
  });
});

it('should return an empty achievements array when mockData is an empty array', () => {
  const { result } = renderHook(() => useAchievements({ mockData: [] }), {
    wrapper,
  });

  expect(result.current.achievements).toHaveLength(0);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should expose a refetch no-op function when using mock data', () => {
  const { result } = renderHook(() => useAchievements({ mockData: mockAchievements }), {
    wrapper,
  });

  expect(typeof result.current.refetch).toBe('function');
  expect(() => result.current.refetch()).not.toThrow();
});

it('should enter loading state when no mock data is provided', () => {
  const { result } = renderHook(() => useAchievements(), {
    wrapper,
  });

  expect(result.current.loading).toBe(true);
  expect(result.current.achievements).toHaveLength(0);
});

it('should return achievement names from mock data', () => {
  const { result } = renderHook(() => useAchievements({ mockData: mockAchievements }), {
    wrapper,
  });

  const names = result.current.achievements.map((a) => a.name);
  expect(names).toContain('Vršič Conqueror');
  expect(names).toContain('Twisty Rider');
  expect(names).toContain('Mokra Vožnja');
});
