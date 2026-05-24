import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type HeaderLink = {
  /**
   * display label for the header link.
   */
  label: string;

  /**
   * URL for the header link.
   */
  href: string;
};

export type HeaderLinkSlot = SlotRegistry<HeaderLink[]>;