import { OsrmClient, type OsrmLatLng, type OsrmRoute, haversineKm } from './osrm-client.js';

function curviness(geometry: OsrmLatLng[]): number {
  if (geometry.length < 3) return 0;
  let totalBearingChange = 0;
  for (let i = 1; i < geometry.length - 1; i += 1) {
    const a = bearing(geometry[i - 1], geometry[i]);
    const b = bearing(geometry[i], geometry[i + 1]);
    totalBearingChange += Math.abs(angleDiff(a, b));
  }
  return totalBearingChange;
}

function bearing(a: OsrmLatLng, b: OsrmLatLng): number {
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180) / Math.PI;
}

function angleDiff(a: number, b: number): number {
  let diff = ((b - a + 180) % 360) - 180;
  if (diff < -180) diff += 360;
  return diff;
}

/**
 * sample a detour candidate by offsetting the midpoint perpendicular to the line.
 */
function detourMidpoint(start: OsrmLatLng, end: OsrmLatLng, offsetKm: number, direction: 1 | -1): OsrmLatLng {
  const midLat = (start.lat + end.lat) / 2;
  const midLng = (start.lng + end.lng) / 2;
  const brg = bearing(start, end);
  const perp = ((brg + 90 * direction) * Math.PI) / 180;
  const offsetLat = (offsetKm / 111) * Math.cos(perp);
  const offsetLng = (offsetKm / (111 * Math.cos((midLat * Math.PI) / 180))) * Math.sin(perp);
  return { lat: midLat + offsetLat, lng: midLng + offsetLng };
}

export type TwistyOptions = {
  start: OsrmLatLng;
  end: OsrmLatLng;
  twistiness: number;
};

/**
 * generateTwistyRoute: sample 2 detour candidates from secondary roads and pick the curviest.
 */
export async function generateTwistyRoute(osrm: OsrmClient, options: TwistyOptions): Promise<OsrmRoute> {
  const baseDistance = haversineKm(options.start, options.end);
  const offsetKm = baseDistance * (0.15 + options.twistiness * 0.35);

  const candidateA = detourMidpoint(options.start, options.end, offsetKm, 1);
  const candidateB = detourMidpoint(options.start, options.end, offsetKm, -1);

  const [routeA, routeB] = await Promise.all([
    osrm.route([options.start, candidateA, options.end]),
    osrm.route([options.start, candidateB, options.end]),
  ]);

  return curviness(routeA.geometry) >= curviness(routeB.geometry) ? routeA : routeB;
}

export type RoundTripOptions = {
  start: OsrmLatLng;
  distanceKm: number;
  twistiness: number;
  direction?: 'clockwise' | 'counterclockwise';
};

/**
 * generateRoundTrip: builds 3-6 intermediate waypoints on a circular pattern.
 * radius = distanceKm/(2π) + jitter. twistiness biases intermediate count.
 */
export async function generateRoundTrip(osrm: OsrmClient, options: RoundTripOptions): Promise<OsrmRoute> {
  const intermediateCount = Math.max(3, Math.min(6, 3 + Math.round(options.twistiness * 3)));
  const baseRadiusKm = options.distanceKm / (2 * Math.PI);
  const dir = options.direction === 'counterclockwise' ? -1 : 1;

  const waypoints: OsrmLatLng[] = [options.start];
  for (let i = 1; i <= intermediateCount; i += 1) {
    const angle = (i / (intermediateCount + 1)) * 2 * Math.PI * dir;
    const jitter = 1 + (Math.random() - 0.5) * 0.3 * options.twistiness;
    const radiusKm = baseRadiusKm * jitter;
    const latOffset = (radiusKm / 111) * Math.cos(angle);
    const lngOffset = (radiusKm / (111 * Math.cos((options.start.lat * Math.PI) / 180))) * Math.sin(angle);
    waypoints.push({
      lat: options.start.lat + latOffset,
      lng: options.start.lng + lngOffset,
    });
  }
  waypoints.push(options.start);

  // route each segment individually and concatenate to avoid reusing segments.
  const seenSegments = new Set<string>();
  const fullGeometry: OsrmLatLng[] = [];
  const fullSteps: OsrmRoute['steps'] = [];
  let totalDistance = 0;
  let totalDuration = 0;

  for (let i = 0; i < waypoints.length - 1; i += 1) {
    const segment = await osrm.route([waypoints[i], waypoints[i + 1]]);

    // de-dup segments along the geometry to ensure no segment is reused.
    const filtered: OsrmLatLng[] = [];
    for (let p = 0; p < segment.geometry.length; p += 1) {
      if (p === 0 && fullGeometry.length > 0) continue;
      const prev = filtered.length > 0
        ? filtered[filtered.length - 1]
        : fullGeometry[fullGeometry.length - 1];
      if (!prev) {
        filtered.push(segment.geometry[p]);
        continue;
      }
      const key = segmentKey(prev, segment.geometry[p]);
      if (seenSegments.has(key)) continue;
      seenSegments.add(key);
      filtered.push(segment.geometry[p]);
    }
    fullGeometry.push(...filtered);
    fullSteps.push(...segment.steps);
    totalDistance += segment.distanceKm;
    totalDuration += segment.durationSec;
  }

  return {
    geometry: fullGeometry,
    distanceKm: totalDistance,
    durationSec: totalDuration,
    steps: fullSteps,
  };
}

function segmentKey(a: OsrmLatLng, b: OsrmLatLng): string {
  const round = (n: number) => Math.round(n * 1e4) / 1e4;
  return `${round(a.lat)},${round(a.lng)}->${round(b.lat)},${round(b.lng)}`;
}
