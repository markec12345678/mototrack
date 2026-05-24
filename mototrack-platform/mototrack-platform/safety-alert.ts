import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type SafetyAlert = {
  /**
   * unique key for this safety alert.
   */
  key: string;

  /**
   * alert component rendered as a floating notification.
   */
  component: ComponentType;
};

export type SafetyAlertSlot = SlotRegistry<SafetyAlert[]>;
