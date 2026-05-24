import * as React from 'react';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useCrosswind } from '@markec/weather.hooks.use-crosswind';
import { Heading } from '@markec/mototrack-design.typography.heading';
import styles from './crosswind-alert.module.scss';

export type CrosswindLevel = 'none' | 'moderate' | 'strong' | 'dangerous';

export type CrosswindAlertProps = {
  /**
   * Current heading of the rider in degrees (0–359).
   */
  headingDeg: number;

  /**
   * Override the crosswind level for testing or external control.
   * When provided, the hook result is ignored.
   */
  levelOverride?: CrosswindLevel;

  /**
   * Override the crosswind speed in km/h for display purposes.
   */
  crossKmhOverride?: number;

  /**
   * Additional class name applied to the overlay root.
   */
  className?: string;

  /**
   * Inline styles for the overlay root.
   */
  style?: React.CSSProperties;
};

const LEVEL_LABELS: Record<Exclude<CrosswindLevel, 'none'>, string> = {
  moderate: `Bočni veter`,
  strong: `Močan bočni veter`,
  dangerous: `USTAVI SE!`,
};

const LEVEL_SUBLABELS: Record<Exclude<CrosswindLevel, 'none'>, string> = {
  moderate: `Zmerni bočni veter — bodite previdni`,
  strong: `Nevarno — zmanjšajte hitrost`,
  dangerous: `Izjemno nevaren bočni veter!`,
};

/**
 * CrosswindAlert overlay component.
 *
 * Registered as a SafetyAlert. Hidden when level is `none`.
 * Color escalates: moderate (yellow) → strong (orange) → dangerous (red, full-screen flash).
 */
export function CrosswindAlert({
  headingDeg,
  levelOverride,
  crossKmhOverride,
  className,
  style,
}: CrosswindAlertProps) {
  const { crossKmh: hookCrossKmh, level: hookLevel } = useCrosswind(headingDeg);
  const [flashVisible, setFlashVisible] = useState(true);

  const level: CrosswindLevel = levelOverride ?? hookLevel;
  const crossKmh: number = crossKmhOverride ?? hookCrossKmh;

  useEffect(() => {
    if (level !== `dangerous`) {
      setFlashVisible(true);
      return;
    }

    const interval = setInterval(() => {
      setFlashVisible((prev) => !prev);
    }, 600);

    return () => clearInterval(interval);
  }, [level]);

  if (level === `none`) return null;

  const isDangerous = level === `dangerous`;
  const isStrong = level === `strong`;
  const isModerate = level === `moderate`;

  return (
    <div
      className={classNames(
        styles.overlay,
        {
          [styles.moderate]: isModerate,
          [styles.strong]: isStrong,
          [styles.dangerous]: isDangerous,
          [styles.flashHidden]: isDangerous && !flashVisible,
        },
        className
      )}
      style={style}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.content}>
        <div className={styles.iconRow}>
          <span className={styles.windIcon}>💨</span>
          {isDangerous && (
            <span className={styles.warningIcon}>⚠️</span>
          )}
        </div>

        <Heading
          level={isDangerous ? 1 : 2}
          size={isDangerous ? `3xl` : `xl`}
          className={classNames(styles.title, {
            [styles.titleDangerous]: isDangerous,
            [styles.titleStrong]: isStrong,
            [styles.titleModerate]: isModerate,
          })}
        >
          {LEVEL_LABELS[level as Exclude<CrosswindLevel, 'none'>]}
        </Heading>

        <p className={styles.sublabel}>
          {LEVEL_SUBLABELS[level as Exclude<CrosswindLevel, 'none'>]}
        </p>

        <div className={styles.speedBadge}>
          <span className={styles.speedValue}>{Math.round(crossKmh)}</span>
          <span className={styles.speedUnit}>km/h</span>
          <span className={styles.speedLabel}>bočni veter</span>
        </div>

        {isDangerous && (
          <div className={styles.pulseRing} />
        )}
      </div>
    </div>
  );
}
