import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type DashboardPanel = {
  /**
   * unique key for this dashboard panel.
   */
  key: string;

  /**
   * panel title displayed in the card header.
   */
  title: string;

  /**
   * component rendered inside the panel.
   */
  component: ComponentType;

  /**
   * number of grid columns the panel spans (1-3).
   */
  span?: 1 | 2 | 3;
};

export type DashboardPanelSlot = SlotRegistry<DashboardPanel[]>;
