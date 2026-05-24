import { ComponentType } from 'react';

export type DashboardPanel = {
  /**
   * Unique key for the panel widget.
   */
  key: string;

  /**
   * Display title of the panel.
   */
  title: string;

  /**
   * The React component to render inside the panel.
   */
  component: ComponentType;

  /**
   * Column span in the responsive grid (1–3).
   * @default 1
   */
  span?: 1 | 2 | 3;
};
