import { useState, useEffect, useRef, useCallback } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

// ─── GraphQL ─────────────────────────────────────────────────────────────────

const TRIGGER_SOS_MUTATION = gql`
  mutation TriggerSos($options: TriggerSosOptions!) {
    triggerSos(options: $options) {
      id
      dispatchedTo
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Sensitivity presets controlling the g-force and speed-drop thresholds.
 * - low: 5g / 50 km/h (fewer false positives)
 * - medium: 4g / 40 km/h (default)
 * - high: 3g / 30 km/h (more sensitive)
 */
export type CrashSensitivity = 'low' | 'medium' | 'high';

/**
 * A single detected crash event.
 */
export type CrashEvent = {
  /** Unique identifier for this crash event. */
  id: string;
  /** ISO timestamp when the crash was detected. */
  detectedAt: string;
  /** Total g-force measured at the moment of impact. */
  gForce: number;
  /** Speed drop in km/h detected within the 1-second window. */
  speedDrop: number;
  /** Whether the SOS was dismissed by the user before dispatch. */
  dismissed: boolean;
  /** Whether the SOS has already been dispatched. */
  sosDispatched: boolean;
  /** Seconds remaining in the countdown before SOS is auto-triggered (null if dismissed or dispatched). */
  countdown: number | null;
  /** Geolocation at the time of crash (if available). */
  location: { lat: number; lng: number } | null;
};

/**
 * Thresholds derived from the selected sensitivity preset.
 */
type SensitivityThresholds = {
  gForceThreshold: number;
  speedDropThreshold: number;
};

/**
 * Return value of the useCrashDetection hook.
 */
export type UseCrashDetectionReturn = {
  /** Whether the hook is actively monitoring DeviceMotion events. */
  isMonitoring: boolean;
  /** The most recently detected crash event, or null if none. */
  lastEvent: CrashEvent | null;
  /** Current sensitivity preset. */
  sensitivity: CrashSensitivity;
  /** Update the sensitivity preset. */
  setSensitivity: (sensitivity: CrashSensitivity) => void;
  /**
   * Dismiss the countdown for a given crash event, preventing SOS dispatch.
   * @param eventId - The id of the CrashEvent to dismiss.
   */
  dismiss: (eventId: string) => void;
};

/**
 * Options accepted by useCrashDetection.
 */
export type UseCrashDetectionOptions = {
  /**
   * Provide mock crash event data to bypass real DeviceMotion subscription.
   * Useful for testing and Storybook compositions.
   */
  mockData?: CrashEvent | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const COUNTDOWN_SECONDS = 15;
const SPEED_WINDOW_MS = 1000;

const SENSITIVITY_MAP: Record<CrashSensitivity, SensitivityThresholds> = {
  low: { gForceThreshold: 5, speedDropThreshold: 50 },
  medium: { gForceThreshold: 4, speedDropThreshold: 40 },
  high: { gForceThreshold: 3, speedDropThreshold: 30 },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `crash-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function totalGForce(x: number, y: number, z: number): number {
  // DeviceMotionEvent acceleration is in m/s². 1g ≈ 9.81 m/s².
  return Math.sqrt(x * x + y * y + z * z) / 9.81;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useCrashDetection — subscribes to the DeviceMotion accelerometer API and
 * detects motorcycle crashes based on g-force and speed-drop thresholds.
 *
 * Detection criteria (default / medium sensitivity):
 * - Total g-force > 4g, AND
 * - Speed drop > 40 km/h within a 1-second sliding window.
 *
 * On detection a 15-second countdown begins. If not dismissed via dismiss(eventId),
 * the hook automatically fires a triggerSos GraphQL mutation with the last known
 * GPS coordinates.
 *
 * @param options - Optional configuration including mockData for testing.
 * @returns UseCrashDetectionReturn
 */
export function useCrashDetection(
  options?: UseCrashDetectionOptions
): UseCrashDetectionReturn {
  const [sensitivity, setSensitivity] = useState<CrashSensitivity>('medium');
  const [lastEvent, setLastEvent] = useState<CrashEvent | null>(
    options?.mockData !== undefined ? options.mockData : null
  );
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);

  // Refs for mutable state that must not trigger re-renders
  const speedHistoryRef = useRef<{ speed: number; ts: number }[]>([]);
  const locationRef = useRef<{ lat: number; lng: number } | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeEventIdRef = useRef<string | null>(null);
  const sensitivityRef = useRef<CrashSensitivity>(sensitivity);

  // Keep sensitivityRef in sync
  useEffect(() => {
    sensitivityRef.current = sensitivity;
  }, [sensitivity]);

  const [triggerSosMutation] = useMutation<
    { triggerSos: { id: string; dispatchedTo: string[] } },
    { options: { lat: number; lng: number } }
  >(TRIGGER_SOS_MUTATION);

  // ── Geolocation tracking ────────────────────────────────────────────────────
  useEffect(() => {
    if (options?.mockData !== undefined) return;

    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        locationRef.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        // Record speed (m/s → km/h) for speed-drop detection
        const speedKmh =
          pos.coords.speed != null ? pos.coords.speed * 3.6 : 0;
        const now = Date.now();
        speedHistoryRef.current.push({ speed: speedKmh, ts: now });

        // Prune entries older than the detection window
        speedHistoryRef.current = speedHistoryRef.current.filter(
          (entry) => now - entry.ts <= SPEED_WINDOW_MS
        );
      },
      undefined,
      { enableHighAccuracy: true, maximumAge: 500 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options?.mockData]);

  // ── Countdown management ────────────────────────────────────────────────────
  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current !== null) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(
    (eventId: string) => {
      clearCountdown();
      activeEventIdRef.current = eventId;
      let remaining = COUNTDOWN_SECONDS;

      countdownTimerRef.current = setInterval(() => {
        remaining -= 1;

        setLastEvent((prev) => {
          if (!prev || prev.id !== eventId || prev.dismissed) return prev;
          if (remaining <= 0) return { ...prev, countdown: 0 };
          return { ...prev, countdown: remaining };
        });

        if (remaining <= 0) {
          clearCountdown();

          // Dispatch SOS
          const loc = locationRef.current;
          const sosLat = loc?.lat ?? 0;
          const sosLng = loc?.lng ?? 0;

          triggerSosMutation({
            variables: { options: { lat: sosLat, lng: sosLng } },
          }).catch(() => {
            // Silently handle network errors — SOS best-effort
          });

          setLastEvent((prev) => {
            if (!prev || prev.id !== eventId) return prev;
            return { ...prev, countdown: null, sosDispatched: true };
          });

          activeEventIdRef.current = null;
        }
      }, 1000);
    },
    [clearCountdown, triggerSosMutation]
  );

  // ── Crash detection via DeviceMotion ───────────────────────────────────────
  useEffect(() => {
    if (options?.mockData !== undefined) return;

    if (typeof window === 'undefined' || !window.DeviceMotionEvent) {
      return;
    }

    setIsMonitoring(true);

    const handleMotion = (event: DeviceMotionEvent) => {
      const accel =
        event.accelerationIncludingGravity ?? event.acceleration;
      if (!accel) return;

      const x = accel.x ?? 0;
      const y = accel.y ?? 0;
      const z = accel.z ?? 0;

      const gForce = totalGForce(x, y, z);
      const { gForceThreshold, speedDropThreshold } =
        SENSITIVITY_MAP[sensitivityRef.current];

      if (gForce < gForceThreshold) return;

      // Calculate speed drop within the last 1s window
      const history = speedHistoryRef.current;
      if (history.length < 2) return;

      const maxSpeed = Math.max(...history.map((e) => e.speed));
      const minSpeed = Math.min(...history.map((e) => e.speed));
      const speedDrop = maxSpeed - minSpeed;

      if (speedDrop < speedDropThreshold) return;

      // Crash confirmed — prevent duplicate events while countdown is active
      if (activeEventIdRef.current !== null) return;

      const newEvent: CrashEvent = {
        id: generateId(),
        detectedAt: new Date().toISOString(),
        gForce: Math.round(gForce * 10) / 10,
        speedDrop: Math.round(speedDrop * 10) / 10,
        dismissed: false,
        sosDispatched: false,
        countdown: COUNTDOWN_SECONDS,
        location: locationRef.current,
      };

      setLastEvent(newEvent);
      startCountdown(newEvent.id);
    };

    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      setIsMonitoring(false);
      clearCountdown();
    };
  }, [options?.mockData, startCountdown, clearCountdown]);

  // ── Mock mode ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (options?.mockData === undefined) return;
    setLastEvent(options.mockData);
    setIsMonitoring(false);
  }, [options?.mockData]);

  // ── dismiss ─────────────────────────────────────────────────────────────────
  const dismiss = useCallback(
    (eventId: string) => {
      if (activeEventIdRef.current === eventId) {
        clearCountdown();
        activeEventIdRef.current = null;
      }

      setLastEvent((prev) => {
        if (!prev || prev.id !== eventId) return prev;
        return { ...prev, dismissed: true, countdown: null };
      });
    },
    [clearCountdown]
  );

  return {
    isMonitoring,
    lastEvent,
    sensitivity,
    setSensitivity,
    dismiss,
  };
}
