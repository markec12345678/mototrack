import React, { useState, useId } from 'react';
import classNames from 'classnames';
import styles from './text-input.module.scss';

export type TextInputType = 'text' | 'email' | 'password' | 'number' | 'search';

export type TextInputProps = {
  /**
   * Input type — text, email, password, number, or search.
   */
  type?: TextInputType;

  /**
   * Label displayed above the input.
   */
  label?: string;

  /**
   * Current value of the input.
   */
  value?: string;

  /**
   * Placeholder text shown when the input is empty.
   */
  placeholder?: string;

  /**
   * Helper text displayed below the input.
   */
  helperText?: string;

  /**
   * Error message — when set, the input is styled in error state.
   */
  errorMessage?: string;

  /**
   * Optional icon rendered on the left side of the input.
   */
  leftIcon?: React.ReactNode;

  /**
   * Whether the input is disabled.
   */
  disabled?: boolean;

  /**
   * Whether the input is required.
   */
  required?: boolean;

  /**
   * Name attribute for the input element.
   */
  name?: string;

  /**
   * Callback fired when the value changes. Receives the new string value.
   */
  onChange?: (value: string) => void;

  /**
   * Callback fired when the input gains focus.
   */
  onFocus?: () => void;

  /**
   * Callback fired when the input loses focus.
   */
  onBlur?: () => void;

  /**
   * Additional class name applied to the root wrapper.
   */
  className?: string;

  /**
   * Inline styles applied to the root wrapper.
   */
  style?: React.CSSProperties;
};

/**
 * Text input with label, error message, helper text, and optional left icon.
 * Supports types: text, email, password, number, search.
 * Theme-styled with focus accent border.
 */
export function TextInput({
  type = `text`,
  label,
  value,
  placeholder = ``,
  helperText,
  errorMessage,
  leftIcon,
  disabled = false,
  required = false,
  name,
  onChange,
  onFocus,
  onBlur,
  className,
  style,
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const uid = useId();
  const inputId = `text-input-${uid}`;
  const hasError = Boolean(errorMessage);

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  return (
    <div
      className={classNames(styles.wrapper, className)}
      style={style}
    >
      {label && (
        <label
          htmlFor={inputId}
          className={classNames(styles.label, {
            [styles.labelDisabled]: disabled,
            [styles.labelError]: hasError,
          })}
        >
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div
        className={classNames(styles.inputWrapper, {
          [styles.focused]: focused,
          [styles.error]: hasError,
          [styles.disabled]: disabled,
          [styles.hasIcon]: Boolean(leftIcon),
        })}
      >
        {leftIcon && (
          <span className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={styles.input}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      {hasError && (
        <span className={styles.errorMessage}>
          <ErrorIcon />
          {errorMessage}
        </span>
      )}

      {!hasError && helperText && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.errorIcon}
    >
      <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
      <path d="M6 3.5V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6" cy="8.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
