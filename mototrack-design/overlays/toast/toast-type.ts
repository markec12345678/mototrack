export type ToastVariant = 'success' | 'warning' | 'danger' | 'info';

export type Toast = {
  /**
   * Unique identifier for the toast.
   */
  id: string;

  /**
   * The message to display in the toast.
   */
  message: string;

  /**
   * Optional title for the toast.
   */
  title?: string;

  /**
   * Visual variant of the toast.
   */
  variant: ToastVariant;

  /**
   * Duration in milliseconds before the toast auto-dismisses.
   * Defaults to 4000ms. Set to 0 to disable auto-dismiss.
   */
  duration?: number;
};
