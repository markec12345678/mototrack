import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { type NavigationItem } from './navigation-item-type.js';
import styles from './bottom-nav.module.scss';

export type BottomNavProps = {
  /**
   * Primary navigation items to render as tabs.
   * Only items with `primary: true` are displayed.
   */
  navigationItems?: NavigationItem[];

  /**
   * Additional class name for the nav container.
   */
  className?: string;

  /**
   * Inline styles for the nav container.
   */
  style?: React.CSSProperties;
};

const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  { key: `dashboard`, label: `Home`, icon: `home`, path: `/`, order: 1, primary: true },
  { key: `map`, label: `Map`, icon: `map`, path: `/map`, order: 2, primary: true },
  { key: `routes`, label: `Routes`, icon: `route`, path: `/routes`, order: 3, primary: true },
  { key: `riders`, label: `Riders`, icon: `riders`, path: `/riders`, order: 4, primary: true },
  { key: `profile`, label: `Profile`, icon: `profile`, path: `/profile`, order: 5, primary: true },
];

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 3L15 5.5L21 3V17L15 19.5L9 17L3 19.5V5.5L9 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3V17M15 5.5V19.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="6" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 15.5C6 15.5 6 12 9 10C12 8 15 8 18 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RidersIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 20C3 16.6863 5.68629 14 9 14C12.3137 14 15 16.6863 15 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 20C21 17.2386 19.2091 15 17 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 20C4 16.134 7.58172 13 12 13C16.4183 13 20 16.134 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MotoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="5" cy="16" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="16" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 16H14L16 11H10L8 16Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 11L16 8H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function renderIcon(icon: string) {
  switch (icon) {
    case `home`: return <HomeIcon />;
    case `map`: return <MapIcon />;
    case `route`: return <RouteIcon />;
    case `riders`: return <RidersIcon />;
    case `profile`: return <ProfileIcon />;
    default: return <MotoIcon />;
  }
}

function isActivePath(currentPath: string, itemPath: string): boolean {
  if (itemPath === `/`) return currentPath === `/`;
  return currentPath.startsWith(itemPath);
}

/**
 * Mobile bottom-tab navigation bar.
 * Renders primary NavigationItems as icon + label tabs.
 * Applies safe-area bottom inset for notched devices.
 * Active tab is highlighted in orange.
 * Only visible on screens narrower than 1024px.
 */
export function BottomNav({ navigationItems = DEFAULT_NAV_ITEMS, className, style }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const primaryItems = [...navigationItems]
    .filter((item) => item.primary)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <nav
      className={classNames(styles.bottomNav, className)}
      style={style}
      aria-label="Mobile navigation"
    >
      <div className={styles.inner}>
        {primaryItems.map((item) => {
          const active = isActivePath(location.pathname, item.path);
          return (
            <button
              key={item.key}
              type="button"
              className={classNames(styles.tab, { [styles.active]: active })}
              onClick={() => navigate(item.path)}
              aria-current={active ? `page` : undefined}
            >
              <span className={styles.iconWrap}>
                {renderIcon(item.icon)}
                {active && <span className={styles.activeDot} />}
              </span>
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
