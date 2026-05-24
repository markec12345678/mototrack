/// <reference path="./bluetooth.d.ts" />
import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Common Bluetooth audio service UUIDs used by Sena and Cardo helmet
 * communication systems.
 */
const AUDIO_SERVICE_UUIDS = [
  // Generic Audio / Headset Profile (HSP)
  '00001108-0000-1000-8000-00805f9b34fb',
  // Hands-Free Profile (HFP)
  '0000111e-0000-1000-8000-00805f9b34fb',
  // Advanced Audio Distribution Profile (A2DP) — sink
  '0000110b-0000-1000-8000-00805f9b34fb',
  // Audio/Video Remote Control Profile (AVRCP)
  '0000110e-0000-1000-8000-00805f9b34fb',
  // Sena-specific proprietary service (common across SMH series)
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
];

/**
 * The return value of the `useBtHelmet` hook.
 */
export type UseBtHelmetReturn = {
  /**
   * Whether the Web Bluetooth API is supported in the current browser.
   */
  isSupported: boolean;

  /**
   * Whether a Bluetooth helmet device is currently connected.
   */
  isConnected: boolean;

  /**
   * The human-readable name of the connected Bluetooth device, or null if
   * no device is connected.
   */
  deviceName: string | null;

  /**
   * Error message if the last connect/disconnect attempt failed, or null.
   */
  error: string | null;

  /**
   * Initiates a Bluetooth device picker filtered to audio-capable helmet
   * devices (Sena / Cardo common service UUIDs). Configures MediaSession
   * once connected so SpeechSynthesis routes to the helmet audio output.
   */
  connect: () => Promise<void>;

  /**
   * Disconnects the currently connected Bluetooth device and cleans up
   * MediaSession state.
   */
  disconnect: () => void;
};

/**
 * Options accepted by `useBtHelmet`.
 */
export type UseBtHelmetOptions = {
  /**
   * Provide mock data to bypass the real Web Bluetooth API.
   * Useful for testing and Storybook/Bit compositions.
   */
  mockData?: Partial<UseBtHelmetReturn>;
};

/**
 * Configures the MediaSession API so that SpeechSynthesis utterances are
 * associated with the active media session, which causes the browser to route
 * audio to the currently connected Bluetooth output on supported platforms.
 */
function configureMediaSession(name: string): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'MotoTrack Navigation',
    artist: name,
    album: 'Helmet Audio',
  });

  // Set a playback state so the OS treats this as an active audio session,
  // which helps route SpeechSynthesis to the Bluetooth output.
  navigator.mediaSession.playbackState = 'playing';
}

/**
 * Clears the MediaSession state set by `configureMediaSession`.
 */
function clearMediaSession(): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = null;
  navigator.mediaSession.playbackState = 'none';
}

/**
 * `useBtHelmet` — Web Bluetooth wrapper for motorcycle helmet intercoms.
 *
 * Requests a Bluetooth device using audio service filters that cover common
 * Sena and Cardo helmet communication systems. Once connected, the hook
 * configures the MediaSession API so that SpeechSynthesis utterances are
 * routed to the connected Bluetooth audio output.
 *
 * @param options - Optional configuration including mockData for testing.
 * @returns An object with connection state and control functions.
 */
export function useBtHelmet(options?: UseBtHelmetOptions): UseBtHelmetReturn {
  const isSupported =
    typeof navigator !== 'undefined' &&
    'bluetooth' in navigator;

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const deviceRef = useRef<BluetoothDevice | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (deviceRef.current?.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
      }
      clearMediaSession();
    };
  }, []);

  const handleDisconnected = useCallback(() => {
    setIsConnected(false);
    setDeviceName(null);
    clearMediaSession();
    deviceRef.current = null;
  }, []);

  const connect = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      setError('Web Bluetooth is not supported in this browser.');
      return;
    }

    setError(null);

    try {
      // Build filters: one filter per service UUID so the browser shows any
      // device advertising at least one of the known helmet audio services.
      const filters: BluetoothRequestDeviceFilter[] = AUDIO_SERVICE_UUIDS.map(
        (uuid) => ({ services: [uuid] })
      );

      const nav = navigator as Navigator;
      const device = await nav.bluetooth.requestDevice({
        filters,
        optionalServices: AUDIO_SERVICE_UUIDS,
      });

      deviceRef.current = device;

      // Listen for disconnection events fired by the OS/browser.
      device.addEventListener('gattserverdisconnected', handleDisconnected);

      // Attempt GATT connection so we hold an active link.
      if (device.gatt) {
        await device.gatt.connect();
      }

      const name = device.name ?? 'Unknown Helmet Device';
      setDeviceName(name);
      setIsConnected(true);

      configureMediaSession(name);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // User cancelled the picker — not a real error worth surfacing.
        if (err.name === 'NotFoundError' || err.message.includes('cancelled')) {
          return;
        }
        setError(err.message);
      } else {
        setError('An unknown error occurred while connecting.');
      }
    }
  }, [isSupported, handleDisconnected]);

  const disconnect = useCallback((): void => {
    const device = deviceRef.current;
    if (device) {
      device.removeEventListener('gattserverdisconnected', handleDisconnected);
      if (device.gatt?.connected) {
        device.gatt.disconnect();
      }
    }
    deviceRef.current = null;
    setIsConnected(false);
    setDeviceName(null);
    clearMediaSession();
  }, [handleDisconnected]);

  // ── Mock data short-circuit ──────────────────────────────────────────────
  if (options?.mockData) {
    return {
      isSupported: options.mockData.isSupported ?? isSupported,
      isConnected: options.mockData.isConnected ?? false,
      deviceName: options.mockData.deviceName ?? null,
      error: options.mockData.error ?? null,
      connect: options.mockData.connect ?? connect,
      disconnect: options.mockData.disconnect ?? disconnect,
    };
  }

  return {
    isSupported,
    isConnected,
    deviceName,
    error,
    connect,
    disconnect,
  };
}
