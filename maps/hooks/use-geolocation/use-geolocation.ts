import { useState, useEffect, useRef } from 'react';
import { LatLng } from '@markec/maps.entities.lat-lng';

/** Default fallback center — Sarajevo, Bosnia & Herzegovina */
export const BALKAN_CENTER: LatLng = new LatLng(43.85, 18.38);

/** Options accepted by the hook */
export type UseGeolocationOptions = {
  /**
   * Request high-accuracy GPS fix. Defaults to true.
   */
  enableHighAccuracy?: boolean;

  /**
   * Maximum milliseconds to wait for a position fix. Defaults to 15 000 ms.
   */
  timeout?: number;

  /**
   * Maximum age (ms) of a cached position that is acceptable. Defaults to 0.
   */
  maximumAge?: number;

  /**
   * Provide mock data to skip the real Geolocation API (useful in tests / Storybook).
   */
  mockData?: GeolocationResult;
};

/** The value returned by the hook */
export type GeolocationResult = {
  /**
   * Current geographic position. Falls back to Sarajevo when permission is denied.
   */
  position: LatLng;

  /**
   * Accuracy of the position fix in metres, or null when unknown.
   */
  accuracy: number | null;

  /**
   * Direction of travel in degrees (0 = north), or null when unavailable.
   */
  heading: number | null;

  /**
   * Speed in metres per second, or null when unavailable.
   */
  speed: number | null;

  /**
   * Human-readable error message, or null when there is no error.
   */
  error: string | null;

  /**
   * True when the position was obtained with high-accuracy GPS.
   */
  isHighAccuracy: boolean;

  /**
   * True while waiting for the first position fix.
   */
  loading: boolean;
};

const DEFAULT_OPTIONS: Required<Omit<UseGeolocationOptions, 'mockData'>> = {
  enableHighAccuracy: true,
  timeout: 15_000,
  maximumAge: 0,
};

function buildPositionOptions(
  opts: UseGeolocationOptions,
): PositionOptions {
  return {
    enableHighAccuracy: opts.enableHighAccuracy ?? DEFAULT_OPTIONS.enableHighAccuracy,
    timeout: opts.timeout ?? DEFAULT_OPTIONS.timeout,
    maximumAge: opts.maximumAge ?? DEFAULT_OPTIONS.maximumAge,
  };
}

function isSecureContext(): boolean {
  if (typeof window === 'undefined') return true;
  return window.isSecureContext;
}

function geolocationAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

/**
 * useGeolocation — wraps navigator.geolocation.getCurrentPosition and
 * watchPosition to provide a reactive position stream.
 *
 * Falls back to Sarajevo (~43.85, 18.38) when the user denies permission.
 * Surfaces a friendly error when running on an insecure HTTP context.
 *
 * @param options - Optional configuration: enableHighAccuracy, timeout,
 *   maximumAge, and mockData for testing.
 * @returns GeolocationResult with position, accuracy, heading, speed, error,
 *   isHighAccuracy, and loading.
 */
export function useGeolocation(options: UseGeolocationOptions = {}): GeolocationResult {
  const { mockData, ...posOpts } = options;

  const [state, setState] = useState<GeolocationResult>(() => {
    if (mockData) return mockData;
    return {
      position: BALKAN_CENTER,
      accuracy: null,
      heading: null,
      speed: null,
      error: null,
      isHighAccuracy: false,
      loading: true,
    };
  });

  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (mockData) {
      setState(mockData);
      return;
    }

    if (!isSecureContext()) {
      setState((prev) => ({
        ...prev,
        position: BALKAN_CENTER,
        error:
          'Geolocation requires a secure connection (HTTPS). ' +
          'Showing default map centre.',
        isHighAccuracy: false,
        loading: false,
      }));
      return;
    }

    if (!geolocationAvailable()) {
      setState((prev) => ({
        ...prev,
        position: BALKAN_CENTER,
        error: 'Geolocation is not supported by your browser.',
        isHighAccuracy: false,
        loading: false,
      }));
      return;
    }

    const positionOptions = buildPositionOptions(posOpts);

    const onSuccess = (geo: GeolocationPosition) => {
      const { latitude, longitude, accuracy, heading, speed } = geo.coords;
      setState({
        position: new LatLng(latitude, longitude),
        accuracy,
        heading: heading ?? null,
        speed: speed ?? null,
        error: null,
        isHighAccuracy: positionOptions.enableHighAccuracy ?? true,
        loading: false,
      });
    };

    const onError = (err: GeolocationPositionError) => {
      const isPermissionDenied = err.code === err.PERMISSION_DENIED;
      const message = isPermissionDenied
        ? 'Location access denied. Showing default map centre (Sarajevo).'
        : err.code === err.TIMEOUT
        ? 'Location request timed out. Showing default map centre.'
        : 'Unable to determine your location. Showing default map centre.';

      setState((prev) => ({
        ...prev,
        position: BALKAN_CENTER,
        error: message,
        isHighAccuracy: false,
        loading: false,
      }));
    };

    // Kick off an immediate fix first, then start watching.
    navigator.geolocation.getCurrentPosition(onSuccess, onError, positionOptions);

    watchIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      positionOptions,
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mockData,
    posOpts.enableHighAccuracy,
    posOpts.timeout,
    posOpts.maximumAge,
  ]);

  return state;
}
