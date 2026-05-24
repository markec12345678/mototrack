import React from 'react';
import classNames from 'classnames';
import styles from './heading.module.scss';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type HeadingColor = 'primary' | 'secondary' | 'accent' | 'danger';

export type HeadingProps = {
  /**
   * The semantic heading level (h1–h6). Defaults to 1.
   */
  level?: HeadingLevel;

  /**
   * Visual size variant. When omitted the size maps automatically from the level.
   */
  size?: HeadingSize;

  /**
   * Color variant using theme CSS variables.
   */
  color?: HeadingColor;

  /**
   * Heading text content.
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
};

const DEFAULT_SIZE_BY_LEVEL: Record<HeadingLevel, HeadingSize> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'md',
  6: 'sm',
};

export function Heading({
  level = 1,
  size,
  color = 'primary',
  children,
  className,
  style,
}: HeadingProps) {
  const resolvedSize = size ?? DEFAULT_SIZE_BY_LEVEL[level];
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  return (
    <Tag
      className={classNames(
        styles.heading,
        styles[`size-${resolvedSize}`],
        styles[`color-${color}`],
        className
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
