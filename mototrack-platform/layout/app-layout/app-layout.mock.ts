import { type NavigationItem } from './navigation-item-type.js';
import { type HeaderAction } from './header-action-type.js';
import { type DashboardPanel } from './dashboard-panel-type.js';

export const MOCK_NAVIGATION_ITEMS: NavigationItem[] = [
  { key: `dashboard`, label: `Dashboard`, icon: `🏠`, path: `/`, order: 1, primary: true },
  { key: `races`, label: `Races`, icon: `🏁`, path: `/races`, order: 2, primary: true },
  { key: `riders`, label: `Riders`, icon: `🏍️`, path: `/riders`, order: 3, primary: true },
  { key: `map`, label: `Route Map`, icon: `🗺️`, path: `/map`, order: 4, primary: true },
  { key: `standings`, label: `Standings`, icon: `🏆`, path: `/standings`, order: 5, primary: true },
  { key: `settings`, label: `Settings`, icon: `⚙️`, path: `/settings`, order: 6 },
];

export const MOCK_HEADER_ACTIONS: HeaderAction[] = [
  {
    key: `sos`,
    label: `SOS`,
    icon: `🚨`,
    order: 1,
    onClick: () => undefined,
  },
  {
    key: `motochat`,
    label: `MotoChat`,
    icon: `💬`,
    order: 2,
    onClick: () => undefined,
  },
  {
    key: `notifications`,
    label: `Notifications`,
    icon: `🔔`,
    order: 3,
    onClick: () => undefined,
  },
];

export const MOCK_DASHBOARD_PANELS: DashboardPanel[] = [
  {
    key: `live-race`,
    title: `Live Race`,
    component: () => null,
    span: 2,
  },
  {
    key: `standings`,
    title: `Standings`,
    component: () => null,
    span: 1,
  },
  {
    key: `recent-routes`,
    title: `Recent Routes`,
    component: () => null,
    span: 1,
  },
];
