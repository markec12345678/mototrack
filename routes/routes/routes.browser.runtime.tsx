import React from 'react';
import {
  MototrackPlatformAspect,
  type MototrackPlatformBrowser,
} from '@markec/mototrack-platform.mototrack-platform';
import { PlanPage } from '@markec/routes.pages.plan-page';
import { Library } from '@markec/routes.pages.library';
import type { RoutesConfig } from './routes-config.js';
import type { RouteAction, RouteActionSlot } from './route-action.js';

export class RoutesBrowser {
  constructor(
    private config: RoutesConfig,
    private routeActionSlot: RouteActionSlot
  ) {}

  /**
   * register an action to be rendered on every route card.
   */
  registerRouteAction(actions: RouteAction[]) {
    this.routeActionSlot.register(actions);
    return this;
  }

  /**
   * list all route actions registered into the slot.
   */
  listRouteActions(): RouteAction[] {
    return this.routeActionSlot.flatValues();
  }

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig: RoutesConfig = {};

  static async provider(
    [mototrackPlatform]: [MototrackPlatformBrowser],
    config: RoutesConfig,
    [routeActionSlot]: [RouteActionSlot]
  ) {
    const routes = new RoutesBrowser(config, routeActionSlot);

    mototrackPlatform.registerRoute([
      {
        path: '/plan',
        component: () => <PlanPage />,
        requiresAuth: true,
      },
      {
        path: '/routes',
        component: () => {
          const extraActions = routes.listRouteActions();
          return <Library extraActions={extraActions} />;
        },
        requiresAuth: true,
      },
    ]);

    mototrackPlatform.registerNavigationItem([
      {
        key: 'plan',
        label: 'Načrtuj',
        icon: '🛤️',
        path: '/plan',
        order: 2,
        primary: true,
      },
      {
        key: 'library',
        label: 'Knjižnica',
        icon: '📂',
        path: '/routes',
        order: 12,
        primary: false,
      },
    ]);

    return routes;
  }
}

export default RoutesBrowser;
