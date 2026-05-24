import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { Avatar } from '@markec/mototrack-design.content.avatar';
import { useGroupRide } from '@markec/community.hooks.use-group-ride';
import { ChatMessage } from './chat-message-type.js';
import { MOCK_MESSAGES, MOCK_MY_SENDER_ID } from './group-ride-chat.mock.js';
import styles from './group-ride-chat.module.scss';

export type RideStatus = `pripravljen` | `na-poti` | `odmor` | `konec`;

export type GroupRideChatProps = {
  /** ID of the group ride to connect to */
  rideId?: string;
  /** Display name of the ride */
  rideName?: string;
  /** Current user's sender ID */
  currentUserId?: string;
  /** Initial messages for testing / SSR */
  initialMessages?: ChatMessage[];
  /** Additional class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
};

const STATUS_PILLS: { key: RideStatus; label: string; pillClass: string }[] = [
  { key: `pripravljen`, label: `Pripravljen`, pillClass: styles.pillPripravljen },
  { key: `na-poti`, label: `Na poti`, pillClass: styles.pillNaPoti },
  { key: `odmor`, label: `Odmor`, pillClass: styles.pillOdmor },
  { key: `konec`, label: `Konec`, pillClass: styles.pillKonec },
];

function scrollToBottom(el: HTMLDivElement | null) {
  if (el && typeof el.scrollIntoView === `function`) {
    el.scrollIntoView({ behavior: `smooth` });
  }
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, `0`);
  const m = d.getMinutes().toString().padStart(2, `0`);
  return `${h}:${m}`;
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 9L16 2L9 16L8 10L2 9Z" fill="currentColor" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 1.5C6.515 1.5 4.5 3.515 4.5 6C4.5 9.375 9 16.5 9 16.5C9 16.5 13.5 9.375 13.5 6C13.5 3.515 11.485 1.5 9 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 6C4 4.895 4.895 4 6 4H26C27.105 4 28 4.895 28 6V20C28 21.105 27.105 22 26 22H10L4 28V6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GroupRideChat({
  rideId = `ride-1`,
  rideName = `Vršič Adventure Ride`,
  currentUserId = MOCK_MY_SENDER_ID,
  initialMessages,
  className,
  style,
}: GroupRideChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages ?? MOCK_MESSAGES);
  const [inputText, setInputText] = useState(``);
  const [activeStatus, setActiveStatus] = useState<RideStatus>(`pripravljen`);
  const [locationShared, setLocationShared] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { chat, updateStatus } = useGroupRide();
  const chatRef = useRef<ReturnType<typeof chat> | null>(null);

  useEffect(() => {
    if (!rideId) return;
    const connection = chat(rideId);
    chatRef.current = connection;

    connection.onMessage((msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      connection.disconnect?.();
    };
  }, [rideId]);

  useEffect(() => {
    scrollToBottom(messagesEndRef.current);
  }, [messages]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: `Jaz`,
      senderCountry: `🇸🇮`,
      text,
      at: Date.now(),
    };

    if (chatRef.current) {
      chatRef.current.sendMessage(text as any);
    } else {
      setMessages((prev) => [...prev, newMsg]);
    }

    setInputText(``);
    inputRef.current?.focus();
  }, [inputText, currentUserId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === `Enter` && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleStatusChange = useCallback(
    (status: RideStatus) => {
      setActiveStatus(status);
      updateStatus(rideId, status);
    },
    [rideId, updateStatus]
  );

  const handleShareLocation = useCallback(() => {
    setLocationShared((prev) => !prev);
    if (!locationShared && typeof navigator !== `undefined` && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {});
    }
  }, [locationShared]);

  return (
    <div className={classNames(styles.panel, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.liveDot} />
          <div>
            <p className={styles.headerTitle}>{rideName}</p>
            <p className={styles.headerSub}>Skupinska vožnja · v živo</p>
          </div>
        </div>
        <span className={styles.participantCount}>
          {messages.length > 0
            ? `${new Set(messages.map((m) => m.senderId)).size} udeležencev`
            : `0 udeležencev`}
        </span>
      </div>

      <div className={styles.statusBar}>
        <span className={styles.statusLabel}>Status:</span>
        {STATUS_PILLS.map(({ key, label, pillClass }) => (
          <button
            key={key}
            type="button"
            className={classNames(styles.pill, { [pillClass]: activeStatus === key })}
            onClick={() => handleStatusChange(key)}
          >
            <span className={styles.pillDot} />
            {label}
          </button>
        ))}
      </div>

      {locationShared && (
        <div className={styles.locationToast}>
          <LocationIcon />
          Lokacija se deli v živo
        </div>
      )}

      <div className={styles.messagesList}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>
              <ChatIcon />
            </span>
            <p className={styles.emptyText}>Še ni sporočil. Začni pogovor!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={classNames(styles.messageRow, { [styles.messageRowOwn]: isOwn })}
              >
                {!isOwn && (
                  <div className={styles.avatarWrapper}>
                    <Avatar name={msg.senderName} size="sm" />
                    <span className={styles.countryFlag}>{msg.senderCountry}</span>
                  </div>
                )}
                <div className={classNames(styles.messageBubble, { [styles.messageBubbleOwn]: isOwn })}>
                  {!isOwn && (
                    <span className={styles.senderName}>{msg.senderName}</span>
                  )}
                  <div className={classNames(styles.bubble, { [styles.bubbleOwn]: isOwn })}>
                    {msg.text}
                  </div>
                  <span className={styles.messageTime}>{formatTime(msg.at)}</span>
                </div>
                {isOwn && (
                  <div className={styles.avatarWrapper}>
                    <Avatar name="Jaz" size="sm" />
                    <span className={styles.countryFlag}>🇸🇮</span>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.sendBox}>
        <input
          ref={inputRef}
          className={styles.sendInput}
          type="text"
          placeholder="Napiši sporočilo…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
        />
        <div className={styles.sendActions}>
          <button
            type="button"
            className={classNames(styles.iconBtn, { [styles.iconBtnActive]: locationShared })}
            onClick={handleShareLocation}
            title="Deli lokacijo"
          >
            <LocationIcon />
          </button>
          <button
            type="button"
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={!inputText.trim()}
            title="Pošlji"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
