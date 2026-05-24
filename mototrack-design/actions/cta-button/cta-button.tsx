import React from 'react';
import classNames from 'classnames';
import { Button } from '@markec/mototrack-design.actions.button';
import styles from './cta-button.module.scss';

export type CtaButtonVariant = 'sos' | 'start-ride' | 'save-route' | 'default';

export type CtaButtonProps = {
  /**
   * Semantic variant of the CTA button.
   * - `sos`: emergency red-orange gradient for SOS actions
   * - `start-ride`: vivid orange gradient for starting a ride
   * - `save-route`: amber-gold gradient for saving a route
   * - `default`: standard orange gradient CTA
   */
  variant?: CtaButtonVariant;

  /**
   * Button label text.
   */
  children?: React.ReactNode;

  /**
   * Icon rendered to the left of the label.
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon rendered to the right of the label.
   */
  rightIcon?: React.ReactNode;

  /**
   * When provided, renders the button as an anchor navigating to this URL.
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
 * Large CTA button for landing pages and primary actions.
 * Built on top of the base Button with bigger padding, orange gradient, and drop shadow.
 * Designed for high-impact actions: SOS, Start Ride, Save Route.
 */
export function CtaButton({
  variant = `default`,
  children,
  leftIcon,
  rightIcon,
  href,
  external = false,
  loading = false,
  fullWidth = false,
  disabled = false,
  onClick,
  type = `button`,
  className,
  style,
  'aria-label': ariaLabel,
}: CtaButtonProps) {
  return (
    <span
      className={classNames(
        styles.ctaWrapper,
        styles[variant],
        {
          [styles.fullWidth]: fullWidth,
          [styles.disabled]: disabled || loading,
        },
        className
      )}
      style={style}
    >
      <Button
        variant="primary"
        size="xl"
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        href={href}
        external={external}
        loading={loading}
        fullWidth={fullWidth}
        disabled={disabled}
        onClick={onClick}
        type={type}
        aria-label={ariaLabel}
        className={styles.ctaButton}
      >
        {children}
      </Button>
    </span>
  );
}
