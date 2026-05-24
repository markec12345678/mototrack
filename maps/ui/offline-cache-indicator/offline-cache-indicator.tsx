import { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { useTileCache } from '@markec/maps.hooks.use-tile-cache';
import { Badge } from '@markec/mototrack-design.content.badge';
import { ProgressBar } from '@markec/mototrack-design.loaders.progress-bar';
import styles from './offline-cache-indicator.module.scss';

export type OfflineCacheIndicatorProps = {
  /**
   * Override the number of cached tiles (useful for testing/storybook).
   */
  tilesCached?: number;

  /**
   * Override the cached size in bytes (useful for testing/storybook).
   */
  bytes?: number;

  /**
   * Callback fired when the user clears the cache.
   */
  onCacheCleared?: () => void;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

function formatMb(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 0.1) return `<0.1 MB`;
  if (mb >= 1000) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb.toFixed(1)} MB`;
}

function computeReadiness(tiles: number, bytes: number): number {
  if (tiles === 0) return 0;
  const tileScore = Math.min(tiles / 5000, 1) * 60;
  const sizeScore = Math.min(bytes / (200 * 1024 * 1024), 1) * 40;
  return Math.round(tileScore + sizeScore);
}

function readinessVariant(score: number): 'success' | 'warning' | 'danger' | 'neutral' {
  if (score >= 70) return 'success';
  if (score >= 35) return 'warning';
  if (score > 0) return 'danger';
  return 'neutral';
}

function readinessLabel(score: number): string {
  if (score >= 70) return `Ready`;
  if (score >= 35) return `Partial`;
  if (score > 0) return `Low`;
  return `No cache`;
}

function DatabaseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <ellipse cx="7" cy="3.5" rx="5" ry="1.75" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 3.5v3.5c0 .97 2.24 1.75 5 1.75s5-.78 5-1.75V3.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 7v3.5c0 .97 2.24 1.75 5 1.75s5-.78 5-1.75V7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={classNames(styles.chevron, { [styles.chevronOpen]: open })}
    >
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M11.5 3.5l-.75 7.5a.5.5 0 0 1-.5.5h-6.5a.5.5 0 0 1-.5-.5L2.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WifiOffIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 1l10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M3.5 5.5A5.5 5.5 0 0 1 9.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M5.5 7.5A2.5 2.5 0 0 1 8 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="6" cy="10" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function OfflineCacheIndicator({
  tilesCached: tilesCachedProp,
  bytes: bytesProp,
  onCacheCleared,
  className,
  style,
}: OfflineCacheIndicatorProps) {
  const { getStats, clear } = useTileCache();
  const [expanded, setExpanded] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const hookStats = getStats();
  const tilesCached = tilesCachedProp ?? hookStats.tilesCached;
  const bytes = bytesProp ?? hookStats.bytes;
  const readiness = computeReadiness(tilesCached, bytes);
  const variant = readinessVariant(readiness);
  const mb = formatMb(bytes);

  useEffect(() => {
    if (!cleared) return;
    const t = setTimeout(() => setCleared(false), 2000);
    return () => clearTimeout(t);
  }, [cleared]);

  const handleToggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleClear = useCallback(async () => {
    setClearing(true);
    try {
      await clear();
      setCleared(true);
      onCacheCleared?.();
    } finally {
      setClearing(false);
    }
  }, [clear, onCacheCleared]);

  const progressVariant =
    variant === 'success'
      ? 'success'
      : variant === 'warning'
      ? 'warning'
      : variant === 'danger'
      ? 'danger'
      : 'accent';

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <button
        type="button"
        className={classNames(styles.pill, { [styles.pillExpanded]: expanded })}
        onClick={handleToggle}
        aria-expanded={expanded}
        aria-label="Offline cache status"
      >
        <span className={styles.pillIcon}>
          <DatabaseIcon />
        </span>

        <span className={styles.pillStats}>
          <span className={styles.stat}>
            <span className={styles.statValue}>{tilesCached.toLocaleString()}</span>
            <span className={styles.statLabel}>tiles</span>
          </span>
          <span className={styles.divider} />
          <span className={styles.stat}>
            <span className={styles.statValue}>{mb}</span>
          </span>
          <span className={styles.divider} />
          <span className={styles.stat}>
            <span className={classNames(styles.statValue, styles[`score-${variant}`])}>{readiness}</span>
            <span className={styles.statLabel}>/ 100</span>
          </span>
        </span>

        <span className={styles.pillBadge}>
          <Badge variant={variant} label={readinessLabel(readiness)} size="sm" />
        </span>

        <span className={styles.pillChevron}>
          <ChevronIcon open={expanded} />
        </span>
      </button>

      <div className={classNames(styles.panel, { [styles.panelOpen]: expanded })} aria-hidden={!expanded}>
        <div className={styles.panelInner}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Offline Cache</span>
            <span className={styles.offlineIcon}>
              <WifiOffIcon />
            </span>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statCardValue}>{tilesCached.toLocaleString()}</span>
              <span className={styles.statCardLabel}>Cached Tiles</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statCardValue}>{mb}</span>
              <span className={styles.statCardLabel}>Storage Used</span>
            </div>
            <div className={styles.statCard}>
              <span className={classNames(styles.statCardValue, styles[`score-${variant}`])}>{readiness}</span>
              <span className={styles.statCardLabel}>Readiness Score</span>
            </div>
          </div>

          <div className={styles.barSection}>
            <ProgressBar
              value={readiness}
              variant={progressVariant}
              label="Offline Readiness"
              showPercentage
              height={8}
            />
          </div>

          <p className={styles.infoText}>
            {tilesCached === 0
              ? `No tiles cached yet. Cache a route to enable offline maps.`
              : `${tilesCached.toLocaleString()} map tiles are stored locally for offline use.`}
          </p>

          <button
            type="button"
            className={classNames(styles.clearBtn, {
              [styles.clearBtnClearing]: clearing,
              [styles.clearBtnCleared]: cleared,
            })}
            onClick={() => { void handleClear(); }}
            disabled={clearing || tilesCached === 0}
          >
            <span className={styles.clearBtnIcon}>
              <TrashIcon />
            </span>
            <span>
              {cleared ? `Cache cleared!` : clearing ? `Clearing…` : `Clear Cache`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
