import React from 'react';
import classNames from 'classnames';
import { Button } from '@markec/mototrack-design.actions.button';
import styles from './deviation-alert.module.scss';

export type DeviationState = 'on-track' | 'minor' | 'moderate' | 'lost';

export type DeviationAlertProps = {
  /**
   * Current deviation state that drives the color escalation and label.
   * - `on-track`  → green pill
   * - `minor`     → yellow pill
   * - `moderate`  → orange pill
   * - `lost`      → red pill + Recompute button
   */
  state?: DeviationState;

  /**
   * Deviation distance in metres. Shown inside the pill when > 0.
   */
  deviationMeters?: number;

  /**
   * Called when the user clicks the Recompute button (only visible in `lost` state).
   */
  onRecompute?: () => void;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

const STATE_LABELS: Record<DeviationState, string> = {
  'on-track': `On Track`,
  minor: `Minor Deviation`,
  moderate: `Off Route`,
  lost: `Route Lost`,
};

const STATE_ICONS: Record<DeviationState, React.ReactNode> = {
  'on-track': (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  minor: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 2v4M6 8.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  moderate: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 1.5L10.5 9.5H1.5L6 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 5v2M6 8.2v.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  lost: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 4l4 4M8 4L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

function RecomputeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M2 6.5A4.5 4.5 0 016.5 2a4.5 4.5 0 013.182 1.318"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M9.5 1.5v2.5H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M11 6.5A4.5 4.5 0 016.5 11a4.5 4.5 0 01-3.182-1.318"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M3.5 11.5V9H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * DeviationAlert — a small floating pill that escalates colour
 * (green → yellow → orange → red) based on the current deviation state.
 * When the state is `lost`, a Recompute button is shown alongside the pill.
 */
export function DeviationAlert({
  state = `on-track`,
  deviationMeters = 0,
  onRecompute,
  className,
  style,
}: DeviationAlertProps) {
  const label = STATE_LABELS[state];
  const icon = STATE_ICONS[state];
  const isLost = state === `lost`;

  const distanceLabel =
    deviationMeters > 0
      ? deviationMeters >= 1000
        ? `${(deviationMeters / 1000).toFixed(1)} km`
        : `${Math.round(deviationMeters)} m`
      : null;

  return (
    <div className={classNames(styles.wrapper, className)} style={style}>
      <div className={classNames(styles.pill, styles[state === `on-track` ? `onTrack` : state])}>
        <span className={styles.iconSlot}>{icon}</span>
        <span className={styles.label}>{label}</span>
        {distanceLabel && <span className={styles.distance}>{distanceLabel}</span>}
        <span className={classNames(styles.dot, styles[`dot-${state === `on-track` ? `onTrack` : state}`])} />
      </div>

      {isLost && (
        <button
          type="button"
          className={styles.recomputeBtn}
          onClick={() => onRecompute?.()}
          aria-label="Recompute route"
        >
          <RecomputeIcon />
          <span>Recompute</span>
        </button>
      )}
    </div>
  );
}
