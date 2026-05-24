import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useTileCache } from './use-tile-cache.js';
import { mockCacheStats, mockRoute } from './use-tile-cache.mock.js';

// ─── Wrapper ──────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

it('returns initial state with mock data', () => {
  const { result } = renderHook(
    () => useTileCache({ mockData: mockCacheStats.small }),
    { wrapper }
  );

  expect(result.current.caching).toBe(false);
  expect(result.current.statsLoading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('getStats returns mockData when provided', () => {
  const { result } = renderHook(
    () => useTileCache({ mockData: mockCacheStats.small }),
    { wrapper }
  );

  const stats = result.current.getStats();
  expect(stats.tilesCached).toBe(128);
  expect(stats.bytes).toBe(2_097_152);
  expect(stats.oldest).not.toBeNull();
  expect(stats.newest).not.toBeNull();
});

it('getStats returns empty stats when mockData is empty', () => {
  const { result } = renderHook(
    () => useTileCache({ mockData: mockCacheStats.empty }),
    { wrapper }
  );

  const stats = result.current.getStats();
  expect(stats.tilesCached).toBe(0);
  expect(stats.bytes).toBe(0);
  expect(stats.oldest).toBeNull();
  expect(stats.newest).toBeNull();
});

it('getStats returns large stats when mockData is large', () => {
  const { result } = renderHook(
    () => useTileCache({ mockData: mockCacheStats.large }),
    { wrapper }
  );

  const stats = result.current.getStats();
  expect(stats.tilesCached).toBe(4_096);
  expect(stats.bytes).toBe(134_217_728);
});

it('isTileCached returns false for an uncached tile', async () => {
  const { result } = renderHook(
    () => useTileCache({ mockData: mockCacheStats.empty }),
    { wrapper }
  );

  let cached: boolean = false;
  await act(async () => {
    cached = await result.current.isTileCached(14, 8976, 5765);
  });

  expect(cached).toBe(false);
});

it('isTileCached returns true after a tile key is stored in Cache API', async () => {
  // Simulate the Cache API being available via a simple in-memory mock.
  const store = new Map<string, Response>();
  const cacheMock = {
    match: (key: string) => Promise.resolve(store.get(key)),
    put: (key: string, value: Response) => {
      store.set(key, value);
      return Promise.resolve();
    },
    delete: () => Promise.resolve(true),
  };

  const originalCaches = (globalThis as Record<string, unknown>).caches;
  (globalThis as Record<string, unknown>).caches = {
    open: () => Promise.resolve(cacheMock),
    delete: () => Promise.resolve(true),
  };

  // Pre-populate the cache with a tile key.
  store.set('tile://14/8976/5765', new Response('{}'));

  const { result } = renderHook(
    () => useTileCache({ mockData: mockCacheStats.small }),
    { wrapper }
  );

  let cached: boolean = false;
  await act(async () => {
    cached = await result.current.isTileCached(14, 8976, 5765);
  });

  expect(cached).toBe(true);

  (globalThis as Record<string, unknown>).caches = originalCaches;
});

it('clear purges the Cache API and resets in-memory keys', async () => {
  const deleted: string[] = [];
  const originalCaches = (globalThis as Record<string, unknown>).caches;
  (globalThis as Record<string, unknown>).caches = {
    open: () => Promise.resolve({ match: () => Promise.resolve(undefined), put: () => Promise.resolve() }),
    delete: (name: string) => {
      deleted.push(name);
      return Promise.resolve(true);
    },
  };

  const { result } = renderHook(
    () => useTileCache({ mockData: mockCacheStats.small }),
    { wrapper }
  );

  await act(async () => {
    await result.current.clear();
  });

  expect(deleted).toContain('mototrack-tiles-v1');

  (globalThis as Record<string, unknown>).caches = originalCaches;
});

it('exposes cacheTilesForRoute as a function', () => {
  const { result } = renderHook(
    () => useTileCache({ mockData: mockCacheStats.empty }),
    { wrapper }
  );

  expect(typeof result.current.cacheTilesForRoute).toBe('function');
});

it('exposes all expected API surface', () => {
  const { result } = renderHook(
    () => useTileCache({ mockData: mockCacheStats.small }),
    { wrapper }
  );

  expect(typeof result.current.cacheTilesForRoute).toBe('function');
  expect(typeof result.current.getStats).toBe('function');
  expect(typeof result.current.clear).toBe('function');
  expect(typeof result.current.isTileCached).toBe('function');
  expect(typeof result.current.caching).toBe('boolean');
  expect(typeof result.current.statsLoading).toBe('boolean');
});

it('mockRoute has the expected number of waypoints', () => {
  expect(mockRoute.length).toBe(4);
  expect(mockRoute[0].lat).toBeCloseTo(46.0569);
  expect(mockRoute[0].lng).toBeCloseTo(14.5058);
});
