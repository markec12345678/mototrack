import {
  MototrackPlatformAspect,
  type MototrackPlatformBrowser,
} from '@markec/mototrack-platform.mototrack-platform';
import { ExplorePage } from '@markec/balkan-roads.pages.explore-page';
import { TourDetail } from '@markec/balkan-roads.pages.tour-detail';
import { TourDashboardPanel } from '@markec/balkan-roads.ui.tour-dashboard-panel';
import type { BalkanRoadsConfig } from './balkan-roads-config.js';

export class BalkanRoadsBrowser {
  constructor(private config: BalkanRoadsConfig) {}

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig: BalkanRoadsConfig = {};

  static async provider(
    [mototrackPlatform]: [MototrackPlatformBrowser],
    config: BalkanRoadsConfig
  ) {
    const balkanRoads = new BalkanRoadsBrowser(config);

    /**
     * register the /explore and /tours/:id routes.
     */
    mototrackPlatform.registerRoute([
      {
        path: '/explore',
        component: () => <ExplorePage />,
      },
      {
        path: '/tours/:id',
        component: () => <TourDetail />,
      },
    ]);

    /**
     * register the 'Raziskuj' navigation item.
     */
    mototrackPlatform.registerNavigationItem([
      {
        key: 'explore',
        label: 'Raziskuj',
        icon: '🧭',
        path: '/explore',
        order: 4,
        primary: true,
      },
    ]);

    /**
     * register the tour dashboard panel into the DashboardPanel slot.
     */
    mototrackPlatform.registerDashboardPanel([
      {
        key: 'balkan-roads-tours',
        title: 'Predlagane ture',
        component: () => <TourDashboardPanel />,
        span: 3,
      },
    ]);

    return balkanRoads;
  }
}

export default BalkanRoadsBrowser;
