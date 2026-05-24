import React from 'react';
import classNames from 'classnames';
import styles from './toggle.module.scss';

export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleVariant = 'default' | 'success' | 'warning' | 'danger';

export type ToggleProps = {
  /**
   * Whether the toggle is currently on.
   */
  checked?: boolean;

  /**
   * Default checked state (uncontrolled).
   */
  defaultChecked?: boolean;

  /**
   * Called when the toggle value changes.
   */
  onChange?: (checked: boolean) => void;

  /**
   * Label text displayed next to the toggle.
   */
  label?: string;

  /**
   * Supplementary description shown below the label.
   */
  description?: string;

  /**
   * Icon displayed inside the toggle knob.
   */
  icon?: React.ReactNode;

  /**
   * Size variant of the toggle.
   */
  size?: ToggleSize;

  /**
   * Color variant when the toggle is active.
   */
  variant?: ToggleVariant;

  /**
   * Disables interaction.
   */
  disabled?: boolean;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;

  /**
   * Accessible name for the toggle input.
   */
  'aria-label'?: string;
};

export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  label,
  description,
  icon,
  size = `md`,
  variant = `default`,
  disabled = false,
  className,
  style,
  'aria-label': ariaLabel,
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };

  return (
    <label
      className={classNames(
        styles.root,
        styles[size],
        disabled && styles.disabled,
        className
      )}
      style={style}
    >
      <div className={styles.toggleWrapper}>
        <input
          type="checkbox"
          className={styles.input}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          aria-label={ariaLabel ?? label}
        />
        <div
          className={classNames(
            styles.track,
            isChecked && styles.trackChecked,
            isChecked && styles[`track-${variant}`]
          )}
        >
          <div className={classNames(styles.knob, isChecked && styles.knobChecked)}>
            {icon && <span className={styles.icon}>{icon}</span>}
          </div>
        </div>
      </div>

      {(label || description) && (
        <div className={styles.labelGroup}>
          {label && <span className={styles.label}>{label}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </div>
      )}
    </label>
  );
}
