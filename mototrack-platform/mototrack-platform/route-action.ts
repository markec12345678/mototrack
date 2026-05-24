import type { SlotRegistry } from '@bitdev/harmony.harmony';

export type PlannedRoute = {
  /**
   * route identifier.
   */
  id: string;

  /**
   * route display name.
   */
  name: string;

  /**
   * waypoint coordinates [lng, lat].
   */
  waypoints: Array<[number, number]>;

  /**
   * route distance in kilometers.
   */
  distanceKm?: number;
};

export type RouteAction = {
  /**
   * unique key for this route action.
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
   * handler invoked with the active planned route.
   */
  handler: (route: PlannedRoute) => void;
};

export type RouteActionSlot = SlotRegistry<RouteAction[]>;
