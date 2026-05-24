import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useBtHelmet } from './use-bt-helmet.js';
import {
  mockBtHelmetDisconnected,
  mockBtHelmetConnectedSena,
  mockBtHelmetUnsupported,
  mockBtHelmetError,
} from './use-bt-helmet.mock.js';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockProvider>{children}</MockProvider>
);

describe('useBtHelmet — mock data', () => {
  it('returns isSupported=true and isConnected=false when disconnected mock is provided', () => {
    const { result } = renderHook(
      () => useBtHelmet({ mockData: mockBtHelmetDisconnected }),
      { wrapper }
    );

    expect(result.current.isSupported).toBe(true);
    expect(result.current.isConnected).toBe(false);
    expect(result.current.deviceName).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns connected state with device name when connected mock is provided', () => {
    const { result } = renderHook(
      () => useBtHelmet({ mockData: mockBtHelmetConnectedSena }),
      { wrapper }
    );

    expect(result.current.isConnected).toBe(true);
    expect(result.current.deviceName).toBe('Sena SMH10');
    expect(result.current.error).toBeNull();
  });

  it('returns isSupported=false when unsupported mock is provided', () => {
    const { result } = renderHook(
      () => useBtHelmet({ mockData: mockBtHelmetUnsupported }),
      { wrapper }
    );

    expect(result.current.isSupported).toBe(false);
    expect(result.current.isConnected).toBe(false);
  });

  it('returns error message when error mock is provided', () => {
    const { result } = renderHook(
      () => useBtHelmet({ mockData: mockBtHelmetError }),
      { wrapper }
    );

    expect(result.current.error).toBe(
      'Bluetooth adapter not found or permission denied.'
    );
    expect(result.current.isConnected).toBe(false);
  });

  it('exposes connect and disconnect as functions', () => {
    const { result } = renderHook(
      () => useBtHelmet({ mockData: mockBtHelmetDisconnected }),
      { wrapper }
    );

    expect(typeof result.current.connect).toBe('function');
    expect(typeof result.current.disconnect).toBe('function');
  });

  it('mock connect function resolves without throwing', async () => {
    const { result } = renderHook(
      () => useBtHelmet({ mockData: mockBtHelmetDisconnected }),
      { wrapper }
    );

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.isConnected).toBe(false);
  });

  it('mock disconnect function does not throw', () => {
    const { result } = renderHook(
      () => useBtHelmet({ mockData: mockBtHelmetConnectedSena }),
      { wrapper }
    );

    act(() => {
      result.current.disconnect();
    });

    expect(result.current.isConnected).toBe(true);
  });
});

describe('useBtHelmet — real hook (no Web Bluetooth in JSDom)', () => {
  it('reports isSupported=false in JSDom environment', () => {
    const { result } = renderHook(() => useBtHelmet(), { wrapper });

    expect(result.current.isSupported).toBe(false);
  });

  it('sets error when connect is called in unsupported environment', async () => {
    const { result } = renderHook(() => useBtHelmet(), { wrapper });

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.error).toBe(
      'Web Bluetooth is not supported in this browser.'
    );
    expect(result.current.isConnected).toBe(false);
  });

  it('disconnect can be called safely when no device is connected', () => {
    const { result } = renderHook(() => useBtHelmet(), { wrapper });

    act(() => {
      result.current.disconnect();
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.deviceName).toBeNull();
  });

  it('initial state has null deviceName and null error', () => {
    const { result } = renderHook(() => useBtHelmet(), { wrapper });

    expect(result.current.deviceName).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
