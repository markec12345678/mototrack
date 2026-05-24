import { useState, useEffect, useCallback, useRef } from 'react';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { useGeolocation } from '@markec/maps.hooks.use-geolocation';
import { PlannedRoute } from '@markec/routes.entities.planned-route';
import { TurnStep } from '@markec/routes.entities.turn-step';
import { useTts } from '@markec/navigation.hooks.use-tts';

/**
 * Represents the rider's deviation status relative to the planned route.
 *
 * - `on-route`  — within acceptable corridor (< 30 m off the route line)
 * - `drift`     — slightly off (30–80 m); soft warning
 * - `off-route` — clearly off (80–200 m); recompute recommended
 * - `lost`      — severely off (> 200 m) or no GPS fix; urgent recompute
 */
export type DeviationState = 'on-route' | 'drift' | 'off-route' | 'lost';

const DRIFT_THRESHOLD_M = 30;
const OFF_ROUTE_THRESHOLD_M = 80;
const LOST_THRESHOLD_M = 200;
const MIN_SEGMENT_LENGTH_M = 0.5;

export type UseTurnByTurnOptions = {
  /**
   * Mock position for testing — bypasses live geolocation when provided.
   */
  mockPosition?: LatLng;

  /**
   * Mock deviation state override for testing.
   */
  mockDeviationState?: DeviationState;
};

export type TurnByTurnResult = {
  /**
   * The step the rider is currently navigating towards.
   */
  currentStep: TurnStep | null;

  /**
   * The step that follows the current one (look-ahead).
   */
  nextStep: TurnStep | null;

  /**
   * Distance in metres from the current position to the next manoeuvre point.
   */
  distanceToTurn: number;

  /**
   * Estimated time of arrival at the route destination in seconds from now.
   */
  etaSeconds: number;

  /**
   * Current deviation status of the rider relative to the planned route.
   */
  deviationState: DeviationState;

  /**
   * Triggers a route recompute request.
   */
  recompute: () => void;
};

// ─── Geometry Helpers ─────────────────────────────────────────────────────────

/**
 * TurnStep.location is an OSRM [lng, lat] tuple.
 * Returns a LatLng plain object from it.
 */
function stepToLatLng(step: TurnStep): LatLng {
  const loc = step.location as unknown as number[];
  return LatLng.from({ lat: loc[1], lng: loc[0] });
}

function pointToSegmentT(p: LatLng, a: LatLng, b: LatLng): number {
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-14) return 0;
  return Math.max(0, Math.min(1, ((p.lng - a.lng) * dx + (p.lat - a.lat) * dy) / lenSq));
}

function pointToSegmentDistSq(p: LatLng, a: LatLng, b: LatLng): number {
  const t = pointToSegmentT(p, a, b);
  const closestLng = a.lng + t * (b.lng - a.lng);
  const closestLat = a.lat + t * (b.lat - a.lat);
  const ex = p.lng - closestLng;
  const ey = p.lat - closestLat;
  return ex * ex + ey * ey;
}

