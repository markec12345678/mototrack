import * as React from 'react';
import classNames from 'classnames';
import { Speedometer } from '@markec/mototrack-design.hud.speedometer';
import { GpsQualityIndicator } from '@markec/mototrack-design.hud.gps-quality-indicator';
import styles from './ride-stats-panel.module.scss';

export type RideStatsPanelProps = {
  /**
   * Current speed in km/h.
   */
  currentSpeedKmh?: number;

  /**
   * Total distance covered in km.
   */
  distanceKm?: number;

  /**
   * Elapsed duration in seconds.
   */
  durationSec?: number;

  /**
   * Maximum speed reached in km/h.
   */
  maxSpeedKmh?: number;

  /**
   * Total climb in meters.
   */
  climbM?: number;

  /**
   * Current elevation in meters.
   */
  elevationM?: number;

  /**
   * GPS accuracy in meters. Null means no fix.
   */
  gpsAccuracyMeters?: number | null;

  /**
   * Whether the recording is currently active.
   */
  isRecording?: boolean;

  /**
   * Speed warning threshold in km/h.
   */
  warningThreshold?: number;

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, `0`)}:${String(s).padStart(2, `0`)}`;
  }
  return `${String(m).padStart(2, `0`)}:${String(s).padStart(2, `0`)}`;
}

function formatDistance(km: number): string {
  if (km >= 100) return `${Math.round(km)} km`;
  return `${km.toFixed(1)} km`;
}

function formatElevation(m: number): string {
  return `${Math.round(m)} m`;
}

type StatItemProps = {
  label: string;
  value: string;
  accent?: boolean;
  className?: string;
};

function StatItem({ label, value, accent = false, className }: StatItemProps) {
  return (
    <div className={classNames(styles.statItem, { [styles.accent]: accent }, className)}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

export function RideStatsPanel({
  currentSpeedKmh = 0,
  distanceKm = 0,
  durationSec = 0,
  maxSpeedKmh = 0,
  climbM = 0,
  elevationM = 0,
  gpsAccuracyMeters = null,
  isRecording = false,
  warningThreshold = 120,
  className,
  style,
}: RideStatsPanelProps) {
  return (
    <div className={classNames(styles.panel, className)} style={style}>
      <div className={styles.header}>
        <div className={classNames(styles.recordingBadge, { [styles.recording]: isRecording })}>
          <span className={styles.recordingDot} />
          <span className={styles.recordingLabel}>{isRecording ? `REC` : `PAUSED`}</span>
        </div>
        <div className={styles.gpsRow}>
          <GpsQualityIndicator accuracyMeters={gpsAccuracyMeters} size={10} />
          <span className={styles.gpsLabel}>GPS</span>
        </div>
      </div>

      <div className={styles.speedometerWrapper}>
        <Speedometer
          speed={currentSpeedKmh}
          size="compact"
          warningThreshold={warningThreshold}
          showUnit
        />
      </div>

      <div className={styles.statsGrid}>
        <StatItem label="DIST" value={formatDistance(distanceKm)} />
        <StatItem label="TIME" value={formatDuration(durationSec)} />
        <StatItem label="MAX" value={`${Math.round(maxSpeedKmh)} km/h`} accent />
        <StatItem label="CLIMB" value={formatElevation(climbM)} />
        <StatItem label="ELEV" value={formatElevation(elevationM)} />
      </div>
    </div>
  );
}
