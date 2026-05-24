import type { ComponentType } from 'react';

export type SafetyAlert = {
  /**
   * Unique key for the slot widget.
   */
  key: string;

  /**
   * The React component to render as a floating safety alert widget.
   */
  component: ComponentType;

  /**
   * Optional render order (lower = higher priority).
   */
  order?: number;
};
