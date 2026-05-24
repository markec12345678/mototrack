import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Logo } from '@markec/mototrack-design.content.logo';
import { UserBar } from '@markec/mototrack-platform.composites.user-bar';
import { type HeaderAction } from './header-action-type.js';
import styles from './header.module.scss';

export type HeaderProps = {
  /**
   * Array of header action slot items (SOS button, MotoChat trigger, notifications, etc.).
   * Rendered in center/right area. On mobile, collapsed into a 3-dot menu.
   */
  headerActions?: HeaderAction[];

  /**
   * URL for the profile page link passed to UserBar.
   */
  profileHref?: string;

  /**
   * URL for the settings page link passed to UserBar.
   */
  settingsHref?: string;

  /**
   * URL for the login page passed to UserBar.
   */
  loginHref?: string;

  /**
   * URL for the signup page passed to UserBar.
   */
  signupHref?: string;

  /**
   * Optional avatar image URL override passed to UserBar.
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

const DEFAULT_HEADER_ACTIONS: HeaderAction[] = [
  {
    key: `sos`,
    label: `SOS`,
    icon: `🚨`,
    order: 1,
  },
  {
    key: `motochat`,
    label: `MotoChat`,
    icon: `💬`,
    order: 2,
  },
  {
    key: `notifications`,
    label: `Notifications`,
    icon: `🔔`,
    order: 3,
  },
];

function ThreeDotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="4" cy="9" r="1.5" fill="currentColor" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      <circle cx="14" cy="9" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

type ActionButtonProps = {
  action: HeaderAction;
  compact?: boolean;
};

function ActionButton({ action, compact = false }: ActionButtonProps) {
  if (action.component) {
    const ActionComponent = action.component;
    return <ActionComponent />;
  }

  const isSos = action.key === `sos`;

  return (
    <button
      type="button"
      className={classNames(styles.actionButton, {
        [styles.sosButton]: isSos,
        [styles.actionButtonCompact]: compact,
      })}
      onClick={() => action.onClick?.()}
      aria-label={action.label}
      title={action.label}
    >
      <span className={styles.actionIcon}>{action.icon}</span>
      {!compact && <span className={styles.actionLabel}>{action.label}</span>}
    </button>
  );
}

export function Header({
  headerActions = DEFAULT_HEADER_ACTIONS,
  profileHref = `/profile`,
  settingsHref = `/settings`,
  loginHref = `/login`,
  signupHref = `/signup`,
  avatarSrc,
  className,
  style,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const sortedActions = [...headerActions].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const sosAction = sortedActions.find((a) => a.key === `sos`);
  const otherActions = sortedActions.filter((a) => a.key !== `sos`);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener(`mousedown`, handleClickOutside);
    return () => document.removeEventListener(`mousedown`, handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header className={classNames(styles.header, className)} style={style}>
      <div className={styles.inner}>
        {/* ── Left: Logo ─────────────────────────────────────────── */}
        <div className={styles.logoArea}>
          <Logo size="sm" href="/" />
        </div>

        {/* ── Center/Right: Desktop actions ──────────────────────── */}
        <div className={styles.actionsArea}>
          {sortedActions.map((action) => (
            <ActionButton key={action.key} action={action} />
          ))}
        </div>

        {/* ── Mobile: SOS always visible + 3-dot menu ────────────── */}
        <div className={styles.mobileActions}>
          {sosAction && (
            <ActionButton key={sosAction.key} action={sosAction} compact />
          )}

          {otherActions.length > 0 && (
            <div className={styles.mobileMenuWrapper}>
              <button
                ref={triggerRef}
                type="button"
                className={classNames(styles.menuTrigger, { [styles.menuTriggerActive]: mobileMenuOpen })}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Open actions menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <CloseIcon /> : <ThreeDotsIcon />}
              </button>

              {mobileMenuOpen && (
                <div ref={menuRef} className={styles.mobileDropdown} role="menu">
                  <div className={styles.mobileDropdownInner}>
                    {otherActions.map((action) => (
                      <button
                        key={action.key}
                        type="button"
                        className={styles.mobileDropdownItem}
                        onClick={() => {
                          action.onClick?.();
                          setMobileMenuOpen(false);
                        }}
                        role="menuitem"
                      >
                        <span className={styles.mobileDropdownIcon}>{action.icon}</span>
                        <span className={styles.mobileDropdownLabel}>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Far Right: UserBar ─────────────────────────────────── */}
        <div className={styles.userBarArea}>
          <UserBar
            profileHref={profileHref}
            settingsHref={settingsHref}
            loginHref={loginHref}
            signupHref={signupHref}
            avatarSrc={avatarSrc}
          />
        </div>
      </div>
    </header>
  );
}
