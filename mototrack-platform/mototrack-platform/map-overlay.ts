import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type MapOverlayPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type MapOverlay = {
  /**
   * unique key for this overlay.
   */
  key: string;

  /**
   * overlay component rendered above the map.
   */
  component: ComponentType;

  /**
   * absolute position on the map canvas.
   */
  position?: MapOverlayPosition;
};

export type MapOverlaySlot = SlotRegistry<MapOverlay[]>;
