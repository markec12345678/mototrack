import * as React from 'react';
import { useState, useCallback } from 'react';
import classNames from 'classnames';
import { useGeolocation } from '@markec/maps.hooks.use-geolocation';
import { useHazards } from '@markec/safety.hooks.use-hazards';
import { Modal } from '@markec/mototrack-design.overlays.modal';
import styles from './hazard-report-button.module.scss';
import { HazardType } from './hazard-type.js';

const DEFAULT_HAZARD_TYPES: HazardType[] = [
  { id: `landslide`, label: `Landslide`, emoji: `🏔️`, color: `#92400e` },
  { id: `construction`, label: `Construction`, emoji: `🚧`, color: `#d97706` },
  { id: `ice`, label: `Ice`, emoji: `🧊`, color: `#0ea5e9` },
  { id: `flood`, label: `Flood`, emoji: `🌊`, color: `#2563eb` },
  { id: `animal`, label: `Animal`, emoji: `🦌`, color: `#16a34a` },
  { id: `oil`, label: `Oil Spill`, emoji: `🛢️`, color: `#7c3aed` },
  { id: `pothole`, label: `Pothole`, emoji: `🕳️`, color: `#b45309` },
  { id: `camera`, label: `Camera`, emoji: `📷`, color: `#dc2626` },
];

export type HazardReportButtonProps = {
  /**
   * List of hazard types to display in the grid.
   */
  hazardTypes?: HazardType[];

  /**
   * Additional class name for the container.
   */
  className?: string;

  /**
   * Inline styles for the container.
   */
  style?: React.CSSProperties;

  /**
   * Callback fired after a hazard is successfully reported.
   */
  onReported?: (hazardId: string, hazardType: string) => void;
};

export function HazardReportButton({
  hazardTypes = DEFAULT_HAZARD_TYPES,
  className,
  style,
  onReported,
}: HazardReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reporting, setReporting] = useState<string | null>(null);
  const [successType, setSuccessType] = useState<string | null>(null);

  const { position } = useGeolocation();
  const { report } = useHazards();

  const handleOpen = useCallback(() => {
    setSuccessType(null);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setReporting(null);
    setSuccessType(null);
  }, []);

  const handleReport = useCallback(
    async (hazard: HazardType) => {
      if (reporting) return;
      setReporting(hazard.id);
      try {
        const lat = position?.lat ?? 43.85;
        const lng = position?.lng ?? 18.38;
        const result = await report({ type: hazard.id, lat, lng });
        setSuccessType(hazard.label);
        onReported?.(result?.id ?? hazard.id, hazard.id);
        setTimeout(() => {
          setOpen(false);
          setReporting(null);
          setSuccessType(null);
        }, 1400);
      } catch {
        setReporting(null);
      }
    },
    [reporting, position, report, onReported]
  );

  return (
    <div className={classNames(styles.overlay, className)} style={style}>
      <button
        type="button"
        className={styles.triggerButton}
        onClick={() => handleOpen()}
        aria-label="Report a road hazard"
        title="Report Hazard"
      >
        <span className={styles.triggerEmoji}>⚠️</span>
        <span className={styles.triggerLabel}>Report</span>
        <span className={styles.triggerPulse} />
      </button>

      <Modal
        open={open}
        onClose={() => handleClose()}
        title="Report a Hazard"
        size="sm"
      >
        <div className={styles.modalBody}>
          {successType ? (
            <div className={styles.successState}>
              <span className={styles.successIcon}>✅</span>
              <p className={styles.successTitle}>Hazard Reported!</p>
              <p className={styles.successSub}>
                {successType} reported at your current location.
              </p>
            </div>
          ) : (
            <>
              <p className={styles.modalHint}>
                Tap a hazard type to instantly report it at your current location.
              </p>
              <div className={styles.grid}>
                {hazardTypes.map((hazard) => {
                  const isLoading = reporting === hazard.id;
                  return (
                    <button
                      key={hazard.id}
                      type="button"
                      className={classNames(styles.tile, {
                        [styles.tileLoading]: isLoading,
                        [styles.tileDisabled]: reporting !== null && !isLoading,
                      })}
                      style={{ '--tile-color': hazard.color } as React.CSSProperties}
                      onClick={() => handleReport(hazard)}
                      disabled={reporting !== null}
                      aria-label={`Report ${hazard.label}`}
                    >
                      <span className={styles.tileEmoji}>{hazard.emoji}</span>
                      <span className={styles.tileLabel}>{hazard.label}</span>
                      {isLoading && <span className={styles.tileSpinner} />}
                    </button>
                  );
                })}
              </div>
              <p className={styles.locationNote}>
                📍 Reporting at{' '}
                {position
                  ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
                  : `current location`}
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
