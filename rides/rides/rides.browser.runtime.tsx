import {
  MototrackPlatformAspect,
  type MototrackPlatformBrowser,
} from '@markec/mototrack-platform.mototrack-platform';
import { TrackPage } from '@markec/rides.pages.track-page';
import { RidesList } from '@markec/rides.pages.rides-list';
import { RideDetail } from '@markec/rides.pages.ride-detail';
import { RideDashboardPanel } from '@markec/rides.ui.ride-dashboard-panel';
import { RidesAspect } from './rides.aspect.js';
import type {
  RideDetailTab,
  RideDetailTabSlot,
} from './ride-detail-tab.js';

export class RidesBrowser {
  constructor(private rideDetailTabSlot: RideDetailTabSlot) {}

  /**
   * register one or more tabs into the ride detail page.
   */
  registerRideDetailTab(tabs: RideDetailTab[]) {
    this.rideDetailTabSlot.register(tabs);
    return this;
  }

  /**
   * list all ride detail tabs sorted by order.
   */
  listRideDetailTabs(): RideDetailTab[] {
    return [...this.rideDetailTabSlot.flatValues()].sort(
      (a, b) => (a.order ?? 99) - (b.order ?? 99)
    );
  }

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig = {};

  static async provider(
    [mototrackPlatform]: [MototrackPlatformBrowser],
    _config: Record<string, never>,
    [rideDetailTabSlot]: [RideDetailTabSlot]
  ) {
    const rides = new RidesBrowser(rideDetailTabSlot);

    /**
     * register the rides feature routes.
     */
    mototrackPlatform.registerRoute([
      {
        path: '/track',
        component: () => <TrackPage />,
        requiresAuth: true,
      },
      {
        path: '/rides',
        component: () => <RidesList />,
        requiresAuth: true,
      },
      {
        path: '/rides/:id',
        component: () => {
          const tabs = rides.listRideDetailTabs();
          return <RideDetail tabs={tabs} />;
        },
        requiresAuth: true,
      },
    ]);

    /**
     * register navigation items into the platform.
     */
    mototrackPlatform.registerNavigationItem([
      {
        key: 'track',
        label: 'Sledi',
        icon: '▶️',
        path: '/track',
        order: 3,
        primary: true,
      },
      {
        key: 'rides',
        label: 'Vožnje',
        icon: '🛣️',
        path: '/rides',
        order: 11,
      },
    ]);

    /**
     * register the recent rides panel into the dashboard.
     */
    mototrackPlatform.registerDashboardPanel([
      {
        key: 'ride-dashboard-panel',
        component: () => <RideDashboardPanel />,
        order: 10,
        span: 2,
      },
    ]);

    return rides;
  }
}

export default RidesBrowser;
