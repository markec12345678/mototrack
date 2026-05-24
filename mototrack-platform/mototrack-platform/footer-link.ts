import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type FooterLink = {
  /**
   * display label for the footer link.
   */
  label: string;

  /**
   * URL for the footer link.
   */
  href: string;

  /**
   * optional category to group footer links.
   */
  category?: string;
};

export type FooterLinkSlot = SlotRegistry<FooterLink[]>;