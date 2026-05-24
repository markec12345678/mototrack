import * as React from 'react';
import classNames from 'classnames';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Link } from '@markec/mototrack-design.navigation.link';
import { RideCard } from '@markec/rides.ui.ride-card';
import { useRides } from '@markec/rides.hooks.use-rides';
import styles from './ride-dashboard-panel.module.scss';

export type Ride = {
  id: string;
  userId: string;
  startedAt: number;
  endedAt: number;
  distanceKm: number;
  durationSec: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  climbM: number;
  descentM: number;
  twistinessScore: number;
  track: Array<{ lat: number; lng: number; ts: number }>;
  name?: string;
  notes?: string;
};

export type RideDashboardPanelProps = {
  /**
   * Override rides data (useful for testing/compositions).
   * When provided, the GraphQL hook loading/error state is bypassed entirely.
   */
  rides?: Ride[];

  /**
   * Number of recent rides to display. Defaults to 3.
   */
  limit?: number;

  /**
   * Link target for "Vse vožnje →".
   */
  allRidesHref?: string;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

export function RideDashboardPanel({
  rides: ridesProp,
  limit = 3,
  allRidesHref = `/rides`,
  className,
  style,
}: RideDashboardPanelProps) {
  const isPropControlled = ridesProp !== undefined;
  const { rides: fetchedRides, loading: hookLoading, error: hookError } = useRides({
    listOptions: { limit },
  });

  const loading = isPropControlled ? false : hookLoading;
  const error = isPropControlled ? undefined : hookError;
  const rides = isPropControlled ? ridesProp : (fetchedRides ?? []);
  const displayRides = rides.slice(0, limit);

  return (
    <div className={classNames(styles.panel, className)} style={style}>
      <div className={styles.header}>
        <Heading level={4} size="md" color="primary">
          Zadnje vožnje
        </Heading>
        <Link href={allRidesHref} variant="subtle" className={styles.allLink}>
          Vse vožnje →
        </Link>
      </div>

      <div className={styles.content}>
        {loading && (
          <div className={styles.stateContainer}>
            <div className={styles.skeletonList}>
              {Array.from({ length: limit }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          </div>
        )}

        {!loading && error && (
          <div className={styles.stateContainer}>
            <div className={styles.errorState}>
              <span className={styles.errorIcon}>⚠</span>
              <p className={styles.errorText}>Napaka pri nalaganju vožnje.</p>
            </div>
          </div>
        )}

        {!loading && !error && displayRides.length === 0 && (
          <div className={styles.stateContainer}>
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🏍️</span>
              <p className={styles.emptyTitle}>Še ni vožnje</p>
              <p className={styles.emptySubtitle}>Začni svojo prvo vožnjo!</p>
            </div>
          </div>
        )}

        {!loading && !error && displayRides.length > 0 && (
          <ul className={styles.rideList}>
            {displayRides.map((ride) => (
              <li key={ride.id} className={styles.rideItem}>
                <RideCard ride={ride} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
