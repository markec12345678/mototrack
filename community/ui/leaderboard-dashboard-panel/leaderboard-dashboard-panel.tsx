import * as React from 'react';
import classNames from 'classnames';
import { Card } from '@markec/mototrack-design.content.card';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Link } from '@markec/mototrack-design.navigation.link';
import { useLeaderboard } from '@markec/community.hooks.use-leaderboard';
import { LeaderboardEntry } from '@markec/community.entities.leaderboard-entry';
import styles from './leaderboard-dashboard-panel.module.scss';

export type LeaderboardDashboardPanelProps = {
  /**
   * Period for the leaderboard. Defaults to 'weekly'.
   */
  period?: string;

  /**
   * Sort field for the leaderboard. Defaults to 'km'.
   */
  sortBy?: string;

  /**
   * Number of top entries to display. Defaults to 5.
   */
  limit?: number;

  /**
   * Link to the full leaderboard page.
   */
  fullLeaderboardHref?: string;

  /**
   * Optional mock entries for testing/compositions.
   */
  mockEntries?: LeaderboardEntry[];

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

const RANK_COLORS: Record<number, string> = {
  1: `var(--colors-flags-gold)`,
  2: `var(--colors-flags-silver)`,
  3: `var(--colors-flags-bronze)`,
};

type RankBadgeProps = { rank: number };

function RankBadge({ rank }: RankBadgeProps) {
  const color = RANK_COLORS[rank];
  return (
    <div
      className={classNames(styles.rankBadge, { [styles.rankBadgeTop]: rank <= 3 })}
      style={color ? { backgroundColor: color, color: `#020617` } : undefined}
    >
      {rank <= 3 ? (
        <span className={styles.rankMedal}>{rank === 1 ? `🥇` : rank === 2 ? `🥈` : `🥉`}</span>
      ) : (
        <span className={styles.rankNumber}>{rank}</span>
      )}
    </div>
  );
}

type KmBarProps = { km: number; maxKm: number };

function KmBar({ km, maxKm }: KmBarProps) {
  const pct = maxKm > 0 ? Math.round((km / maxKm) * 100) : 0;
  return (
    <div className={styles.kmBarTrack}>
      <div className={styles.kmBarFill} style={{ width: `${pct}%` }} />
    </div>
  );
}

type EntryRowProps = { entry: LeaderboardEntry; maxKm: number; isMe: boolean };

function EntryRow({ entry, maxKm, isMe }: EntryRowProps) {
  return (
    <div className={classNames(styles.entryRow, { [styles.entryRowMe]: isMe })}>
      <RankBadge rank={entry.rank} />
      <div className={styles.entryInfo}>
        <div className={styles.entryNameRow}>
          <span className={styles.entryName}>{entry.displayName}</span>
          {isMe && <span className={styles.meBadge}>You</span>}
          <span className={styles.entryCountry}>{entry.country}</span>
        </div>
        <KmBar km={entry.km} maxKm={maxKm} />
      </div>
      <div className={styles.entryStats}>
        <span className={styles.entryKm}>{entry.km.toLocaleString()}</span>
        <span className={styles.entryKmUnit}>km</span>
      </div>
    </div>
  );
}

type EntriesListProps = { entries: LeaderboardEntry[] };

function EntriesList({ entries }: EntriesListProps) {
  const maxKm = entries.length > 0 ? Math.max(...entries.map((e) => e.km)) : 1;
  return (
    <div className={styles.entriesList}>
      {entries.map((entry) => (
        <EntryRow key={entry.userId} entry={entry} maxKm={maxKm} isMe={entry.me ?? false} />
      ))}
    </div>
  );
}

type MockLeaderboardProps = { entries: LeaderboardEntry[]; limit: number };

function MockLeaderboard({ entries, limit }: MockLeaderboardProps) {
  const displayEntries = entries.slice(0, limit);
  if (displayEntries.length === 0) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🏁</span>
          <p className={styles.emptyText}>No riders yet this week</p>
        </div>
      </div>
    );
  }
  return <EntriesList entries={displayEntries} />;
}

type LiveLeaderboardProps = { period: string; sortBy: string; limit: number };

function LiveLeaderboard({ period, sortBy, limit }: LiveLeaderboardProps) {
  const { entries, loading, error } = useLeaderboard(period, sortBy);
  const displayEntries = (entries ?? []).slice(0, limit);

  if (loading) {
    return (
      <div className={styles.stateContainer}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className={styles.skeletonRow}>
            <div className={styles.skeletonBadge} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonName} />
              <div className={styles.skeletonBar} />
            </div>
            <div className={styles.skeletonKm} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorText}>Failed to load leaderboard</p>
        </div>
      </div>
    );
  }

  if (displayEntries.length === 0) {
    return (
      <div className={styles.stateContainer}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🏁</span>
          <p className={styles.emptyText}>No riders yet this week</p>
        </div>
      </div>
    );
  }

  return <EntriesList entries={displayEntries} />;
}

export function LeaderboardDashboardPanel({
  period = `weekly`,
  sortBy = `km`,
  limit = 5,
  fullLeaderboardHref = `/community/leaderboard`,
  mockEntries,
  className,
  style,
}: LeaderboardDashboardPanelProps) {
  return (
    <Card variant="elevated" padding="none" className={classNames(styles.panel, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>🏍️</div>
          <div>
            <Heading level={4} size="sm" color="primary" className={styles.title}>
              Weekly Leaderboard
            </Heading>
            <p className={styles.subtitle}>Top riders by kilometres this week</p>
          </div>
        </div>
        <div className={styles.periodBadge}>
          <span className={styles.periodDot} />
          <span className={styles.periodLabel}>This Week</span>
        </div>
      </div>

      <div className={styles.body}>
        {mockEntries !== undefined ? (
          <MockLeaderboard entries={mockEntries} limit={limit} />
        ) : (
          <LiveLeaderboard period={period} sortBy={sortBy} limit={limit} />
        )}
      </div>

      <div className={styles.footer}>
        <Link href={fullLeaderboardHref} variant="subtle" className={styles.footerLink}>
          View full leaderboard →
        </Link>
      </div>
    </Card>
  );
}
