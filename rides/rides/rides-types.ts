import type { Ride } from '@markec/rides.entities.ride';
import type { TrackPoint } from '@markec/rides.entities.track-point';

export type TrackPointInput = {
  lat: number;
  lng: number;
  ts: number;
  speed?: number;
  elevation?: number;
  accuracy?: number;
  heading?: number;
};

export type CreateRideInput = {
  name?: string;
  notes?: string;
  startedAt: number;
  endedAt: number;
  track: TrackPointInput[];
};

export type ListRidesOptions = {
  limit?: number;
  offset?: number;
  from?: number;
  to?: number;
};

export type RideStats = {
  totalKm: number;
  totalRides: number;
  totalDurationSec: number;
  totalClimbM: number;
  maxSpeedKmh: number;
  longestRideKm: number;
  avgKmPerWeek: number;
  streakDays: number;
};

/**
 * Represents a user in the system, typically provided by the MototrackPlatform.
 * Assumed to have an 'id', 'username', and 'roles' property for authentication/authorization.
 */
export type User = {
  id: string;
  username: string;
  roles: string[];
  // Add other properties that might be on the User object from MototrackPlatform
};