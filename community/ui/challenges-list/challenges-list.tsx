import React from 'react';
import classNames from 'classnames';
import { ProgressBar } from '@markec/mototrack-design.loaders.progress-bar';
import { Button } from '@markec/mototrack-design.actions.button';
import { useChallenges } from '@markec/community.hooks.use-challenges';
import type { ChallengeItem } from './challenge-item-type.js';
import { mockChallenges } from './challenges-list.mock.js';
import styles from './challenges-list.module.scss';

export type ChallengesListProps = {
  /**
   * Override challenges data (useful for testing / SSR).
   * When omitted the hook fetches live data.
   */
  challenges?: ChallengeItem[];

  /**
   * Title shown above the list.
   */
  title?: string;

  /**
   * Subtitle shown below the title.
   */
  subtitle?: string;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

function formatTimeRemaining(endsAt: number): { label: string; urgency: `normal` | `warning` | `urgent` } {
  const msLeft = endsAt - Date.now();
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));

  if (msLeft <= 0) return { label: `Ended`, urgency: `urgent` };
  if (hoursLeft < 24) return { label: `${hoursLeft}h left`, urgency: `urgent` };
  if (daysLeft <= 3) return { label: `${daysLeft}d left`, urgency: `warning` };
  return { label: `${daysLeft} days left`, urgency: `normal` };
}

function ChallengeCard({
  challenge,
  onJoin,
}: {
  challenge: ChallengeItem;
  onJoin: (id: string) => void;
}) {
  const time = formatTimeRemaining(challenge.endsAt);

  const timeClass = classNames(styles.metaValue, {
    [styles.metaValueUrgent]: time.urgency === `urgent`,
    [styles.metaValueWarning]: time.urgency === `warning`,
  });

  return (
    <li className={classNames(styles.card, { [styles.cardJoined]: challenge.joined })}>
      {/* Top row: icon + info + XP */}
      <div className={styles.cardTop}>
        <div className={styles.iconWrapper} aria-label={challenge.name}>
          {challenge.icon}
        </div>

        <div className={styles.cardInfo}>
          <h3 className={styles.cardName}>{challenge.name}</h3>
          <p className={styles.cardDescription}>{challenge.description}</p>
        </div>

        <div className={styles.xpBadge}>
          <span className={styles.xpIcon}>⚡</span>
          <span className={styles.xpValue}>+{challenge.points} XP</span>
        </div>
      </div>

      {/* Meta: time + participants */}
      <div className={styles.metaRow}>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>⏱</span>
          <span className={styles.metaLabel}>Ends in:</span>
          <span className={timeClass}>{time.label}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}>👥</span>
          <span className={styles.metaLabel}>Riders:</span>
          <span className={styles.metaValue}>{challenge.participants.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress bar (only when joined) */}
      {challenge.joined && (
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Your progress</span>
            <span className={styles.progressValue}>{Math.round(challenge.progressPct ?? 0)}%</span>
          </div>
          <ProgressBar
            value={challenge.progressPct ?? 0}
            variant={
              (challenge.progressPct ?? 0) >= 80
                ? `success`
                : (challenge.progressPct ?? 0) >= 40
                ? `accent`
                : `warning`
            }
            height={8}
          />
        </div>
      )}

      {/* Footer: participants summary + join/joined */}
      <div className={styles.cardFooter}>
        <div className={styles.participantsInfo}>
          <span className={styles.participantsIcon}>🏍️</span>
          <span className={styles.participantsText}>
            <span className={styles.participantsCount}>{challenge.participants.toLocaleString()}</span>
            {` riders joined`}
          </span>
        </div>

        {challenge.joined ? (
          <div className={styles.joinedBadge}>
            <span className={styles.joinedIcon}>✓</span>
            Joined
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onJoin(challenge.id)}
          >
            Join Challenge
          </Button>
        )}
      </div>
    </li>
  );
}

function ChallengesListInner({
  challenges,
  title = `Active Challenges`,
  subtitle = `Complete challenges to earn XP and climb the leaderboard.`,
  className,
  style,
}: ChallengesListProps) {
  const { listActive, join, loading } = useChallenges();
  const active = listActive();

  const items: ChallengeItem[] = challenges ?? (active as ChallengeItem[] | undefined) ?? [];

  const handleJoin = (id: string) => {
    join(id);
  };

  if (loading && !challenges) {
    return (
      <div className={classNames(styles.root, className)} style={style}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.countBadge}>{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🏁</span>
          <p className={styles.emptyTitle}>No active challenges</p>
          <p className={styles.emptySubtitle}>Check back soon for new riding challenges.</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {items.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={handleJoin}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * ChallengesList displays active riding challenges with icon, name,
 * description, XP reward, progress bar, time remaining, and a Join button.
 */
export function ChallengesList(props: ChallengesListProps) {
  return <ChallengesListInner {...props} />;
}
