import { useState, type CSSProperties } from 'react';
import classNames from 'classnames';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import { MotoChatPanel } from '@markec/ai-assistant.ui.moto-chat-panel';
import styles from './chat-header-trigger.module.scss';

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export type ChatHeaderTriggerProps = {
  /**
   * Subtitle shown inside the MotoChatPanel header.
   */
  subtitle?: string;

  /**
   * Additional class name applied to the trigger button wrapper.
   */
  className?: string;

  /**
   * Inline styles for the trigger button wrapper.
   */
  style?: CSSProperties;
};

/**
 * ChatHeaderTrigger — a 💬 icon button designed to be placed as a HeaderAction.
 * Clicking it opens the MotoChatPanel slide-in drawer.
 * Manages the open/close state internally.
 */
export function ChatHeaderTrigger({
  subtitle,
  className,
  style,
}: ChatHeaderTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={classNames(styles.triggerWrapper, className)} style={style}>
      <div className={styles.buttonWrap}>
        <IconButton
          icon={<ChatIcon />}
          variant="ghost"
          size="sm"
          aria-label="Odpri MotoChat"
          title="MotoChat AI asistent"
          active={open}
          onClick={() => setOpen(true)}
        />
        {!open && (
          <span className={styles.badge} aria-hidden />
        )}
      </div>
      <MotoChatPanel
        open={open}
        onClose={() => setOpen(false)}
        subtitle={subtitle}
      />
    </div>
  );
}
