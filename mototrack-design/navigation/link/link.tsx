import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './link.module.scss';

export type LinkVariant = 'default' | 'button' | 'subtle';

export type LinkProps = {
  /**
   * The URL or path the link points to.
   */
  href: string;

  /**
   * Visual variant of the link.
   * - `default`: styled inline text link with accent hover
   * - `button`: pill-shaped button-style link
   * - `subtle`: muted text, accent on hover
   */
  variant?: LinkVariant;

  /**
   * Whether the link opens in a new tab.
   * Automatically adds `rel="noopener noreferrer"` for security.
   */
  external?: boolean;

  /**
   * Child content rendered inside the link.
   */
  children?: React.ReactNode;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;

  /**
   * Click handler.
   */
  onClick?: () => void;

  /**
   * Aria label for accessibility.
   */
  'aria-label'?: string;
};

/**
 * Link component wrapping react-router-dom Link.
 * Supports external links (opens in new tab with `rel="noopener noreferrer"`).
 * Variants: default, button, subtle. Uses theme accent color on hover.
 */
export function Link({
  href = `/`,
  variant = `default`,
  external = false,
  children,
  className,
  style,
  onClick,
  'aria-label': ariaLabel,
}: LinkProps) {
  const linkClassName = classNames(
    styles.link,
    styles[variant],
    className
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
        style={style}
        onClick={() => onClick?.()}
        aria-label={ariaLabel}
      >
        {children}
        <span className={styles.externalIcon} aria-hidden="true">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 9L9 1M9 1H3M9 1V7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    );
  }

  return (
    <RouterLink
      to={href}
      className={linkClassName}
      style={style}
      onClick={() => onClick?.()}
      aria-label={ariaLabel}
    >
      {children}
    </RouterLink>
  );
}
