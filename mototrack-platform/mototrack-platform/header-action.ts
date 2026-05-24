import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type HeaderAction = {
  /**
   * unique key for this header action.
   */
  key: string;

  /**
   * display label.
   */
  label: string;

  /**
   * icon glyph (emoji or short string).
   */
  icon: string;

  /**
   * optional click handler — used when no component is provided.
   */
  onClick?: () => void;

  /**
   * optional custom component to render in place of the default button.
   */
  component?: ComponentType;

  /**
   * sorting order — lower numbers appear first.
   */
  order?: number;
};

export type HeaderActionSlot = SlotRegistry<HeaderAction[]>;
