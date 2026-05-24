import React from 'react';
import classNames from 'classnames';
import styles from './spinner.module.scss';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export type SpinnerProps = {
  /**
   * Size of the spinner. Defaults to 'md'.
   */
  size?: SpinnerSize;

  /**
   * Optional label rendered below the spinner.
   */
  label?: string;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * Loading spinner with optional label.
 * Supports sm / md / lg sizes.
 * Used in protected-route guards and async data loads.
 */
export function Spinner({
  size = `md`,
  label,
  className,
  style,
}: SpinnerProps) {
  return (
    <div
      className={classNames(styles.root, className)}
      style={style}
      role="status"
      aria-label={label ?? `Loading`}
    >
      <span
        className={classNames(styles.ring, styles[size])}
        aria-hidden
      >
        <span className={styles.track} />
        <span className={styles.arc} />
      </span>
      {label && (
        <span className={classNames(styles.label, styles[`label${size.toUpperCase()}`])}>
          {label}
        </span>
      )}
    </div>
  );
}
