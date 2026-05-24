import { type NavigationItem } from './navigation-item-type.js';

export const mockNavigationItems: NavigationItem[] = [
  { key: `dashboard`, label: `Home`, icon: `home`, path: `/`, order: 1, primary: true },
  { key: `map`, label: `Map`, icon: `map`, path: `/map`, order: 2, primary: true },
  { key: `routes`, label: `Routes`, icon: `route`, path: `/routes`, order: 3, primary: true },
  { key: `riders`, label: `Riders`, icon: `riders`, path: `/riders`, order: 4, primary: true },
  { key: `profile`, label: `Profile`, icon: `profile`, path: `/profile`, order: 5, primary: true },
];

export const mockNavigationItemsWithNonPrimary: NavigationItem[] = [
  { key: `dashboard`, label: `Home`, icon: `home`, path: `/`, order: 1, primary: true },
  { key: `map`, label: `Map`, icon: `map`, path: `/map`, order: 2, primary: true },
  { key: `settings`, label: `Settings`, icon: `settings`, path: `/settings`, order: 3, primary: false },
  { key: `routes`, label: `Routes`, icon: `route`, path: `/routes`, order: 4, primary: true },
  { key: `profile`, label: `Profile`, icon: `profile`, path: `/profile`, order: 5, primary: true },
];

export const mockMinimalNavItems: NavigationItem[] = [
  { key: `dashboard`, label: `Home`, icon: `home`, path: `/`, order: 1, primary: true },
  { key: `map`, label: `Map`, icon: `map`, path: `/map`, order: 2, primary: true },
  { key: `profile`, label: `Profile`, icon: `profile`, path: `/profile`, order: 3, primary: true },
];
