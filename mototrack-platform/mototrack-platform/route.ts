import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type Route = {
  /**
   * route path, e.g. '/dashboard'.
   */
  path: string;

  /**
   * component to render at this path.
   */
  component: ComponentType;

  /**
   * when true, wraps the route with ProtectedRoute.
   */
  requiresAuth?: boolean;
};

export type RouteSlot = SlotRegistry<Route[]>;
