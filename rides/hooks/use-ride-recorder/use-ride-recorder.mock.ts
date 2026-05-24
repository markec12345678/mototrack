import { TrackPoint } from '@markec/rides.entities.track-point';
import type { TrackEntry, RideSnapshot, UseRideRecorderReturn } from './use-ride-recorder.js';

// ─── Mock track points ────────────────────────────────────────────────────────

const now = Date.now();

export const mockTrackPoints: TrackPoint[] = [
  new TrackPoint(43.8563, 18.4131, now - 300_000, 0, 520, 8, 0),
  new TrackPoint(43.8601, 18.4178, now - 270_000, 12.5, 524, 6, 42),
  new TrackPoint(43.8654, 18.4221, now - 240_000, 18.3, 531, 5, 48),
  new TrackPoint(43.8712, 18.4289, now - 210_000, 22.1, 545, 7, 55),
  new TrackPoint(43.8789, 18.4367, now - 180_000, 25.6, 562, 6, 60),
  new TrackPoint(43.8845, 18.4423, now - 150_000, 28.9, 578, 5, 58),
  new TrackPoint(43.8901, 18.4489, now - 120_000, 31.2, 591, 4, 62),
  new TrackPoint(43.8967, 18.4556, now - 90_000, 27.4, 603, 6, 65),
  new TrackPoint(43.9023, 18.4612, now - 60_000, 24.8, 618, 5, 63),
  new TrackPoint(43.9089, 18.4678, now - 30_000, 20.1, 625, 7, 68),
];

export const mockTrackEntries: TrackEntry[] = [
  ...mockTrackPoints.slice(0, 5),
  { gap: true, ts: now - 145_000 },
  ...mockTrackPoints.slice(5),
];

// ─── Mock snapshot ────────────────────────────────────────────────────────────

export const mockRideSnapshot: RideSnapshot = {
  startedAt: now - 300_000,
  points: mockTrackPoints,
  pausedDurationMs: 0,
};

// ─── Mock hook return values ──────────────────────────────────────────────────

export const mockRecorderIdle: UseRideRecorderReturn = {
  status: 'idle',
  points: [],
  distanceKm: 0,
  durationSec: 0,
  currentSpeedKmh: 0,
  maxSpeedKmh: 0,
  climbM: 0,
  gpsQuality: 'lost',
  reconnectCount: 0,
  start: async () => {},
  pause: () => {},
  resume: () => {},
  stop: () => {},
  restore: () => false,
};

export const mockRecorderRecording: UseRideRecorderReturn = {
  status: 'recording',
  points: mockTrackEntries,
  distanceKm: 6.23,
  durationSec: 300,
  currentSpeedKmh: 72.4,
  maxSpeedKmh: 112.3,
  climbM: 105,
  gpsQuality: 'excellent',
  reconnectCount: 1,
  start: async () => {},
  pause: () => {},
  resume: () => {},
  stop: () => {},
  restore: () => false,
};

export const mockRecorderPaused: UseRideRecorderReturn = {
  ...mockRecorderRecording,
  status: 'paused',
  currentSpeedKmh: 0,
  gpsQuality: 'good',
};

export const mockRecorderStopped: UseRideRecorderReturn = {
  ...mockRecorderRecording,
  status: 'stopped',
  currentSpeedKmh: 0,
  gpsQuality: 'lost',
};
