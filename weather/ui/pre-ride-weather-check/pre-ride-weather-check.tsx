import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useCurrentWeather } from '@markec/weather.hooks.use-current-weather';
import type { WeatherSnapshot } from '@markec/weather.entities.weather-snapshot';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Card } from '@markec/mototrack-design.content.card';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import type { WeatherCheckResult } from './weather-check-result-type.js';
import styles from './pre-ride-weather-check.module.scss';

// ─── Danger thresholds ────────────────────────────────────────────────────────

const DANGER_WIND_KMH = 60;
const DANGER_GUST_KMH = 80;
const DANGER_PRECIP_MMH = 5;
const DANGER_VISIBILITY_KM = 1;

// WMO codes considered dangerous: thunderstorm, heavy snow, heavy rain, blizzard
const DANGER_WMO_CODES = new Set([
  65, 67, 75, 77, 82, 86, 95, 96, 99,
]);

function evaluateDanger(snapshot: WeatherSnapshot): { isDangerous: boolean; reason: string } {
  if (DANGER_WMO_CODES.has(snapshot.wmoCode)) {
    return { isDangerous: true, reason: `Dangerous weather: ${snapshot.label}` };
  }
  if (snapshot.windKmh >= DANGER_WIND_KMH) {
    return { isDangerous: true, reason: `Wind speed ${snapshot.windKmh.toFixed(0)} km/h exceeds safe limit` };
  }
  if (snapshot.gustKmh != null && snapshot.gustKmh >= DANGER_GUST_KMH) {
    return { isDangerous: true, reason: `Gusts up to ${snapshot.gustKmh.toFixed(0)} km/h — too dangerous to ride` };
  }
  if (snapshot.precipMmH >= DANGER_PRECIP_MMH) {
    return { isDangerous: true, reason: `Heavy precipitation: ${snapshot.precipMmH.toFixed(1)} mm/h` };
  }
  if (snapshot.visibilityKm < DANGER_VISIBILITY_KM) {
    return { isDangerous: true, reason: `Visibility only ${snapshot.visibilityKm.toFixed(1)} km — unsafe` };
  }
  return { isDangerous: false, reason: `Conditions are safe for riding` };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WeatherStatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.statRow}>
      <Paragraph variant="caption" color="muted" className={styles.statLabel}>
        {label}
      </Paragraph>
      <Paragraph variant="mono" color="primary" className={styles.statValue}>
        {value}
      </Paragraph>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonStats}>
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
      </div>
    </div>
  );
}

function WarningBanner({ reason }: { reason: string }) {
  return (
    <div className={styles.warningBanner}>
      <div className={styles.warningIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className={styles.warningContent}>
        <Paragraph variant="label" color="primary" className={styles.warningTitle}>
          Ride Not Recommended
        </Paragraph>
        <Paragraph variant="body" color="secondary" className={styles.warningReason}>
          {reason}
        </Paragraph>
      </div>
    </div>
  );
}

function SafeBanner({ reason }: { reason: string }) {
  return (
    <div className={styles.safeBanner}>
      <div className={styles.safeIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className={styles.safeContent}>
        <Paragraph variant="label" color="primary" className={styles.safeTitle}>
          Good to Go
        </Paragraph>
        <Paragraph variant="body" color="secondary" className={styles.safeReason}>
          {reason}
        </Paragraph>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type PreRideWeatherCheckProps = {
  /**
   * GPS latitude for the weather lookup.
   */
  lat?: number;

  /**
   * GPS longitude for the weather lookup.
   */
  lng?: number;

  /**
   * Callback fired whenever the weather check result changes.
   * Parent checklist uses this to enable/disable the Start button.
   */
  onResult?: (result: WeatherCheckResult) => void;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PreRideWeatherCheck({
  lat = 46.0569,
  lng = 14.5058,
  onResult,
  className,
  style,
}: PreRideWeatherCheckProps) {
  const { snapshot, isLoading, error, refresh } = useCurrentWeather({ location: { lat, lng } });

  const result: WeatherCheckResult = React.useMemo(() => {
    if (!snapshot) {
      return { isDangerous: false, reason: `Checking weather conditions…`, snapshot: null };
    }
    const { isDangerous, reason } = evaluateDanger(snapshot);
    return { isDangerous, reason, snapshot };
  }, [snapshot]);

  useEffect(() => {
    if (snapshot && onResult) {
      onResult(result);
    }
  }, [result, snapshot, onResult]);

  if (isLoading) {
    return (
      <div className={classNames(styles.root, className)} style={style}>
        <SkeletonLoader />
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className={classNames(styles.root, className)} style={style}>
        <Card variant="outlined" padding="lg" className={styles.errorCard}>
          <div className={styles.errorContent}>
            <span className={styles.errorEmoji}>⚠️</span>
            <Paragraph variant="body" color="muted">
              Unable to fetch weather data. Please check your connection.
            </Paragraph>
            <button type="button" className={styles.retryButton} onClick={() => refresh()}>
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const windDir = degreesToCompass(snapshot.windDirDeg);
  const updatedAt = new Date(snapshot.ts * 1000).toLocaleTimeString([], { hour: `2-digit`, minute: `2-digit` });

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Paragraph variant="label" color="muted">
            Current Weather
          </Paragraph>
          <div className={styles.conditionRow}>
            <span className={styles.weatherIcon}>{snapshot.icon}</span>
            <span className={styles.weatherLabel}>{snapshot.label}</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.tempDisplay}>
            <span className={styles.tempValue}>{snapshot.tempC.toFixed(1)}</span>
            <span className={styles.tempUnit}>°C</span>
          </div>
          <Paragraph variant="caption" color="muted" className={styles.feelsLike}>
            Feels like {snapshot.feelsLikeC.toFixed(1)}°C
          </Paragraph>
        </div>
      </div>

      {/* Status banner */}
      {result.isDangerous
        ? <WarningBanner reason={result.reason} />
        : <SafeBanner reason={result.reason} />
      }

      {/* Stats grid */}
      <Card variant="elevated" padding="lg" className={styles.statsCard}>
        <div className={styles.statsGrid}>
          <WeatherStatRow label="Wind" value={`${snapshot.windKmh.toFixed(0)} km/h ${windDir}`} />
          {snapshot.gustKmh != null && (
            <WeatherStatRow label="Gusts" value={`${snapshot.gustKmh.toFixed(0)} km/h`} />
          )}
          <WeatherStatRow label="Visibility" value={`${snapshot.visibilityKm.toFixed(1)} km`} />
          <WeatherStatRow label="Precipitation" value={`${snapshot.precipMmH.toFixed(1)} mm/h`} />
          <WeatherStatRow label="Humidity" value={`${snapshot.humidity.toFixed(0)}%`} />
        </div>
      </Card>

      {/* Footer */}
      <div className={styles.footer}>
        <Badge
          variant={result.isDangerous ? `danger` : `success`}
          label={result.isDangerous ? `Dangerous` : `Safe`}
          size="sm"
        />
        <Paragraph variant="caption" color="muted" className={styles.updatedAt}>
          Updated {updatedAt}
        </Paragraph>
        <button type="button" className={styles.refreshButton} onClick={() => refresh()}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M10.5 6A4.5 4.5 0 116 1.5a4.49 4.49 0 013.182 1.318L7.5 4.5H11V1l-1.44 1.44A5.5 5.5 0 106 11.5a5.49 5.49 0 004.5-2.34l-.87-.58A4.49 4.49 0 0110.5 6z" />
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function degreesToCompass(deg: number): string {
  const dirs = [`N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`];
  const idx = Math.round(deg / 45) % 8;
  return dirs[idx];
}
