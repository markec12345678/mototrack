import type { MockRoute } from './driving-mode-page-props-type';

export const mockRouteHighway: MockRoute = {
  id: `route-highway-a1`,
  name: `Avtocesta A1 — Ljubljana → Maribor`,
  distanceKm: 128.4,
  durationSec: 4680,
};

export const mockRouteCity: MockRoute = {
  id: `route-city-lj`,
  name: `Ljubljana mestno jedro`,
  distanceKm: 14.2,
  durationSec: 1800,
};

export const mockRouteMountain: MockRoute = {
  id: `route-mountain-vrsic`,
  name: `Vršič Pass — Kranjska Gora`,
  distanceKm: 52.7,
  durationSec: 5400,
};
