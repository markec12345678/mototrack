import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useGroupRide } from './use-group-ride.js';
import { mockGroupRides } from './use-group-ride.mock.js';

// ─── Wrapper ──────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

it('returns mock rides when mockData is provided', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  expect(result.current.rides).toHaveLength(mockGroupRides.length);
  expect(result.current.rides[0].name).toBe('Vršič Sunrise Run');
});

it('returns loading=false and error=undefined when mockData is provided', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('returns an empty rides array when no mockData and no network response', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: [] }), { wrapper });

  expect(result.current.rides).toEqual([]);
});

it('exposes a refetch function', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  expect(typeof result.current.refetch).toBe('function');
});

it('exposes a create function', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  expect(typeof result.current.create).toBe('function');
});

it('exposes a join function', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  expect(typeof result.current.join).toBe('function');
});

it('exposes an updateStatus function', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  expect(typeof result.current.updateStatus).toBe('function');
});

it('exposes a chat function', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  expect(typeof result.current.chat).toBe('function');
});

it('ride entities contain expected fields', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  const [first] = result.current.rides;
  expect(first.id).toBe('ride-001');
  expect(first.host.displayName).toBe('Luka Horvat');
  expect(first.meetingPoint.label).toBe('Kranjska Gora — Parking P1');
  expect(first.participants).toHaveLength(3);
});

it('participants carry a status field', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  const participant = result.current.rides[0].participants[0];
  expect(participant.status).toBe('pripravljen');
});

it('chat returns a connection object with sendMessage and onMessage', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  const connection = result.current.chat('ride-001');
  expect(typeof connection.sendMessage).toBe('function');
  expect(typeof connection.onMessage).toBe('function');
  expect(typeof connection.disconnect).toBe('function');

  act(() => {
    connection.disconnect();
  });
});

it('onMessage registers and unregisters a listener', () => {
  const { result } = renderHook(() => useGroupRide({ mockData: mockGroupRides }), { wrapper });

  const connection = result.current.chat('ride-001');
  const handler = vi.fn();
  const unsubscribe = connection.onMessage(handler);

  expect(typeof unsubscribe).toBe('function');

  act(() => {
    unsubscribe();
    connection.disconnect();
  });
});
