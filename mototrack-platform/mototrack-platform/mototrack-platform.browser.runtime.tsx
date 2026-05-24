import React from 'react';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformBrowser,
} from '@bitdev/symphony.symphony-platform';
import { MototrackTheme } from '@markec/mototrack-design.mototrack-theme';
import { AppLayout } from '@markec/mototrack-platform.layout.app-layout';
import { Home } from '@markec/mototrack-platform.pages.home';
import { Dashboard } from '@markec/mototrack-platform.pages.dashboard';
import { Login } from '@markec/mototrack-platform.pages.login';
import { Signup } from '@markec/mototrack-platform.pages.signup';
import { NotFound } from '@markec/mototrack-platform.pages.not-found';
import { ProtectedRoute } from '@markec/mototrack-platform.ui.protected-route';
import { SosAction } from '@markec/mototrack-platform.composites.sos-action';
import type { Route, RouteSlot } from './route.js';
import type { NavigationItem, NavigationItemSlot } from './navigation-item.js';
import type { DashboardPanel, DashboardPanelSlot } from './dashboard-panel.js';
import type { HeaderAction, HeaderActionSlot } from './header-action.js';
import type { MapLayer, MapLayerSlot } from './map-layer.js';
import type { MapOverlay, MapOverlaySlot } from './map-overlay.js';
import type { RouteAction, RouteActionSlot } from './route-action.js';
import type { SafetyAlert, SafetyAlertSlot } from './safety-alert.js';

export class MototrackPlatformBrowser {
  constructor(
    private symphonyPlatform: SymphonyPlatformBrowser,
    private routeSlot: RouteSlot,
    private navigationItemSlot: NavigationItemSlot,
    private dashboardPanelSlot: DashboardPanelSlot,
    private headerActionSlot: HeaderActionSlot,
    private mapLayerSlot: MapLayerSlot,
    private mapOverlaySlot: MapOverlaySlot,
    private routeActionSlot: RouteActionSlot,
    private safetyAlertSlot: SafetyAlertSlot
  ) {}

  /**
   * register one or more application routes.
   */
  registerRoute(routes: Route[]) {
    this.routeSlot.register(routes);
    const symphonyRoutes = routes.map((route) => ({
      path: route.path,
      component: route.requiresAuth
        ? () => {
            const RouteComponent = route.component;
            return (
              <ProtectedRoute redirectTo="/login">
                <RouteComponent />
              </ProtectedRoute>
            );
          }
        : route.component,
    }));
    this.symphonyPlatform.registerRoute(symphonyRoutes);
    return this;
  }

  listRoutes(): Route[] {
    return this.routeSlot.flatValues();
  }

  /**
   * register navigation items for the sidebar and bottom-nav.
   */
  registerNavigationItem(items: NavigationItem[]) {
    this.navigationItemSlot.register(items);
    return this;
  }

  listNavigationItems(): NavigationItem[] {
    return [...this.navigationItemSlot.flatValues()].sort(
      (a, b) => (a.order ?? 100) - (b.order ?? 100)
    );
  }

  /**
   * register a panel for the authenticated dashboard.
   */
  registerDashboardPanel(panels: DashboardPanel[]) {
    this.dashboardPanelSlot.register(panels);
    return this;
  }

  listDashboardPanels(): DashboardPanel[] {
    return this.dashboardPanelSlot.flatValues();
  }

  /**
   * register a header action — e.g. SOS, notifications.
   */
  registerHeaderAction(actions: HeaderAction[]) {
    this.headerActionSlot.register(actions);
    return this;
  }

  listHeaderActions(): HeaderAction[] {
    return [...this.headerActionSlot.flatValues()].sort(
      (a, b) => (a.order ?? 100) - (b.order ?? 100)
    );
  }

  /**
   * register a map layer.
   */
  registerMapLayer(layers: MapLayer[]) {
    this.mapLayerSlot.register(layers);
    return this;
  }

  listMapLayers(): MapLayer[] {
    return this.mapLayerSlot.flatValues();
  }

  /**
   * register a map overlay.
   */
  registerMapOverlay(overlays: MapOverlay[]) {
    this.mapOverlaySlot.register(overlays);
    return this;
  }

  listMapOverlays(): MapOverlay[] {
    return this.mapOverlaySlot.flatValues();
  }

  /**
   * register a route action — invoked against a planned route.
   */
  registerRouteAction(actions: RouteAction[]) {
    this.routeActionSlot.register(actions);
    return this;
  }

  listRouteActions(): RouteAction[] {
    return this.routeActionSlot.flatValues();
  }

  /**
   * register a safety alert component.
   */
  registerSafetyAlert(alerts: SafetyAlert[]) {
    this.safetyAlertSlot.register(alerts);
    return this;
  }

  listSafetyAlerts(): SafetyAlert[] {
    return this.safetyAlertSlot.flatValues();
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig = {};

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformBrowser],
    _config: Record<string, never>,
    [
      routeSlot,
      navigationItemSlot,
      dashboardPanelSlot,
      headerActionSlot,
      mapLayerSlot,
      mapOverlaySlot,
      routeActionSlot,
      safetyAlertSlot,
    ]: [
      RouteSlot,
      NavigationItemSlot,
      DashboardPanelSlot,
      HeaderActionSlot,
      MapLayerSlot,
      MapOverlaySlot,
      RouteActionSlot,
      SafetyAlertSlot,
    ]
  ) {
    const platform = new MototrackPlatformBrowser(
      symphonyPlatform,
      routeSlot,
      navigationItemSlot,
      dashboardPanelSlot,
      headerActionSlot,
      mapLayerSlot,
      mapOverlaySlot,
      routeActionSlot,
      safetyAlertSlot
    );

    /**
     * register the global theme.
     */
    symphonyPlatform.registerTheme((props) => <MototrackTheme {...props} />);

    /**
     * register the app layout. Slot values are read at render time so feature
     * aspects can contribute items after the provider has run.
     */
    symphonyPlatform.registerLayoutComponent(({ children }) => {
      const navigationItems = platform.listNavigationItems();
      const headerActions = platform.listHeaderActions();
      const dashboardPanels = platform.listDashboardPanels();

      return (
        <AppLayout
          navigationItems={navigationItems}
          headerActions={headerActions}
          dashboardPanels={dashboardPanels}
          profileHref="/profile"
          settingsHref="/settings"
          loginHref="/login"
          signupHref="/signup"
        >
          {children}
        </AppLayout>
      );
    });

    /**
     * 404 / not-found page.
     */
    symphonyPlatform.registerPageNotFound(() => <NotFound />);

    /**
     * register the built-in platform routes.
     */
    platform.registerRoute([
      {
        path: '/',
        component: () => <Home signupPath="/signup" loginPath="/login" />,
      },
      {
        path: '/login',
        component: () => <Login redirectTo="/" signupPath="/signup" />,
      },
      {
        path: '/signup',
        component: () => <Signup redirectTo="/" loginPath="/login" />,
      },
      {
        path: '/dashboard',
        component: () => {
          const panels = platform.listDashboardPanels();
          return <Dashboard panels={panels} />;
        },
        requiresAuth: true,
      },
    ]);

    /**
     * register built-in navigation items.
     */
    platform.registerNavigationItem([
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: '🏠',
        path: '/dashboard',
        order: 0,
        primary: true,
      },
    ]);

    /**
     * register the SOS header action.
     */
    platform.registerHeaderAction([
      {
        key: 'sos',
        label: 'SOS',
        icon: '🆘',
        component: SosAction,
        order: 0,
      },
    ]);

    return platform;
  }
}

export default MototrackPlatformBrowser;
