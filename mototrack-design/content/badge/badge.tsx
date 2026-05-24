import React from 'react';
import classNames from 'classnames';
import styles from './badge.module.scss';

export type BadgeVariant = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export type BadgeProps = {
  /**
   * The text label displayed inside the badge.
   */
  label: string;

  /**
   * Visual variant of the badge.
   */
  variant?: BadgeVariant;

  /**
   * Size of the badge.
   */
  size?: BadgeSize;

  /**
   * Optional icon component rendered before the label.
   */
  icon?: React.ReactNode;

  /**
   * Additional class name for the badge root element.
   */
  className?: string;

  /**
   * Inline styles for the badge root element.
   */
  style?: React.CSSProperties;
};

export function Badge({
  label = `Badge`,
  variant = 'neutral',
  size = 'md',
  icon,
  className,
  style,
}: BadgeProps) {
  return (
    <span
      className={classNames(
        styles.badge,
        styles[variant],
        styles[size],
        className
      )}
      style={style}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
    </span>
  );
}
