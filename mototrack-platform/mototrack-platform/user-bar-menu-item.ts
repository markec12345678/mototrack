import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type UserBarMenuItem = {
  /**
   * display label for the menu item.
   */
  label: string;

  /**
   * action to perform on click.
   */
  onClick?: () => void;

  /**
   * optional icon component.
   */
  icon?: ComponentType;

  /**
   * optional link href.
   */
  href?: string;
};

export type UserBarMenuItemSlot = SlotRegistry<UserBarMenuItem[]>;