import { PlannedRoute } from '@markec/routes.entities.planned-route';

export type RouteAction = {
  key: string;
  label: string;
  icon: string;
  handler: (route: PlannedRoute) => void;
};
