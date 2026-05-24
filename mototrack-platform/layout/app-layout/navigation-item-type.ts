export type NavigationItem = {
  /**
   * Unique key for the navigation item.
   */
  key: string;

  /**
   * Display label for the navigation item.
   */
  label: string;

  /**
   * Icon string (emoji or icon key) for the navigation item.
   */
  icon: string;

  /**
   * Route path for the navigation item.
   */
  path: string;

  /**
   * Sort order for rendering.
   */
  order?: number;

  /**
   * Whether this item is a primary navigation item (shown in bottom-nav on mobile).
   */
  primary?: boolean;
};
