import type { TrackPointModel } from './ride.model.js';

type SeedRide = {
  name: string;
  notes: string;
  startedAt: number;
  endedAt: number;
  track: TrackPointModel[];
};

function buildTrack(
  start: { lat: number; lng: number; ele: number },
  end: { lat: number; lng: number; ele: number },
  startedAt: number,
  endedAt: number,
  steps: number
): TrackPointModel[] {
  const points: TrackPointModel[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const wobble = Math.sin(t * Math.PI * 4) * 0.001;
    const lat = start.lat + (end.lat - start.lat) * t + wobble;
    const lng = start.lng + (end.lng - start.lng) * t + wobble;
    const elevation = start.ele + (end.ele - start.ele) * t;
    const ts = Math.round(startedAt + (endedAt - startedAt) * t);
    points.push({ lat, lng, ts, elevation, speed: 16, accuracy: 5 });
  }
  return points;
}

const NOW = Date.now();
const DAY = 24 * 60 * 60 * 1000;

export const seedRides: SeedRide[] = [
  {
    name: 'Vršič Pass',
    notes: 'Klasika — 50 ovinkov, sonce, perfektna oprijemljivost.',
    startedAt: NOW - 3 * DAY,
    endedAt: NOW - 3 * DAY + 2 * 60 * 60 * 1000,
    track: buildTrack(
      { lat: 46.4621, lng: 13.7372, ele: 800 },
      { lat: 46.4334, lng: 13.7458, ele: 1611 },
      NOW - 3 * DAY,
      NOW - 3 * DAY + 2 * 60 * 60 * 1000,
      80
    ),
  },
  {
    name: 'Soča Valley',
    notes: 'Reka spodaj, smaragdna voda, gladek asfalt.',
    startedAt: NOW - 7 * DAY,
    endedAt: NOW - 7 * DAY + 3 * 60 * 60 * 1000,
    track: buildTrack(
      { lat: 46.2493, lng: 13.5786, ele: 230 },
      { lat: 46.3556, lng: 13.7297, ele: 480 },
      NOW - 7 * DAY,
      NOW - 7 * DAY + 3 * 60 * 60 * 1000,
      120
    ),
  },
  {
    name: 'Local Loop',
    notes: 'Hitra popoldanska rundica okoli mesta.',
    startedAt: NOW - 1 * DAY,
    endedAt: NOW - 1 * DAY + 45 * 60 * 1000,
    track: buildTrack(
      { lat: 46.0569, lng: 14.5058, ele: 295 },
      { lat: 46.1102, lng: 14.5311, ele: 340 },
      NOW - 1 * DAY,
      NOW - 1 * DAY + 45 * 60 * 1000,
      40
    ),
  },
];
