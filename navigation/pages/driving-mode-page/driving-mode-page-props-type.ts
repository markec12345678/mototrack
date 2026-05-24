import type React from 'react';
import type { FontScale } from '@markec/navigation.ui.driving-mode-hud';

/**
 * Props for the DrivingModePage component.
 */
export type DrivingModePageProps = {
  /**
   * Additional CSS class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;

  /**
   * Optional mock route used in compositions and tests.
   * When provided, bypasses the routeId URL param lookup.
   */
  mockRoute?: MockRoute | null;

  /**
   * Total tank capacity in liters. Defaults to 18.
   */
  tankCapacityLiters?: number;

  /**
   * Initial fuel level in liters at the start of the ride. Defaults to 14.
   */
  initialFuelLiters?: number;

  /**
   * Font scale multiplier for accessibility.
   * - `1x`: default
   * - `1.5x`: larger text
   * - `2x`: maximum accessibility size
   */
  fontScale?: FontScale;

  /**
   * Speed warning threshold in km/h. Defaults to 120.
   */
  warningThreshold?: number;

  /**
   * Whether voice guidance is enabled. Defaults to true.
   */
  voiceEnabled?: boolean;
};

/**
 * Minimal route shape consumed by the page.
 */
export type MockRoute = {
  id: string;
  name: string;
  distanceKm: number;
  durationSec: number;
  waypoints?: unknown[];
  geometry?: unknown;
};
