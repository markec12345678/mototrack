import React, { useCallback, useState, type ReactNode } from 'react';
import classNames from 'classnames';
import { ToastContext } from './toast-context.js';
import { ToastItem } from './toast-item.js';
import type { Toast, ToastVariant } from './toast-type.js';
import styles from './toast.module.scss';

export type ToastProviderProps = {
  /**
   * The component tree that can access the toast system.
   */
  children?: ReactNode;

  /**
   * Additional class name for the toast container.
   */
  className?: string;

  /**
   * Inline styles for the toast container.
   */
  style?: React.CSSProperties;

  /**
   * Default duration in milliseconds for auto-dismiss.
   * Defaults to 4000ms. Set to 0 to disable auto-dismiss globally.
   */
  defaultDuration?: number;

  /**
   * Maximum number of toasts visible at once.
   * Defaults to 5.
   */
  maxToasts?: number;
};

let toastCounter = 0;

function generateId(): string {
  toastCounter += 1;
  return `toast-${toastCounter}-${Date.now()}`;
}

/**
 * ToastProvider wraps your app and provides the toast notification system.
 * Use the `useToast` hook inside to trigger notifications.
 */
export function ToastProvider({
  children,
  className,
  style,
  defaultDuration = 4000,
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = 'info', title?: string, duration?: number) => {
      const newToast: Toast = {
        id: generateId(),
        message,
        variant,
        title,
        duration: duration !== undefined ? duration : defaultDuration,
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        return updated.length > maxToasts ? updated.slice(updated.length - maxToasts) : updated;
      });
    },
    [defaultDuration, maxToasts]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className={classNames(styles.toastContainer, className)} style={style} aria-label="Notifications">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
