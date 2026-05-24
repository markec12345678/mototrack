import { useContext } from 'react';
import { ToastContext, type ToastContextValue } from './toast-context.js';

/**
 * Hook to access the toast notification system.
 * Must be used within a ToastProvider.
 *
 * @example
 * const { addToast } = useToast();
 * addToast('Ride saved!', 'success', 'Success');
 */
export function useToast(): ToastContextValue {
  return useContext(ToastContext);
}
