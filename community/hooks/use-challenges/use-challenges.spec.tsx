import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useChallenges } from './use-challenges.js';
import { mockChallenges, mockActiveChallenges, mockPastChallenges } from './use-challenges.mock.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should return mock challenges when mockData is provided', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: mockChallenges }),
    { wrapper }
  );

  expect(result.current.challenges).toHaveLength(mockChallenges.length);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return only active challenges from listActive()', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: mockChallenges }),
    { wrapper }
  );

  const active = result.current.listActive();
  expect(active).toHaveLength(mockActiveChallenges.length);
  active.forEach((c) => expect(c.status).toBe('active'));
});

it('should return only past/completed challenges from listPast()', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: mockChallenges }),
    { wrapper }
  );

  const past = result.current.listPast();
  expect(past).toHaveLength(mockPastChallenges.length);
  past.forEach((c) =>
    expect(['past', 'completed']).toContain(c.status)
  );
});

it('should return an empty active list when no active challenges exist', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: mockPastChallenges }),
    { wrapper }
  );

  expect(result.current.listActive()).toHaveLength(0);
});

it('should return an empty past list when no past challenges exist', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: mockActiveChallenges }),
    { wrapper }
  );

  expect(result.current.listPast()).toHaveLength(0);
});

it('should return loading=false and no error in mock mode', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: [] }),
    { wrapper }
  );

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return correct challenge ids from listActive()', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: mockChallenges }),
    { wrapper }
  );

  const activeIds = result.current.listActive().map((c) => c.id);
  expect(activeIds).toContain('challenge-1');
  expect(activeIds).toContain('challenge-2');
  expect(activeIds).not.toContain('challenge-3');
  expect(activeIds).not.toContain('challenge-4');
});

it('should return correct challenge ids from listPast()', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: mockChallenges }),
    { wrapper }
  );

  const pastIds = result.current.listPast().map((c) => c.id);
  expect(pastIds).toContain('challenge-3');
  expect(pastIds).toContain('challenge-4');
  expect(pastIds).not.toContain('challenge-1');
  expect(pastIds).not.toContain('challenge-2');
});

it('should expose a join function', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: mockChallenges }),
    { wrapper }
  );

  expect(typeof result.current.join).toBe('function');
});

it('should expose joining state as false initially', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: mockChallenges }),
    { wrapper }
  );

  expect(result.current.joining).toBe(false);
});

it('should expose refetch as a function', () => {
  const { result } = renderHook(
    () => useChallenges({ mockData: mockChallenges }),
    { wrapper }
  );

  expect(typeof result.current.refetch).toBe('function');
});
