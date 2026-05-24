import { type ReactNode } from 'react';
import classNames from 'classnames';
import { Card } from '@markec/mototrack-design.content.card';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { ForecastDay } from '@markec/weather.entities.forecast-day';
import styles from './forecast-card.module.scss';

export type ForecastCardProps = {
  /**
   * Array of forecast days to display. Typically 3 days.
   */
  days?: ForecastDay[];

  /**
   * Title shown at the top of the card.
   */
  title?: string;

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: import('react').CSSProperties;
};

const DEFAULT_DAYS: ForecastDay[] = [
  ForecastDay.from({
    date: `2025-06-10`,
    tempMinC: 12,
    tempMaxC: 22,
    precipMm: 0.2,
    windKmh: 18,
    wmoCode: 1,
    label: `Pretežno jasno`,
    icon: `⛅`,
  }),
  ForecastDay.from({
    date: `2025-06-11`,
    tempMinC: 10,
    tempMaxC: 19,
    precipMm: 4.5,
    windKmh: 32,
    wmoCode: 61,
    label: `Dež`,
    icon: `🌧️`,
  }),
  ForecastDay.from({
    date: `2025-06-12`,
    tempMinC: 14,
    tempMaxC: 25,
    precipMm: 0,
    windKmh: 12,
    wmoCode: 0,
    label: `Jasno`,
    icon: `☀️`,
  }),
];

function formatDay(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return `Danes`;
  if (date.toDateString() === tomorrow.toDateString()) return `Jutri`;

  return date.toLocaleDateString(`sl-SI`, { weekday: `short` });
}

function getWindSeverity(windKmh: number): `normal` | `moderate` | `strong` | `danger` {
  if (windKmh >= 60) return `danger`;
  if (windKmh >= 40) return `strong`;
  if (windKmh >= 20) return `moderate`;
  return `normal`;
}

function getPrecipSeverity(precipMm: number): `none` | `light` | `heavy` {
  if (precipMm >= 5) return `heavy`;
  if (precipMm > 0) return `light`;
  return `none`;
}

type DayRowProps = {
  day: ForecastDay;
  isFirst: boolean;
};

function DayRow({ day, isFirst }: DayRowProps): ReactNode {
  const windSeverity = getWindSeverity(day.windKmh);
  const precipSeverity = getPrecipSeverity(day.precipMm);

  return (
    <div className={classNames(styles.dayRow, { [styles.dayRowFirst]: isFirst })}>
      <div className={styles.dayLabel}>
        <Paragraph variant="label" color="muted" className={styles.dayName}>
          {formatDay(day.date)}
        </Paragraph>
      </div>

      <div className={styles.iconBlock}>
        <span className={styles.weatherIcon} role="img" aria-label={day.label}>
          {day.icon}
        </span>
        <Paragraph variant="caption" color="secondary" className={styles.weatherLabel}>
          {day.label}
        </Paragraph>
      </div>

      <div className={styles.tempBlock}>
        <span className={styles.tempMax}>{Math.round(day.tempMaxC)}°</span>
        <span className={styles.tempSep}>/</span>
        <span className={styles.tempMin}>{Math.round(day.tempMinC)}°</span>
      </div>

      <div className={styles.metaBlock}>
        <span className={classNames(styles.metaIcon, styles.windIcon)}>💨</span>
        <span className={classNames(styles.metaValue, styles[`wind-${windSeverity}`])}>
          {Math.round(day.windKmh)}
          <span className={styles.metaUnit}> km/h</span>
        </span>
      </div>

      <div className={styles.metaBlock}>
        <span className={classNames(styles.metaIcon, styles.precipIcon)}>🌧</span>
        <span className={classNames(styles.metaValue, styles[`precip-${precipSeverity}`])}>
          {day.precipMm.toFixed(1)}
          <span className={styles.metaUnit}> mm</span>
        </span>
      </div>
    </div>
  );
}

/**
 * ForecastCard — 3-day weather forecast card for the MotoTrack dashboard and plan page.
 * Displays day, weather icon, min/max temperature, wind speed, and precipitation for each day.
 */
export function ForecastCard({
  days = DEFAULT_DAYS,
  title = `3-dnevna napoved`,
  className,
  style,
}: ForecastCardProps) {
  const displayDays = days.slice(0, 3);

  return (
    <Card variant="elevated" padding="lg" className={classNames(styles.forecastCard, className)} style={style}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>📅</span>
        <Paragraph variant="label" color="muted" className={styles.headerTitle}>
          {title}
        </Paragraph>
      </div>

      <div className={styles.divider} />

      <div className={styles.dayList}>
        {displayDays.map((day, index) => (
          <DayRow key={day.date} day={day} isFirst={index === 0} />
        ))}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: `var(--colors-status-warning-default)` }} />
          <Paragraph variant="caption" color="muted">
            Veter ≥ 20 km/h
          </Paragraph>
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: `var(--colors-status-danger-default)` }} />
          <Paragraph variant="caption" color="muted">
            Veter ≥ 60 km/h
          </Paragraph>
        </span>
      </div>
    </Card>
  );
}
