import React from 'react';
import classNames from 'classnames';
import { Avatar } from '@markec/mototrack-design.content.avatar';
import { Button } from '@markec/mototrack-design.actions.button';
import { Dropdown } from '@markec/mototrack-design.overlays.dropdown';
import { useAuth } from '@markec/mototrack-platform.hooks.use-auth';
import { type DropdownItem } from '@markec/mototrack-design.overlays.dropdown';
import styles from './user-bar.module.scss';

// ── Icons ──────────────────────────────────────────────────────────────────

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Avatar Trigger ─────────────────────────────────────────────────────────

type AvatarTriggerProps = {
  displayName: string;
  avatarSrc?: string;
  level: number;
  points: number;
};

function AvatarTrigger({ displayName, avatarSrc, level, points }: AvatarTriggerProps) {
  return (
    <div className={styles.avatarTrigger}>
      <div className={styles.avatarWrapper}>
        <Avatar name={displayName} src={avatarSrc} size="md" status="online" />
      </div>
      <div className={styles.triggerInfo}>
        <span className={styles.triggerName}>{displayName}</span>
        <div className={styles.triggerMeta}>
          <span className={styles.levelBadge}>Lv {level}</span>
          <span className={styles.triggerPoints}>{points.toLocaleString()} pts</span>
        </div>
      </div>
    </div>
  );
}

// ── Dropdown Header ────────────────────────────────────────────────────────

type DropdownHeaderProps = {
  displayName: string;
  username: string;
  level: number;
  points: number;
  avatarSrc?: string;
};

function DropdownHeader({ displayName, username, level, points, avatarSrc }: DropdownHeaderProps) {
  return (
    <div className={styles.dropdownHeader}>
      <div className={styles.dropdownAvatarRow}>
        <Avatar name={displayName} src={avatarSrc} size="lg" status="online" />
        <div className={styles.dropdownUserInfo}>
          <span className={styles.dropdownDisplayName}>{displayName}</span>
          <span className={styles.dropdownUsername}>@{username}</span>
        </div>
      </div>
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{level}</span>
          <span className={styles.statLabel}>Level</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statValue}>{points.toLocaleString()}</span>
          <span className={styles.statLabel}>Points</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <div className={styles.levelRing}>
            <span className={styles.levelRingText}>{level}</span>
          </div>
          <span className={styles.statLabel}>Rank</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export type UserBarProps = {
  /**
   * URL for the profile page link.
   */
  profileHref?: string;

  /**
   * URL for the settings page link.
   */
  settingsHref?: string;

  /**
   * URL for the login page.
   */
  loginHref?: string;

  /**
   * URL for the signup page.
   */
  signupHref?: string;

  /**
   * Optional avatar image URL override.
   */
  avatarSrc?: string;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles applied to the root element.
   */
  style?: React.CSSProperties;
};

/**
 * UserBar component.
 * Anonymous: Login + Signup buttons.
 * Authenticated: Avatar trigger + dropdown with displayName, level badge, points, profile, settings, logout.
 */
export function UserBar({
  profileHref = `/profile`,
  settingsHref = `/settings`,
  loginHref = `/login`,
  signupHref = `/signup`,
  avatarSrc,
  className,
  style,
}: UserBarProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div className={classNames(styles.userBar, className)} style={style}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className={classNames(styles.userBar, className)} style={style}>
        <Button variant="ghost" size="sm" href={loginHref}>
          Login
        </Button>
        <Button variant="primary" size="sm" href={signupHref}>
          Sign Up
        </Button>
      </div>
    );
  }

  const dropdownHeader = (
    <DropdownHeader
      displayName={user.displayName}
      username={user.username}
      level={user.level}
      points={user.points}
      avatarSrc={avatarSrc}
    />
  );

  const items: DropdownItem[] = [
    {
      key: `header`,
      label: ``,
      divider: false,
      disabled: true,
      icon: dropdownHeader,
      variant: `default`,
    },
    { key: `divider-top`, label: ``, divider: true },
    {
      key: `profile`,
      label: `View Profile`,
      icon: <UserIcon />,
      href: profileHref,
      variant: `default`,
    },
    {
      key: `settings`,
      label: `Settings`,
      icon: <SettingsIcon />,
      href: settingsHref,
      variant: `default`,
    },
    { key: `divider-bottom`, label: ``, divider: true },
    {
      key: `logout`,
      label: `Sign Out`,
      icon: <LogoutIcon />,
      variant: `danger`,
      onClick: () => logout(),
    },
  ];

  return (
    <div className={classNames(styles.userBar, className)} style={style}>
      <Dropdown
        trigger={
          <AvatarTrigger
            displayName={user.displayName}
            avatarSrc={avatarSrc}
            level={user.level}
            points={user.points}
          />
        }
        items={items}
        align="right"
        showChevron
      />
    </div>
  );
}
