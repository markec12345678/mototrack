import { type ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useCrashDetection } from './use-crash-detection.js';
import { crashEventMock } from './use-crash-detection.mock.js';

function wrapper({ children }: { children: ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should return default values when no mock data is provided', () => {
  const { result } = renderHook(
    () => useCrashDetection({ mockData: null }),
    { wrapper }
  );

  expect(result.current.isMonitoring).toBe(false);
  expect(result.current.lastEvent).toBeNull();
  expect(result.current.sensitivity).toBe('medium');
  expect(typeof result.current.setSensitivity).toBe('function');
  expect(typeof result.current.dismiss).toBe('function');
});

it('should return the provided mock crash event as lastEvent', () => {
  const { result } = renderHook(
    () => useCrashDetection({ mockData: crashEventMock.active }),
    { wrapper }
  );

  expect(result.current.lastEvent).not.toBeNull();
  expect(result.current.lastEvent?.id).toBe(crashEventMock.active.id);
  expect(result.current.lastEvent?.gForce).toBe(6.2);
  expect(result.current.lastEvent?.speedDrop).toBe(87.5);
  expect(result.current.lastEvent?.countdown).toBe(15);
});

it('should not be monitoring when mock data is supplied', () => {
  const { result } = renderHook(
    () => useCrashDetection({ mockData: crashEventMock.midCountdown }),
    { wrapper }
  );

  expect(result.current.isMonitoring).toBe(false);
});

it('should reflect a dismissed crash event from mock data', () => {
  const { result } = renderHook(
    () => useCrashDetection({ mockData: crashEventMock.dismissed }),
    { wrapper }
  );

  expect(result.current.lastEvent?.dismissed).toBe(true);
  expect(result.current.lastEvent?.countdown).toBeNull();
  expect(result.current.lastEvent?.sosDispatched).toBe(false);
});

it('should reflect a dispatched SOS event from mock data', () => {
  const { result } = renderHook(
    () => useCrashDetection({ mockData: crashEventMock.dispatched }),
    { wrapper }
  );

  expect(result.current.lastEvent?.sosDispatched).toBe(true);
  expect(result.current.lastEvent?.countdown).toBeNull();
});

it('should update sensitivity via setSensitivity', () => {
  const { result } = renderHook(
    () => useCrashDetection({ mockData: null }),
    { wrapper }
  );

  expect(result.current.sensitivity).toBe('medium');

  act(() => {
    result.current.setSensitivity('high');
  });

  expect(result.current.sensitivity).toBe('high');

  act(() => {
    result.current.setSensitivity('low');
  });

  expect(result.current.sensitivity).toBe('low');
});

it('should dismiss an active crash event by eventId', () => {
  const { result } = renderHook(
    () => useCrashDetection({ mockData: crashEventMock.active }),
    { wrapper }
  );

  expect(result.current.lastEvent?.dismissed).toBe(false);

  act(() => {
    result.current.dismiss(crashEventMock.active.id);
  });

  expect(result.current.lastEvent?.dismissed).toBe(true);
  expect(result.current.lastEvent?.countdown).toBeNull();
});

it('should not affect lastEvent when dismissing a non-matching eventId', () => {
  const { result } = renderHook(
    () => useCrashDetection({ mockData: crashEventMock.active }),
    { wrapper }
  );

  act(() => {
    result.current.dismiss('non-existent-id');
  });

  expect(result.current.lastEvent?.dismissed).toBe(false);
  expect(result.current.lastEvent?.countdown).toBe(15);
});

it('should handle a crash event with no GPS location', () => {
  const { result } = renderHook(
    () => useCrashDetection({ mockData: crashEventMock.noLocation }),
    { wrapper }
  );

  expect(result.current.lastEvent?.location).toBeNull();
  expect(result.current.lastEvent?.countdown).toBe(12);
});

it('should update lastEvent when mockData prop changes', () => {
  const { result, rerender } = renderHook(
    ({ mockData }) => useCrashDetection({ mockData }),
    {
      wrapper,
      initialProps: { mockData: crashEventMock.active as typeof crashEventMock.active | null },
    }
  );

  expect(result.current.lastEvent?.id).toBe(crashEventMock.active.id);

  rerender({ mockData: null });

  expect(result.current.lastEvent).toBeNull();
});
