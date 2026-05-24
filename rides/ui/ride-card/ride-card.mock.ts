import { type RideCardRide } from './ride-card.js';

export const mockRide: RideCardRide = {
  id: `ride-001`,
  name: `Alpine Pass Morning Run`,
  startedAt: new Date(`2025-06-14T07:30:00Z`).getTime(),
  distanceKm: 142.7,
  durationSec: 6480,
  maxSpeedKmh: 187,
  twistinessScore: 7.4,
};

export const mockRideExtreme: RideCardRide = {
  id: `ride-002`,
  name: `Stelvio Pass Assault`,
  startedAt: new Date(`2025-06-10T06:00:00Z`).getTime(),
  distanceKm: 98.3,
  durationSec: 5220,
  maxSpeedKmh: 212,
  twistinessScore: 9.2,
};

export const mockRideMild: RideCardRide = {
  id: `ride-003`,
  name: `Coastal Highway Cruise`,
  startedAt: new Date(`2025-06-08T09:15:00Z`).getTime(),
  distanceKm: 215.4,
  durationSec: 9000,
  maxSpeedKmh: 145,
  twistinessScore: 2.1,
};

export const mockRideNoName: RideCardRide = {
  id: `ride-004`,
  startedAt: new Date(`2025-06-05T17:45:00Z`).getTime(),
  distanceKm: 67.8,
  durationSec: 3600,
  maxSpeedKmh: 163,
  twistinessScore: 5.5,
};

export const mockRides: RideCardRide[] = [
  mockRide,
  mockRideExtreme,
  mockRideMild,
  mockRideNoName,
];
