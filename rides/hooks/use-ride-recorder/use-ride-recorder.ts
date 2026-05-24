import { useState, useEffect, useRef, useCallback } from 'react';
import { TrackPoint } from '@markec/rides.entities.track-point';
import { LatLng } from '@markec/maps.entities.lat-lng';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mototrack:active-ride';
const HEARTBEAT_INTERVAL_MS = 30_000;
const AUTOSAVE_INTERVAL_MS = 15_000;
const MAX_ACCURACY_M = 200;
const MAX_JUMP_SLOW_M = 500;
const MAX_JUMP_FAST_M = 200;
const FAST_SPEED_THRESHOLD_KMH = 120;
const MS_TO_KMH = 3.6;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Recording lifecycle status of the ride recorder.
 */
export type RecorderStatus = 'idle' | 'recording' | 'paused' | 'stopped';

/**
 * GPS signal quality level derived from the most recent fix accuracy.
 */
export type GpsQuality = 'excellent' | 'good' | 'poor' | 'lost';

/**
 * A gap marker inserted into the track when GPS is re-acquired after a
 * visibility change or resume. Consumers can use this to break the polyline.
 */
export type GapMarker = { gap: true; ts: number };

/**
 * A single entry in the recorded track — either a real GPS fix or a gap marker.
 */
export type TrackEntry = TrackPoint | GapMarker;

/**
 * Snapshot persisted to localStorage for crash recovery.
 */
export type RideSnapshot = {
  startedAt: number;
  points: TrackPoint[];
  pausedDurationMs: number;
};

/**
 * Full return value of the useRideRecorder hook.
 */
export type UseRideRecorderReturn = {
  /** Current lifecycle status. */
  status: RecorderStatus;
  /** Recorded track entries (GPS fixes + gap markers). */
  points: TrackEntry[];
  /** Total distance in kilometres. */
  distanceKm: number;
  /** Elapsed recording time in seconds (excludes paused time). */
  durationSec: number;
  /** Speed from the most recent GPS fix, in km/h. */
  currentSpeedKmh: number;
  /** Maximum speed observed during the ride, in km/h. */
  maxSpeedKmh: number;
  /** Total positive elevation gain in metres. */
  climbM: number;
  /** GPS signal quality derived from the latest fix accuracy. */
  gpsQuality: GpsQuality;
  /** Number of times GPS was re-acquired after a signal loss. */
  reconnectCount: number;
  /** Start recording. Requests WakeLock. */
  start: () => Promise<void>;
  /** Pause recording — GPS watch stays active but points are not stored. */
  pause: () => void;
  /** Resume from paused state. */
  resume: () => void;
  /** Stop recording and clear the crash-recovery snapshot. */
  stop: () => void;
  /** Rehydrate a previously crashed ride from localStorage. */
  restore: () => boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isGapMarker(entry: TrackEntry): entry is GapMarker {
  return (entry as GapMarker).gap === true;
}

function gpsPoints(entries: TrackEntry[]): TrackPoint[] {
  return entries.filter((e): e is TrackPoint => !isGapMarker(e));
}

function deriveGpsQuality(accuracyM: number | null): GpsQuality {
  if (accuracyM === null) return 'lost';
  if (accuracyM <= 10) return 'excellent';
  if (accuracyM <= 50) return 'good';
  if (accuracyM <= MAX_ACCURACY_M) return 'poor';
  return 'lost';
}

function computeDistanceKm(pts: TrackPoint[]): number {
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = new LatLng(pts[i - 1].lat, pts[i - 1].lng);
    const b = new LatLng(pts[i].lat, pts[i].lng);
    total += LatLng.haversineKm(a, b);
  }
  return total;
}

function computeClimbM(pts: TrackPoint[]): number {
  let climb = 0;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1].elevation;
    const curr = pts[i].elevation;
    if (prev != null && curr != null && curr > prev) {
      climb += curr - prev;
    }
  }
  return climb;
}

function computeMaxSpeedKmh(pts: TrackPoint[]): number {
  let max = 0;
  for (const pt of pts) {
    if (pt.speed != null) {
      const kmh = pt.speed * MS_TO_KMH;
      if (kmh > max) max = kmh;
    }
  }
  return max;
}

function isSanityOk(
  incoming: GeolocationCoordinates,
  lastPoint: TrackPoint | null
): boolean {
  if (incoming.accuracy > MAX_ACCURACY_M) return false;

  if (lastPoint !== null) {
    const a = new LatLng(lastPoint.lat, lastPoint.lng);
    const b = new LatLng(incoming.latitude, incoming.longitude);
    const distM = LatLng.haversineKm(a, b) * 1000;
    const speedKmh =
      incoming.speed != null ? incoming.speed * MS_TO_KMH : 0;
    const threshold =
      speedKmh >= FAST_SPEED_THRESHOLD_KMH
        ? MAX_JUMP_FAST_M
        : MAX_JUMP_SLOW_M;
    if (distM > threshold) return false;
  }

  return true;
}

