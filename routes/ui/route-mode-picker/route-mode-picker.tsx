import React from 'react';
import classNames from 'classnames';
import styles from './route-mode-picker.module.scss';

export type RouteMode = 'asfalt' | 'vijugasto' | 'terensko';

export type RouteModeOption = {
  mode: RouteMode;
  label: string;
  emoji: string;
};

export type RouteModePickerProps = {
  /**
   * Currently active route mode.
   */
  activeMode?: RouteMode;

  /**
   * Callback fired when the user selects a different mode.
   */
  onModeChange?: (mode: RouteMode) => void;

  /**
   * Override the default mode options.
   */
  options?: RouteModeOption[];

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_OPTIONS: RouteModeOption[] = [
  { mode: `asfalt`, label: `Asfalt`, emoji: `🛣️` },
  { mode: `vijugasto`, label: `Vijugasto`, emoji: `🌀` },
  { mode: `terensko`, label: `Terensko`, emoji: `🏔️` },
];

/**
 * Three-segment route mode picker for MotoTrack.
 * Modes: Asfalt (blue), Vijugasto (orange), Terensko (green).
 * The active segment is highlighted with a coloured outline matching its mode colour.
 */
export function RouteModePicker({
  activeMode = `asfalt`,
  onModeChange,
  options = DEFAULT_OPTIONS,
  className,
  style,
}: RouteModePickerProps) {
  return (
    <div
      className={classNames(styles.picker, className)}
      style={style}
      role="group"
      aria-label="Route mode"
    >
      {options.map((option) => {
        const isActive = option.mode === activeMode;
        return (
          <button
            key={option.mode}
            type="button"
            className={classNames(styles.segment, styles[option.mode], {
              [styles.active]: isActive,
            })}
            aria-pressed={isActive}
            onClick={() => onModeChange?.(option.mode)}
          >
            <span className={styles.emoji} aria-hidden="true">
              {option.emoji}
            </span>
            <span className={styles.label}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
