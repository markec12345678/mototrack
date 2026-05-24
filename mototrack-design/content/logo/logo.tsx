import React from 'react';
import classNames from 'classnames';
import { Link } from '@markec/mototrack-design.navigation.link';
import styles from './logo.module.scss';

export type LogoSize = 'sm' | 'md' | 'lg';

export type LogoProps = {
  /**
   * Controls the overall scale of the logo.
   * sm = compact nav bar, md = default, lg = hero / splash.
   */
  size?: LogoSize;

  /**
   * Destination href for the home link.
   */
  href?: string;

  /**
   * Text shown in the accent tag pill next to the wordmark.
   */
  tag?: string;

  /**
   * Whether to show the tag pill.
   */
  showTag?: boolean;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles applied to the root element.
   */
  style?: React.CSSProperties;
};

/**
 * MotoTrack logo — 🏍️ icon + 'MotoTrack' wordmark + 'Balkan' accent tag pill.
 * Configurable size (sm / md / lg). Links to home via react-router-dom.
 * Uses theme accent color for the tag pill.
 */
export function Logo({
  size = `md`,
  href = `/`,
  tag = `Balkan`,
  showTag = true,
  className,
  style,
}: LogoProps) {
  return (
    <Link
      href={href}
      variant="default"
      className={classNames(styles.logo, styles[size], className)}
      style={style}
    >
      <span className={styles.icon} aria-hidden="true">🏍️</span>
      <span className={styles.wordmark}>
        <span className={styles.wordmarkMoto}>Moto</span>
        <span className={styles.wordmarkTrack}>Track</span>
      </span>
      {showTag && (
        <span className={styles.tag} aria-label={`${tag} edition`}>
          {tag}
        </span>
      )}
    </Link>
  );
}
