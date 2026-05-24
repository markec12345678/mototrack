import { Ride } from '@markec/rides.entities.ride';

/**
 * A realistic mock track with a short mountain route.
 */
const mockTrack = [
  { lat: 46.0569, lng: 14.5058, ts: 1700000000000, speed: 20.5, elevation: 320, accuracy: 5, heading: 45 },
  { lat: 46.0589, lng: 14.5078, ts: 1700000060000, speed: 28.3, elevation: 335, accuracy: 4, heading: 48 },
  { lat: 46.0612, lng: 14.5102, ts: 1700000120000, speed: 35.1, elevation: 358, accuracy: 4, heading: 52 },
  { lat: 46.0638, lng: 14.5131, ts: 1700000180000, speed: 42.7, elevation: 380, accuracy: 3, heading: 55 },
  { lat: 46.0665, lng: 14.5163, ts: 1700000240000, speed: 50.2, elevation: 410, accuracy: 3, heading: 58 },
  { lat: 46.0692, lng: 14.5198, ts: 1700000300000, speed: 55.8, elevation: 445, accuracy: 3, heading: 62 },
  { lat: 46.0718, lng: 14.5235, ts: 1700000360000, speed: 48.4, elevation: 470, accuracy: 4, heading: 65 },
  { lat: 46.0741, lng: 14.5268, ts: 1700000420000, speed: 38.9, elevation: 490, accuracy: 4, heading: 68 },
];

const mockTrackShort = [
  { lat: 46.1234, lng: 14.6789, ts: 1700100000000, speed: 15.0, elevation: 280, accuracy: 6, heading: 90 },
  { lat: 46.1254, lng: 14.6820, ts: 1700100060000, speed: 22.5, elevation: 290, accuracy: 5, heading: 92 },
  { lat: 46.1278, lng: 14.6855, ts: 1700100120000, speed: 30.0, elevation: 305, accuracy: 5, heading: 95 },
  { lat: 46.1301, lng: 14.6891, ts: 1700100180000, speed: 25.5, elevation: 295, accuracy: 5, heading: 98 },
];

const mockTrackCity = [
  { lat: 46.0511, lng: 14.5051, ts: 1700200000000, speed: 8.3, elevation: 298, accuracy: 8, heading: 180 },
  { lat: 46.0498, lng: 14.5048, ts: 1700200060000, speed: 10.5, elevation: 296, accuracy: 7, heading: 182 },
  { lat: 46.0482, lng: 14.5042, ts: 1700200120000, speed: 12.2, elevation: 294, accuracy: 7, heading: 185 },
  { lat: 46.0465, lng: 14.5035, ts: 1700200180000, speed: 9.8, elevation: 292, accuracy: 8, heading: 188 },
];

/**
 * Mock Ride entities for use in compositions and tests.
 */
export const mockRides: Ride[] = [
  Ride.from({
    id: 'ride-001',
    userId: 'user-001',
    startedAt: 1700000000000,
    endedAt: 1700000420000,
    distanceKm: 8.4,
    durationSec: 420,
    maxSpeedKmh: 200.88,
    avgSpeedKmh: 72.0,
    climbM: 170,
    descentM: 0,
    twistinessScore: 7.2,
    name: 'Morning Alpine Run',
    notes: 'Perfect conditions, light traffic on the pass.',
    track: mockTrack,
  }),
  Ride.from({
    id: 'ride-002',
    userId: 'user-001',
    startedAt: 1700100000000,
    endedAt: 1700100180000,
    distanceKm: 3.1,
    durationSec: 180,
    maxSpeedKmh: 108.0,
    avgSpeedKmh: 62.0,
    climbM: 25,
    descentM: 15,
    twistinessScore: 4.5,
    name: 'Quick Country Loop',
    notes: 'Short evening ride through the valley.',
    track: mockTrackShort,
  }),
  Ride.from({
    id: 'ride-003',
    userId: 'user-001',
    startedAt: 1700200000000,
    endedAt: 1700200180000,
    distanceKm: 1.8,
    durationSec: 180,
    maxSpeedKmh: 43.92,
    avgSpeedKmh: 36.0,
    climbM: 6,
    descentM: 12,
    twistinessScore: 2.1,
    name: 'City Commute',
    notes: 'Daily commute through Ljubljana centre.',
    track: mockTrackCity,
  }),
];

/**
 * A single mock ride for isolated testing.
 */
export const mockRide = mockRides[0];
