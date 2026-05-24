import React, { useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import styles from './modal.module.scss';

export type ModalSize = 'sm' | 'md' | 'lg';

export type ModalProps = {
  /**
   * Whether the modal is open.
   */
  open: boolean;

  /**
   * Callback fired when the modal requests to be closed.
   * Triggered by ESC key, backdrop click, or close button.
   */
  onClose: () => void;

  /**
   * Modal title displayed in the header.
   */
  title?: string;

  /**
   * Main content of the modal body.
   */
  children?: React.ReactNode;

  /**
   * Footer slot — typically action buttons.
   */
  footer?: React.ReactNode;

  /**
   * Size variant of the modal dialog.
   * - `sm`: 400px max-width
   * - `md`: 560px max-width
   * - `lg`: 720px max-width
   */
  size?: ModalSize;

  /**
   * Additional class name applied to the modal dialog panel.
   */
  className?: string;

  /**
   * Inline styles for the modal dialog panel.
   */
  style?: React.CSSProperties;

  /**
   * Whether clicking the backdrop closes the modal. Defaults to true.
   */
  closeOnBackdrop?: boolean;

  /**
   * Whether pressing ESC closes the modal. Defaults to true.
   */
  closeOnEsc?: boolean;
};

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={18} y1={6} x2={6} y2={18} />
      <line x1={6} y1={6} x2={18} y2={18} />
    </svg>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = `md`,
  className,
  style,
  closeOnBackdrop = true,
  closeOnEsc = true,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === `Escape`) {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener(`keydown`, handleKeyDown);
      document.body.style.overflow = `hidden`;
    }
    return () => {
      document.removeEventListener(`keydown`, handleKeyDown);
      document.body.style.overflow = ``;
    };
  }, [open, handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className={classNames(styles.backdrop, { [styles.visible]: open })}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={classNames(styles.dialog, styles[size], className)}
        style={style}
      >
        {/* Header */}
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <div className={styles.closeButton}>
            <IconButton
              icon={<XIcon />}
              variant="ghost"
              size="sm"
              aria-label="Close modal"
              title="Close"
              onClick={() => onClose()}
            />
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>{children}</div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
