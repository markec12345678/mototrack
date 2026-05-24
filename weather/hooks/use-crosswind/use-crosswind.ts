import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useCurrentWeather } from '@markec/weather.hooks.use-current-weather';
import { WeatherSnapshot } from '@markec/weather.entities.weather-snapshot';

/**
 * Severity level of the crosswind relative to the rider's heading.
 *
 * - `none`       — crosswind < 20 km/h, safe riding conditions
 * - `moderate`   — crosswind 20–39 km/h, increased attention required
 * - `strong`     — crosswind 40–59 km/h, single audio beep alert triggered
 * - `dangerous`  — crosswind ≥ 60 km/h, repeated red flash + 'USTAVI SE!' alert
 */
export type CrosswindLevel = 'none' | 'moderate' | 'strong' | 'dangerous';

/**
 * Result returned by the useCrosswind hook.
 */
export type CrosswindResult = {
  /**
   * Perpendicular (cross) wind component in km/h relative to the rider's heading.
   * Always a non-negative value.
   */
  crossKmh: number;

  /**
   * Severity classification of the crosswind.
   */
  level: CrosswindLevel;

  /**
   * Whether an audible alert is currently active.
   * True when level is `strong` (single beep on entry) or `dangerous` (repeating beep).
   */
  audibleAlert: boolean;

  /**
   * Whether the dangerous flash overlay is currently active.
   * True when level is `dangerous`.
   */
  dangerFlash: boolean;

  /**
   * Whether data is currently being loaded.
   */
  isLoading: boolean;

  /**
   * Error message if the weather fetch failed.
   */
  error?: string;
};

/**
 * Options for the useCrosswind hook.
 */
export type UseCrosswindOptions = {
  /**
   * Provide a mock WeatherSnapshot to skip the real GraphQL fetch.
   * Useful for testing and Storybook compositions.
   */
  mockData?: WeatherSnapshot;

  /**
   * GPS location for the weather fetch.
   */
  location?: { lat: number; lng: number };
};

/** Crosswind thresholds in km/h. */
const THRESHOLDS = {
  moderate: 20,
  strong: 40,
  dangerous: 60,
} as const;

/**
 * Computes the perpendicular (cross) wind component in km/h
 * given the wind speed, wind direction, and the rider's heading.
 *
 * @param windKmh - Total wind speed in km/h
 * @param windDirDeg - Meteorological wind direction in degrees (direction wind comes FROM)
 * @param headingDeg - Rider's heading in degrees (0 = North, 90 = East)
 * @returns Absolute crosswind component in km/h
 */
export function computeCrossKmh(windKmh: number, windDirDeg: number, headingDeg: number): number {
  const angleDiff = ((windDirDeg - headingDeg + 360) % 360) * (Math.PI / 180);
  return Math.abs(windKmh * Math.sin(angleDiff));
}

/**
 * Classifies a crosswind speed into a severity level.
 *
 * @param crossKmh - Perpendicular wind component in km/h
 * @returns CrosswindLevel classification
 */
export function classifyCrosswind(crossKmh: number): CrosswindLevel {
  if (crossKmh >= THRESHOLDS.dangerous) return 'dangerous';
  if (crossKmh >= THRESHOLDS.strong) return 'strong';
  if (crossKmh >= THRESHOLDS.moderate) return 'moderate';
  return 'none';
}

/**
 * Plays a short beep using the Web Audio API.
 * Silently fails if AudioContext is unavailable (e.g. SSR).
 *
 * @param durationMs - Duration of the beep in milliseconds
 */
function playBeep(durationMs = 300): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationMs / 1000);
    osc.onended = () => { ctx.close(); };
  } catch {
    // AudioContext unavailable — silent fail (SSR / test environment)
  }
}

/**
 * useCrosswind — computes the perpendicular wind component from current weather
 * relative to the rider's heading.
 *
 * Triggers a single audio beep when the level transitions to `strong`.
 * Triggers a repeating audio beep every 2 seconds and sets `dangerFlash = true`
 * when the level is `dangerous`.
 *
 * @param headingDeg - Rider's current heading in degrees (0 = North, 90 = East)
 * @param options - Optional location and mock data overrides
 * @returns CrosswindResult with crossKmh, level, audibleAlert, dangerFlash, isLoading, error
 */
export function useCrosswind(
  headingDeg: number,
  options?: UseCrosswindOptions
): CrosswindResult {
  const hasMock = Boolean(options?.mockData);

  // Always call the hook — skip real fetch when mock data is provided
  const weatherResult = useCurrentWeather(
    options?.location ?? { lat: 46.05, lng: 14.51 },
    { mockData: options?.mockData }
  );

  const snapshot: WeatherSnapshot | undefined = hasMock
    ? options?.mockData
    : weatherResult.snapshot;

  const isLoading = hasMock ? false : weatherResult.isLoading;
  const error = hasMock ? undefined : weatherResult.error;

  const crossKmh = useMemo(() => {
    if (!snapshot) return 0;
    const raw = computeCrossKmh(snapshot.windKmh, snapshot.windDirDeg, headingDeg);
    return Math.round(raw * 10) / 10;
  }, [snapshot, headingDeg]);

  const level = useMemo(() => classifyCrosswind(crossKmh), [crossKmh]);

  const [dangerFlash, setDangerFlash] = useState(false);
  const [audibleAlert, setAudibleAlert] = useState(false);

  const prevLevelRef = useRef<CrosswindLevel>('none');
  const dangerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearDangerInterval = useCallback(() => {
    if (dangerIntervalRef.current !== null) {
      clearInterval(dangerIntervalRef.current);
      dangerIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const prevLevel = prevLevelRef.current;
    prevLevelRef.current = level;

    if (level === 'dangerous') {
      setDangerFlash(true);
      setAudibleAlert(true);

      if (dangerIntervalRef.current === null) {
        playBeep(500);
        dangerIntervalRef.current = setInterval(() => {
          playBeep(500);
        }, 2000);
      }

      return undefined;
    }

    clearDangerInterval();
    setDangerFlash(false);

    if (level === 'strong' && prevLevel !== 'strong' && prevLevel !== 'dangerous') {
      setAudibleAlert(true);
      playBeep(300);
      const timeout = setTimeout(() => setAudibleAlert(false), 600);
      return () => clearTimeout(timeout);
    }

    setAudibleAlert(false);
    return undefined;
  }, [level, clearDangerInterval]);

  useEffect(() => {
    return () => {
      clearDangerInterval();
    };
  }, [clearDangerInterval]);

  return {
    crossKmh,
    level,
    audibleAlert,
    dangerFlash,
    isLoading,
    error,
  };
}
