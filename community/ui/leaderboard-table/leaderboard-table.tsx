import React, { useState } from 'react';
import classNames from 'classnames';
import { Avatar } from '@markec/mototrack-design.content.avatar';
import { CountryFlag } from '@markec/mototrack-design.hud.country-flag';
import type { CountryCode } from '@markec/mototrack-design.hud.country-flag';
import { useLeaderboard } from '@markec/community.hooks.use-leaderboard';
import type { LeaderboardEntry } from '@markec/community.entities.leaderboard-entry';
import styles from './leaderboard-table.module.scss';

export type LeaderboardPeriod = 'week' | 'month' | 'alltime';
export type LeaderboardSortBy = 'points' | 'km' | 'rides';

const PERIOD_OPTIONS: { value: LeaderboardPeriod; label: string }[] = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'alltime', label: 'All Time' },
];

const SORT_OPTIONS: { value: LeaderboardSortBy; label: string }[] = [
  { value: 'points', label: 'Points' },
  { value: 'km', label: 'Distance' },
  { value: 'rides', label: 'Rides' },
];

const MEDAL_EMOJIS: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const BALKAN_COUNTRY_CODES = new Set([
  'SI', 'HR', 'BA', 'ME', 'RS', 'MK', 'AL', 'BG', 'RO', 'GR',
]);

function isBalkanCode(code: string): code is CountryCode {
  return BALKAN_COUNTRY_CODES.has(code.toUpperCase());
}

function formatKm(km: number): string {
  if (km >= 1000) return `${(km / 1000).toFixed(1)}k km`;
  return `${Math.round(km)} km`;
}

function formatPoints(points: number): string {
  if (points >= 1000) return `${(points / 1000).toFixed(1)}k`;
  return String(points);
}

export type LeaderboardTableProps = {
  /**
   * Initial period filter value.
   */
  defaultPeriod?: LeaderboardPeriod;

  /**
   * Initial sort-by value.
   */
  defaultSortBy?: LeaderboardSortBy;

  /**
   * Maximum number of rows to display.
   */
  limit?: number;

  /**
   * Override entries (useful for testing / SSR).
   */
  entries?: LeaderboardEntry[];

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

export function LeaderboardTable({
  defaultPeriod = `week`,
  defaultSortBy = `points`,
  limit = 20,
  entries: entriesProp,
  className,
  style,
}: LeaderboardTableProps) {
  const [period, setPeriod] = useState<LeaderboardPeriod>(defaultPeriod);
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>(defaultSortBy);

  const { entries: fetchedEntries, loading: hookLoading, error: hookError } = useLeaderboard(period, sortBy);

  // When entriesProp is explicitly provided (even as []), bypass the hook's
  // loading/error states so the empty state renders immediately.
  const hasEntriesProp = entriesProp !== undefined;
  const entries = hasEntriesProp ? entriesProp : (fetchedEntries ?? []);
  const loading = !hasEntriesProp && hookLoading;
  const error = !hasEntriesProp && !!hookError;
  const displayEntries = entries.slice(0, limit);

  return (
    <div className={classNames(styles.leaderboardTable, className)} style={style}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <span className={styles.titleIcon}>🏆</span>
          <div>
            <h2 className={styles.title}>Leaderboard</h2>
            <p className={styles.subtitle}>Top riders in the community</p>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.selectorGroup}>
            <span className={styles.selectorLabel}>Period</span>
            <div className={styles.selector}>
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={classNames(styles.selectorBtn, {
                    [styles.selectorBtnActive]: period === opt.value,
                  })}
                  onClick={() => setPeriod(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.selectorGroup}>
            <span className={styles.selectorLabel}>Sort by</span>
            <div className={styles.selector}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={classNames(styles.selectorBtn, {
                    [styles.selectorBtnActive]: sortBy === opt.value,
                  })}
                  onClick={() => setSortBy(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {/* Column headers */}
        <div className={styles.colHeaders}>
          <span className={styles.colRank}>#</span>
          <span className={styles.colRider}>Rider</span>
          <span className={styles.colKm}>Distance</span>
          <span className={styles.colRides}>Rides</span>
          <span className={styles.colPoints}>Points</span>
        </div>

        {/* Body */}
        <div className={styles.tableBody}>
          {loading && (
            <div className={styles.stateBox}>
              <div className={styles.spinner} />
              <span className={styles.stateText}>Loading riders…</span>
            </div>
          )}

          {error && (
            <div className={styles.stateBox}>
              <span className={styles.errorIcon}>⚠️</span>
              <span className={styles.stateText}>Failed to load leaderboard</span>
            </div>
          )}

          {!loading && !error && displayEntries.length === 0 && (
            <div className={styles.stateBox}>
              <span className={styles.stateText}>No riders found for this period.</span>
            </div>
          )}

          {displayEntries.map((entry, idx) => {
            const isMe = entry.me === true;
            const medal = MEDAL_EMOJIS[entry.rank];
            const countryUpper = (entry.country ?? '').toUpperCase();
            const isBalkan = isBalkanCode(countryUpper);

            return (
              <div
                key={entry.userId}
                className={classNames(styles.row, {
                  [styles.rowMe]: isMe,
                  [styles.rowTop1]: entry.rank === 1,
                  [styles.rowTop2]: entry.rank === 2,
                  [styles.rowTop3]: entry.rank === 3,
                  [styles.rowEven]: idx % 2 === 0,
                })}
              >
                {/* Rank */}
                <div className={styles.rankCell}>
                  {medal ? (
                    <span className={styles.medal}>{medal}</span>
                  ) : (
                    <span className={classNames(styles.rankNum, { [styles.rankNumMe]: isMe })}>
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* Rider info */}
                <div className={styles.riderCell}>
                  <Avatar name={entry.displayName} size="sm" />
                  <div className={styles.riderInfo}>
                    <span className={classNames(styles.riderName, { [styles.riderNameMe]: isMe })}>
                      {entry.displayName}
                      {isMe && <span className={styles.meBadge}>You</span>}
                    </span>
                    <span className={styles.riderCountry}>
                      {isBalkan ? (
                        <CountryFlag code={countryUpper as CountryCode} size="sm" />
                      ) : (
                        <span className={styles.countryText}>{entry.country}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Distance */}
                <div className={classNames(styles.dataCell, styles.kmCell)}>
                  <span className={styles.dataPrimary}>{formatKm(entry.km)}</span>
                </div>

                {/* Rides */}
                <div className={classNames(styles.dataCell, styles.ridesCell)}>
                  <span className={styles.dataPrimary}>{entry.rides}</span>
                </div>

                {/* Points */}
                <div className={classNames(styles.dataCell, styles.pointsCell)}>
                  <span className={classNames(styles.pointsValue, { [styles.pointsValueMe]: isMe })}>
                    {formatPoints(entry.points)}
                  </span>
                  <span className={styles.pointsUnit}>pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {displayEntries.length > 0 && (
        <div className={styles.footer}>
          <span className={styles.footerText}>
            Showing {displayEntries.length} of {entries.length} riders
          </span>
          <div className={styles.legend}>
            <span className={styles.legendItem}>🥇 Gold</span>
            <span className={styles.legendItem}>🥈 Silver</span>
            <span className={styles.legendItem}>🥉 Bronze</span>
          </div>
        </div>
      )}
    </div>
  );
}
