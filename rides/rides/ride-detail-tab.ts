import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type RideDetailTabProps = {
  /**
   * id of the ride being viewed.
   */
  rideId: string;
};

export type RideDetailTab = {
  /**
   * unique key for the tab.
   */
  key: string;

  /**
   * tab label shown to the user.
   */
  label: string;

  /**
   * optional icon (emoji or short string) for the tab.
   */
  icon?: string;

  /**
   * the tab content component. Receives the active rideId.
   */
  component: ComponentType<RideDetailTabProps>;

  /**
   * order in which the tab is displayed.
   */
  order?: number;
};

export type RideDetailTabSlot = SlotRegistry<RideDetailTab[]>;
