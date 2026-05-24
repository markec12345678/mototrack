import React from 'react';

export type TabItem = {
  /**
   * Unique key identifying the tab.
   */
  key: string;

  /**
   * Display label for the tab.
   */
  label: string;

  /**
   * Optional icon rendered before the label.
   */
  icon?: React.ReactNode;
};
