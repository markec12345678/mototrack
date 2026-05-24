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
   * Icon string (emoji or SVG string) for the navigation item.
   */
  icon: string;

  /**
   * Route path the item navigates to.
   */
  path: string;

  /**
   * Render order — lower numbers appear first.
   */
  order?: number;

  /**
   * Whether this is a primary (top-level) navigation item.
   */
  primary?: boolean;
};
