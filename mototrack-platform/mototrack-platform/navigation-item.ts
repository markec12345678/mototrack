import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type NavigationItem = {
  /**
   * unique key for this navigation item.
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
   * route path the item links to.
   */
  path: string;

  /**
   * sorting order — lower numbers appear first.
   */
  order?: number;

  /**
   * when true, the item shows in the mobile bottom-nav primary tabs.
   */
  primary?: boolean;
};

export type NavigationItemSlot = SlotRegistry<NavigationItem[]>;
