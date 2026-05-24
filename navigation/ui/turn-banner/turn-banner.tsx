import React, { useState } from 'react';
import classNames from 'classnames';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { NavInstruction } from '@markec/navigation.entities.nav-instruction';
import styles from './turn-banner.module.scss';

// ─── Icons ────────────────────────────────────────────────────────────────────

function TurnArrowIcon({ modifier }: { modifier: string }) {
  const isLeft = modifier === 'turn-left' || modifier === 'sharp-left' || modifier === 'slight-left';
  const isRight = modifier === 'turn-right' || modifier === 'sharp-right' || modifier === 'slight-right';
  const isUturn = modifier === 'uturn';
  const isContinue = modifier === 'continue' || modifier === 'straight';

  if (isUturn) {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.arrowSvg}>
        <path
          d="M44 12C44 12 52 12 52 24C52 36 44 36 44 36H16"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 28L16 36L24 44"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (isContinue) {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.arrowSvg}>
        <path
          d="M32 52V12"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M20 24L32 12L44 24"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (isLeft) {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.arrowSvg}>
        <path
          d="M52 52V32C52 20 44 12 32 12H12"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 24L12 12L24 0"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (isRight) {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.arrowSvg}>
        <path
          d="M12 52V32C12 20 20 12 32 12H52"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 24L52 12L40 0"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Default: straight arrow
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.arrowSvg}>
      <path
        d="M32 52V12"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M20 24L32 12L44 24"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function VoiceOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VoiceOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function HelmetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7 2 3 6.5 3 11v3a2 2 0 0 0 2 2h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1h1a2 2 0 0 0 2-2v-3c0-4.5-4-9-9-9z" />
      <path d="M3 14c0 0 2 1 9 1s9-1 9-1" />
      <path d="M8 17v1" />
      <path d="M16 17v1" />
    </svg>
  );
}

// ─── Distance formatter ───────────────────────────────────────────────────────

function formatDistance(meters: number): string {
  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  }
  const rounded = Math.round(meters / 10) * 10;
  return `${rounded} m`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export type TurnBannerProps = {
  /**
   * The current navigation instruction to display.
   */
  instruction: NavInstruction;

  /**
   * Street name for the upcoming turn.
   */
  streetName?: string;

  /**
   * Whether voice guidance is currently enabled.
   */
  voiceEnabled?: boolean;

  /**
   * Called when the user toggles voice on/off.
   */
  onVoiceToggle?: (enabled: boolean) => void;

  /**
   * Whether a Bluetooth helmet is connected.
   */
  btConnected?: boolean;

  /**
   * Name of the connected BT device, shown in tooltip.
   */
  btDeviceName?: string;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

const DEFAULT_INSTRUCTION: NavInstruction = NavInstruction.from({
  id: 'default',
  text: 'Zavijte desno',
  distanceM: 320,
  modifier: 'turn-right',
  announceAt: 300,
});

export function TurnBanner({
  instruction = DEFAULT_INSTRUCTION,
  streetName = `Dunajska cesta`,
  voiceEnabled = true,
  onVoiceToggle,
  btConnected = false,
  btDeviceName = ``,
  className,
  style,
}: TurnBannerProps) {
  const [localVoice, setLocalVoice] = useState(voiceEnabled);

  const handleVoiceToggle = () => {
    const next = !localVoice;
    setLocalVoice(next);
    onVoiceToggle?.(next);
  };

  const isImminent = instruction.distanceM <= instruction.announceAt;

  return (
    <div
      className={classNames(styles.banner, { [styles.imminent]: isImminent }, className)}
      style={style}
    >
      {/* Gradient overlay */}
      <div className={styles.gradientOverlay} />

      {/* Top row: BT helmet badge + controls */}
      <div className={styles.topRow}>
        <div className={styles.btBadge} title={btDeviceName || `Bluetooth helmet`}>
          {btConnected && (
            <>
              <span className={styles.btIcon}>
                <HelmetIcon />
              </span>
              <span className={styles.btLabel}>{btDeviceName || `BT Helmet`}</span>
              <span className={styles.btDot} />
            </>
          )}
        </div>

        <div className={styles.controls}>
          <IconButton
            icon={localVoice ? <VoiceOnIcon /> : <VoiceOffIcon />}
            variant={localVoice ? `filled` : `ghost`}
            size="sm"
            aria-label={localVoice ? `Disable voice` : `Enable voice`}
            title={localVoice ? `Voice on` : `Voice off`}
            onClick={() => handleVoiceToggle()}
          />
        </div>
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Arrow column */}
        <div className={classNames(styles.arrowWrap, { [styles.arrowPulse]: isImminent })}>
          <TurnArrowIcon modifier={instruction.modifier} />
        </div>

        {/* Text column */}
        <div className={styles.textColumn}>
          <div className={styles.distanceBadge}>
            <span className={styles.distanceValue}>{formatDistance(instruction.distanceM)}</span>
          </div>

          <Heading level={3} size="xl" className={styles.instructionText}>
            {instruction.text}
          </Heading>

          {streetName && (
            <div className={styles.streetRow}>
              <span className={styles.streetDot} />
              <Paragraph variant="body" color="secondary" className={styles.streetName}>
                {streetName}
              </Paragraph>
            </div>
          )}
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={
            {
              '--progress': `${Math.min(100, Math.max(0, (1 - instruction.distanceM / Math.max(instruction.announceAt * 3, 500)) * 100))}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
