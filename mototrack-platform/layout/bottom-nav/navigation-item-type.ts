export type NavigationItem = {
  /**
   * Unique key for the navigation item.
   */
  key: string;

  /**
   * Display label shown below the icon.
   */
  label: string;

  /**
   * Icon name or SVG string used to render the tab icon.
   */
  icon: string;

  /**
   * Route path the tab navigates to.
   */
  path: string;

  /**
   * Render order (lower = leftmost).
   */
  order?: number;

  /**
   * Whether this item is a primary navigation item.
   * Only primary items are rendered in the bottom nav.
   */
  primary?: boolean;
};
