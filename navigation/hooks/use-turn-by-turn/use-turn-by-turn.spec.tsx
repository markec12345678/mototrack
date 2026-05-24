import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useTurnByTurn } from './use-turn-by-turn.js';
import {
  mockRoute,
  mockPositionLjubljana,
  mockPositionDrift,
  mockPositionOffRoute,
  mockPositionLost,
  mockStep1,
  mockStep2,
} from './use-turn-by-turn.mock.js';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockProvider>{children}</MockProvider>
);

// ─── Null route ───────────────────────────────────────────────────────────────

it('returns null steps and zero distances when route is null', () => {
  const { result } = renderHook(() => useTurnByTurn(null), { wrapper });

  expect(result.current.currentStep).toBeNull();
  expect(result.current.nextStep).toBeNull();
  expect(result.current.distanceToTurn).toBe(0);
  expect(result.current.etaSeconds).toBe(0);
});

// ─── Mock position — on route ─────────────────────────────────────────────────

it('returns currentStep and nextStep when on route with mock position', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionLjubljana,
        mockDeviationState: 'on-route',
      }),
    { wrapper }
  );

  expect(result.current.currentStep).not.toBeNull();
  expect(result.current.deviationState).toBe('on-route');
});

it('returns a non-negative distanceToTurn', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionLjubljana,
        mockDeviationState: 'on-route',
      }),
    { wrapper }
  );

  expect(result.current.distanceToTurn).toBeGreaterThanOrEqual(0);
});

it('returns a positive etaSeconds when on route', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionLjubljana,
        mockDeviationState: 'on-route',
      }),
    { wrapper }
  );

  expect(result.current.etaSeconds).toBeGreaterThan(0);
});

// ─── Deviation states ─────────────────────────────────────────────────────────

it('reports drift deviation state when mockDeviationState is drift', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionDrift,
        mockDeviationState: 'drift',
      }),
    { wrapper }
  );

  expect(result.current.deviationState).toBe('drift');
});

it('reports off-route deviation state when mockDeviationState is off-route', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionOffRoute,
        mockDeviationState: 'off-route',
      }),
    { wrapper }
  );

  expect(result.current.deviationState).toBe('off-route');
});

it('reports lost deviation state when mockDeviationState is lost', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionLost,
        mockDeviationState: 'lost',
      }),
    { wrapper }
  );

  expect(result.current.deviationState).toBe('lost');
});

// ─── Step structure ───────────────────────────────────────────────────────────

it('currentStep has expected instruction text from the route', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionLjubljana,
        mockDeviationState: 'on-route',
      }),
    { wrapper }
  );

  const { currentStep } = result.current;
  expect(currentStep).not.toBeNull();
  expect(typeof currentStep?.instruction).toBe('string');
  expect(currentStep?.instruction.length).toBeGreaterThan(0);
});

it('nextStep is the step after currentStep', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionLjubljana,
        mockDeviationState: 'on-route',
      }),
    { wrapper }
  );

  const { currentStep, nextStep } = result.current;
  if (currentStep && nextStep) {
    const currentIdx = mockRoute.steps!.findIndex(
      (s) => s.instruction === currentStep.instruction
    );
    const nextIdx = mockRoute.steps!.findIndex(
      (s) => s.instruction === nextStep.instruction
    );
    expect(nextIdx).toBe(currentIdx + 1);
  }
});

// ─── recompute ────────────────────────────────────────────────────────────────

it('recompute is a callable function', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionLjubljana,
      }),
    { wrapper }
  );

  expect(typeof result.current.recompute).toBe('function');
});

it('calling recompute does not throw', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionLjubljana,
      }),
    { wrapper }
  );

  expect(() => {
    act(() => {
      result.current.recompute();
    });
  }).not.toThrow();
});

// ─── ETA computation ──────────────────────────────────────────────────────────

it('etaSeconds equals sum of remaining step durations', () => {
  const { result } = renderHook(
    () =>
      useTurnByTurn(mockRoute, {
        mockPosition: mockPositionLjubljana,
        mockDeviationState: 'on-route',
      }),
    { wrapper }
  );

  const { etaSeconds, currentStep } = result.current;
  if (currentStep) {
    const currentIdx = mockRoute.steps!.findIndex(
      (s) => s.instruction === currentStep.instruction
    );
    const expectedEta = mockRoute.steps!
      .slice(currentIdx)
      .reduce((sum, s) => sum + s.durationSec, 0);
    expect(etaSeconds).toBe(Math.round(expectedEta));
  }
});

// ─── Mock step fields ─────────────────────────────────────────────────────────

it('mock step1 has correct modifier', () => {
  expect(mockStep1.modifier).toBe('turn-left');
});

it('mock step2 has correct modifier', () => {
  expect(mockStep2.modifier).toBe('turn-right');
});
