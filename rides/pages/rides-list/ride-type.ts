export type Ride = {
  id: string;
  userId: string;
  startedAt: number;
  endedAt: number;
  distanceKm: number;
  durationSec: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  climbM: number;
  descentM: number;
  twistinessScore: number;
  name?: string;
  notes?: string;
};
