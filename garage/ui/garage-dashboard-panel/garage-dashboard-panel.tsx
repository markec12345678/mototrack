import React from 'react';
import classNames from 'classnames';
import { Card } from '@markec/mototrack-design.content.card';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Link } from '@markec/mototrack-design.navigation.link';
import { useBikes } from '@markec/garage.hooks.use-bikes';
import { useMaintenance } from '@markec/garage.hooks.use-maintenance';
import styles from './garage-dashboard-panel.module.scss';

export type MaintenanceStatus = 'ok' | 'warn' | 'danger';

export type MaintenanceItemData = {
  id: string;
  name: string;
  intervalKm: number;
  intervalDays: number;
  lastServiceKm: number;
  lastServiceAt: number;
};

export type BikeData = {
  id: string;
  name: string;
  mileageKm: number;
  primary: boolean;
};

export type GarageDashboardPanelProps = {
  /**
   * Override bikes data (used for testing / compositions).
   */
  bikes?: BikeData[];

  /**
   * Override maintenance items data (used for testing / compositions).
   */
  maintenanceItems?: MaintenanceItemData[];

  /**
   * Link to the full maintenance page.
   */
  maintenanceHref?: string;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

function deriveStatus(item: MaintenanceItemData, mileageKm: number): MaintenanceStatus {
  const kmUsed = mileageKm - item.lastServiceKm;
  const daysUsed = (Date.now() - item.lastServiceAt) / 86400000;
  const ratio = Math.max(kmUsed / item.intervalKm, daysUsed / item.intervalDays);
  if (ratio < 0.5) return 'ok';
  if (ratio < 1) return 'warn';
  return 'danger';
}

function WrenchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.5 1.5a3 3 0 0 1 0 4.243L4.243 10.5A3 3 0 1 1 .757 7.014L6 1.757A3 3 0 0 1 9.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="2.5" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M5 1L9.33 8.5H0.67L5 1Z" />
      <rect x="4.4" y="4.2" width="1.2" height="2.4" rx="0.4" fill="white" />
      <rect x="4.4" y="7.2" width="1.2" height="1.2" rx="0.4" fill="white" />
    </svg>
  );
}

function DangerIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="2" y1="2" x2="8" y2="8" />
      <line x1="8" y1="2" x2="2" y2="8" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <WrenchIcon />
      </div>
      <Paragraph variant="body" color="secondary">
        Vsa vzdrževanja so v redu.
      </Paragraph>
    </div>
  );
}

function LoadingState() {
  return (
    <div className={styles.loadingState}>
      {[0, 1, 2].map((i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );
}

type PanelContentProps = {
  bikeName: string;
  items: Array<{ item: MaintenanceItemData; status: MaintenanceStatus }>;
  maintenanceHref: string;
};

function PanelContent({ bikeName, items, maintenanceHref }: PanelContentProps) {
  const alertItems = items.filter(({ status }) => status === 'warn' || status === 'danger');

  return (
    <div className={styles.content}>
      <div className={styles.bikeRow}>
        <div className={styles.bikeIndicator} />
        <Paragraph variant="caption" color="muted">
          {bikeName}
        </Paragraph>
      </div>

      {alertItems.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className={styles.itemList}>
          {alertItems.map(({ item, status }) => (
            <li key={item.id} className={classNames(styles.itemRow, styles[status])}>
              <div className={styles.itemLeft}>
                <div className={classNames(styles.statusDot, styles[`dot-${status}`])} />
                <Paragraph variant="body" color="primary" className={styles.itemName}>
                  {item.name}
                </Paragraph>
              </div>
              <Badge
                variant={status === 'danger' ? 'danger' : 'warning'}
                label={status === 'danger' ? 'Prekoračeno' : 'Kmalu'}
                size="sm"
                icon={status === 'danger' ? <DangerIcon /> : <AlertIcon />}
              />
            </li>
          ))}
        </ul>
      )}

      <div className={styles.footer}>
        <Link href={maintenanceHref} variant="subtle">
          Vsa vzdrževanja →
        </Link>
      </div>
    </div>
  );
}

export function GarageDashboardPanel({
  bikes: bikesProp,
  maintenanceItems: maintenanceItemsProp,
  maintenanceHref = `/maintenance`,
  className,
  style,
}: GarageDashboardPanelProps) {
  const bikesHook = useBikes();
  const resolvedBikes: BikeData[] = bikesProp ?? (bikesHook.bikes as BikeData[]) ?? [];
  const primaryBike = resolvedBikes.find((b) => b.primary) ?? resolvedBikes[0];

  const maintenanceHook = useMaintenance(primaryBike?.id ?? ``);
  const resolvedItems: MaintenanceItemData[] =
    maintenanceItemsProp ?? ((maintenanceHook as any).items ?? (maintenanceHook as any).list?.() ?? []) as MaintenanceItemData[];

  const loading = !bikesProp && !maintenanceItemsProp && (bikesHook.loading || maintenanceHook.loading);

  const itemsWithStatus = resolvedItems.map((item) => ({
    item,
    status: deriveStatus(item, primaryBike?.mileageKm ?? 0),
  }));

  const alertCount = itemsWithStatus.filter(
    ({ status }) => status === 'warn' || status === 'danger'
  ).length;

  return (
    <Card variant="default" padding="none" className={classNames(styles.panel, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.iconWrap}>
            <WrenchIcon />
          </div>
          <Heading level={5} size="sm" color="primary">
            Vzdrževanje
          </Heading>
        </div>
        {alertCount > 0 && (
          <span className={styles.alertBadge}>{alertCount}</span>
        )}
      </div>

      <div className={styles.divider} />

      {loading ? (
        <LoadingState />
      ) : (
        <PanelContent
          bikeName={primaryBike?.name ?? `—`}
          items={itemsWithStatus}
          maintenanceHref={maintenanceHref}
        />
      )}
    </Card>
  );
}
