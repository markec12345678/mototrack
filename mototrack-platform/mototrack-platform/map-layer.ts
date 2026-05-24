import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type MapLayer = {
  /**
   * unique key for this map layer.
   */
  key: string;

  /**
   * display label shown in layer toggles.
   */
  label: string;

  /**
   * icon glyph (emoji or short string).
   */
  icon: string;

  /**
   * component rendered inside the map.
   */
  component: ComponentType;

  /**
   * when true, the layer is enabled by default.
   */
  defaultOn?: boolean;
};

export type MapLayerSlot = SlotRegistry<MapLayer[]>;
