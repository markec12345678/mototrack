import React from 'react';
import classNames from 'classnames';
import { useAchievements } from '@markec/community.hooks.use-achievements';
import { ProgressBar } from '@markec/mototrack-design.loaders.progress-bar';
import { Card } from '@markec/mototrack-design.content.card';
import type { AchievementProgress } from '@markec/community.entities.achievement';
import styles from './achievements-grid.module.scss';

export type AchievementsGridProps = {
  /**
   * Optional override achievements list (useful for testing / SSR).
   * When provided, the hook is not used for data.
   */
  achievements?: AchievementProgress[];

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

function CheckBadge() {
  return (
    <span className={styles.checkBadge} aria-label="Unlocked">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="7" r="7" fill="var(--colors-status-success-default)" />
        <path
          d="M3.5 7L5.8 9.5L10.5 4.5"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function LockIcon() {
  return (
    <svg
      className={styles.lockIcon}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Locked"
    >
      <rect x="3" y="7" width="10" height="7" rx="2" fill="currentColor" opacity="0.5" />
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function AchievementCard({ achievement }: { achievement: AchievementProgress }) {
  const { unlocked, name, description, icon, progressPct, unlockedAt } = achievement;

  const unlockedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString(undefined, { year: `numeric`, month: `short`, day: `numeric` })
    : null;

  return (
    <Card
      variant="elevated"
      padding="none"
      hoverLift
      className={classNames(styles.achievementCard, { [styles.locked]: !unlocked, [styles.unlocked]: unlocked })}
    >
      <div className={styles.cardInner}>
        <div className={classNames(styles.iconWrap, { [styles.iconWrapUnlocked]: unlocked })}>
          <span className={styles.iconEmoji} role="img" aria-label={name}>
            {icon}
          </span>
          {unlocked && <CheckBadge />}
          {!unlocked && <LockIcon />}
        </div>

        <div className={styles.textBlock}>
          <p className={styles.achievementName}>{name}</p>
          <p className={styles.achievementDesc}>{description}</p>
        </div>

        <div className={styles.footer}>
          {unlocked ? (
            <span className={styles.unlockedLabel}>
              {unlockedDate ? `Unlocked ${unlockedDate}` : `Unlocked`}
            </span>
          ) : (
            <ProgressBar
              value={Math.round(progressPct)}
              variant="accent"
              showPercentage
              height={6}
            />
          )}
        </div>
      </div>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonIcon} />
      <div className={styles.skeletonLine} />
      <div className={styles.skeletonLineShort} />
      <div className={styles.skeletonBar} />
    </div>
  );
}

type GridBodyProps = {
  achievements: AchievementProgress[];
  loading: boolean;
  error: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function AchievementsGridBody({ achievements, loading, error, className, style }: GridBodyProps) {
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>Your Progress</p>
          <h2 className={styles.title}>Achievements</h2>
        </div>
        {!loading && !error && (
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{unlocked.length}</span>
              <span className={styles.statLabel}>Unlocked</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{achievements.length}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
          </div>
        )}
      </div>

      {/* Overall progress bar */}
      {!loading && !error && achievements.length > 0 && (
        <div className={styles.overallProgress}>
          <ProgressBar
            value={Math.round((unlocked.length / achievements.length) * 100)}
            variant="success"
            label="Overall completion"
            showPercentage
            height={8}
          />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorText}>Failed to load achievements. Please try again.</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Unlocked section */}
      {!loading && !error && unlocked.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionDot} />
            <span className={styles.sectionTitle}>{`Unlocked (${unlocked.length})`}</span>
          </div>
          <div className={styles.grid}>
            {unlocked.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </section>
      )}

      {/* Locked section */}
      {!loading && !error && locked.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={classNames(styles.sectionDot, styles.sectionDotLocked)} />
            <span className={styles.sectionTitle}>{`Locked (${locked.length})`}</span>
          </div>
          <div className={styles.grid}>
            {locked.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!loading && !error && achievements.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🏆</span>
          <p className={styles.emptyTitle}>No achievements yet</p>
          <p className={styles.emptyDesc}>Start riding to earn your first achievement!</p>
        </div>
      )}
    </div>
  );
}

function AchievementsGridWithHook({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { achievements, loading, error } = useAchievements();
  return (
    <AchievementsGridBody
      achievements={achievements}
      loading={loading}
      error={!!error}
      className={className}
      style={style}
    />
  );
}

export function AchievementsGrid({ achievements: achievementsProp, className, style }: AchievementsGridProps) {
  if (achievementsProp !== undefined) {
    return (
      <AchievementsGridBody
        achievements={achievementsProp}
        loading={false}
        error={false}
        className={className}
        style={style}
      />
    );
  }
  return <AchievementsGridWithHook className={className} style={style} />;
}
