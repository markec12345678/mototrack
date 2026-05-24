import { NavInstruction } from '@markec/navigation.entities.nav-instruction';
import type { DrivingModeHudData } from './driving-mode-hud-data-type.js';

export const mockHudDataHighway: DrivingModeHudData = {
  speed: 112,
  heading: 47,
  streetName: `Avtocesta A1`,
  eta: `14:32`,
  distanceToDestinationKm: 38.4,
  currentFuelLiters: 14.2,
  tankCapacityLiters: 18,
  fuelRangeKm: 218,
  gpsAccuracyMeters: 7,
  nextInstruction: NavInstruction.from({
    id: `instr-1`,
    text: `Zavijte desno`,
    distanceM: 1200,
    modifier: `turn-right`,
    announceAt: 300,
  }),
};

export const mockHudDataCity: DrivingModeHudData = {
  speed: 48,
  heading: 182,
  streetName: `Dunajska cesta`,
  eta: `09:15`,
  distanceToDestinationKm: 4.7,
  currentFuelLiters: 5.8,
  tankCapacityLiters: 18,
  fuelRangeKm: 89,
  gpsAccuracyMeters: 18,
  nextInstruction: NavInstruction.from({
    id: `instr-2`,
    text: `Zavijte levo`,
    distanceM: 320,
    modifier: `turn-left`,
    announceAt: 300,
  }),
};

export const mockHudDataLowFuel: DrivingModeHudData = {
  speed: 87,
  heading: 270,
  streetName: `Gorenjska cesta`,
  eta: `16:55`,
  distanceToDestinationKm: 12.1,
  currentFuelLiters: 2.1,
  tankCapacityLiters: 18,
  fuelRangeKm: 32,
  gpsAccuracyMeters: null,
  nextInstruction: NavInstruction.from({
    id: `instr-3`,
    text: `Nadaljujte naravnost`,
    distanceM: 850,
    modifier: `continue`,
    announceAt: 300,
  }),
};
