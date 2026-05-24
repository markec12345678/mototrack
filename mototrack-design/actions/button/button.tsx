import React from 'react';
import classNames from 'classnames';
import { Link } from '@markec/mototrack-design.navigation.link';
import styles from './button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonProps = {
  /**
   * Visual variant of the button.
   * - `primary`: orange filled CTA button
   * - `secondary`: outlined with accent border
   * - `ghost`: transparent, text only
   * - `danger`: red destructive action
   * - `success`: green confirmation action
   */
  variant?: ButtonVariant;

  /**
   * Size of the button.
   */
  size?: ButtonSize;

  /**
   * Icon rendered to the left of the label.
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon rendered to the right of the label.
   */
  rightIcon?: React.ReactNode;

  /**
   * When provided, renders the button as a Link navigating to this URL.
   */
  href?: string;

  /**
   * Whether the link is external (opens in new tab). Only used when `href` is set.
   */
  external?: boolean;

  /**
   * Shows a spinner and disables interaction.
   */
  loading?: boolean;

  /**
   * Stretches the button to fill its container width.
   */
  fullWidth?: boolean;

  /**
   * Disables the button.
   */
  disabled?: boolean;

  /**
   * Button label / children.
   */
  children?: React.ReactNode;

  /**
   * Click handler.
   */
  onClick?: () => void;

  /**
   * Native button type attribute.
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;

  /**
   * Aria label for accessibility.
   */
  'aria-label'?: string;
};

/**
 * MotoTrack Button component.
 * Supports primary (orange), secondary (outlined), ghost, danger, and success variants.
 * Sizes: sm, md, lg, xl. Optional left/right icons, loading state, full-width, and href (renders as Link).
 */
export function Button({
  variant = `primary`,
  size = `md`,
  leftIcon,
  rightIcon,
  href,
  external = false,
  loading = false,
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  type = `button`,
  className,
  style,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonClassName = classNames(
    styles.button,
    styles[variant],
    styles[size],
    {
      [styles.fullWidth]: fullWidth,
      [styles.loading]: loading,
      [styles.disabled]: isDisabled,
    },
    className
  );

  const content = (
    <>
      {loading && (
        <span className={styles.spinner} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.spinnerIcon}
          >
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="28"
              strokeDashoffset="10"
            />
          </svg>
        </span>
      )}
      {!loading && leftIcon && (
        <span className={styles.iconLeft} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children && <span className={styles.label}>{children}</span>}
      {!loading && rightIcon && (
        <span className={styles.iconRight} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link
        href={href}
        external={external}
        variant="button"
        className={buttonClassName}
        style={style}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClassName}
      style={style}
      onClick={() => !isDisabled && onClick?.()}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {content}
    </button>
  );
}
