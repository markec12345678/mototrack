import React from 'react';
import classNames from 'classnames';
import styles from './card.module.scss';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'danger';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export type CardProps = {
  /**
   * Visual variant of the card.
   * - `default` — standard surface card with subtle border
   * - `elevated` — deeper background with a prominent shadow
   * - `outlined` — transparent background, strong border
   * - `danger` — danger-tinted background and border
   */
  variant?: CardVariant;

  /**
   * Internal padding of the card.
   */
  padding?: CardPadding;

  /**
   * When true, the card lifts slightly on hover with a scale + shadow transition.
   */
  hoverLift?: boolean;

  /**
   * Card content.
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
};

export function Card({
  variant = `default`,
  padding = `md`,
  hoverLift = false,
  children,
  className,
  style,
  onClick,
}: CardProps) {
  return (
    <div
      className={classNames(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        { [styles.hoverLift]: hoverLift, [styles.clickable]: !!onClick }
      )}
      style={style}
      onClick={onClick ? () => onClick() : undefined}
    >
      {children}
    </div>
  );
}
