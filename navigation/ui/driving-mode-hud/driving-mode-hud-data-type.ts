import type { NavInstruction } from '@markec/navigation.entities.nav-instruction';

export type { NavInstruction };

export type DrivingModeHudData = {
  /**
   * Current speed in km/h.
   */
  speed: number;

  /**
   * Compass heading in degrees (0–359).
   */
  heading: number;

  /**
   * Current street name.
   */
  streetName: string;

  /**
   * Estimated time of arrival as a formatted string (e.g. "14:32").
   */
  eta: string;

  /**
   * Estimated remaining distance to destination in km.
   */
  distanceToDestinationKm: number;

  /**
   * Current fuel level in liters.
   */
  currentFuelLiters: number;

  /**
   * Total tank capacity in liters.
   */
  tankCapacityLiters: number;

  /**
   * Estimated fuel range in km.
   */
  fuelRangeKm: number;

  /**
   * GPS accuracy in meters. Null when no fix.
   */
  gpsAccuracyMeters: number | null;

  /**
   * The next navigation instruction.
   */
  nextInstruction: NavInstruction | null;
};
