import React, { useState } from 'react';
import classNames from 'classnames';
import { useCurrentWeather } from '@markec/weather.hooks.use-current-weather';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import type { WeatherSnapshot } from '@markec/weather.entities.weather-snapshot';
import styles from './weather-panel.module.scss';

export type WeatherPanelVariant = 'compact' | 'expanded';

export type WeatherPanelLocation = {
  lat: number;
  lng: number;
};

export type WeatherPanelProps = {
  /**
   * GPS location to fetch weather for.
   */
  location?: WeatherPanelLocation;

  /**
   * Initial display variant.
   */
  variant?: WeatherPanelVariant;

  /**
   * Override snapshot data (useful for testing / SSR).
   */
  snapshot?: WeatherSnapshot;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

// WMO codes that indicate rain or snow proximity
const RAIN_CODES = new Set([51, 53, 55, 61, 63, 65, 80, 81, 82]);
const SNOW_CODES = new Set([71, 73, 75, 77, 85, 86]);
const THUNDER_CODES = new Set([95, 96, 99]);

function isRainCode(wmo: number): boolean {
  return RAIN_CODES.has(wmo);
}

function isSnowCode(wmo: number): boolean {
  return SNOW_CODES.has(wmo);
}

function isThunderCode(wmo: number): boolean {
  return THUNDER_CODES.has(wmo);
}

function getAlertType(wmo: number): 'rain' | 'snow' | 'thunder' | null {
  if (isThunderCode(wmo)) return 'thunder';
  if (isRainCode(wmo)) return 'rain';
  if (isSnowCode(wmo)) return 'snow';
  return null;
}

function WindArrowIcon({ deg }: { deg: number }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={styles.windArrow}
      style={{ transform: `rotate(${deg}deg)` } as React.CSSProperties}
    >
      <path
        d="M8 2L11 10H8.75V14H7.25V10H5L8 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ThermometerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="5.5" y="2" width="3" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="7" cy="10.5" r="2.5" fill="currentColor" />
      <rect x="6" y="3" width="2" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

function WindIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 5h7a2 2 0 1 0-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 8h9a2 2 0 1 1-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7C1 7 3 3 7 3s6 4 6 4-2 4-6 4-6-4-6-4Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2L10.5 7.5a3.5 3.5 0 1 1-7 0L7 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={classNames(styles.chevron, { [styles.chevronExpanded]: expanded })}
    >
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertPill({ type }: { type: 'rain' | 'snow' | 'thunder' }) {
  const config = {
    rain: { label: `Rain nearby`, variant: 'info' as const, icon: `🌧️` },
    snow: { label: `Snow nearby`, variant: 'info' as const, icon: `❄️` },
    thunder: { label: `Storm nearby`, variant: 'danger' as const, icon: `⛈️` },
  };
  const { label, variant, icon } = config[type];

  return (
    <Badge
      variant={variant}
      label={`${icon} ${label}`}
      size="sm"
      className={styles.alertPill}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonTemp} />
      <div className={styles.skeletonRow} />
      <div className={styles.skeletonRow} />
    </div>
  );
}

function WeatherContent({
  snapshot,
  variant,
}: {
  snapshot: WeatherSnapshot;
  variant: WeatherPanelVariant;
}) {
  const alertType = getAlertType(snapshot.wmoCode);

  return (
    <div className={styles.content}>
      {/* Header row: icon + temp + alert */}
      <div className={styles.headerRow}>
        <div className={styles.iconTemp}>
          <span className={styles.weatherIcon}>{snapshot.icon}</span>
          <div className={styles.tempBlock}>
            <Heading level={3} size="xl" color="primary" className={styles.temp}>
              {Math.round(snapshot.tempC)}°C
            </Heading>
            <Paragraph variant="caption" color="muted" className={styles.label}>
              {snapshot.label}
            </Paragraph>
          </div>
        </div>
        {alertType && <AlertPill type={alertType} />}
      </div>

      {/* Feels like — always visible */}
      <div className={styles.feelsLike}>
        <ThermometerIcon />
        <Paragraph variant="caption" color="secondary">
          Feels like&nbsp;
          <span className={styles.value}>{Math.round(snapshot.feelsLikeC)}°C</span>
        </Paragraph>
      </div>

      {/* Wind row — always visible */}
      <div className={styles.statRow}>
        <div className={styles.stat}>
          <WindIcon />
          <Paragraph variant="caption" color="secondary">
            <span className={styles.value}>{Math.round(snapshot.windKmh)}</span>
            <span className={styles.unit}>&nbsp;km/h</span>
          </Paragraph>
          <WindArrowIcon deg={snapshot.windDirDeg} />
        </div>
      </div>

      {/* Expanded-only stats */}
      {variant === 'expanded' && (
        <div className={styles.expandedStats}>
          <div className={styles.stat}>
            <EyeIcon />
            <Paragraph variant="caption" color="secondary">
              <span className={styles.value}>{snapshot.visibilityKm.toFixed(1)}</span>
              <span className={styles.unit}>&nbsp;km</span>
            </Paragraph>
            <Paragraph variant="caption" color="muted">
              Visibility
            </Paragraph>
          </div>
          <div className={styles.stat}>
            <DropletIcon />
            <Paragraph variant="caption" color="secondary">
              <span className={styles.value}>{Math.round(snapshot.humidity)}</span>
              <span className={styles.unit}>&nbsp;%</span>
            </Paragraph>
            <Paragraph variant="caption" color="muted">
              Humidity
            </Paragraph>
          </div>
          {snapshot.gustKmh !== undefined && snapshot.gustKmh !== null && (
            <div className={styles.stat}>
              <WindIcon />
              <Paragraph variant="caption" color="secondary">
                <span className={styles.value}>{Math.round(snapshot.gustKmh)}</span>
                <span className={styles.unit}>&nbsp;km/h</span>
              </Paragraph>
              <Paragraph variant="caption" color="muted">
                Gusts
              </Paragraph>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const DEFAULT_LOCATION: WeatherPanelLocation = { lat: 46.0569, lng: 14.5058 };

export function WeatherPanel({
  location = DEFAULT_LOCATION,
  variant: initialVariant = `compact`,
  snapshot: snapshotProp,
  className,
  style,
}: WeatherPanelProps) {
  const [variant, setVariant] = useState<WeatherPanelVariant>(initialVariant);

  const { snapshot: hookSnapshot, isLoading } = useCurrentWeather({
    location,
  });

  const snapshot = snapshotProp ?? hookSnapshot;

  const toggleVariant = () => {
    setVariant((prev) => (prev === 'compact' ? 'expanded' : 'compact'));
  };

  return (
    <div
      className={classNames(
        styles.panel,
        { [styles.expanded]: variant === 'expanded' },
        className
      )}
      style={style}
    >
      {/* Toggle button */}
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={() => toggleVariant()}
        aria-label={variant === 'compact' ? `Expand weather panel` : `Collapse weather panel`}
      >
        <ChevronIcon expanded={variant === 'expanded'} />
      </button>

      {isLoading && !snapshot ? (
        <LoadingSkeleton />
      ) : snapshot ? (
        <WeatherContent snapshot={snapshot} variant={variant} />
      ) : null}
    </div>
  );
}
