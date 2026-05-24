import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import type { Toast } from './toast-type.js';
import styles from './toast.module.scss';

type ToastItemProps = {
  toast: Toast;
  onRemove: (id: string) => void;
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function DangerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const VARIANT_ICONS = {
  success: CheckIcon,
  warning: WarningIcon,
  danger: DangerIcon,
  info: InfoIcon,
};

export function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    if (!toast.duration && toast.duration !== 0) return undefined;
    if (toast.duration === 0) return undefined;

    const dismissTimer = setTimeout(() => {
      handleAutoDismiss();
    }, toast.duration);

    return () => clearTimeout(dismissTimer);
  }, [toast.duration, toast.id]);

  const handleAutoDismiss = () => {
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const handleClose = () => {
    setExiting(true);
    onRemove(toast.id);
  };

  const IconComponent = VARIANT_ICONS[toast.variant];

  return (
    <div
      className={classNames(
        styles.toastItem,
        styles[toast.variant],
        visible && styles.visible,
        exiting && styles.exiting
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.toastIcon}>
        <IconComponent />
      </div>
      <div className={styles.toastContent}>
        {toast.title && <p className={styles.toastTitle}>{toast.title}</p>}
        <p className={styles.toastMessage}>{toast.message}</p>
      </div>
      <button
        type="button"
        className={styles.toastClose}
        onClick={() => handleClose()}
        aria-label="Dismiss notification"
      >
        <CloseIcon />
      </button>
      {toast.duration !== 0 && (
        <div
          className={styles.progressBar}
          style={{ animationDuration: `${toast.duration ?? 4000}ms` } as React.CSSProperties}
        />
      )}
    </div>
  );
}
