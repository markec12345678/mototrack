import React, { useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import styles from './tooltip.module.scss';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export type TooltipProps = {
  /**
   * The content to display inside the tooltip bubble.
   */
  content: string;

  /**
   * The element that triggers the tooltip on hover or focus.
   */
  children: React.ReactNode;

  /**
   * Position of the tooltip relative to the trigger element.
   * @default 'top'
   */
  position?: TooltipPosition;

  /**
   * Delay in milliseconds before the tooltip appears.
   * @default 150
   */
  delay?: number;

  /**
   * Additional class name for the tooltip wrapper.
   */
  className?: string;

  /**
   * Inline styles for the tooltip wrapper.
   */
  style?: React.CSSProperties;

  /**
   * Additional class name for the tooltip bubble.
   */
  tooltipClassName?: string;

  /**
   * Whether the tooltip is disabled.
   * @default false
   */
  disabled?: boolean;
};

export function Tooltip({
  content,
  children,
  position = `top`,
  delay = 150,
  className,
  style,
  tooltipClassName,
  disabled = false,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    if (disabled) return;
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [disabled, delay]);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  const positionClass = {
    top: styles.top,
    bottom: styles.bottom,
    left: styles.left,
    right: styles.right,
  }[position];

  return (
    <span
      className={classNames(styles.wrapper, className)}
      style={style}
      onMouseEnter={() => show()}
      onMouseLeave={() => hide()}
      onFocusCapture={() => show()}
      onBlurCapture={() => hide()}
    >
      {children}
      <span
        className={classNames(
          styles.tooltip,
          positionClass,
          { [styles.visible]: visible },
          tooltipClassName
        )}
        role="tooltip"
        aria-hidden={!visible}
      >
        {content}
        <span className={classNames(styles.arrow, positionClass)} />
      </span>
    </span>
  );
}
