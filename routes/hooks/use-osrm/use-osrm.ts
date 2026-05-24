import { useState, useCallback } from 'react';
import { TurnStep, OsrmStep, OsrmManeuverType, OsrmModifier } from '@markec/routes.entities.turn-step';
import { LatLng } from '@markec/maps.entities.lat-lng';

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

// ─── OSRM raw response types ──────────────────────────────────────────────────

type OsrmLeg = {
  steps: OsrmStep[];
};

type OsrmRoute = {
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  distance: number;
  duration: number;
  legs: OsrmLeg[];
};

type OsrmResponse = {
  code: string;
  routes: OsrmRoute[];
};

// ─── Public types ─────────────────────────────────────────────────────────────

/**
 * The computed route result returned by the OSRM router.
 */
export type OsrmRouteResult = {
  /** Decoded geometry as an ordered array of LatLng points. */
  geometry: LatLng[];
  /** Total route distance in kilometres. */
  distanceKm: number;
  /** Total route duration in seconds. */
  durationSec: number;
  /** Turn-by-turn steps with Slovenian instructions. */
  steps: TurnStep[];
};

/**
 * Options for the useOsrm hook, enabling mock data injection for testing.
 */
export type UseOsrmOptions = {
  /** Provide mock data to skip the network call entirely (useful in tests). */
  mockData?: OsrmRouteResult;
};

/**
 * Return value of the useOsrm hook.
 */
export type UseOsrmResult = {
  /**
   * Triggers a route computation for the given waypoints.
   * Falls back to straight-line geometry on network failure.
   */
  compute: (waypoints: LatLng[]) => Promise<void>;
  /** The last successfully computed route, or undefined if none yet. */
  data: OsrmRouteResult | undefined;
  /** True while a route request is in flight. */
  isLoading: boolean;
  /** Error message if the last request failed, or undefined. */
  error: string | undefined;
};

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function coordsToLatLng(coordinates: [number, number][]): LatLng[] {
  return coordinates.map(([lng, lat]) => new LatLng(lat, lng));
}

function buildStraightLineGeometry(waypoints: LatLng[]): LatLng[] {
  if (waypoints.length < 2) return waypoints;
  const segments: LatLng[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];
    const numSteps = 10;
    for (let s = 0; s <= numSteps; s++) {
      const t = s / numSteps;
      segments.push(new LatLng(
        from.lat + (to.lat - from.lat) * t,
        from.lng + (to.lng - from.lng) * t,
      ));
    }
  }
  return segments;
}

function haversineKm(from: LatLng, to: LatLng): number {
  const dLat = (to.lat - from.lat) * (Math.PI / 180);
  const dLng = (to.lng - from.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(from.lat * (Math.PI / 180)) *
      Math.cos(to.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildFallbackResult(waypoints: LatLng[]): OsrmRouteResult {
  const geometry = buildStraightLineGeometry(waypoints);
  const distanceKm = waypoints.reduce((acc, wp, i) => {
    if (i === 0) return acc;
    return acc + haversineKm(waypoints[i - 1], wp);
  }, 0);

  const departStep = TurnStep.fromOsrmStep(
    {
      maneuver: { type: 'depart' as OsrmManeuverType, location: [waypoints[0].lng, waypoints[0].lat] },
      distance: distanceKm * 1000,
      duration: (distanceKm / 60) * 3600,
      name: '',
    },
    'fallback-depart',
  );

  const last = waypoints[waypoints.length - 1];
  const arriveStep = TurnStep.fromOsrmStep(
    {
      maneuver: { type: 'arrive' as OsrmManeuverType, location: [last.lng, last.lat] },
      distance: 0,
      duration: 0,
      name: '',
    },
    'fallback-arrive',
  );

  return {
    geometry,
    distanceKm: Math.round(distanceKm * 10) / 10,
    durationSec: Math.round((distanceKm / 60) * 3600),
    steps: [departStep, arriveStep],
  };
}

function parseOsrmResponse(response: OsrmResponse): OsrmRouteResult {
  const route = response.routes[0];
  const geometry = coordsToLatLng(route.geometry.coordinates);
  const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
  const durationSec = Math.round(route.duration);

  const steps: TurnStep[] = route.legs
    .flatMap((leg) => leg.steps)
    .map((step, index) => {
      const osrmStep: OsrmStep = {
        maneuver: {
          type: step.maneuver.type as OsrmManeuverType,
          modifier: step.maneuver.modifier as OsrmModifier | undefined,
          location: step.maneuver.location,
        },
        distance: step.distance,
        duration: step.duration,
        name: step.name,
      };
      return TurnStep.fromOsrmStep(osrmStep, `step-${index}`);
    });

  return { geometry, distanceKm, durationSec, steps };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useOsrm — calls the public OSRM routing API and returns decoded route data.
 *
 * Fetches from https://router.project-osrm.org/route/v1/driving/{coords}
 * with overview=full, geometries=geojson, and steps=true.
 *
 * Steps are translated to Slovenian turn instructions via TurnStep.fromOsrmStep.
 * On network failure the hook falls back to straight-line geometry between
 * the provided waypoints so the UI never breaks.
 *
 * @param options - Optional configuration. Pass mockData to skip the network
 *   call and immediately return a pre-built result (useful in tests).
 * @returns compute, data, isLoading, error
 */
export function useOsrm(options?: UseOsrmOptions): UseOsrmResult {
  const [data, setData] = useState<OsrmRouteResult | undefined>(
    options?.mockData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const compute = useCallback(
    async (waypoints: LatLng[]) => {
      if (options?.mockData) {
        setData(options.mockData);
        return;
      }

      if (waypoints.length < 2) {
        setError('Potrebni sta vsaj dve točki za izračun poti.');
        return;
      }

      setIsLoading(true);
      setError(undefined);

      const coords = waypoints
        .map((wp) => `${wp.lng},${wp.lat}`)
        .join(';');

      const url = `${OSRM_BASE}/${coords}?overview=full&geometries=geojson&steps=true`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`OSRM vrnil napako: ${response.status}`);
        }

        const json: OsrmResponse = await response.json();

        if (json.code !== 'Ok' || !json.routes.length) {
          throw new Error('OSRM ni našel poti med izbranimi točkami.');
        }

        setData(parseOsrmResponse(json));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Neznana napaka pri izračunu poti.';
        setError(message);
        setData(buildFallbackResult(waypoints));
      } finally {
        setIsLoading(false);
      }
    },
    [options?.mockData]
  );

  return { compute, data, isLoading, error };
}
