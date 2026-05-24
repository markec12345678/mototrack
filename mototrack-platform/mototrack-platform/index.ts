import { MototrackPlatformAspect } from './mototrack-platform.aspect.js';

export type { MototrackPlatformBrowser } from './mototrack-platform.browser.runtime.js';
export type { MototrackPlatformNode } from './mototrack-platform.node.runtime.js';
export type { MototrackPlatformConfig } from './mototrack-platform-config.js';
export type { Route } from './route.js';
export type { NavigationItem } from './navigation-item.js';
export type { DashboardPanel } from './dashboard-panel.js';
export type { HeaderAction } from './header-action.js';
export type { MapLayer, MapLayerSlot } from './map-layer.js';
export type {
  MapOverlay,
  MapOverlaySlot,
  MapOverlayPosition,
} from './map-overlay.js';
export type { RouteAction, PlannedRoute } from './route-action.js';
export type { SafetyAlert } from './safety-alert.js';

export default MototrackPlatformAspect;
export { MototrackPlatformAspect };
