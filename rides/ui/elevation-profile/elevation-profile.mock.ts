import type { ElevationPoint } from './elevation-profile.js';

/**
 * A flat valley-to-peak-to-valley mountain pass profile.
 */
export const mockMountainPassPoints: ElevationPoint[] = [
  { elevation: 280, distanceKm: 0 },
  { elevation: 310, distanceKm: 1.5 },
  { elevation: 380, distanceKm: 3.0 },
  { elevation: 460, distanceKm: 4.8 },
  { elevation: 540, distanceKm: 6.2 },
  { elevation: 620, distanceKm: 7.5 },
  { elevation: 710, distanceKm: 9.0 },
  { elevation: 780, distanceKm: 10.5 },
  { elevation: 820, distanceKm: 12.0 },
  { elevation: 795, distanceKm: 13.2 },
  { elevation: 730, distanceKm: 14.5 },
  { elevation: 650, distanceKm: 15.8 },
  { elevation: 560, distanceKm: 17.0 },
  { elevation: 470, distanceKm: 18.3 },
  { elevation: 390, distanceKm: 19.5 },
  { elevation: 310, distanceKm: 20.8 },
  { elevation: 280, distanceKm: 22.0 },
];

/**
 * A rolling hills profile with multiple crests.
 */
export const mockRollingHillsPoints: ElevationPoint[] = [
  { elevation: 150, distanceKm: 0 },
  { elevation: 185, distanceKm: 1.0 },
  { elevation: 210, distanceKm: 2.0 },
  { elevation: 190, distanceKm: 3.0 },
  { elevation: 165, distanceKm: 4.0 },
  { elevation: 200, distanceKm: 5.2 },
  { elevation: 235, distanceKm: 6.5 },
  { elevation: 215, distanceKm: 7.5 },
  { elevation: 180, distanceKm: 8.5 },
  { elevation: 195, distanceKm: 9.5 },
  { elevation: 225, distanceKm: 10.8 },
  { elevation: 205, distanceKm: 11.8 },
  { elevation: 170, distanceKm: 12.8 },
  { elevation: 155, distanceKm: 14.0 },
];

/**
 * A short, flat coastal route with minimal elevation change.
 */
export const mockFlatCoastalPoints: ElevationPoint[] = [
  { elevation: 12, distanceKm: 0 },
  { elevation: 18, distanceKm: 1.0 },
  { elevation: 22, distanceKm: 2.5 },
  { elevation: 15, distanceKm: 4.0 },
  { elevation: 10, distanceKm: 5.5 },
  { elevation: 8, distanceKm: 7.0 },
  { elevation: 14, distanceKm: 8.5 },
  { elevation: 20, distanceKm: 10.0 },
];

export const mockClimbM = 540;
export const mockDescentM = 540;
export const mockRollingClimbM = 285;
export const mockRollingDescentM = 280;
export const mockFlatClimbM = 14;
export const mockFlatDescentM = 14;
