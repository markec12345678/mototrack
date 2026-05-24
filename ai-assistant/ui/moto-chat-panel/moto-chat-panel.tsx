import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';
import classNames from 'classnames';
import { useMotoChat } from '@markec/ai-assistant.hooks.use-moto-chat';
import { ChatMessageBubble } from '@markec/ai-assistant.ui.chat-message-bubble';
import { QuickPrompts } from '@markec/ai-assistant.ui.quick-prompts';
import { VoiceInputButton } from '@markec/ai-assistant.ui.voice-input-button';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import type { QuickPrompt } from '@markec/ai-assistant.ui.quick-prompts';
import styles from './moto-chat-panel.module.scss';

export type MotoChatPanelProps = {
  /**
   * Whether the panel is open/visible.
   */
  open: boolean;

  /**
   * Callback fired when the panel requests to be closed.
   * Triggered by Esc key or backdrop click.
   */
  onClose: () => void;

  /**
   * Subtitle shown below the MotoChat heading.
   */
  subtitle?: string;

  /**
   * Custom quick prompts to display when conversation is empty.
   */
  quickPrompts?: QuickPrompt[];

  /**
   * Additional class name applied to the drawer panel.
   */
  className?: string;

  /**
   * Inline styles for the drawer panel.
   */
  style?: CSSProperties;
};

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1={18} y1={6} x2={6} y2={18} />
      <line x1={6} y1={6} x2={18} y2={18} />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1={22} y1={2} x2={11} y2={13} />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function ThinkingDots() {
  return (
    <div className={styles.thinkingDots}>
      <span className={styles.dot} />
      <span className={classNames(styles.dot, styles.dotDelay1)} />
      <span className={classNames(styles.dot, styles.dotDelay2)} />
    </div>
  );
}

const DEFAULT_SUBTITLE = `Vaš AI asistent za motocikliste`;

export function MotoChatPanel({
  open,
  onClose,
  subtitle = DEFAULT_SUBTITLE,
  quickPrompts,
  className,
  style,
}: MotoChatPanelProps) {
  const { messages, send, isThinking, clear } = useMotoChat();
  const [inputValue, setInputValue] = useState(``);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isEmpty = messages.length === 0;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: `smooth` });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === `Escape`) {
        onClose();
      }
    };
    document.addEventListener(`keydown`, handleKeyDown);
    return () => document.removeEventListener(`keydown`, handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isThinking) return;
    setInputValue(``);
    send(text);
  }, [inputValue, isThinking, send]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === `Enter` && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPromptSelect = useCallback((label: string) => {
    send(label);
  }, [send]);

  const handleVoiceResult = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const canSend = inputValue.trim().length > 0 && !isThinking;

  return (
    <div
      className={classNames(styles.backdrop, { [styles.backdropVisible]: open })}
      onClick={handleBackdropClick}
      aria-hidden={!open}
    >
      <div
        className={classNames(styles.panel, { [styles.panelOpen]: open }, className)}
        style={style}
        role="dialog"
        aria-modal="true"
        aria-label="MotoChat AI asistent"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.brainIconWrap}>
              <BrainIcon />
            </div>
            <div className={styles.headerText}>
              <span className={styles.headerTitle}>MotoChat</span>
              <span className={styles.headerSubtitle}>{subtitle}</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            {!isEmpty && (
              <IconButton
                icon={<TrashIcon />}
                variant="ghost"
                size="sm"
                aria-label="Počisti pogovor"
                title="Počisti pogovor"
                onClick={() => clear()}
              />
            )}
            <IconButton
              icon={<XIcon />}
              variant="ghost"
              size="sm"
              aria-label="Zapri MotoChat"
              title="Zapri"
              onClick={() => onClose()}
            />
          </div>
        </div>

        {/* Message list */}
        <div className={styles.messageList}>
          {isEmpty && !isThinking ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <BrainIcon />
              </div>
              <p className={styles.emptyTitle}>Pozdravljeni! 🏍️</p>
              <p className={styles.emptySubtitle}>
                Sem vaš MotoChat AI asistent. Vprašajte me karkoli o poteh, vremenu ali motociklizmu.
              </p>
            </div>
          ) : (
            <div className={styles.messages}>
              {messages.map((msg, i) => {
                const role = msg.role as `user` | `assistant`;
                return (
                  <ChatMessageBubble
                    key={i}
                    role={role}
                    content={msg.content}
                  />
                );
              })}
              {isThinking && (
                <div className={styles.thinkingWrapper}>
                  <div className={styles.thinkingAvatar}>
                    <BrainIcon />
                  </div>
                  <div className={styles.thinkingBubble}>
                    <ThinkingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Quick prompts — only when conversation is empty */}
        {isEmpty && !isThinking && (
          <div className={styles.quickPromptsWrap}>
            <QuickPrompts
              prompts={quickPrompts}
              onSelect={(label) => handleQuickPromptSelect(label)}
            />
          </div>
        )}

        {/* Input bar */}
        <div className={styles.inputBar}>
          <div className={styles.inputWrap}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Napišite sporočilo…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isThinking}
              aria-label="Sporočilo"
            />
          </div>
          <div className={styles.inputActions}>
            <VoiceInputButton
              onResult={(text) => handleVoiceResult(text)}
              disabled={isThinking}
            />
            <button
              type="button"
              className={classNames(styles.sendButton, { [styles.sendButtonActive]: canSend })}
              onClick={() => handleSend()}
              disabled={!canSend}
              aria-label="Pošlji sporočilo"
              title="Pošlji"
            >
              <span className={styles.sendIcon}>
                <SendIcon />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