function findNearestSegmentIndex(position: LatLng, geometry: LatLng[]): number {
  if (geometry.length < 2) return 0;
  let bestIdx = 0;
  let bestDistSq = Infinity;
  for (let i = 0; i < geometry.length - 1; i++) {
    const distSq = pointToSegmentDistSq(position, geometry[i], geometry[i + 1]);
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function distanceToPolylineM(position: LatLng, geometry: LatLng[]): number {
  if (geometry.length === 0) return Infinity;
  if (geometry.length === 1) return LatLng.haversineKm(position, geometry[0]) * 1000;
  let minDistM = Infinity;
  for (let i = 0; i < geometry.length - 1; i++) {
    const a = geometry[i];
    const b = geometry[i + 1];
    const segLenM = LatLng.haversineKm(a, b) * 1000;
    if (segLenM < MIN_SEGMENT_LENGTH_M) continue;
    const t = pointToSegmentT(position, a, b);
    const closest: LatLng = LatLng.interpolate(a, b, t);
    const distM = LatLng.haversineKm(position, closest) * 1000;
    if (distM < minDistM) minDistM = distM;
  }
  return minDistM;
}

function findCurrentStepIndex(position: LatLng, steps: TurnStep[], geometry: LatLng[]): number {
  if (steps.length === 0) return 0;
  const nearestSegIdx = findNearestSegmentIndex(position, geometry);
  let bestIdx = 0;
  let bestDistM = Infinity;
  for (let i = 0; i < steps.length; i++) {
    const stepPos = stepToLatLng(steps[i]);
    const stepSegIdx = findNearestSegmentIndex(stepPos, geometry);
    if (stepSegIdx < nearestSegIdx) continue;
    const distM = LatLng.haversineKm(position, stepPos) * 1000;
    if (distM < bestDistM) {
      bestDistM = distM;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function computeEtaSeconds(steps: TurnStep[], currentStepIdx: number): number {
  let eta = 0;
  for (let i = currentStepIdx; i < steps.length; i++) {
    eta += steps[i].durationSec;
  }
  return Math.round(eta);
}

function resolveAnnounceAt(speedKmh: number): number {
  return Math.max(150, speedKmh * 4);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useTurnByTurn — orchestrates real-time turn-by-turn navigation.
 *
 * Consumes a PlannedRoute (geometry + steps) and live GPS position from
 * useGeolocation. On each position update it:
 *
 * 1. Projects the rider onto the nearest route segment.
 * 2. Identifies the current and next TurnStep from route.steps.
 * 3. Computes distanceToTurn (metres to the next manoeuvre).
 * 4. Announces the step instruction via useTts when distance is within announceAt.
 * 5. Tracks deviationState (on-route / drift / off-route / lost).
 * 6. Emits a Slovenian "lost" announcement with urgent priority when lost.
 * 7. Returns recompute() for consumers to trigger route recalculation.
 *
 * @param route - The planned route providing geometry and steps.
 * @param options - Optional mock overrides for testing.
 * @returns Navigation state including current/next step, distance, ETA, deviation.
 */
export function useTurnByTurn(
  route: PlannedRoute | null,
  options?: UseTurnByTurnOptions
): TurnByTurnResult {
  const { speak } = useTts();
  const geo = useGeolocation();

  const livePosition = geo.position;
  const position: LatLng | null = options?.mockPosition ?? livePosition;

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [distanceToTurn, setDistanceToTurn] = useState<number>(0);
  const [etaSeconds, setEtaSeconds] = useState<number>(0);
  const [deviationState, setDeviationState] = useState<DeviationState>('on-route');
  const [recomputeCounter, setRecomputeCounter] = useState<number>(0);

  const announcedStepsRef = useRef<Set<number>>(new Set());
  const lostAnnouncedRef = useRef<boolean>(false);

  useEffect(() => {
    announcedStepsRef.current = new Set();
    lostAnnouncedRef.current = false;
    setCurrentStepIdx(0);
    setDistanceToTurn(0);
    setEtaSeconds(0);
    setDeviationState('on-route');
  }, [route?.id]);

  useEffect(() => {
    if (!route || !position) return;

    const steps: TurnStep[] = (route as any).steps ?? [];
    const geometry: LatLng[] = ((route as any).geometry ?? []).map((p: any) => LatLng.from(p));

    if (steps.length === 0 || geometry.length === 0) return;

    // 1. Find current step index
    const stepIdx = findCurrentStepIndex(position, steps, geometry);
    setCurrentStepIdx(stepIdx);

    // 2. Distance to the manoeuvre point of the current step
    const currentStep = steps[stepIdx];
    const stepPos = stepToLatLng(currentStep);
    const distM = LatLng.haversineKm(position, stepPos) * 1000;
    setDistanceToTurn(Math.round(distM));

    // 3. ETA
    setEtaSeconds(computeEtaSeconds(steps, stepIdx));

    // 4. Deviation detection
    const offRouteDistM = distanceToPolylineM(position, geometry);
    let newDeviation: DeviationState;

    if (offRouteDistM > LOST_THRESHOLD_M) {
      newDeviation = 'lost';
    } else if (offRouteDistM > OFF_ROUTE_THRESHOLD_M) {
      newDeviation = 'off-route';
    } else if (offRouteDistM > DRIFT_THRESHOLD_M) {
      newDeviation = 'drift';
    } else {
      newDeviation = 'on-route';
    }

    const effectiveDeviation = options?.mockDeviationState ?? newDeviation;
    setDeviationState(effectiveDeviation);

    // 5. Lost announcement (urgent, Slovenian)
    if (effectiveDeviation === 'lost' && !lostAnnouncedRef.current) {
      lostAnnouncedRef.current = true;
      speak('Izgubili ste pot, pritisnite za ponovni izračun', { priority: 'urgent' });
    } else if (effectiveDeviation !== 'lost') {
      lostAnnouncedRef.current = false;
    }

    // 6. Step announcement when within announceAt distance
    const speedKmh = (geo.speed ?? 0) * 3.6;
    const announceAt = resolveAnnounceAt(speedKmh);
    const shouldAnnounce =
      distM <= announceAt &&
      !announcedStepsRef.current.has(stepIdx) &&
      effectiveDeviation !== 'lost';

    if (shouldAnnounce) {
      announcedStepsRef.current.add(stepIdx);
      speak(currentStep.instruction, { priority: 'normal' });
    }
  }, [position, route, options?.mockDeviationState, geo.speed, speak]);

  const recompute = useCallback(() => {
    setRecomputeCounter((c) => c + 1);
    announcedStepsRef.current = new Set();
    lostAnnouncedRef.current = false;
  }, []);

  void recomputeCounter;

  const routeSteps: TurnStep[] = (route as any)?.steps ?? [];
  const currentStep = routeSteps[currentStepIdx] ?? null;
  const nextStep = routeSteps[currentStepIdx + 1] ?? null;

  return {
    currentStep,
    nextStep,
    distanceToTurn,
    etaSeconds,
    deviationState,
    recompute,
  };
}
