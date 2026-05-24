import React, { useState } from 'react';
import classNames from 'classnames';
import { Slider } from '@markec/mototrack-design.inputs.slider';
import { Button } from '@markec/mototrack-design.actions.button';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { RoutePreview } from './route-preview.js';
import styles from './round-trip-config.module.scss';

export type Direction = 'clockwise' | 'counterclockwise';

export type RoundTripConfigProps = {
  /**
   * Initial target distance in km (20–300).
   */
  defaultDistance?: number;

  /**
   * Initial twistiness value (0–100).
   */
  defaultTwistiness?: number;

  /**
   * Initial direction of the round trip.
   */
  defaultDirection?: Direction;

  /**
   * Called when the user clicks Generate with the current config values.
   */
  onGenerate?: (config: { distanceKm: number; twistiness: number; direction: Direction }) => void;

  /**
   * Whether the generate action is loading.
   */
  loading?: boolean;

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
 * Round-Trip v2 config card.
 * Sliders for target distance (20–300 km) and twistiness (0–100).
 * Direction selector (clockwise / counterclockwise).
 * Mini SVG preview of a circular route.
 * Generate button.
 */
export function RoundTripConfig({
  defaultDistance = 120,
  defaultTwistiness = 60,
  defaultDirection = `clockwise`,
  onGenerate,
  loading = false,
  className,
  style,
}: RoundTripConfigProps) {
  const [distance, setDistance] = useState<number>(defaultDistance);
  const [twistiness, setTwistiness] = useState<number>(defaultTwistiness);
  const [direction, setDirection] = useState<Direction>(defaultDirection);

  const handleGenerate = () => {
    onGenerate?.({ distanceKm: distance, twistiness, direction });
  };

  return (
    <div className={classNames(styles.card, className)} style={style}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span className={styles.badgeLabel}>Round Trip v2</span>
        </div>
        <Heading level={3} size="lg" color="primary">
          Configure Your Route
        </Heading>
        <p className={styles.subtitle}>
          Set your preferences and generate a circular motorcycle route.
        </p>
      </div>

      {/* SVG Preview */}
      <div className={styles.previewWrapper}>
        <RoutePreview distance={distance} twistiness={twistiness} direction={direction} />
      </div>

      {/* Sliders */}
      <div className={styles.sliders}>
        <Slider
          label="Target Distance"
          min={20}
          max={300}
          step={5}
          value={distance}
          unit=" km"
          onChange={(v) => setDistance(v)}
        />
        <Slider
          label="Twistiness"
          min={0}
          max={100}
          step={1}
          value={twistiness}
          unit="%"
          onChange={(v) => setTwistiness(v)}
        />
      </div>

      {/* Direction Selector */}
      <div className={styles.directionSection}>
        <span className={styles.directionLabel}>Direction</span>
        <div className={styles.directionButtons}>
          <button
            type="button"
            className={classNames(styles.directionBtn, {
              [styles.directionBtnActive]: direction === `clockwise`,
            })}
            onClick={() => setDirection(`clockwise`)}
            aria-pressed={direction === `clockwise`}
          >
            <ClockwiseIcon active={direction === `clockwise`} />
            <span>Clockwise</span>
          </button>
          <button
            type="button"
            className={classNames(styles.directionBtn, {
              [styles.directionBtnActive]: direction === `counterclockwise`,
            })}
            onClick={() => setDirection(`counterclockwise`)}
            aria-pressed={direction === `counterclockwise`}
          >
            <CounterclockwiseIcon active={direction === `counterclockwise`} />
            <span>Counter-CW</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{distance}</span>
          <span className={styles.statUnit}>km</span>
          <span className={styles.statLabel}>Distance</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{twistiness}</span>
          <span className={styles.statUnit}>%</span>
          <span className={styles.statLabel}>Twistiness</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{Math.round((distance / 50) * 60)}</span>
          <span className={styles.statUnit}>min</span>
          <span className={styles.statLabel}>Est. Time</span>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        onClick={() => handleGenerate()}
        leftIcon={loading ? undefined : <GenerateIcon />}
      >
        {loading ? `Generating Route...` : `Generate Round Trip`}
      </Button>
    </div>
  );
}

// ── Inline icons ──────────────────────────────────────────────────────────────

function ClockwiseIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 2.5A6.5 6.5 0 1 1 2.5 9"
        stroke={active ? `#f97316` : `currentColor`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2.5 5.5V9H6"
        stroke={active ? `#f97316` : `currentColor`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CounterclockwiseIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 2.5A6.5 6.5 0 1 0 15.5 9"
        stroke={active ? `#f97316` : `currentColor`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15.5 5.5V9H12"
        stroke={active ? `#f97316` : `currentColor`}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GenerateIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.41 1.41M11.37 11.37l1.41 1.41M3.22 12.78l1.41-1.41M11.37 4.63l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
