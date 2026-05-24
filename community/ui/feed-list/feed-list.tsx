import * as React from 'react';
import classNames from 'classnames';
import { Avatar } from '@markec/mototrack-design.content.avatar';
import { CountryFlag } from '@markec/mototrack-design.hud.country-flag';
import type { CountryCode } from '@markec/mototrack-design.hud.country-flag';
import { useFeed } from '@markec/community.hooks.use-feed';
import type { FeedItem } from '@markec/community.entities.feed-item';
import styles from './feed-list.module.scss';

// ─── Time-ago helper ──────────────────────────────────────────────────────────

function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `just now`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

// ─── Payload parsers ──────────────────────────────────────────────────────────

function safeParsePayload(payload: string): Record<string, unknown> {
  try {
    return JSON.parse(payload) as Record<string, unknown>;
  } catch {
    return { text: payload };
  }
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ─── Kind badge ───────────────────────────────────────────────────────────────

function KindBadge({ kind }: { kind: string }) {
  const iconMap: Record<string, string> = {
    ride: `🏍️`,
    route: `🗺️`,
    achievement: `🏆`,
    comment: `💬`,
  };
  const classMap: Record<string, string> = {
    ride: styles.kindBadgeRide,
    route: styles.kindBadgeRoute,
    achievement: styles.kindBadgeAchievement,
    comment: styles.kindBadgeComment,
  };

  return (
    <span className={classNames(styles.kindBadge, classMap[kind] ?? styles.kindBadgeComment)}>
      {iconMap[kind] ?? `📌`}
    </span>
  );
}

// ─── Kind label ───────────────────────────────────────────────────────────────

function kindActionLabel(kind: string): string {
  const labels: Record<string, string> = {
    ride: `completed a ride`,
    route: `shared a route`,
    achievement: `unlocked an achievement`,
    comment: `left a comment`,
  };
  return labels[kind] ?? `posted an update`;
}

// ─── Payload: Ride ────────────────────────────────────────────────────────────

function RidePayload({ data }: { data: Record<string, unknown> }) {
  const km = typeof data.km === `number` ? data.km : 0;
  const durationMin = typeof data.durationMin === `number` ? data.durationMin : 0;
  const title = typeof data.title === `string` ? data.title : `Ride`;

  return (
    <div className={classNames(styles.payloadCard, styles.payloadRide)}>
      <span className={styles.payloadRideIcon}>🏍️</span>
      <div>
        <p className={styles.payloadRideTitle}>{title}</p>
        <div className={styles.payloadRideStats}>
          <div className={styles.payloadStat}>
            <span className={styles.payloadStatValue}>{km} km</span>
            <span className={styles.payloadStatLabel}>Distance</span>
          </div>
          <div className={styles.payloadStat}>
            <span className={styles.payloadStatValue}>{formatDuration(durationMin)}</span>
            <span className={styles.payloadStatLabel}>Duration</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Payload: Route ───────────────────────────────────────────────────────────

function RoutePayload({ data }: { data: Record<string, unknown> }) {
  const name = typeof data.name === `string` ? data.name : `Route`;
  const distanceKm = typeof data.distanceKm === `number` ? data.distanceKm : 0;
  const difficulty = typeof data.difficulty === `string` ? data.difficulty : `medium`;

  const difficultyClass: Record<string, string> = {
    easy: styles.difficultyEasy,
    medium: styles.difficultyMedium,
    hard: styles.difficultyHard,
  };

  return (
    <div className={classNames(styles.payloadCard, styles.payloadRoute)}>
      <span className={styles.payloadRouteIcon}>🗺️</span>
      <div>
        <p className={styles.payloadRouteName}>{name}</p>
        <div className={styles.payloadRouteDetails}>
          <span className={styles.payloadStatValue}>{distanceKm} km</span>
          <span className={classNames(styles.difficultyBadge, difficultyClass[difficulty] ?? styles.difficultyMedium)}>
            {difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Payload: Achievement ─────────────────────────────────────────────────────

function AchievementPayload({ data }: { data: Record<string, unknown> }) {
  const name = typeof data.name === `string` ? data.name : `Achievement`;
  const icon = typeof data.icon === `string` ? data.icon : `🏆`;
  const description = typeof data.description === `string` ? data.description : ``;

  return (
    <div className={classNames(styles.payloadCard, styles.payloadAchievement)}>
      <span className={styles.achievementIcon}>{icon}</span>
      <div>
        <p className={styles.achievementName}>{name}</p>
        {description && <p className={styles.achievementDesc}>{description}</p>}
      </div>
    </div>
  );
}

// ─── Payload: Comment ─────────────────────────────────────────────────────────

function CommentPayload({ data }: { data: Record<string, unknown> }) {
  const text = typeof data.text === `string` ? data.text : ``;

  return (
    <div className={classNames(styles.payloadCard, styles.payloadComment)}>
      <p className={styles.commentText}>&ldquo;{text}&rdquo;</p>
    </div>
  );
}

// ─── Payload dispatcher ───────────────────────────────────────────────────────

function FeedPayload({ kind, payload }: { kind: string; payload: string }) {
  const data = safeParsePayload(payload);

  if (kind === `ride`) return <RidePayload data={data} />;
  if (kind === `route`) return <RoutePayload data={data} />;
  if (kind === `achievement`) return <AchievementPayload data={data} />;
  if (kind === `comment`) return <CommentPayload data={data} />;
  return null;
}

// ─── Single feed item ─────────────────────────────────────────────────────────

type FeedItemCardProps = {
  item: FeedItem;
  index: number;
};

function FeedItemCard({ item, index }: FeedItemCardProps) {
  const validCountryCodes = [`SI`, `HR`, `BA`, `ME`, `RS`, `MK`, `AL`, `BG`, `RO`, `GR`];
  const isValidCountry = (code: string): code is CountryCode => validCountryCodes.includes(code);
  const countryCode = isValidCountry(item.actor.country) ? item.actor.country : null;

  return (
    <article
      className={styles.feedItem}
      style={{ animationDelay: `${index * 40}ms` } as React.CSSProperties}
    >
      <div className={styles.avatarWrapper}>
        <Avatar name={item.actor.displayName} size="md" />
        <KindBadge kind={item.kind} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.actorRow}>
            <span className={styles.actorName}>{item.actor.displayName}</span>
            {countryCode && (
              <CountryFlag code={countryCode} size="sm" showLabel={false} />
            )}
            <span className={styles.kindLabel}>{kindActionLabel(item.kind)}</span>
          </div>
          <time className={styles.timeAgo} dateTime={new Date(item.at).toISOString()}>
            {formatTimeAgo(item.at)}
          </time>
        </div>

        <FeedPayload kind={item.kind} payload={item.payload} />
      </div>
    </article>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function FeedSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={styles.skeletonList}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeletonItem}>
          <div className={styles.skeletonAvatar} />
          <div className={styles.skeletonBody}>
            <div className={classNames(styles.skeletonLine, styles.skeletonLineMedium)} />
            <div className={classNames(styles.skeletonLine, styles.skeletonLineFull)} />
            <div className={classNames(styles.skeletonLine, styles.skeletonLineShort)} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type FeedListProps = {
  /**
   * Override feed items — used for testing or static rendering.
   * When omitted, the component fetches live data via useFeed.
   */
  items?: FeedItem[];

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

// ─── Main component ───────────────────────────────────────────────────────────

export function FeedList({ items: itemsProp, className, style }: FeedListProps) {
  const { feed, loading, error } = useFeed({ mockData: itemsProp });

  const items = feed ?? [];

  if (loading) {
    return <FeedSkeleton count={5} />;
  }

  if (error) {
    return (
      <div className={classNames(styles.errorState, className)} style={style}>
        <span className={styles.errorIcon}>⚠️</span>
        <p className={styles.errorText}>Failed to load feed. Please try again later.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={classNames(styles.emptyState, className)} style={style}>
        <span className={styles.emptyIcon}>🏍️</span>
        <p className={styles.emptyTitle}>No activity yet</p>
        <p className={styles.emptySubtitle}>Be the first to log a ride or share a route!</p>
      </div>
    );
  }

  return (
    <div className={classNames(styles.feedList, className)} style={style}>
      {items.map((item, index) => (
        <FeedItemCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