function coordsToTrackPoint(coords: GeolocationCoordinates, ts: number): TrackPoint {
  return new TrackPoint(
    coords.latitude,
    coords.longitude,
    ts,
    coords.speed ?? undefined,
    coords.altitude ?? undefined,
    coords.accuracy,
    coords.heading ?? undefined,
  );
}

function loadSnapshot(): RideSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RideSnapshot;
  } catch {
    return null;
  }
}

function saveSnapshot(snapshot: RideSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

function clearSnapshot(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently ignore
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useRideRecorder — production-grade GPS ride recorder hook.
 *
 * Manages the full lifecycle of a GPS-tracked motorcycle ride:
 * - Requests WakeLock on start to prevent screen sleep
 * - Uses watchPosition with enableHighAccuracy=true for continuous tracking
 * - Heartbeat fallback every 30s via getCurrentPosition if watchPosition goes silent
 * - Sanity-checks each fix: rejects accuracy >200m and impossible position jumps
 * - Auto-saves a crash-recovery snapshot to localStorage every 15s
 * - Re-acquires GPS on visibilitychange (return to foreground) and inserts gap markers
 * - Full pause/resume/stop lifecycle
 *
 * @returns The recorder state and control functions.
 */
export function useRideRecorder(): UseRideRecorderReturn {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [points, setPoints] = useState<TrackEntry[]>([]);
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState(0);
  const [gpsQuality, setGpsQuality] = useState<GpsQuality>('lost');
  const [reconnectCount, setReconnectCount] = useState(0);
  const [durationSec, setDurationSec] = useState(0);

  // Refs — mutable state that must not trigger re-renders
  const statusRef = useRef<RecorderStatus>('idle');
  const pointsRef = useRef<TrackEntry[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const pausedDurationMsRef = useRef(0);
  const lastPointRef = useRef<TrackPoint | null>(null);
  const lastFixTsRef = useRef<number>(0);
  const watchIdRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autosaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Internal: append a point ─────────────────────────────────────────────

  const appendPoint = useCallback((entry: TrackEntry) => {
    pointsRef.current = [...pointsRef.current, entry];
    setPoints([...pointsRef.current]);
  }, []);

  // ── Internal: process a raw GeolocationPosition ──────────────────────────

  const handlePosition = useCallback(
    (pos: GeolocationPosition) => {
      if (statusRef.current !== 'recording') return;

      const { coords, timestamp } = pos;
      lastFixTsRef.current = Date.now();

      const quality = deriveGpsQuality(coords.accuracy);
      setGpsQuality(quality);
      setCurrentSpeedKmh(
        coords.speed != null ? coords.speed * MS_TO_KMH : 0
      );

      if (!isSanityOk(coords, lastPointRef.current)) return;

      const pt = coordsToTrackPoint(coords, timestamp);
      lastPointRef.current = pt;
      appendPoint(pt);
    },
    [appendPoint]
  );

  // ── Internal: clear GPS watch ────────────────────────────────────────────

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // ── Internal: start GPS watch ────────────────────────────────────────────

  const startWatch = useCallback(() => {
    clearWatch();
    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePosition,
      () => {
        setGpsQuality('lost');
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 }
    );
  }, [clearWatch, handlePosition]);

  // ── Internal: heartbeat ──────────────────────────────────────────────────

  const startHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current !== null) {
      clearInterval(heartbeatTimerRef.current);
    }
    heartbeatTimerRef.current = setInterval(() => {
      if (statusRef.current !== 'recording') return;
      const silentMs = Date.now() - lastFixTsRef.current;
      if (silentMs >= HEARTBEAT_INTERVAL_MS) {
        navigator.geolocation.getCurrentPosition(
          handlePosition,
          () => {
            setGpsQuality('lost');
            setReconnectCount((c) => c + 1);
          },
          { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
        );
      }
    }, HEARTBEAT_INTERVAL_MS);
  }, [handlePosition]);

  // ── Internal: autosave ───────────────────────────────────────────────────

  const startAutosave = useCallback(() => {
    if (autosaveTimerRef.current !== null) {
      clearInterval(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = setInterval(() => {
      if (startedAtRef.current === null) return;
      const pts = gpsPoints(pointsRef.current);
      saveSnapshot({
        startedAt: startedAtRef.current,
        points: pts,
        pausedDurationMs: pausedDurationMsRef.current,
      });
    }, AUTOSAVE_INTERVAL_MS);
  }, []);

  // ── Internal: duration ticker ────────────────────────────────────────────

  const startDurationTicker = useCallback(() => {
    if (durationTimerRef.current !== null) {
      clearInterval(durationTimerRef.current);
    }
    durationTimerRef.current = setInterval(() => {
      if (startedAtRef.current === null) return;
      const elapsed =
        Date.now() -
        startedAtRef.current -
        pausedDurationMsRef.current;
      setDurationSec(Math.floor(elapsed / 1000));
    }, 1000);
  }, []);

  // ── Internal: stop all timers ────────────────────────────────────────────

  const stopAllTimers = useCallback(() => {
    if (heartbeatTimerRef.current !== null) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (autosaveTimerRef.current !== null) {
      clearInterval(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    if (durationTimerRef.current !== null) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  // ── Internal: release WakeLock ───────────────────────────────────────────

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current !== null) {
      try {
        await wakeLockRef.current.release();
      } catch {
        // Ignore release errors
      }
      wakeLockRef.current = null;
    }
  }, []);

  // ── Public: start ────────────────────────────────────────────────────────

  const start = useCallback(async () => {
    if (
      statusRef.current === 'recording' ||
      statusRef.current === 'paused'
    ) return;

    startedAtRef.current = Date.now();
    pausedDurationMsRef.current = 0;
    pausedAtRef.current = null;
    pointsRef.current = [];
    lastPointRef.current = null;
    lastFixTsRef.current = 0;

    setPoints([]);
    setDurationSec(0);
    setCurrentSpeedKmh(0);
    setGpsQuality('lost');
    setReconnectCount(0);

    statusRef.current = 'recording';
    setStatus('recording');

    // Request WakeLock
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (
          navigator as Navigator & {
            wakeLock: { request: (type: string) => Promise<WakeLockSentinel> };
          }
        ).wakeLock.request('screen');
      } catch {
        // WakeLock not critical — continue without it
      }
    }

    startWatch();
    startHeartbeat();
    startAutosave();
    startDurationTicker();
  }, [startWatch, startHeartbeat, startAutosave, startDurationTicker]);

  // ── Public: pause ────────────────────────────────────────────────────────

  const pause = useCallback(() => {
    if (statusRef.current !== 'recording') return;
    pausedAtRef.current = Date.now();
    statusRef.current = 'paused';
    setStatus('paused');
  }, []);

  // ── Public: resume ───────────────────────────────────────────────────────

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return;
    if (pausedAtRef.current !== null) {
      pausedDurationMsRef.current += Date.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
    appendPoint({ gap: true, ts: Date.now() });
    statusRef.current = 'recording';
    setStatus('recording');
  }, [appendPoint]);

  // ── Public: stop ─────────────────────────────────────────────────────────

  const stop = useCallback(() => {
    if (
      statusRef.current === 'idle' ||
      statusRef.current === 'stopped'
    ) return;

    statusRef.current = 'stopped';
    setStatus('stopped');

    clearWatch();
    stopAllTimers();
    releaseWakeLock();
    clearSnapshot();
  }, [clearWatch, stopAllTimers, releaseWakeLock]);

  // ── Public: restore ──────────────────────────────────────────────────────

  const restore = useCallback((): boolean => {
    const snapshot = loadSnapshot();
    if (!snapshot) return false;

    startedAtRef.current = snapshot.startedAt;
    pausedDurationMsRef.current = snapshot.pausedDurationMs;

    const restoredPoints: TrackPoint[] = snapshot.points.map(
      (p) => TrackPoint.from(p)
    );
    pointsRef.current = restoredPoints;
    setPoints([...restoredPoints]);

    if (restoredPoints.length > 0) {
      lastPointRef.current = restoredPoints[restoredPoints.length - 1];
    }

    const elapsed =
      Date.now() - snapshot.startedAt - snapshot.pausedDurationMs;
    setDurationSec(Math.floor(elapsed / 1000));

    const pts = gpsPoints(restoredPoints);
    const maxSpd = computeMaxSpeedKmh(pts);
    setCurrentSpeedKmh(maxSpd);

    return true;
  }, []);

  // ── visibilitychange listener ────────────────────────────────────────────

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      if (statusRef.current !== 'recording') return;

      appendPoint({ gap: true, ts: Date.now() });
      setReconnectCount((c) => c + 1);

      startWatch();
      lastFixTsRef.current = 0;
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [appendPoint, startWatch]);

  // ── Restore on mount if snapshot exists ─────────────────────────────────

  useEffect(() => {
    const snapshot = loadSnapshot();
    if (snapshot) {
      restore();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cleanup on unmount ───────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      clearWatch();
      stopAllTimers();
      releaseWakeLock();
    };
  }, [clearWatch, stopAllTimers, releaseWakeLock]);

  // ── Derived metrics (computed from React state `points`) ─────────────────

  const gpsPts = gpsPoints(points);
  const distanceKm = computeDistanceKm(gpsPts);
  const climbM = computeClimbM(gpsPts);
  const maxSpeedKmh = computeMaxSpeedKmh(gpsPts);

  return {
    status,
    points,
    distanceKm,
    durationSec,
    currentSpeedKmh,
    maxSpeedKmh,
    climbM,
    gpsQuality,
    reconnectCount,
    start,
    pause,
    resume,
    stop,
    restore,
  };
}
