import { type ComponentType } from 'react';

export type HeaderAction = {
  /**
   * Unique key for the action slot item.
   */
  key: string;

  /**
   * Accessible label for the action.
   */
  label: string;

  /**
   * Icon string (emoji or icon identifier).
   */
  icon: string;

  /**
   * Optional click handler.
   */
  onClick?: () => void;

  /**
   * Optional component to render instead of a plain button.
   */
  component?: ComponentType;

  /**
   * Render order — lower numbers appear first.
   */
  order?: number;
};
