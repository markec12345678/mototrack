import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useFeed } from './use-feed.js';
import { feedItemMocks } from './use-feed.mock.js';

it('should return mock data when mockData option is provided', () => {
  const { result } = renderHook(() => useFeed({ mockData: feedItemMocks }), {
    wrapper: ({ children }) => (
      <MockProvider>{children}</MockProvider>
    ),
  });

  expect(result.current.feed).toHaveLength(feedItemMocks.length);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return the correct feed item ids when using mock data', () => {
  const { result } = renderHook(() => useFeed({ mockData: feedItemMocks }), {
    wrapper: ({ children }) => (
      <MockProvider>{children}</MockProvider>
    ),
  });

  const ids = result.current.feed.map((item) => item.id);
  expect(ids).toContain('feed-1');
  expect(ids).toContain('feed-2');
  expect(ids).toContain('feed-3');
});

it('should return the correct feed item kinds when using mock data', () => {
  const { result } = renderHook(() => useFeed({ mockData: feedItemMocks }), {
    wrapper: ({ children }) => (
      <MockProvider>{children}</MockProvider>
    ),
  });

  const kinds = result.current.feed.map((item) => item.kind);
  expect(kinds).toContain('ride_completed');
  expect(kinds).toContain('achievement_unlocked');
  expect(kinds).toContain('group_ride_created');
});

it('should return actor information for each feed item', () => {
  const { result } = renderHook(() => useFeed({ mockData: feedItemMocks }), {
    wrapper: ({ children }) => (
      <MockProvider>{children}</MockProvider>
    ),
  });

  const firstItem = result.current.feed[0];
  expect(firstItem.actor.displayName).toBe('Marco Bianchi');
  expect(firstItem.actor.country).toBe('IT');
});

it('should return an empty feed when no mock data is provided and query is loading', () => {
  const { result } = renderHook(() => useFeed(), {
    wrapper: ({ children }) => (
      <MockProvider>{children}</MockProvider>
    ),
  });

  expect(result.current.feed).toEqual([]);
  expect(result.current.loading).toBe(true);
});

it('should expose a refetch function when using mock data', () => {
  const { result } = renderHook(() => useFeed({ mockData: feedItemMocks }), {
    wrapper: ({ children }) => (
      <MockProvider>{children}</MockProvider>
    ),
  });

  expect(typeof result.current.refetch).toBe('function');
});

it('should return feed items with a valid timestamp', () => {
  const { result } = renderHook(() => useFeed({ mockData: feedItemMocks }), {
    wrapper: ({ children }) => (
      <MockProvider>{children}</MockProvider>
    ),
  });

  result.current.feed.forEach((item) => {
    expect(typeof item.at).toBe('number');
    expect(item.at).toBeGreaterThan(0);
  });
});
