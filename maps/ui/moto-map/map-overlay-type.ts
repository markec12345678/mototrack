import type { ComponentType } from 'react';

export type MapOverlayPosition =
  | `top-left`
  | `top-right`
  | `bottom-left`
  | `bottom-right`
  | `top-center`
  | `bottom-center`;

export type MapOverlay = {
  /**
   * Unique key for the overlay slot entry.
   */
  key: string;

  /**
   * The React component to render as an overlay.
   */
  component: ComponentType;

  /**
   * Where to position the overlay on the map.
   */
  position?: MapOverlayPosition;
};
