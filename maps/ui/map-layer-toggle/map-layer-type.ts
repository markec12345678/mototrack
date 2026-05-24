import type React from 'react';

export type MapLayer = {
  /**
   * Unique key identifying the layer (used for localStorage persistence).
   */
  key: string;

  /**
   * Display label shown next to the toggle.
   */
  label: string;

  /**
   * Icon rendered to the left of the label.
   */
  icon?: React.ReactNode;

  /**
   * Whether the layer is enabled by default.
   */
  defaultEnabled?: boolean;
};
