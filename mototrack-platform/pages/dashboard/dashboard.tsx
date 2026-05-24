import React from 'react';
import classNames from 'classnames';
import { PageLayout } from '@markec/mototrack-design.layouts.page-layout';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Card } from '@markec/mototrack-design.content.card';
import { useAuth } from '@markec/mototrack-platform.hooks.use-auth';
import { DashboardPanel } from './dashboard-panel-type.js';
import styles from './dashboard.module.scss';

const HERO_IMAGE =
  `https://storage.googleapis.com/bit-generated-images/images/image_dark_motorcycle_dashboard_hero_0_1779617081716.png`;

const RIDE_IMAGE =
  `https://storage.googleapis.com/bit-generated-images/images/image_minimalist_motorcycle_rider_si_0_1779617092234.png`;

const ROUTE_IMAGE =
  `https://storage.googleapis.com/bit-generated-images/images/image_aerial_view_of_winding_mountai_0_1779617092624.png`;

const DEFAULT_GETTING_STARTED = [
  {
    key: `first-ride`,
    icon: `🏍️`,
    title: `Start your first ride`,
    description: `Record your route, track speed and elevation, and relive every moment of your ride.`,
    cta: `Start riding`,
    image: RIDE_IMAGE,
  },
  {
    key: `plan-route`,
    icon: `🗺️`,
    title: `Plan a route`,
    description: `Design your perfect journey through mountain passes, coastal roads, and hidden gems.`,
    cta: `Plan now`,
    image: ROUTE_IMAGE,
  },
  {
    key: `balkan-tours`,
    icon: `🌍`,
    title: `Browse Balkan tours`,
    description: `Explore curated multi-day tours across Slovenia, Croatia, Bosnia, Serbia and beyond.`,
    cta: `Explore tours`,
    image: RIDE_IMAGE,
  },
];

export type DashboardProps = {
  /**
   * Registered DashboardPanel slot widgets to render in the grid.
   * When empty, the getting-started empty state is shown.
   */
  panels?: DashboardPanel[];

  /**
   * Override the display name shown in the greeting.
   * Falls back to the authenticated user's displayName.
   */
  displayName?: string;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

export function Dashboard({ panels = [], displayName, className, style }: DashboardProps) {
  const { user, isLoading } = useAuth();

  const resolvedName = displayName ?? user?.displayName ?? `Rider`;
  const hasPanels = panels.length > 0;

  return (
    <div className={classNames(styles.dashboard, className)} style={style}>
      {/* Hero banner */}
      <div className={styles.heroBanner}>
        <img src={HERO_IMAGE} alt="" className={styles.heroImage} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <PageLayout maxWidth="1280px" padding="0 var(--layout-gutter)" gap="var(--spacing-sm)">
            <div className={styles.greetingRow}>
              <div className={styles.greetingBadge}>
                <span className={styles.greetingDot} />
                <span className={styles.greetingBadgeText}>MotoTrack</span>
              </div>
              {isLoading ? (
                <div className={styles.skeletonHeading} />
              ) : (
                <Heading level={1} size="2xl" className={styles.greetingHeading}>
                  {`Pozdravljen, ${resolvedName}! 🏍️`}
                </Heading>
              )}
              <Paragraph variant="body" color="secondary" className={styles.greetingSubtitle}>
                Dobrodošel nazaj. Tvoja naslednja avantura te čaka.
              </Paragraph>
            </div>
          </PageLayout>
        </div>
      </div>

      {/* Main content */}
      <PageLayout maxWidth="1280px" padding="var(--spacing-xl) var(--layout-gutter)" gap="var(--spacing-xl)">
        {hasPanels ? (
          <div className={styles.panelGrid}>
            {panels.map((panel) => {
              const PanelComponent = panel.component;
              return (
                <div
                  key={panel.key}
                  className={classNames(styles.panelCell, {
                    [styles.span1]: panel.span === 1 || !panel.span,
                    [styles.span2]: panel.span === 2,
                    [styles.span3]: panel.span === 3,
                  })}
                >
                  <Card variant="elevated" padding="lg" className={styles.panelCard}>
                    <div className={styles.panelHeader}>
                      <Heading level={3} size="md" color="primary">
                        {panel.title}
                      </Heading>
                    </div>
                    <div className={styles.panelBody}>
                      <PanelComponent />
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateHeader}>
              <Paragraph variant="label" color="muted" className={styles.emptyStateLabel}>
                Začni svojo pot
              </Paragraph>
              <Heading level={2} size="xl" color="primary">
                Kaj bi rad naredil danes?
              </Heading>
              <Paragraph variant="body" color="secondary" className={styles.emptyStateDescription}>
                Tvoj MotoTrack nadzorni panel je pripravljen. Izberi eno od spodnjih možnosti in začni svojo avantura.
              </Paragraph>
            </div>
            <div className={styles.gettingStartedGrid}>
              {DEFAULT_GETTING_STARTED.map((item) => (
                <Card key={item.key} variant="elevated" padding="none" hoverLift className={styles.startCard}>
                  <div className={styles.startCardImageWrapper}>
                    <img src={item.image} alt={item.title} className={styles.startCardImage} />
                    <div className={styles.startCardImageOverlay} />
                    <span className={styles.startCardIcon}>{item.icon}</span>
                  </div>
                  <div className={styles.startCardBody}>
                    <Heading level={3} size="md" color="primary" className={styles.startCardTitle}>
                      {item.title}
                    </Heading>
                    <Paragraph variant="body" color="secondary" className={styles.startCardDescription}>
                      {item.description}
                    </Paragraph>
                    <button type="button" className={styles.startCardCta}>
                      {item.cta}
                      <span className={styles.startCardCtaArrow}>→</span>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </PageLayout>
    </div>
  );
}
