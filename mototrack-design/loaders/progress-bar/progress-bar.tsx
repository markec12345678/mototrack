import React from 'react';
import classNames from 'classnames';
import styles from './progress-bar.module.scss';

export type ProgressBarVariant = 'accent' | 'success' | 'warning' | 'danger';

export type ProgressBarProps = {
  /**
   * Progress value between 0 and 100.
   * When undefined or omitted, the bar renders in indeterminate (animated stripes) mode.
   */
  value?: number;

  /**
   * Color variant of the progress bar fill.
   * @default 'accent'
   */
  variant?: ProgressBarVariant;

  /**
   * Optional label displayed above the bar (left-aligned) with an optional percentage on the right.
   */
  label?: string;

  /**
   * Show the numeric percentage value next to the label.
   * @default false
   */
  showPercentage?: boolean;

  /**
   * Height of the progress bar track in pixels.
   * @default 8
   */
  height?: number;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

const VARIANT_CLASS: Record<ProgressBarVariant, string> = {
  accent: styles.variantAccent,
  success: styles.variantSuccess,
  warning: styles.variantWarning,
  danger: styles.variantDanger,
};

export function ProgressBar({
  value,
  variant = `accent`,
  label,
  showPercentage = false,
  height = 8,
  className,
  style,
}: ProgressBarProps) {
  const isIndeterminate = value === undefined || value === null;
  const clampedValue = isIndeterminate ? 0 : Math.min(100, Math.max(0, value));

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {(label || showPercentage) && (
        <div className={styles.labelRow}>
          {label && <span className={styles.label}>{label}</span>}
          {showPercentage && !isIndeterminate && (
            <span className={styles.percentage}>{clampedValue}%</span>
          )}
          {showPercentage && isIndeterminate && (
            <span className={styles.percentage}>—</span>
          )}
        </div>
      )}

      <div
        className={styles.track}
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={classNames(
            styles.fill,
            VARIANT_CLASS[variant],
            { [styles.indeterminate]: isIndeterminate }
          )}
          style={isIndeterminate ? undefined : { width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
