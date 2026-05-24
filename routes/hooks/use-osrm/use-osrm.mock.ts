import { TurnStep } from '@markec/routes.entities.turn-step';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { OsrmRouteResult } from './use-osrm.js';

/**
 * Mock OSRM route result for a Ljubljana → Bled → Kranjska Gora trip.
 */
export const mockOsrmRoute: OsrmRouteResult = {
  geometry: [
    new LatLng(46.0511, 14.5051),
    new LatLng(46.0811, 14.3201),
    new LatLng(46.1591, 14.1061),
    new LatLng(46.2421, 13.9141),
  ],
  distanceKm: 87.4,
  durationSec: 5220,
  steps: [
    TurnStep.from({ id: 'mock-01', instruction: 'Začnite pot', distanceM: 0, durationSec: 0, location: { lat: 46.0511, lng: 14.5051 }, modifier: 'depart' }),
    TurnStep.from({ id: 'mock-02', instruction: 'Zavijte levo', distanceM: 3200, durationSec: 240, location: { lat: 46.0611, lng: 14.4801 }, modifier: 'turn-left' }),
    TurnStep.from({ id: 'mock-03', instruction: 'Nadaljujte naravnost', distanceM: 18500, durationSec: 1100, location: { lat: 46.0811, lng: 14.3201 }, modifier: 'straight' }),
    TurnStep.from({ id: 'mock-04', instruction: 'Vstopite v krožišče', distanceM: 500, durationSec: 40, location: { lat: 46.1201, lng: 14.2101 }, modifier: 'roundabout' }),
    TurnStep.from({ id: 'mock-05', instruction: 'Zavijte desno', distanceM: 22000, durationSec: 1320, location: { lat: 46.1591, lng: 14.1061 }, modifier: 'turn-right' }),
    TurnStep.from({ id: 'mock-06', instruction: 'Rahlo levo na razcepu', distanceM: 31000, durationSec: 1860, location: { lat: 46.2001, lng: 14.0101 }, modifier: 'turn-slight-left' }),
    TurnStep.from({ id: 'mock-07', instruction: 'Prispeli ste na cilj', distanceM: 0, durationSec: 0, location: { lat: 46.2421, lng: 13.9141 }, modifier: 'arrive' }),
  ],
};

/**
 * Mock for a short two-point route (Maribor → Ptuj).
 */
export const mockShortRoute: OsrmRouteResult = {
  geometry: [
    new LatLng(46.5547, 15.6459),
    new LatLng(46.4201, 15.8701),
  ],
  distanceKm: 24.1,
  durationSec: 1440,
  steps: [
    TurnStep.from({ id: 'mock-s1', instruction: 'Začnite pot', distanceM: 0, durationSec: 0, location: { lat: 46.5547, lng: 15.6459 }, modifier: 'depart' }),
    TurnStep.from({ id: 'mock-s2', instruction: 'Zavijte desno', distanceM: 12000, durationSec: 720, location: { lat: 46.4901, lng: 15.7601 }, modifier: 'turn-right' }),
    TurnStep.from({ id: 'mock-s3', instruction: 'Prispeli ste na cilj', distanceM: 0, durationSec: 0, location: { lat: 46.4201, lng: 15.8701 }, modifier: 'arrive' }),
  ],
};
