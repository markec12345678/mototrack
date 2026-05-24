import React from 'react';
import classNames from 'classnames';
import { Card } from '@markec/mototrack-design.content.card';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import type { ChatCitation } from './citation-type.js';
import styles from './chat-message-bubble.module.scss';

export type ChatMessageRole = 'user' | 'assistant' | 'system';

export type ChatMessageBubbleProps = {
  /**
   * The role of the message sender.
   * - `user`: right-aligned bubble with accent gradient
   * - `assistant`: left-aligned dark card with markdown rendering
   */
  role: ChatMessageRole;

  /**
   * The text content of the message. Supports markdown-style
   * bold (**text**) and bullet lists (lines starting with - or *).
   */
  content: string;

  /**
   * Optional citations to display as compact links below the message.
   */
  citations?: ChatCitation[];

  /**
   * Additional CSS class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

type ParsedSegment =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string };

function parseInline(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'bold', value: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return segments;
}

function renderInline(text: string): React.ReactNode {
  const segments = parseInline(text);
  return segments.map((seg, i) => {
    if (seg.type === 'bold') {
      return <strong key={i} className={styles.bold}>{seg.value}</strong>;
    }
    return <span key={i}>{seg.value}</span>;
  });
}

type ParsedBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullet'; items: string[] };

function parseContent(content: string): ParsedBlock[] {
  const lines = content.split('\n');
  const blocks: ParsedBlock[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      blocks.push({ type: 'bullet', items: [...bulletBuffer] });
      bulletBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      flushBullets();
      continue;
    }
    const bulletMatch = /^[-*]\s+(.+)$/.exec(trimmed);
    if (bulletMatch) {
      bulletBuffer.push(bulletMatch[1]);
    } else {
      flushBullets();
      blocks.push({ type: 'paragraph', text: trimmed });
    }
  }

  flushBullets();
  return blocks;
}

function MarkdownContent({ content }: { content: string }) {
  const blocks = parseContent(content);

  return (
    <div className={styles.markdownContent}>
      {blocks.map((block, i) => {
        if (block.type === 'bullet') {
          return (
            <ul key={i} className={styles.bulletList}>
              {block.items.map((item, j) => (
                <li key={j} className={styles.bulletItem}>
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className={styles.paragraph}>
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export function ChatMessageBubble({
  role,
  content,
  citations,
  className,
  style,
}: ChatMessageBubbleProps) {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  return (
    <div
      className={classNames(
        styles.wrapper,
        { [styles.userWrapper]: isUser, [styles.assistantWrapper]: isAssistant },
        className
      )}
      style={style}
    >
      {isUser && (
        <div className={styles.userBubble}>
          <p className={styles.userText}>{content}</p>
        </div>
      )}

      {!isUser && (
        <div className={styles.assistantContainer}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <svg
                className={styles.avatarIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
                  fill="currentColor"
                />
                <circle cx="19" cy="5" r="1.5" fill="currentColor" opacity="0.6" />
                <circle cx="5" cy="19" r="1" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
          </div>

          <div className={styles.assistantBody}>
            <Card variant="elevated" padding="lg" className={styles.assistantCard}>
              <MarkdownContent content={content} />

              {citations && citations.length > 0 && (
                <div className={styles.citationsSection}>
                  <Paragraph variant="label" color="muted" className={styles.citationsLabel}>
                    Viri
                  </Paragraph>
                  <div className={styles.citationsList}>
                    {citations.map((citation, i) => (
                      <a
                        key={i}
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.citationLink}
                      >
                        <span className={styles.citationIndex}>{i + 1}</span>
                        <span className={styles.citationTitle}>{citation.title}</span>
                        <svg
                          className={styles.citationArrow}
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
