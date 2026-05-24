import { createContext } from 'react';
import type { Toast, ToastVariant } from './toast-type.js';

export type ToastContextValue = {
  /**
   * Currently active toasts.
   */
  toasts: Toast[];

  /**
   * Add a new toast notification.
   */
  addToast: (message: string, variant?: ToastVariant, title?: string, duration?: number) => void;

  /**
   * Remove a toast by its ID.
   */
  removeToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  addToast: () => undefined,
  removeToast: () => undefined,
});
