import React from 'react';
import classNames from 'classnames';
import styles from './flex.module.scss';

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
export type FlexJustify =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type ResponsiveValue<T> = T | { mobile?: T; tablet?: T; laptop?: T; desktop?: T };

export type FlexProps = {
  /**
   * Flex direction. Supports responsive object syntax.
   */
  direction?: ResponsiveValue<FlexDirection>;

  /**
   * Gap between children using spacing tokens. Supports responsive object syntax.
   */
  gap?: ResponsiveValue<FlexGap>;

  /**
   * Align items (cross-axis). Supports responsive object syntax.
   */
  align?: ResponsiveValue<FlexAlign>;

  /**
   * Justify content (main-axis). Supports responsive object syntax.
   */
  justify?: ResponsiveValue<FlexJustify>;

  /**
   * Flex wrap behaviour. Supports responsive object syntax.
   */
  wrap?: ResponsiveValue<FlexWrap>;

  /**
   * Whether the flex container should fill 100% of its parent width.
   */
  fullWidth?: boolean;

  /**
   * Whether the flex container should fill 100% of its parent height.
   */
  fullHeight?: boolean;

  /**
   * Whether to render the container as `inline-flex` instead of `flex`.
   */
  inline?: boolean;

  /**
   * HTML element to render as. Defaults to `div`.
   */
  as?: keyof React.JSX.IntrinsicElements;

  /**
   * Children to render inside the flex container.
   */
  children?: React.ReactNode;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline style overrides.
   */
  style?: React.CSSProperties;
};

const GAP_MAP: Record<FlexGap, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  xxl: 'var(--spacing-xxl)',
};

function resolveScalar<T>(value: T | undefined, fallback: T): T {
  return value !== undefined ? value : fallback;
}

function buildCSSVars(props: FlexProps): React.CSSProperties {
  const { direction, gap, align, justify, wrap } = props;

  const vars: Record<string, string> = {};

  function applyResponsive<T>(
    val: ResponsiveValue<T> | undefined,
    prefix: string,
    transform: (v: T) => string
  ) {
    if (val === undefined) return;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const rv = val as { mobile?: T; tablet?: T; laptop?: T; desktop?: T };
      if (rv.mobile !== undefined) vars[`${prefix}-mobile`] = transform(rv.mobile);
      if (rv.tablet !== undefined) vars[`${prefix}-tablet`] = transform(rv.tablet);
      if (rv.laptop !== undefined) vars[`${prefix}-laptop`] = transform(rv.laptop);
      if (rv.desktop !== undefined) vars[`${prefix}-desktop`] = transform(rv.desktop);
    } else {
      vars[`${prefix}-mobile`] = transform(val as T);
    }
  }

  applyResponsive(direction, '--flex-direction', (v) => v as string);
  applyResponsive(gap, '--flex-gap', (v) => GAP_MAP[v as FlexGap] ?? '0');
  applyResponsive(align, '--flex-align', (v) => v as string);
  applyResponsive(justify, '--flex-justify', (v) => v as string);
  applyResponsive(wrap, '--flex-wrap', (v) => v as string);

  return vars as React.CSSProperties;
}

/**
 * Flex layout primitive.
 *
 * A composable, mobile-first flex container with direction, gap, align,
 * justify, and wrap props. All layout props support responsive object syntax
 * `{ mobile, tablet, laptop, desktop }`.
 */
export function Flex({
  direction = 'row',
  gap = 'none',
  align,
  justify,
  wrap,
  fullWidth,
  fullHeight,
  inline,
  as = 'div',
  children,
  className,
  style,
}: FlexProps) {
  const Tag = as as keyof React.JSX.IntrinsicElements;

  const cssVars = buildCSSVars({ direction, gap, align, justify, wrap });

  const rootClass = classNames(
    styles.flex,
    inline && styles.inline,
    fullWidth && styles.fullWidth,
    fullHeight && styles.fullHeight,
    className
  );

  return (
    <Tag
      className={rootClass}
      style={{ ...cssVars, ...style }}
    >
      {children}
    </Tag>
  );
}
