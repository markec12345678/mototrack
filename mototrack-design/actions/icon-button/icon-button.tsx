import React from 'react';
import classNames from 'classnames';
import styles from './icon-button.module.scss';

export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonVariant = 'ghost' | 'filled' | 'danger';

export type IconButtonProps = {
  /**
   * The icon to render inside the button.
   * Pass any React node — typically an SVG icon component.
   */
  icon: React.ReactNode;

  /**
   * Visual variant of the button.
   * - `ghost`: transparent background, subtle hover
   * - `filled`: primary accent background
   * - `danger`: red destructive action
   */
  variant?: IconButtonVariant;

  /**
   * Size of the circular button.
   * - `sm`: 32px
   * - `md`: 40px
   * - `lg`: 48px
   */
  size?: IconButtonSize;

  /**
   * Accessible label for screen readers.
   */
  'aria-label'?: string;

  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;

  /**
   * Click handler.
   */
  onClick?: () => void;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;

  /**
   * Button type attribute.
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Whether the button is in an active/pressed state.
   */
  active?: boolean;

  /**
   * Optional tooltip title shown on hover.
   */
  title?: string;
};

export function IconButton({
  icon,
  variant = `ghost`,
  size = `md`,
  disabled = false,
  onClick,
  className,
  style,
  type = `button`,
  active = false,
  title,
  'aria-label': ariaLabel,
}: IconButtonProps) {
  return (
    <button
      type={type}
      title={title}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onClick?.()}
      style={style}
      className={classNames(
        styles.iconButton,
        styles[variant],
        styles[size],
        { [styles.active]: active },
        className
      )}
    >
      <span className={styles.iconWrap}>{icon}</span>
    </button>
  );
}
