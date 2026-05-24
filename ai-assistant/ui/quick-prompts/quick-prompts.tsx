import React from 'react';
import classNames from 'classnames';
import styles from './quick-prompts.module.scss';

export type QuickPrompt = {
  id: string;
  label: string;
};

const DEFAULT_PROMPTS: QuickPrompt[] = [
  { id: `1`, label: `Predlagaj vijugasto pot po Soški dolini` },
  { id: `2`, label: `Kakšno bo vreme jutri v Bovcu?` },
  { id: `3`, label: `Pripravi seznam pred vožnjo na Vršič` },
  { id: `4`, label: `Najbližje gorivo na Transfăgărășan` },
  { id: `5`, label: `Ali je danes primerno za Kotor serpentine?` },
];

export type QuickPromptsProps = {
  /**
   * List of suggestion chips to display.
   */
  prompts?: QuickPrompt[];

  /**
   * Callback fired when the user selects a suggestion chip.
   */
  onSelect?: (label: string) => void;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * QuickPrompts renders a horizontal scrollable row of Slovenian suggestion chips
 * for the AI assistant. Clicking a chip fires `onSelect` with the chip label.
 */
export function QuickPrompts({
  prompts = DEFAULT_PROMPTS,
  onSelect,
  className,
  style,
}: QuickPromptsProps) {
  return (
    <div className={classNames(styles.root, className)} style={style}>
      <div className={styles.track}>
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            className={styles.chip}
            onClick={() => onSelect?.(prompt.label)}
          >
            <span className={styles.chipIcon} aria-hidden="true">
              <RouteIcon />
            </span>
            <span className={styles.chipLabel}>{prompt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function RouteIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 12C2 12 3.5 9 5 7C6.5 5 8.5 5 9.5 4C10.5 3 11 2 11 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="2" cy="12" r="1.25" fill="currentColor" />
      <circle cx="11" cy="2" r="1.25" fill="currentColor" />
    </svg>
  );
}
