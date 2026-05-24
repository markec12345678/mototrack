import { type RideStatsPanelProps } from './ride-stats-panel.js';

export const mockActiveRideStats: RideStatsPanelProps = {
  currentSpeedKmh: 87,
  distanceKm: 24.3,
  durationSec: 3720,
  maxSpeedKmh: 134,
  climbM: 412,
  elevationM: 876,
  gpsAccuracyMeters: 7,
  isRecording: true,
  warningThreshold: 120,
};

export const mockPausedRideStats: RideStatsPanelProps = {
  currentSpeedKmh: 0,
  distanceKm: 12.8,
  durationSec: 1845,
  maxSpeedKmh: 98,
  climbM: 210,
  elevationM: 540,
  gpsAccuracyMeters: 18,
  isRecording: false,
  warningThreshold: 120,
};

export const mockHighSpeedStats: RideStatsPanelProps = {
  currentSpeedKmh: 158,
  distanceKm: 67.4,
  durationSec: 7260,
  maxSpeedKmh: 172,
  climbM: 890,
  elevationM: 1240,
  gpsAccuracyMeters: 5,
  isRecording: true,
  warningThreshold: 120,
};

export const mockNoGpsStats: RideStatsPanelProps = {
  currentSpeedKmh: 0,
  distanceKm: 0,
  durationSec: 0,
  maxSpeedKmh: 0,
  climbM: 0,
  elevationM: 0,
  gpsAccuracyMeters: null,
  isRecording: false,
  warningThreshold: 120,
};
