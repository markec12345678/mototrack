import React from 'react';
import classNames from 'classnames';
import styles from './select-list.module.scss';

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectListProps = {
  /**
   * Label displayed above the select dropdown.
   */
  label?: string;

  /**
   * Array of options to display in the dropdown.
   */
  options?: SelectOption[];

  /**
   * Currently selected value.
   */
  value?: string;

  /**
   * Placeholder text shown when no value is selected.
   */
  placeholder?: string;

  /**
   * Error message to display below the select.
   */
  error?: string;

  /**
   * Whether the select is disabled.
   */
  disabled?: boolean;

  /**
   * Whether the select is required.
   */
  required?: boolean;

  /**
   * Callback fired when the selected value changes.
   */
  onChange?: (value: string) => void;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;

  /**
   * Name attribute for the select element.
   */
  name?: string;

  /**
   * ID attribute for the select element.
   */
  id?: string;
};

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: `motogp`, label: `MotoGP` },
  { value: `moto2`, label: `Moto2` },
  { value: `moto3`, label: `Moto3` },
  { value: `superbike`, label: `Superbike` },
  { value: `supersport`, label: `Supersport` },
];

export function SelectList({
  label,
  options = DEFAULT_OPTIONS,
  value,
  placeholder = `Choose an option...`,
  error,
  disabled = false,
  required = false,
  onChange,
  className,
  style,
  name,
  id,
}: SelectListProps) {
  const selectId = id ?? name ?? `select-list`;
  const hasError = Boolean(error);

  return (
    <div
      className={classNames(styles.wrapper, className, {
        [styles.hasError]: hasError,
        [styles.isDisabled]: disabled,
      })}
      style={style}
    >
      {label && (
        <label
          htmlFor={selectId}
          className={classNames(styles.label, { [styles.required]: required })}
        >
          {label}
        </label>
      )}

      <div className={styles.selectWrapper}>
        <select
          id={selectId}
          name={name}
          value={value ?? ``}
          disabled={disabled}
          required={required}
          className={classNames(styles.select, {
            [styles.placeholder]: !value,
            [styles.errorSelect]: hasError,
          })}
          onChange={(e) => onChange?.(e.target.value)}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className={styles.chevron} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {hasError && (
        <div className={styles.errorMessage} role="alert">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.errorIcon}
          >
            <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
            <path
              d="M7 4V7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="7" cy="10" r="0.75" fill="currentColor" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
