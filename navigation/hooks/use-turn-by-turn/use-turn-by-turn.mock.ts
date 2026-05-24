import { LatLng } from '@markec/maps.entities.lat-lng';
import { TurnStep } from '@markec/routes.entities.turn-step';
import { PlannedRoute } from '@markec/routes.entities.planned-route';
import { DeviationState } from './use-turn-by-turn.js';

// ─── Mock Positions ───────────────────────────────────────────────────────────

/** Ljubljana city centre */
export const mockPositionLjubljana: LatLng = { lat: 46.0569, lng: 14.5058 };

/** Slightly off-route position (drift zone) */
export const mockPositionDrift: LatLng = { lat: 46.0572, lng: 14.5065 };

/** Clearly off-route position */
export const mockPositionOffRoute: LatLng = { lat: 46.0600, lng: 14.5120 };

/** Lost position — far from the route */
export const mockPositionLost: LatLng = { lat: 46.0700, lng: 14.5300 };

// ─── Mock Steps ───────────────────────────────────────────────────────────────

export const mockStep1: TurnStep = {
  instruction: 'Zavijte levo na Slovenska cesta',
  distanceM: 320,
  durationSec: 45,
  location: [14.5058, 46.0569],
  modifier: 'turn-left',
};

export const mockStep2: TurnStep = {
  instruction: 'Zavijte desno na Prešernova cesta',
  distanceM: 180,
  durationSec: 28,
  location: [14.5080, 46.0580],
  modifier: 'turn-right',
};

export const mockStep3: TurnStep = {
  instruction: 'Nadaljujte naravnost čez Tromostovje',
  distanceM: 500,
  durationSec: 72,
  location: [14.5095, 46.0510],
  modifier: 'continue',
};

export const mockStep4: TurnStep = {
  instruction: 'Naredite U-obrat pri Mestnem trgu',
  distanceM: 90,
  durationSec: 18,
  location: [14.5060, 46.0495],
  modifier: 'uturn',
};

export const mockSteps: TurnStep[] = [mockStep1, mockStep2, mockStep3, mockStep4];

// ─── Mock Geometry ────────────────────────────────────────────────────────────

export const mockGeometry: LatLng[] = [
  { lat: 46.0569, lng: 14.5058 },
  { lat: 46.0572, lng: 14.5065 },
  { lat: 46.0576, lng: 14.5072 },
  { lat: 46.0580, lng: 14.5080 },
  { lat: 46.0575, lng: 14.5085 },
  { lat: 46.0565, lng: 14.5090 },
  { lat: 46.0555, lng: 14.5092 },
  { lat: 46.0540, lng: 14.5093 },
  { lat: 46.0525, lng: 14.5090 },
  { lat: 46.0510, lng: 14.5095 },
  { lat: 46.0500, lng: 14.5075 },
  { lat: 46.0495, lng: 14.5060 },
];

// ─── Mock Route ───────────────────────────────────────────────────────────────

export const mockRoute: PlannedRoute = {
  id: 'mock-route-ljublana-loop',
  name: 'Ljubljana mestna zanka',
  waypoints: [
    { id: 'wp-1', name: 'Izhodišče', lat: 46.0569, lng: 14.5058 },
    { id: 'wp-2', name: 'Cilj', lat: 46.0495, lng: 14.5060 },
  ],
  mode: 'paved',
  geometry: mockGeometry,
  distanceKm: 1.09,
  durationSec: 163,
  steps: mockSteps,
  notes: 'Testna pot skozi center Ljubljane',
  createdAt: new Date('2024-06-01T10:00:00Z'),
};

// ─── Mock Deviation States ────────────────────────────────────────────────────

export const mockDeviationStates: Record<string, DeviationState> = {
  onRoute: 'on-route',
  drift: 'drift',
  offRoute: 'off-route',
  lost: 'lost',
};
