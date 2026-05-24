import { useMemo, type CSSProperties } from 'react';
import classNames from 'classnames';
import { MotoMap } from '@markec/maps.ui.moto-map';
import { useRideRecorder } from '@markec/rides.hooks.use-ride-recorder';
import { RideStatsPanel } from '@markec/rides.ui.ride-stats-panel';
import { StartRideControl } from '@markec/rides.ui.start-ride-control';
import { ElevationProfile } from '@markec/rides.ui.elevation-profile';
import { LatLng } from '@markec/maps.entities.lat-lng';
import type { ElevationPoint } from '@markec/rides.ui.elevation-profile';
import type { SafetyAlert } from './safety-alert-type.js';
import styles from './track-page.module.scss';

const DEFAULT_CENTER = LatLng.from({ lat: 43.8563, lng: 18.4131 });

export type TrackPageProps = {
  /**
   * Slot-registered SafetyAlert widgets rendered as a floating right column.
   */
  safetyAlerts?: SafetyAlert[];

  /**
   * Called after a ride is successfully saved.
   */
  onRideSaved?: (rideId: string) => void;

  /**
   * Called when the user discards a stopped ride without saving.
   */
  onRideDiscarded?: () => void;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: CSSProperties;
};

export function TrackPage({
  safetyAlerts = [],
  onRideSaved,
  onRideDiscarded,
  className,
  style,
}: TrackPageProps) {
  const recorder = useRideRecorder();

  const isRecording = recorder.status === `recording`;
  const isPaused = recorder.status === `paused`;
  const isActive = isRecording || isPaused;

  const rideTrack = useMemo(() => {
    const rawPoints = recorder.points as Array<{ lat: number; lng: number; ts: number; elevation?: number }>;
    return rawPoints
      .filter((p) => typeof p.lat === `number` && typeof p.lng === `number`)
      .map((p) => LatLng.from({ lat: p.lat, lng: p.lng }));
  }, [recorder.points]);

  const riderPosition = rideTrack.length > 0 ? rideTrack[rideTrack.length - 1] : undefined;

  const mapCenter = riderPosition ?? DEFAULT_CENTER;

  const elevationPoints = useMemo((): ElevationPoint[] => {
    const rawPoints = recorder.points as Array<{ lat: number; lng: number; ts: number; elevation?: number }>;
    const valid = rawPoints.filter(
      (p) => typeof p.lat === `number` && typeof p.lng === `number`
    );
    if (valid.length < 2) return [];

    let cumulativeKm = 0;
    return valid.map((p, idx) => {
      if (idx > 0) {
        const prev = valid[idx - 1];
        const dLat = p.lat - prev.lat;
        const dLng = p.lng - prev.lng;
        const R = 6371;
        const a =
          Math.sin((dLat * Math.PI) / 180) ** 2 +
          Math.cos((prev.lat * Math.PI) / 180) *
            Math.cos((p.lat * Math.PI) / 180) *
            Math.sin((dLng * Math.PI) / 180) ** 2;
        cumulativeKm += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      }
      return {
        elevation: p.elevation ?? 0,
        distanceKm: cumulativeKm,
      };
    });
  }, [recorder.points]);

  const progress = useMemo(() => {
    if (elevationPoints.length < 2) return 0;
    const total = elevationPoints[elevationPoints.length - 1].distanceKm;
    if (total === 0) return 0;
    return Math.min(1, recorder.distanceKm / total);
  }, [elevationPoints, recorder.distanceKm]);

  const sortedAlerts = useMemo(
    () => [...safetyAlerts].sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
    [safetyAlerts]
  );

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {/* ── Full-screen map ── */}
      <div className={styles.mapLayer}>
        <MotoMap
          center={mapCenter}
          zoom={14}
          rideTrack={isActive ? rideTrack : undefined}
          riderPosition={isActive ? riderPosition : undefined}
          className={styles.map}
        />
      </div>

      {/* ── Top HUD: ride stats panel ── */}
      {isActive && (
        <div className={styles.topHud}>
          <RideStatsPanel
            currentSpeedKmh={recorder.currentSpeedKmh ?? 0}
            distanceKm={recorder.distanceKm}
            durationSec={recorder.durationSec}
            maxSpeedKmh={recorder.maxSpeedKmh ?? 0}
            climbM={recorder.climbM}
            gpsAccuracyMeters={null}
            isRecording={isRecording}
          />
        </div>
      )}

      {/* ── Right column: safety alert slot widgets ── */}
      {sortedAlerts.length > 0 && (
        <div className={styles.safetyColumn}>
          {sortedAlerts.map((alert) => {
            const AlertComponent = alert.component;
            return (
              <div key={alert.key} className={styles.safetyWidget}>
                <AlertComponent />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Bottom strip: elevation profile ── */}
      {isActive && elevationPoints.length >= 2 && (
        <div className={styles.elevationStrip}>
          <ElevationProfile
            points={elevationPoints}
            progress={progress}
            climbM={recorder.climbM}
            descentM={0}
            height={72}
            showStats
            className={styles.elevationProfile}
          />
        </div>
      )}

      {/* ── Bottom center: start/stop ride control ── */}
      <div className={classNames(styles.rideControl, { [styles.rideControlActive]: isActive })}>
        <StartRideControl
          onRideSaved={(id) => onRideSaved?.(id)}
          onRideDiscarded={() => onRideDiscarded?.()}
        />
      </div>
    </div>
  );
}
