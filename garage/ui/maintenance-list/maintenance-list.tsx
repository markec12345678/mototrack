import React from 'react';
import classNames from 'classnames';
import { ProgressBar } from '@markec/mototrack-design.loaders.progress-bar';
import { Button } from '@markec/mototrack-design.actions.button';
import type { MaintenanceItem } from '@markec/garage.entities.maintenance-item';
import { useMaintenance } from '@markec/garage.hooks.use-maintenance';
import styles from './maintenance-list.module.scss';

export type MaintenanceStatus = `ok` | `warn` | `danger`;

export type MaintenanceListProps = {
  /**
   * The bike ID to load maintenance items for.
   */
  bikeId: string;

  /**
   * Current mileage of the bike in km. Used to compute progress.
   */
  currentMileageKm: number;

  /**
   * Optional override of maintenance items (useful for testing / SSR).
   */
  items?: MaintenanceItem[];

  /**
   * Called after a successful markServiced action.
   */
  onServiced?: (itemId: string) => void;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function deriveStatus(
  item: MaintenanceItem,
  currentMileageKm: number
): MaintenanceStatus {
  const kmUsed = currentMileageKm - item.lastServiceKm;
  const daysUsed = (Date.now() - item.lastServiceAt) / (1000 * 60 * 60 * 24);
  const ratio = Math.max(
    item.intervalKm > 0 ? kmUsed / item.intervalKm : 0,
    item.intervalDays > 0 ? daysUsed / item.intervalDays : 0
  );
  if (ratio < 0.5) return `ok`;
  if (ratio < 1) return `warn`;
  return `danger`;
}

function deriveProgressPercent(
  item: MaintenanceItem,
  currentMileageKm: number
): number {
  const kmUsed = currentMileageKm - item.lastServiceKm;
  const daysUsed = (Date.now() - item.lastServiceAt) / (1000 * 60 * 60 * 24);
  const kmRatio = item.intervalKm > 0 ? kmUsed / item.intervalKm : 0;
  const dayRatio = item.intervalDays > 0 ? daysUsed / item.intervalDays : 0;
  return Math.min(100, Math.round(Math.max(kmRatio, dayRatio) * 100));
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(`en-GB`, {
    day: `2-digit`,
    month: `short`,
    year: `numeric`,
  });
}

function formatKmRemaining(
  item: MaintenanceItem,
  currentMileageKm: number
): string {
  const kmUsed = currentMileageKm - item.lastServiceKm;
  const remaining = item.intervalKm - kmUsed;
  if (remaining <= 0) return `Overdue`;
  return `${Math.round(remaining).toLocaleString()} km`;
}

function formatDaysRemaining(item: MaintenanceItem): string {
  const daysUsed =
    (Date.now() - item.lastServiceAt) / (1000 * 60 * 60 * 24);
  const remaining = item.intervalDays - daysUsed;
  if (remaining <= 0) return `Overdue`;
  return `${Math.round(remaining)} days`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

type StatusDotProps = { status: MaintenanceStatus };

function StatusDot({ status }: StatusDotProps) {
  const dotClass = classNames(styles.statusDot, {
    [styles.dotOk]: status === `ok`,
    [styles.dotWarn]: status === `warn`,
    [styles.dotDanger]: status === `danger`,
  });
  return <span className={dotClass} aria-label={`Status: ${status}`} />;
}

type ProgressVariant = `success` | `warning` | `danger`;

function statusToVariant(status: MaintenanceStatus): ProgressVariant {
  if (status === `ok`) return `success`;
  if (status === `warn`) return `warning`;
  return `danger`;
}

type MaintenanceRowProps = {
  item: MaintenanceItem;
  currentMileageKm: number;
  onMarkServiced: (itemId: string) => void;
  servicing: boolean;
};

function MaintenanceRow({
  item,
  currentMileageKm,
  onMarkServiced,
  servicing,
}: MaintenanceRowProps) {
  const status = deriveStatus(item, currentMileageKm);
  const progress = deriveProgressPercent(item, currentMileageKm);
  const kmRemaining = formatKmRemaining(item, currentMileageKm);
  const daysRemaining = formatDaysRemaining(item);
  const lastServiceDate = formatDate(item.lastServiceAt);

  const rowClass = classNames(styles.row, {
    [styles.rowOk]: status === `ok`,
    [styles.rowWarn]: status === `warn`,
    [styles.rowDanger]: status === `danger`,
  });

  const remainingValueClass = classNames(styles.metaValue, {
    [styles.metaValueOk]: status === `ok`,
    [styles.metaValueWarn]: status === `warn`,
    [styles.metaValueDanger]: status === `danger`,
  });

  return (
    <div className={rowClass}>
      <div className={styles.rowTop}>
        <StatusDot status={status} />
        <span className={styles.name}>{item.name}</span>
      </div>

      <div className={styles.rowAction}>
        <Button
          variant={status === `danger` ? `danger` : status === `warn` ? `secondary` : `ghost`}
          size="sm"
          loading={servicing}
          onClick={() => onMarkServiced(item.id)}
        >
          Mark serviced
        </Button>
      </div>

      <div className={styles.rowProgress}>
        <ProgressBar
          value={progress}
          variant={statusToVariant(status)}
          label={`${progress}% used (${Math.round(currentMileageKm - item.lastServiceKm).toLocaleString()} km / ${Math.round((Date.now() - item.lastServiceAt) / (1000 * 60 * 60 * 24))} days)`}
          height={6}
        />
      </div>

      <div className={styles.rowMeta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Km left:</span>
          <span className={remainingValueClass}>{kmRemaining}</span>
        </div>
        <div className={styles.metaDivider} />
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Days left:</span>
          <span className={remainingValueClass}>{daysRemaining}</span>
        </div>
        <div className={styles.metaDivider} />
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Last service:</span>
          <span className={styles.metaValue}>{lastServiceDate}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * MaintenanceList displays all maintenance tasks for a bike.
 * Each row shows: name, status dot, progress bar (used vs interval),
 * km/days remaining, last service date, and a "Mark serviced" button.
 */
export function MaintenanceList({
  bikeId,
  currentMileageKm,
  items: itemsProp,
  onServiced,
  className,
  style,
}: MaintenanceListProps) {
  const [servicingId, setServicingId] = React.useState<string | null>(null);

  const maintenanceHook = useMaintenance(bikeId);
  const list = (maintenanceHook as any).list ?? maintenanceHook.items ?? [];
  const loading = maintenanceHook.loading;
  const error = maintenanceHook.error;
  const markServiced = (maintenanceHook as any).markServiced;

  // When itemsProp is explicitly provided (even as an empty array), use it
  // directly and bypass the hook's loading/error states entirely.
  const hasStaticItems = itemsProp !== undefined;
  const items = hasStaticItems ? itemsProp : (list ?? []);

  const handleMarkServiced = async (itemId: string) => {
    setServicingId(itemId);
    try {
      await markServiced(itemId, currentMileageKm, Date.now());
      onServiced?.(itemId);
    } finally {
      setServicingId(null);
    }
  };

  if (!hasStaticItems && loading && items.length === 0) {
    return (
      <div className={classNames(styles.root, className)} style={style}>
        <div className={styles.skeleton}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={styles.skeletonRow} />
          ))}
        </div>
      </div>
    );
  }

  if (!hasStaticItems && error) {
    return (
      <div className={classNames(styles.root, className)} style={style}>
        <div className={styles.error}>
          <span className={styles.errorText}>
            Failed to load maintenance data. Please try again.
          </span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={classNames(styles.root, className)} style={style}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔧</span>
          <p className={styles.emptyText}>No maintenance tasks found.</p>
        </div>
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => {
    const ra = deriveProgressPercent(a, currentMileageKm);
    const rb = deriveProgressPercent(b, currentMileageKm);
    return rb - ra;
  });

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <div className={styles.header}>
        <h2 className={styles.title}>Maintenance</h2>
        <span className={styles.count}>{items.length} tasks</span>
      </div>
      {sorted.map((item) => (
        <MaintenanceRow
          key={item.id}
          item={item}
          currentMileageKm={currentMileageKm}
          onMarkServiced={(id) => { void handleMarkServiced(id); }}
          servicing={servicingId === item.id}
        />
      ))}
    </div>
  );
}
