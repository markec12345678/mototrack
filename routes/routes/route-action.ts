import { SlotRegistry } from '@bitdev/harmony.harmony';
import type { PlannedRoute } from '@markec/routes.entities.planned-route';

export type RouteAction = {
  /**
   * unique key for the action.
   */
  key: string;

  /**
   * label shown in the route card.
   */
  label: string;

  /**
   * emoji or short text icon.
   */
  icon: string;

  /**
   * handler invoked against a planned route.
   */
  handler: (route: PlannedRoute) => void;
};

export type RouteActionSlot = SlotRegistry<RouteAction[]>;
