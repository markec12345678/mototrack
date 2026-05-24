import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useIconicTours } from '@markec/balkan-roads.hooks.use-iconic-tours';
import { TourCard } from '@markec/balkan-roads.ui.tour-card';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Link } from '@markec/mototrack-design.navigation.link';
import styles from './tour-dashboard-panel.module.scss';

export type TourDashboardPanelProps = {
  /**
   * Number of random tours to display. Defaults to 3.
   */
  count?: number;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function CompassIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M10.5 5.5l-2 4-4 2 2-4 4-2z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 7A5.5 5.5 0 0112 4.5M12.5 7A5.5 5.5 0 012 9.5" />
      <path d="M11 2.5l1 2-2 .5M3 11.5l-1-2 2-.5" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLineShort} />
        <div className={styles.skeletonStats} />
      </div>
      <div className={styles.skeletonFooter} />
    </div>
  );
}

export function TourDashboardPanel({
  count = 3,
  className,
  style,
}: TourDashboardPanelProps) {
  const { tours, loading, error } = useIconicTours();

  const randomTours = useMemo(() => {
    if (!tours || tours.length === 0) return [];
    return pickRandom(tours, Math.min(count, tours.length));
  }, [tours, count]);

  return (
    <section className={classNames(styles.panel, className)} style={style}>
      {/* Panel header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrap}>
            <CompassIcon />
          </div>
          <div>
            <Heading level={3} size="md" color="primary" className={styles.title}>
              Predlagane ture
            </Heading>
            <p className={styles.subtitle}>
              {randomTours.length > 0
                ? `${randomTours.length} ikoničnih balkanski tur`
                : `Ikonične balkanske ture`}
            </p>
          </div>
        </div>

        <div className={styles.headerRight}>
          <Link href="/tours" variant="subtle" className={styles.viewAll}>
            Vse ture
          </Link>
          <div className={styles.refreshHint}>
            <RefreshIcon />
            <span>Naključno</span>
          </div>
        </div>
      </div>

      {/* Decorative accent bar */}
      <div className={styles.accentBar} />

      {/* Content */}
      {error ? (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorText}>Napaka pri nalaganju tur. Poskusite znova.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {loading
            ? Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : randomTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
        </div>
      )}

      {/* Footer */}
      {!loading && !error && randomTours.length > 0 && (
        <div className={styles.footer}>
          <Link href="/tours" variant="button" className={styles.footerLink}>
            Razišči vse ture
          </Link>
        </div>
      )}
    </section>
  );
}
