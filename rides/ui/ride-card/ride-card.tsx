import React from 'react';
import styles from './ride-card.module.scss';

export type RideCardRide = {
  id: string;
  name?: string;
  startedAt: number;
  distanceKm: number;
  durationSec: number;
  maxSpeedKmh: number;
  twistinessScore?: number;
};

export type RideCardProps = {
  /** The ride to display. */
  ride: RideCardRide;
  /** Called when the card is clicked. */
  onClick?: (id: string) => void;
  /** Additional class name. */
  className?: string;
};

function formatTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('sl-SI', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Compact card showing a single ride summary — distance, duration, speed, twistiness.
 */
export function RideCard({ ride, onClick, className }: RideCardProps) {
  return (
    <div
      className={`${styles.card} ${className ?? ''}`}
      onClick={() => onClick?.(ride.id)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={styles.header}>
        <span className={styles.name}>{ride.name ?? 'Vožnja'}</span>
        <span className={styles.date}>{formatDate(ride.startedAt)}</span>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.val}>{ride.distanceKm.toFixed(1)}</span>
          <span className={styles.lbl}>km</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.val}>{formatTime(ride.durationSec)}</span>
          <span className={styles.lbl}>čas</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.val}>{Math.round(ride.maxSpeedKmh)}</span>
          <span className={styles.lbl}>max km/h</span>
        </div>
        {ride.twistinessScore !== undefined && (
          <div className={styles.stat}>
            <span className={styles.val}>{ride.twistinessScore.toFixed(1)}</span>
            <span className={styles.lbl}>twisty</span>
          </div>
        )}
      </div>
    </div>
  );
}
