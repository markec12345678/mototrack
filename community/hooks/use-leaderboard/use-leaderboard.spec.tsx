import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useLeaderboard } from './use-leaderboard.js';
import { mockLeaderboardEntries } from './use-leaderboard.mock.js';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockProvider>{children}</MockProvider>
);

it('should return mock entries when mockData is provided', () => {
  const { result } = renderHook(
    () => useLeaderboard('weekly', 'points', { mockData: mockLeaderboardEntries }),
    { wrapper }
  );

  expect(result.current.entries).toHaveLength(mockLeaderboardEntries.length);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return the correct rank for the first entry when using mockData', () => {
  const { result } = renderHook(
    () => useLeaderboard('weekly', 'points', { mockData: mockLeaderboardEntries }),
    { wrapper }
  );

  expect(result.current.entries[0].rank).toBe(1);
});

it('should return the correct displayName for the first entry when using mockData', () => {
  const { result } = renderHook(
    () => useLeaderboard('weekly', 'points', { mockData: mockLeaderboardEntries }),
    { wrapper }
  );

  expect(result.current.entries[0].displayName).toBe('Marco Bianchi');
});

it('should identify the current user entry via the me flag', () => {
  const { result } = renderHook(
    () => useLeaderboard('monthly', 'km', { mockData: mockLeaderboardEntries }),
    { wrapper }
  );

  const myEntry = result.current.entries.find((e) => e.me);
  expect(myEntry).toBeDefined();
  expect(myEntry?.displayName).toBe('Luka Horvat');
});

it('should return entries sorted by rank when using mockData', () => {
  const { result } = renderHook(
    () => useLeaderboard('alltime', 'rides', { mockData: mockLeaderboardEntries }),
    { wrapper }
  );

  const ranks = result.current.entries.map((e) => e.rank);
  const sorted = [...ranks].sort((a, b) => a - b);
  expect(ranks).toEqual(sorted);
});

it('should return loading true and empty entries when no mockData is provided', () => {
  const { result } = renderHook(
    () => useLeaderboard('weekly', 'points'),
    { wrapper }
  );

  expect(result.current.loading).toBe(true);
  expect(result.current.entries).toHaveLength(0);
});

it('should expose a refetch function', () => {
  const { result } = renderHook(
    () => useLeaderboard('weekly', 'points', { mockData: mockLeaderboardEntries }),
    { wrapper }
  );

  expect(typeof result.current.refetch).toBe('function');
});

it('should return correct km value for the top entry', () => {
  const { result } = renderHook(
    () => useLeaderboard('weekly', 'km', { mockData: mockLeaderboardEntries }),
    { wrapper }
  );

  expect(result.current.entries[0].km).toBe(4820.5);
});

it('should return correct points for the top entry', () => {
  const { result } = renderHook(
    () => useLeaderboard('monthly', 'points', { mockData: mockLeaderboardEntries }),
    { wrapper }
  );

  expect(result.current.entries[0].points).toBe(9640);
});
