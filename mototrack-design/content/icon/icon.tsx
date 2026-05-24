import React from 'react';
import classNames from 'classnames';
import styles from './icon.module.scss';

export type IconSize = `xs` | `sm` | `md` | `lg` | `xl` | `xxl`;

export type IconProps = {
  /**
   * The glyph to render — a string (e.g. emoji or unicode) or any React node (e.g. SVG).
   */
  glyph?: React.ReactNode;

  /**
   * Alternative to `glyph` — pass an SVG or other React node as children.
   */
  children?: React.ReactNode;

  /**
   * Size of the icon. Maps to a fixed pixel dimension.
   * @default 'md'
   */
  size?: IconSize;

  /**
   * Color override for the icon. Accepts any valid CSS color value.
   * Defaults to `currentColor` (inherits from parent).
   */
  color?: string;

  /**
   * Accessible label for the icon. When provided, the icon is announced by screen readers.
   */
  label?: string;

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Inline style overrides.
   */
  style?: React.CSSProperties;

  /**
   * Click handler.
   */
  onClick?: () => void;
};

const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export function Icon({
  glyph,
  children,
  size = `md`,
  color,
  label,
  className,
  style,
  onClick,
}: IconProps) {
  const px = SIZE_MAP[size];

  const inlineStyle: React.CSSProperties = {
    width: px,
    height: px,
    fontSize: px,
    ...(color ? { color } : {}),
    ...style,
  };

  return (
    <span
      className={classNames(styles.icon, styles[size], { [styles.clickable]: !!onClick }, className)}
      style={inlineStyle}
      role={label ? `img` : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      onClick={onClick ? () => onClick() : undefined}
    >
      {children ?? glyph}
    </span>
  );
}
