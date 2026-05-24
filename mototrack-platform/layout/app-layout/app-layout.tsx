import React from 'react';
import classNames from 'classnames';
import { Header } from '@markec/mototrack-platform.layout.header';
import { Sidebar } from '@markec/mototrack-platform.layout.sidebar';
import { BottomNav } from '@markec/mototrack-platform.layout.bottom-nav';
import { Spinner } from '@markec/mototrack-design.loaders.spinner';
import { useAuth } from '@markec/mototrack-platform.hooks.use-auth';
import { type NavigationItem } from './navigation-item-type.js';
import { type HeaderAction } from './header-action-type.js';
import { type DashboardPanel } from './dashboard-panel-type.js';
import styles from './app-layout.module.scss';

export type AppLayoutProps = {
  /**
   * Navigation items collected from the NavigationItem slot.
   * Passed to Sidebar (desktop) and BottomNav (mobile).
   */
  navigationItems?: NavigationItem[];

  /**
   * Header action items collected from the HeaderAction slot.
   * Passed to the Header component.
   */
  headerActions?: HeaderAction[];

  /**
   * Dashboard panels collected from the DashboardPanel slot.
   * Available for consumers to use in route content.
   */
  dashboardPanels?: DashboardPanel[];

  /**
   * Route outlet content rendered in the main area.
   */
  children?: React.ReactNode;

  /**
   * Href for the profile page link passed to Header.
   */
  profileHref?: string;

  /**
   * Href for the settings page link passed to Header.
   */
  settingsHref?: string;

  /**
   * Href for the login page passed to Header.
   */
  loginHref?: string;

  /**
   * Href for the signup page passed to Header.
   */
  signupHref?: string;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles applied to the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [];
const DEFAULT_HEADER_ACTIONS: HeaderAction[] = [];
const DEFAULT_DASHBOARD_PANELS: DashboardPanel[] = [];

/**
 * App layout shell.
 *
 * Composes:
 * - Sticky Header (always visible)
 * - Sidebar on desktop (≥1024px) — authenticated users only
 * - BottomNav on mobile (<1024px) — authenticated users only
 * - Main content area rendering children (route outlet)
 *
 * Shows a full-page spinner while auth is loading.
 * Anonymous users see header + content only (no sidebar / bottom-nav).
 */
export function AppLayout({
  navigationItems = DEFAULT_NAVIGATION_ITEMS,
  headerActions = DEFAULT_HEADER_ACTIONS,
  dashboardPanels = DEFAULT_DASHBOARD_PANELS,
  children,
  profileHref = `/profile`,
  settingsHref = `/settings`,
  loginHref = `/login`,
  signupHref = `/signup`,
  className,
  style,
}: AppLayoutProps) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingBadge}>
            <span className={styles.loadingDot} />
            <span className={styles.loadingBadgeText}>MotoTrack</span>
          </div>
          <Spinner size="lg" label="Loading your ride…" />
        </div>
      </div>
    );
  }

  const showNav = isAuthenticated;

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {/* ── Sticky Header ───────────────────────────────────────── */}
      <Header
        headerActions={headerActions}
        profileHref={profileHref}
        settingsHref={settingsHref}
        loginHref={loginHref}
        signupHref={signupHref}
      />

      {/* ── Body: sidebar + main ────────────────────────────────── */}
      <div className={styles.body}>
        {/* Desktop Sidebar — authenticated only */}
        {showNav && (
          <Sidebar navigationItems={navigationItems} />
        )}

        {/* Main content */}
        <main
          className={classNames(styles.main, {
            [styles.mainWithSidebar]: showNav,
            [styles.mainAnonymous]: !showNav,
          })}
        >
          <div className={styles.mainInner}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile BottomNav — authenticated only */}
      {showNav && (
        <BottomNav navigationItems={navigationItems} />
      )}
    </div>
  );
}
