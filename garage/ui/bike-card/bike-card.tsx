import React from 'react';
import classNames from 'classnames';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import styles from './bike-card.module.scss';

export type BikeCardBike = {
  id: string;
  name: string;
  model: string;
  year: number;
  mileageKm: number;
  tankL: number;
  consumptionLPer100: number;
  currentFuelL: number;
  color: string;
  primary: boolean;
};

export type BikeCardProps = {
  /**
   * The bike data to display.
   */
  bike: BikeCardBike;

  /**
   * Called when the Edit action is triggered.
   */
  onEdit?: (id: string) => void;

  /**
   * Called when the Set Primary action is triggered.
   */
  onSetPrimary?: (id: string) => void;

  /**
   * Additional class name for the card root element.
   */
  className?: string;

  /**
   * Inline styles for the card root element.
   */
  style?: React.CSSProperties;
};

function StarIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M5 1l1.12 2.27L9 3.64 7 5.59l.47 2.73L5 7.02 2.53 8.32 3 5.59 1 3.64l2.88-.37L5 1z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1l1.5 4.5H13L9.5 8l1.5 4.5L7 10l-4 2.5L4.5 8 1 5.5h4.5L7 1z" />
    </svg>
  );
}

const DEFAULT_BIKE: BikeCardBike = {
  id: `ktm-890`,
  name: `KTM 890 Adventure`,
  model: `890 Adventure`,
  year: 2023,
  mileageKm: 12450,
  tankL: 20,
  consumptionLPer100: 5.2,
  currentFuelL: 14,
  color: `#f97316`,
  primary: true,
};

export function BikeCard({
  bike = DEFAULT_BIKE,
  onEdit,
  onSetPrimary,
  className,
  style,
}: BikeCardProps) {
  const fuelPct = Math.round((bike.currentFuelL / bike.tankL) * 100);
  const rangeKm = Math.round((bike.currentFuelL * 100) / bike.consumptionLPer100);

  const fuelBarColor =
    fuelPct >= 50
      ? `var(--colors-status-success-default)`
      : fuelPct >= 25
      ? `var(--colors-status-warning-default)`
      : `var(--colors-status-danger-default)`;

  return (
    <div
      className={classNames(styles.card, className)}
      style={{ '--bike-color': bike.color, ...style } as React.CSSProperties}
    >
      {/* Colored top border accent */}
      <div className={styles.colorBar} />

      {/* Header row */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Heading level={4} size="md" color="primary">
            {bike.name}
          </Heading>
          <Paragraph variant="caption" color="muted">
            {bike.model} &middot; {bike.year}
          </Paragraph>
        </div>
        {bike.primary && (
          <Badge variant="accent" label="Primary" size="sm" icon={<StarIcon />} />
        )}
      </div>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <Paragraph variant="label" color="muted">
            Mileage
          </Paragraph>
          <div className={styles.statValue}>
            <span className={styles.statNumber}>
              {bike.mileageKm.toLocaleString()}
            </span>
            <span className={styles.statUnit}>km</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <Paragraph variant="label" color="muted">
            Consumption
          </Paragraph>
          <div className={styles.statValue}>
            <span className={styles.statNumber}>
              {bike.consumptionLPer100.toFixed(1)}
            </span>
            <span className={styles.statUnit}>L/100</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <Paragraph variant="label" color="muted">
            Range
          </Paragraph>
          <div className={styles.statValue}>
            <span className={styles.statNumber}>{rangeKm}</span>
            <span className={styles.statUnit}>km</span>
          </div>
        </div>
      </div>

      {/* Fuel bar */}
      <div className={styles.fuelSection}>
        <div className={styles.fuelHeader}>
          <Paragraph variant="label" color="muted">
            Fuel
          </Paragraph>
          <Paragraph variant="caption" color="secondary">
            {bike.currentFuelL.toFixed(1)} / {bike.tankL} L &nbsp;&middot;&nbsp; {fuelPct}%
          </Paragraph>
        </div>
        <div className={styles.fuelTrack}>
          <div
            className={styles.fuelFill}
            style={{ width: `${fuelPct}%`, backgroundColor: fuelBarColor }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => onEdit?.(bike.id)}
        >
          <EditIcon />
          <span>Edit</span>
        </button>
        {!bike.primary && (
          <button
            type="button"
            className={classNames(styles.actionBtn, styles.actionBtnPrimary)}
            onClick={() => onSetPrimary?.(bike.id)}
          >
            <PinIcon />
            <span>Set Primary</span>
          </button>
        )}
      </div>
    </div>
  );
}
