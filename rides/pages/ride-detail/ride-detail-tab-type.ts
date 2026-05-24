import type { ComponentType } from 'react';

export type RideDetailTab = {
  /**
   * Unique key for the tab.
   */
  key: string;

  /**
   * Display label for the tab.
   */
  label: string;

  /**
   * Icon rendered inside the tab pill.
   */
  icon?: string;

  /**
   * The component to render when this tab is active.
   */
  component: ComponentType<{ rideId: string }>;

  /**
   * Optional sort order (lower = first).
   */
  order?: number;
};
