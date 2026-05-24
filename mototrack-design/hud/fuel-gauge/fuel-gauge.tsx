import React from 'react';
import classNames from 'classnames';
import { ProgressBar } from '@markec/mototrack-design.loaders.progress-bar';
import styles from './fuel-gauge.module.scss';

export type FuelGaugeProps = {
  /**
   * Current fuel level in liters.
   * @default 12
   */
  currentLiters?: number;

  /**
   * Total tank capacity in liters.
   * @default 18
   */
  tankCapacity?: number;

  /**
   * Estimated range remaining in kilometers.
   * @default 180
   */
  estimatedRange?: number;

  /**
   * Fuel consumption rate in liters per 100 km (used for range calculation if estimatedRange is not provided).
   * @default 6.5
   */
  consumptionRate?: number;

  /**
   * Show the estimated range label.
   * @default true
   */
  showRange?: boolean;

  /**
   * Show the liters / capacity label.
   * @default true
   */
  showLiters?: boolean;

  /**
   * Height of the progress bar track in pixels.
   * @default 10
   */
  barHeight?: number;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

function getFuelVariant(percentage: number): 'success' | 'warning' | 'danger' {
  if (percentage > 40) return 'success';
  if (percentage > 20) return 'warning';
  return 'danger';
}

function getFuelStatusLabel(percentage: number): string {
  if (percentage > 40) return `Full`;
  if (percentage > 20) return `Low`;
  return `Critical`;
}

export function FuelGauge({
  currentLiters = 12,
  tankCapacity = 18,
  estimatedRange,
  consumptionRate = 6.5,
  showRange = true,
  showLiters = true,
  barHeight = 10,
  className,
  style,
}: FuelGaugeProps) {
  const clampedLiters = Math.min(Math.max(0, currentLiters), tankCapacity);
  const percentage = tankCapacity > 0 ? Math.round((clampedLiters / tankCapacity) * 100) : 0;
  const variant = getFuelVariant(percentage);
  const statusLabel = getFuelStatusLabel(percentage);

  const range =
    estimatedRange !== undefined
      ? estimatedRange
      : Math.round((clampedLiters / consumptionRate) * 100);

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {/* Header row */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.icon} aria-hidden="true">⛽</span>
          <span className={styles.title}>Fuel</span>
          <span className={classNames(styles.statusBadge, styles[`status${variant.charAt(0).toUpperCase()}${variant.slice(1)}`])}>
            {statusLabel}
          </span>
        </div>
        {showLiters && (
          <div className={styles.litersLabel}>
            <span className={classNames(styles.litersValue, styles[`text${variant.charAt(0).toUpperCase()}${variant.slice(1)}`])}>
              {clampedLiters.toFixed(1)}
            </span>
            <span className={styles.litersSeparator}>/</span>
            <span className={styles.capacityValue}>{tankCapacity.toFixed(1)} L</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className={styles.barWrapper}>
        <ProgressBar
          value={percentage}
          variant={variant}
          height={barHeight}
          showPercentage={false}
        />
        {/* Tick marks */}
        <div className={styles.ticks} aria-hidden="true">
          {[25, 50, 75].map((tick) => (
            <div
              key={tick}
              className={styles.tick}
              style={{ left: `${tick}%` }}
            />
          ))}
        </div>
      </div>

      {/* Footer row */}
      <div className={styles.footer}>
        <span className={styles.percentageLabel}>{percentage}%</span>
        {showRange && (
          <div className={styles.rangeRow}>
            <span className={styles.rangeIcon} aria-hidden="true">🏍️</span>
            <span className={styles.rangeValue}>{range.toLocaleString()} km</span>
            <span className={styles.rangeLabel}>est. range</span>
          </div>
        )}
      </div>
    </div>
  );
}
