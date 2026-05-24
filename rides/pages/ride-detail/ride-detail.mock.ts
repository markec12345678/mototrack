import type { RideDetailTab } from './ride-detail-tab-type.js';

export const MOCK_RIDE = {
  id: `ride-001`,
  userId: `user-001`,
  name: `Trebević Morning Blast`,
  notes: `Perfect conditions, light traffic. Pushed hard on the hairpins above the cable car station.`,
  startedAt: Date.now() - 3 * 60 * 60 * 1000,
  endedAt: Date.now() - 1.5 * 60 * 60 * 1000,
  distanceKm: 47.3,
  durationSec: 5400,
  maxSpeedKmh: 118,
  avgSpeedKmh: 63,
  climbM: 812,
  descentM: 798,
  twistinessScore: 7.4,
  track: [
    { lat: 43.8563, lng: 18.4131, ts: Date.now() - 5400000, speed: 0, elevation: 520, accuracy: 5, heading: 0 },
    { lat: 43.862, lng: 18.422, ts: Date.now() - 5100000, speed: 18, elevation: 545, accuracy: 4, heading: 45 },
    { lat: 43.871, lng: 18.435, ts: Date.now() - 4800000, speed: 22, elevation: 580, accuracy: 4, heading: 60 },
    { lat: 43.878, lng: 18.448, ts: Date.now() - 4500000, speed: 25, elevation: 620, accuracy: 3, heading: 75 },
    { lat: 43.882, lng: 18.462, ts: Date.now() - 4200000, speed: 28, elevation: 670, accuracy: 3, heading: 90 },
    { lat: 43.875, lng: 18.478, ts: Date.now() - 3900000, speed: 30, elevation: 710, accuracy: 4, heading: 120 },
    { lat: 43.865, lng: 18.49, ts: Date.now() - 3600000, speed: 32, elevation: 740, accuracy: 4, heading: 150 },
    { lat: 43.858, lng: 18.502, ts: Date.now() - 3300000, speed: 29, elevation: 720, accuracy: 5, heading: 180 },
    { lat: 43.851, lng: 18.515, ts: Date.now() - 3000000, speed: 26, elevation: 690, accuracy: 4, heading: 200 },
    { lat: 43.845, lng: 18.528, ts: Date.now() - 2700000, speed: 24, elevation: 650, accuracy: 4, heading: 220 },
    { lat: 43.852, lng: 18.541, ts: Date.now() - 2400000, speed: 27, elevation: 610, accuracy: 3, heading: 240 },
    { lat: 43.861, lng: 18.553, ts: Date.now() - 2100000, speed: 31, elevation: 575, accuracy: 3, heading: 260 },
    { lat: 43.869, lng: 18.565, ts: Date.now() - 1800000, speed: 33, elevation: 545, accuracy: 4, heading: 280 },
    { lat: 43.876, lng: 18.576, ts: Date.now() - 1500000, speed: 30, elevation: 530, accuracy: 4, heading: 300 },
    { lat: 43.882, lng: 18.588, ts: Date.now() - 1200000, speed: 28, elevation: 520, accuracy: 5, heading: 320 },
  ],
};

export const MOCK_ELEVATION_POINTS = MOCK_RIDE.track.map((pt, idx) => ({
  elevation: pt.elevation ?? 520,
  distanceKm: (idx / (MOCK_RIDE.track.length - 1)) * MOCK_RIDE.distanceKm,
}));

function PlaceholderTabComponent(_props: { rideId: string }) {
  return null;
}

export const MOCK_TABS: RideDetailTab[] = [
  {
    key: `photos`,
    label: `Photos`,
    icon: `📷`,
    component: PlaceholderTabComponent,
    order: 1,
  },
  {
    key: `weather`,
    label: `Weather`,
    icon: `🌤️`,
    component: PlaceholderTabComponent,
    order: 2,
  },
  {
    key: `comments`,
    label: `Comments`,
    icon: `💬`,
    component: PlaceholderTabComponent,
    order: 3,
  },
];

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(`en-GB`, {
    weekday: `short`,
    day: `numeric`,
    month: `short`,
    year: `numeric`,
  });
}
