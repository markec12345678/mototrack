import { Fragment, type CSSProperties } from 'react';
import classNames from 'classnames';
import { useRouteWeather } from '@markec/weather.hooks.use-route-weather';
import { type RouteWeatherPoint } from './route-weather-strip-point-type.js';
import styles from './route-weather-strip.module.scss';

export type RouteWeatherStripProps = {
  /**
   * Array of lat/lng waypoints defining the route.
   * The hook samples evenly-spaced points along this geometry.
   */
  route?: RouteWeatherPoint[];

  /**
   * Number of weather sample points to display along the route.
   * Defaults to 5.
   */
  samples?: number;

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: CSSProperties;
};

const DEFAULT_ROUTE: RouteWeatherPoint[] = [
  { lat: 46.0569, lng: 14.5058 },
  { lat: 46.2396, lng: 14.3561 },
  { lat: 46.3625, lng: 14.0948 },
  { lat: 46.4983, lng: 13.8369 },
  { lat: 46.6226, lng: 13.835 },
];

function formatEta(etaMin: number): string {
  if (etaMin === 0) return `Start`;
  if (etaMin < 60) return `+${Math.round(etaMin)}m`;
  const h = Math.floor(etaMin / 60);
  const m = Math.round(etaMin % 60);
  return m === 0 ? `+${h}h` : `+${h}h ${m}m`;
}

function getWindDirection(deg: number): string {
  const dirs = [`N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`];
  return dirs[Math.round(deg / 45) % 8];
}

function getWindArrowRotation(deg: number): number {
  return (deg + 180) % 360;
}

function getWeatherSeverity(wmoCode: number, precipMmH: number, windKmh: number): `normal` | `alert` | `danger` {
  if (wmoCode >= 95 || precipMmH > 3 || windKmh > 50) return `danger`;
  if (wmoCode >= 61 || precipMmH > 0.5 || windKmh > 30) return `alert`;
  return `normal`;
}

type SkeletonStripProps = {
  count: number;
};

function SkeletonStrip({ count }: SkeletonStripProps) {
  return (
    <div className={styles.skeleton}>
      {Array.from({ length: count }).map((_, i) => (
        <Fragment key={i}>
          <div className={styles.skeletonCard}>
            <div className={classNames(styles.skeletonBlock, styles.skeletonBadge)} />
            <div className={classNames(styles.skeletonBlock, styles.skeletonIcon)} />
            <div className={classNames(styles.skeletonBlock, styles.skeletonTemp)} />
            <div className={classNames(styles.skeletonBlock, styles.skeletonLabel)} />
            <div className={classNames(styles.skeletonBlock, styles.skeletonWind)} />
          </div>
          {i < count - 1 && (
            <div className={styles.skeletonConnector}>
              <div className={styles.skeletonLine} />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

/**
 * RouteWeatherStrip — horizontal strip showing weather conditions
 * at evenly-spaced points along a planned motorcycle route, with ETA labels.
 */
export function RouteWeatherStrip({
  route = DEFAULT_ROUTE,
  samples = 5,
  className,
  style,
}: RouteWeatherStripProps) {
  const { routeWeather, loading, error } = useRouteWeather(route, samples);

  return (
    <div className={classNames(styles.strip, className)} style={style}>
      <div className={styles.header}>
        <p className={styles.title}>Route Weather</p>
        {!loading && !error && routeWeather && routeWeather.length > 0 && (
          <span className={styles.sampleCount}>{routeWeather.length} checkpoints</span>
        )}
      </div>

      <div className={styles.scrollContainer}>
        {loading && <SkeletonStrip count={samples} />}

        {!loading && error && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠️</span>
            <p className={styles.errorText}>
              Unable to load route weather. Please check your connection and try again.
            </p>
          </div>
        )}

        {!loading && !error && (!routeWeather || routeWeather.length === 0) && (
          <div className={styles.emptyState}>
            <span>🗺️</span>
            <p className={styles.emptyText}>No route weather data available.</p>
          </div>
        )}

        {!loading && !error && routeWeather && routeWeather.length > 0 && (
          <div className={styles.pointsRow}>
            {routeWeather.map((point, index) => {
              const { snapshot, etaMin } = point;
              const isStart = index === 0;
              const isEnd = index === routeWeather.length - 1;
              const severity = getWeatherSeverity(snapshot.wmoCode, snapshot.precipMmH, snapshot.windKmh);
              const windDir = getWindDirection(snapshot.windDirDeg);
              const arrowRotation = getWindArrowRotation(snapshot.windDirDeg);
              const etaLabel = formatEta(etaMin);

              const cardClass = classNames(styles.pointCard, {
                [styles.pointCardStart]: isStart,
                [styles.pointCardEnd]: isEnd && !isStart,
                [styles.pointCardAlert]: severity === `alert`,
                [styles.pointCardDanger]: severity === `danger`,
              });

              const badgeClass = classNames(styles.etaBadge, {
                [styles.etaBadgeStart]: isStart,
                [styles.etaBadgeNeutral]: !isStart,
              });

              return (
                <Fragment key={index}>
                  <div className={cardClass}>
                    <span className={badgeClass}>{etaLabel}</span>

                    <span className={styles.weatherIcon} role="img" aria-label={snapshot.label}>
                      {snapshot.icon}
                    </span>

                    <span className={styles.temperature}>{Math.round(snapshot.tempC)}°C</span>

                    <span className={styles.weatherLabel}>{snapshot.label}</span>

                    <div className={styles.windRow}>
                      <span
                        className={styles.windArrow}
                        style={{ transform: `rotate(${arrowRotation}deg)` }}
                      >
                        ↑
                      </span>
                      <span className={styles.windValue}>
                        {Math.round(snapshot.windKmh)} km/h {windDir}
                      </span>
                    </div>

                    {snapshot.precipMmH > 0 && (
                      <div className={styles.precipPill}>
                        <span style={{ fontSize: `10px` }}>💧</span>
                        <span className={styles.precipValue}>
                          {snapshot.precipMmH.toFixed(1)} mm/h
                        </span>
                      </div>
                    )}
                  </div>

                  {index < routeWeather.length - 1 && (
                    <div className={styles.connector}>
                      <div className={styles.connectorLine} />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
