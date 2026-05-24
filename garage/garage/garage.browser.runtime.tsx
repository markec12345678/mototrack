import React from 'react';
import {
  MototrackPlatformAspect,
  type MototrackPlatformBrowser,
} from '@markec/mototrack-platform.mototrack-platform';
import { GaragePage } from '@markec/garage.pages.garage-page';
import { FuelRangeIndicator } from '@markec/garage.ui.fuel-range-indicator';
import { GarageDashboardPanel } from '@markec/garage.ui.garage-dashboard-panel';
import type { GarageConfig } from './garage-config.js';

export class GarageBrowser {
  constructor(private config: GarageConfig) {}

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig: GarageConfig = {};

  static async provider(
    [mototrackPlatform]: [MototrackPlatformBrowser],
    config: GarageConfig
  ) {
    const garage = new GarageBrowser(config);

    /**
     * register the /garage route — authenticated.
     */
    mototrackPlatform.registerRoute([
      {
        path: '/garage',
        component: () => <GaragePage />,
        requiresAuth: true,
      },
    ]);

    /**
     * register the 'Garaža' navigation item — secondary, order 14.
     */
    mototrackPlatform.registerNavigationItem([
      {
        key: 'garage',
        label: 'Garaža',
        icon: '🏍️',
        path: '/garage',
        order: 14,
        primary: false,
      },
    ]);

    /**
     * register the fuel-range overlay onto the live-ride map.
     */
    mototrackPlatform.registerMapOverlay([
      {
        key: 'fuel-range',
        component: () => <FuelRangeIndicator />,
      },
    ]);

    /**
     * register the garage maintenance panel in the dashboard.
     */
    mototrackPlatform.registerDashboardPanel([
      {
        key: 'garage-dashboard-panel',
        title: 'Vzdrževanje',
        component: () => <GarageDashboardPanel maintenanceHref="/garage" />,
        span: 1,
      },
    ]);

    return garage;
  }
}

export default GarageBrowser;
