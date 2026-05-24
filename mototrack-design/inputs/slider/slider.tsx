import React, { useCallback, useId, useState } from 'react';
import classNames from 'classnames';
import styles from './slider.module.scss';

export type SliderProps = {
  /**
   * Label displayed above the slider.
   */
  label?: string;

  /**
   * Minimum value of the slider.
   */
  min?: number;

  /**
   * Maximum value of the slider.
   */
  max?: number;

  /**
   * Step increment for the slider.
   */
  step?: number;

  /**
   * Controlled current value of the slider.
   */
  value?: number;

  /**
   * Default value when used as an uncontrolled component.
   */
  defaultValue?: number;

  /**
   * Unit label shown next to the value (e.g. "km", "%", "°").
   */
  unit?: string;

  /**
   * Called when the slider value changes, receives the new numeric value.
   */
  onChange?: (value: number) => void;

  /**
   * Whether the slider is disabled.
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
};

export function Slider({
  label = `Twistiness`,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 50,
  unit = `%`,
  onChange,
  disabled = false,
  className,
  style,
}: SliderProps) {
  const id = useId();

  const [internalValue, setInternalValue] = useState<number>(
    value !== undefined ? value : defaultValue
  );

  const currentValue = value !== undefined ? value : internalValue;
  const range = max - min;
  const fillPercent = range === 0 ? 0 : ((currentValue - min) / range) * 100;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);
      if (value === undefined) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [value, onChange]
  );

  return (
    <div
      className={classNames(styles.sliderRoot, { [styles.disabled]: disabled }, className)}
      style={style}
    >
      <div className={styles.header}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <span className={styles.valueDisplay}>
          <span className={styles.valueNumber}>{currentValue}</span>
          {unit && <span className={styles.valueUnit}>{unit}</span>}
        </span>
      </div>

      <div className={styles.trackWrapper}>
        <div className={styles.trackBg} />
        <div
          className={styles.trackFill}
          style={{ width: `${fillPercent}%` } as React.CSSProperties}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={disabled}
          onChange={handleChange}
          className={styles.input}
          aria-label={label}
        />
        <div
          className={styles.thumb}
          style={{ left: `${fillPercent}%` } as React.CSSProperties}
        />
      </div>

      <div className={styles.ticks}>
        <span className={styles.tick}>
          {min}
          {unit}
        </span>
        <span className={styles.tick}>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
