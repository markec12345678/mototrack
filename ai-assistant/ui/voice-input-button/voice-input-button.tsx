import React, { useCallback, useRef, useState } from 'react';
import classNames from 'classnames';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import styles from './voice-input-button.module.scss';

export type VoiceInputButtonProps = {
  /**
   * Callback fired with the recognised transcript text.
   */
  onResult: (text: string) => void;

  /**
   * BCP-47 locale passed to SpeechRecognition. Defaults to `sl-SI`.
   */
  locale?: string;

  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;

  /**
   * Additional class name applied to the root wrapper.
   */
  className?: string;

  /**
   * Inline styles for the root wrapper.
   */
  style?: React.CSSProperties;
};

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x={9} y={2} width={6} height={12} rx={3} />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1={12} y1={19} x2={12} y2={22} />
      <line x1={8} y1={22} x2={16} y2={22} />
    </svg>
  );
}

function MicOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1={1} y1={1} x2={23} y2={23} />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 10v-1m14 0v1a7 7 0 0 1-.11 1.23" />
      <line x1={12} y1={19} x2={12} y2={22} />
      <line x1={8} y1={22} x2={16} y2={22} />
    </svg>
  );
}

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionResultList = {
  length: number;
  item: (index: number) => SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
};

type SpeechRecognitionResult = {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
};

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConstructor = new (...args: any[]) => SpeechRecognitionInstance;

function getSpeechRecognitionConstructor(): AnyConstructor | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  return (g.SpeechRecognition as AnyConstructor | undefined) ??
    (g.webkitSpeechRecognition as AnyConstructor | undefined) ??
    null;
}

/**
 * VoiceInputButton wraps the Web SpeechRecognition API with a Slovenian (sl-SI) locale.
 * Shows a pulsing animation while listening and fires `onResult(text)` with the transcript.
 * Hidden automatically when SpeechRecognition is not supported by the browser.
 */
export function VoiceInputButton({
  onResult,
  locale = `sl-SI`,
  disabled = false,
  className,
  style,
}: VoiceInputButtonProps) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const startListening = useCallback(() => {
    const Constructor = getSpeechRecognitionConstructor();
    if (!Constructor) return;

    setError(null);

    const recognition = new Constructor();
    recognition.lang = locale;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      let transcript = ``;
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.isFinal) {
          transcript += result[0].transcript;
        }
      }
      if (transcript.trim()) {
        onResult(transcript.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [locale, onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  const handleToggle = useCallback(() => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }, [listening, startListening, stopListening]);

  // Check support on every render so the component reacts to dynamic availability.
  if (getSpeechRecognitionConstructor() === null) return null;

  return (
    <div
      className={classNames(styles.wrapper, { [styles.listening]: listening }, className)}
      style={style}
    >
      {listening && (
        <>
          <span className={styles.pulse} />
          <span className={classNames(styles.pulse, styles.pulseDelay)} />
        </>
      )}
      <IconButton
        icon={listening ? <MicOffIcon /> : <MicIcon />}
        variant={listening ? `filled` : `ghost`}
        size="md"
        disabled={disabled}
        aria-label={listening ? `Ustavi snemanje` : `Začni snemanje`}
        title={listening ? `Ustavi snemanje` : `Začni glasovni vnos`}
        onClick={() => handleToggle()}
        className={classNames(styles.button, { [styles.buttonListening]: listening })}
      />
      {error && (
        <span className={styles.errorDot} title={`Napaka: ${error}`} />
      )}
    </div>
  );
}
