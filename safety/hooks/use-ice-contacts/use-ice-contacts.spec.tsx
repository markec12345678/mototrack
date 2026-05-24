import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useIceContacts } from './use-ice-contacts.js';
import { iceContactMocks } from './use-ice-contacts.mock.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useIceContacts', () => {
  it('returns mock contacts immediately when mockData is provided', () => {
    const { result } = renderHook(
      () => useIceContacts({ mockData: iceContactMocks }),
      { wrapper }
    );

    expect(result.current.contacts).toHaveLength(iceContactMocks.length);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('returns the correct contact names from mock data', () => {
    const { result } = renderHook(
      () => useIceContacts({ mockData: iceContactMocks }),
      { wrapper }
    );

    const names = result.current.contacts.map((c) => c.name);
    expect(names).toContain('Ana Kovač');
    expect(names).toContain('Marko Novak');
    expect(names).toContain('Dr. Petra Horvat');
  });

  it('identifies the primary contact correctly from mock data', () => {
    const { result } = renderHook(
      () => useIceContacts({ mockData: iceContactMocks }),
      { wrapper }
    );

    const primary = result.current.contacts.find((c) => c.primary);
    expect(primary).toBeDefined();
    expect(primary?.name).toBe('Ana Kovač');
  });

  it('returns an empty contacts array when mockData is an empty list', () => {
    const { result } = renderHook(
      () => useIceContacts({ mockData: [] }),
      { wrapper }
    );

    expect(result.current.contacts).toHaveLength(0);
    expect(result.current.loading).toBe(false);
  });

  it('exposes save and remove functions', () => {
    const { result } = renderHook(
      () => useIceContacts({ mockData: iceContactMocks }),
      { wrapper }
    );

    expect(typeof result.current.save).toBe('function');
    expect(typeof result.current.remove).toBe('function');
  });

  it('exposes saving and removing boolean flags', () => {
    const { result } = renderHook(
      () => useIceContacts({ mockData: iceContactMocks }),
      { wrapper }
    );

    expect(result.current.saving).toBe(false);
    expect(result.current.removing).toBe(false);
  });

  it('starts in loading state when no mockData is provided', () => {
    const { result } = renderHook(() => useIceContacts(), { wrapper });

    // Without mockData the query fires; Apollo MockedProvider returns loading initially.
    expect(result.current.loading).toBe(true);
  });

  it('returns an empty contacts array while loading without mockData', () => {
    const { result } = renderHook(() => useIceContacts(), { wrapper });

    expect(result.current.contacts).toHaveLength(0);
  });

  it('exposes a refetch function', () => {
    const { result } = renderHook(
      () => useIceContacts({ mockData: iceContactMocks }),
      { wrapper }
    );

    expect(typeof result.current.refetch).toBe('function');
  });

  it('mock contacts have the expected blood type on the primary contact', () => {
    const { result } = renderHook(
      () => useIceContacts({ mockData: iceContactMocks }),
      { wrapper }
    );

    const primary = result.current.contacts.find((c) => c.primary);
    expect(primary?.bloodType).toBe('A+');
  });
});
