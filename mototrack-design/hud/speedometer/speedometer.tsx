import React from 'react';
import classNames from 'classnames';
import styles from './speedometer.module.scss';

export type SpeedometerSize = 'compact' | 'normal' | 'driving-mode';

export type SpeedometerProps = {
  /**
   * Current speed value in km/h.
   */
  speed?: number;

  /**
   * Display size variant.
   * - compact: 60px font — for status bars
   * - normal: 120px font — default dashboard view
   * - driving-mode: 240px font — full-screen HUD
   */
  size?: SpeedometerSize;

  /**
   * Speed threshold (km/h) at which the color shifts from green → amber.
   * Amber starts at warningThreshold, red starts at warningThreshold * 1.4.
   */
  warningThreshold?: number;

  /**
   * Show the "km/h" unit label below the number.
   */
  showUnit?: boolean;

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

function getColorState(speed: number, warningThreshold: number): 'green' | 'amber' | 'red' {
  if (speed >= warningThreshold * 1.4) return 'red';
  if (speed >= warningThreshold) return 'amber';
  return 'green';
}

export function Speedometer({
  speed = 0,
  size = 'normal',
  warningThreshold = 120,
  showUnit = true,
  className,
  style,
}: SpeedometerProps) {
  const colorState = getColorState(speed, warningThreshold);
  const displaySpeed = Math.max(0, Math.round(speed));

  return (
    <div
      className={classNames(
        styles.speedometer,
        styles[size],
        styles[colorState],
        className
      )}
      style={style}
    >
      <span className={styles.digits}>
        {displaySpeed}
      </span>
      {showUnit && (
        <span className={styles.unit}>km/h</span>
      )}
    </div>
  );
}
