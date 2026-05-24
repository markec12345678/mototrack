import React from 'react';

export type HeaderAction = {
  /**
   * Unique key for the header action.
   */
  key: string;

  /**
   * Display label for the action.
   */
  label: string;

  /**
   * Icon string (emoji or icon key) for the action.
   */
  icon: string;

  /**
   * Click handler for the action.
   */
  onClick?: () => void;

  /**
   * Optional custom component to render instead of the default button.
   */
  component?: React.ComponentType;

  /**
   * Sort order for rendering.
   */
  order?: number;
};
