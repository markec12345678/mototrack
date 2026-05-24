import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Tooltip } from '@markec/mototrack-design.overlays.tooltip';
import { NavigationItem } from './navigation-item-type.js';
import styles from './sidebar.module.scss';

export type SidebarProps = {
  /**
   * Navigation items to render in the sidebar.
   * Collected from the NavigationItem slot by the platform.
   */
  navigationItems?: NavigationItem[];

  /**
   * Whether the sidebar starts in collapsed (icon-only) mode.
   */
  defaultCollapsed?: boolean;

  /**
   * Additional class name for the sidebar root.
   */
  className?: string;

  /**
   * Inline styles for the sidebar root.
   */
  style?: React.CSSProperties;

  /**
   * Logo or brand element rendered at the top of the sidebar.
   */
  logo?: React.ReactNode;

  /**
   * Footer element rendered at the bottom of the sidebar.
   */
  footer?: React.ReactNode;
};

const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  { key: `dashboard`, label: `Dashboard`, icon: `🏠`, path: `/`, order: 1, primary: true },
  { key: `races`, label: `Races`, icon: `🏁`, path: `/races`, order: 2, primary: true },
  { key: `riders`, label: `Riders`, icon: `🏍️`, path: `/riders`, order: 3, primary: true },
  { key: `map`, label: `Route Map`, icon: `🗺️`, path: `/map`, order: 4, primary: true },
  { key: `standings`, label: `Standings`, icon: `🏆`, path: `/standings`, order: 5, primary: true },
  { key: `settings`, label: `Settings`, icon: `⚙️`, path: `/settings`, order: 6 },
];

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(styles.collapseIcon, { [styles.collapseIconRotated]: collapsed })}
    >
      <path
        d="M10 12L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sidebar({
  navigationItems = DEFAULT_NAV_ITEMS,
  defaultCollapsed = false,
  className,
  style,
  logo,
  footer,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const location = useLocation();

  const sorted = [...navigationItems].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const isActive = (path: string) => {
    if (path === `/`) return location.pathname === `/`;
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={classNames(styles.sidebar, { [styles.collapsed]: collapsed }, className)}
      style={style}
      aria-label="Primary navigation"
    >
      {/* Logo / Brand */}
      <div className={styles.brand}>
        {logo ? (
          <div className={styles.logoSlot}>{logo}</div>
        ) : (
          <div className={styles.defaultLogo}>
            <span className={styles.logoIcon}>🏍️</span>
            {!collapsed && (
              <span className={styles.logoText}>MotoTrack</span>
            )}
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {sorted.map((item) => {
            const active = isActive(item.path);
            const navItem = (
              <li key={item.key} className={styles.navItem}>
                <a
                  href={item.path}
                  className={classNames(styles.navLink, { [styles.active]: active })}
                  aria-current={active ? `page` : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, ``, item.path);
                    window.dispatchEvent(new PopStateEvent(`popstate`));
                  }}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {!collapsed && (
                    <span className={styles.navLabel}>{item.label}</span>
                  )}
                  {active && <span className={styles.activeBorder} />}
                </a>
              </li>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.key} content={item.label} position="right">
                  {navItem}
                </Tooltip>
              );
            }

            return navItem;
          })}
        </ul>
      </nav>

      {/* Footer slot */}
      {footer && (
        <div className={styles.footerSlot}>{footer}</div>
      )}

      {/* Collapse toggle */}
      <button
        type="button"
        className={styles.collapseBtn}
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? `Expand sidebar` : `Collapse sidebar`}
      >
        <CollapseIcon collapsed={collapsed} />
        {!collapsed && <span className={styles.collapseBtnLabel}>Collapse</span>}
      </button>
    </aside>
  );
}
