import type React from 'react';

export type DropdownItem = {
  /**
   * Unique key for the item.
   */
  key: string;

  /**
   * Label text displayed in the menu.
   */
  label: string;

  /**
   * Optional icon rendered before the label.
   */
  icon?: React.ReactNode;

  /**
   * Whether the item is disabled.
   */
  disabled?: boolean;

  /**
   * Whether the item is a visual divider (renders a separator line).
   */
  divider?: boolean;

  /**
   * Variant for visual emphasis.
   */
  variant?: 'default' | 'danger' | 'success';

  /**
   * Callback when the item is clicked.
   */
  onClick?: () => void;

  /**
   * Optional href — renders the item as an anchor tag.
   */
  href?: string;
};
