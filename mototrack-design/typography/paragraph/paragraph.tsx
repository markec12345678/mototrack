import React from 'react';
import classNames from 'classnames';
import styles from './paragraph.module.scss';

export type ParagraphVariant = 'body' | 'caption' | 'label' | 'mono';
export type ParagraphColor = 'primary' | 'secondary' | 'muted';

export type ParagraphProps = {
  /**
   * Visual variant of the paragraph.
   * - `body`: standard readable body text
   * - `caption`: small supplementary text
   * - `label`: uppercase tracking label
   * - `mono`: monospace code-style text
   */
  variant?: ParagraphVariant;

  /**
   * Text color mapped to theme color tokens.
   * - `primary`: --colors-text-primary
   * - `secondary`: --colors-text-secondary
   * - `muted`: --colors-text-muted
   */
  color?: ParagraphColor;

  /**
   * Content to render inside the paragraph.
   */
  children?: React.ReactNode;

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

/**
 * Paragraph component for rendering body copy, captions, labels, and mono text.
 * Uses MotoTrack theme CSS variables for typography and color.
 */
export function Paragraph({
  variant = `body`,
  color = `primary`,
  children,
  className,
  style,
}: ParagraphProps) {
  return (
    <p
      className={classNames(
        styles.paragraph,
        styles[variant],
        styles[color],
        className
      )}
      style={style}
    >
      {children}
    </p>
  );
}
