import React from 'react';
import classNames from 'classnames';
import styles from './page-layout.module.scss';

export type PageLayoutProps = {
  /**
   * Page content to render inside the layout column.
   */
  children?: React.ReactNode;

  /**
   * Maximum width of the page content area.
   * Accepts any valid CSS width value.
   * @default '1280px'
   */
  maxWidth?: string;

  /**
   * Horizontal and vertical padding applied to the content area.
   * Accepts any valid CSS padding shorthand.
   * @default 'var(--spacing-xl) var(--layout-gutter)'
   */
  padding?: string;

  /**
   * Gap between direct children of the layout column.
   * Accepts any valid CSS gap value.
   * @default 'var(--spacing-xl)'
   */
  gap?: string;

  /**
   * Horizontal alignment of the content column within the page.
   * @default 'center'
   */
  align?: 'left' | 'center' | 'right';

  /**
   * When true, the content column stretches to fill the full available width
   * (ignores maxWidth).
   * @default false
   */
  fluid?: boolean;

  /**
   * Additional class name applied to the outer wrapper.
   */
  className?: string;

  /**
   * Inline styles applied to the outer wrapper.
   */
  style?: React.CSSProperties;
};

/**
 * Page layout primitive — flex column, configurable max-width, padding, gap.
 * Used by feature pages. Does NOT include header or footer.
 */
export function PageLayout({
  children,
  maxWidth = `1280px`,
  padding = `var(--spacing-xl) var(--layout-gutter)`,
  gap = `var(--spacing-xl)`,
  align = `center`,
  fluid = false,
  className,
  style,
}: PageLayoutProps) {
  const marginInline =
    align === `center` ? `auto` : align === `right` ? `0 0 0 auto` : `0`;

  return (
    <div className={classNames(styles.wrapper, className)} style={style}>
      <div
        className={styles.column}
        style={{
          maxWidth: fluid ? `100%` : maxWidth,
          padding,
          gap,
          marginInline,
        }}
      >
        {children}
      </div>
    </div>
  );
}
