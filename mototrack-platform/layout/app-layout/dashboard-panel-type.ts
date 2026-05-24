import React from 'react';

export type DashboardPanel = {
  /**
   * Unique key for the dashboard panel.
   */
  key: string;

  /**
   * Display title for the panel.
   */
  title: string;

  /**
   * Component to render inside the panel.
   */
  component: React.ComponentType;

  /**
   * Column span for the panel grid (1–3).
   */
  span?: 1 | 2 | 3;
};
