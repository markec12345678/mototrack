import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { useGeolocation, BALKAN_CENTER } from './use-geolocation.js';
import { geolocationMock } from './use-geolocation.mock.js';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockProvider>{children}</MockProvider>
);

describe('useGeolocation — mockData path', () => {
  it('returns the mock position immediately without calling the Geolocation API', () => {
    const { result } = renderHook(
      () => useGeolocation({ mockData: geolocationMock.sarajevo }),
      { wrapper },
    );

    expect(result.current.position.lat).toBeCloseTo(43.8563);
    expect(result.current.position.lng).toBeCloseTo(18.4131);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('exposes accuracy, heading and speed from mock data', () => {
    const { result } = renderHook(
      () => useGeolocation({ mockData: geolocationMock.sarajevo }),
      { wrapper },
    );

    expect(result.current.accuracy).toBe(8);
    expect(result.current.heading).toBe(45);
    expect(result.current.speed).toBeCloseTo(12.5);
  });

  it('reflects isHighAccuracy from mock data', () => {
    const { result } = renderHook(
      () => useGeolocation({ mockData: geolocationMock.sarajevo }),
      { wrapper },
    );

    expect(result.current.isHighAccuracy).toBe(true);
  });

  it('returns loading=true when mock data represents a loading state', () => {
    const { result } = renderHook(
      () => useGeolocation({ mockData: geolocationMock.loading }),
      { wrapper },
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('surfaces the error message from permission-denied mock', () => {
    const { result } = renderHook(
      () => useGeolocation({ mockData: geolocationMock.permissionDenied }),
      { wrapper },
    );

    expect(result.current.error).toContain('denied');
    expect(result.current.position.lat).toBeCloseTo(BALKAN_CENTER.lat);
    expect(result.current.position.lng).toBeCloseTo(BALKAN_CENTER.lng);
  });

  it('surfaces the error message from timeout mock', () => {
    const { result } = renderHook(
      () => useGeolocation({ mockData: geolocationMock.timeout }),
      { wrapper },
    );

    expect(result.current.error).toContain('timed out');
  });

  it('surfaces the insecure-context error message', () => {
    const { result } = renderHook(
      () => useGeolocation({ mockData: geolocationMock.insecureContext }),
      { wrapper },
    );

    expect(result.current.error).toContain('HTTPS');
  });

  it('returns null accuracy/heading/speed for low-accuracy mock', () => {
    const { result } = renderHook(
      () => useGeolocation({ mockData: geolocationMock.lowAccuracy }),
      { wrapper },
    );

    expect(result.current.heading).toBeNull();
    expect(result.current.speed).toBeNull();
    expect(result.current.isHighAccuracy).toBe(false);
  });

  it('updates state when mockData prop changes', () => {
    let mockData = geolocationMock.loading;

    const { result, rerender } = renderHook(
      () => useGeolocation({ mockData }),
      { wrapper },
    );

    expect(result.current.loading).toBe(true);

    act(() => {
      mockData = geolocationMock.sarajevo;
    });

    rerender();

    expect(result.current.loading).toBe(false);
    expect(result.current.position.lat).toBeCloseTo(43.8563);
  });
});

describe('useGeolocation — BALKAN_CENTER constant', () => {
  it('is a LatLng instance centred on Sarajevo', () => {
    expect(BALKAN_CENTER).toBeInstanceOf(LatLng);
    expect(BALKAN_CENTER.lat).toBeCloseTo(43.85);
    expect(BALKAN_CENTER.lng).toBeCloseTo(18.38);
  });
});

describe('useGeolocation — default state (no Geolocation API in JSDom)', () => {
  it('starts with loading=true and falls back to BALKAN_CENTER', () => {
    // JSDom does not implement navigator.geolocation, so the hook
    // will detect its absence and surface an error with the fallback position.
    const { result } = renderHook(() => useGeolocation(), { wrapper });

    // Position must always be a LatLng instance
    expect(result.current.position).toBeInstanceOf(LatLng);
    // Either still loading or already errored — never a blank state
    const settled = !result.current.loading;
    if (settled) {
      expect(result.current.error).not.toBeNull();
      expect(result.current.position.lat).toBeCloseTo(BALKAN_CENTER.lat);
    } else {
      expect(result.current.loading).toBe(true);
    }
  });
});
