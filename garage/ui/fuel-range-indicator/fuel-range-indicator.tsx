import { useState, useCallback } from 'react';
import type { CSSProperties } from 'react';
import classNames from 'classnames';
import { FuelGauge } from '@markec/mototrack-design.hud.fuel-gauge';
import { useFuelRange, type FuelRange } from '@markec/garage.hooks.use-fuel-range';
// @ts-ignore
import styles from './fuel-range-indicator.module.scss';

export type FuelRangeData = FuelRange;

export type FuelRangeIndicatorProps = {
  /**
   * Override fuel data — useful for testing or static previews.
   */
  mockData?: FuelRangeData;

  /**
   * Called when the user clicks the "najdi črpalko" action button.
   */
  onFindStation?: () => void;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: CSSProperties;
};

function getStatusClass(status: 'ok' | 'warn' | 'empty'): string {
  if (status === 'ok') return styles.statusOk;
  if (status === 'warn') return styles.statusWarn;
  return styles.statusEmpty;
}

function getPercentClass(status: 'ok' | 'warn' | 'empty'): string {
  if (status === 'ok') return styles.percentOk;
  if (status === 'warn') return styles.percentWarn;
  return styles.percentEmpty;
}

export function FuelRangeIndicator({
  mockData,
  onFindStation,
  className,
  style,
}: FuelRangeIndicatorProps) {
  const [expanded, setExpanded] = useState(false);

  const hookData = useFuelRange(undefined, { mockData });

  const { tankL, currentFuelL, rangeKm, percent, status } = hookData;

  const handlePillClick = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleFindStation = useCallback(() => {
    if (onFindStation) {
      onFindStation();
    }
    setExpanded(false);
  }, [onFindStation]);

  const handleClose = useCallback(() => {
    setExpanded(false);
  }, []);

  return (
    <div
      className={classNames(styles.root, { [styles.rootExpanded]: expanded }, className)}
      style={style}
    >
      {!expanded && (
        <button
          type="button"
          className={classNames(styles.pill, getStatusClass(status))}
          onClick={handlePillClick}
          aria-label={`Gorivo: ${percent}%, doseg: ${rangeKm} km. Klikni za podrobnosti.`}
        >
          <span className={styles.pillIcon} aria-hidden="true">⛽</span>
          <span className={classNames(styles.pillPercent, getPercentClass(status))}>
            {percent}%
          </span>
          <span className={styles.pillDivider} aria-hidden="true" />
          <span className={styles.pillRange}>
            <span className={styles.pillRangeValue}>{rangeKm}</span>
            <span className={styles.pillRangeUnit}>km</span>
          </span>
          {status !== 'ok' && (
            <span className={classNames(styles.pillDot, getStatusClass(status))} aria-hidden="true" />
          )}
        </button>
      )}

      {expanded && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleRow}>
              <span className={styles.panelIcon} aria-hidden="true">⛽</span>
              <span className={styles.panelTitle}>Gorivo &amp; doseg</span>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={handleClose}
              aria-label="Zapri"
            >
              ✕
            </button>
          </div>

          <div className={styles.gaugeWrapper}>
            <FuelGauge
              currentLiters={currentFuelL}
              tankCapacity={tankL}
              estimatedRange={rangeKm}
              barHeight={10}
            />
          </div>

          {status !== 'ok' && (
            <div className={classNames(styles.warningBanner, {
              [styles.warningWarn]: status === 'warn',
              [styles.warningEmpty]: status === 'empty',
            })}>
              <span className={styles.warningIcon} aria-hidden="true">
                {status === 'warn' ? '⚠️' : '🚨'}
              </span>
              <span className={styles.warningText}>
                {status === 'warn'
                  ? `Nizko gorivo — priporočamo točenje`
                  : `Gorivo skoraj prazno — takoj poišči črpalko`}
              </span>
            </div>
          )}

          <button
            type="button"
            className={styles.findStationBtn}
            onClick={handleFindStation}
          >
            <span className={styles.findStationIcon} aria-hidden="true">📍</span>
            Najdi črpalko
          </button>
        </div>
      )}
    </div>
  );
}
