import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Priority level for a TTS speak request.
 * - 'normal'  — queued behind any currently speaking utterance
 * - 'urgent'  — cancels the current utterance and plays immediately
 */
export type TtsPriority = 'normal' | 'urgent';

/**
 * Options accepted by the speak() function.
 */
export type SpeakOptions = {
  /** Priority of the utterance. Defaults to 'normal'. */
  priority?: TtsPriority;
};

/**
 * Configuration for the useTts hook.
 */
export type UseTtsOptions = {
  /** Speech volume, 0–1. Defaults to 1. */
  volume?: number;
  /** Speech rate, 0.1–10. Defaults to 1. */
  rate?: number;
  /** Speech pitch, 0–2. Defaults to 1. */
  pitch?: number;
  /**
   * Preferred BCP-47 language tag for voice selection.
   * Defaults to 'sl-SI'. Falls back to the system default voice.
   */
  preferredLang?: string;
};

/**
 * Return value of the useTts hook.
 */
export type UseTtsReturn = {
  /**
   * Enqueue text to be spoken.
   * With priority 'urgent', cancels any current speech and plays immediately.
   */
  speak: (text: string, options?: SpeakOptions) => void;
  /** Cancel all pending and current speech. */
  cancel: () => void;
  /** Whether the Web Speech SpeechSynthesis API is available in this browser. */
  isSupported: boolean;
  /** All voices available from the browser's speech synthesis engine. */
  voices: SpeechSynthesisVoice[];
  /** The voice that will be used for the next utterance, or null if not yet resolved. */
  currentVoice: SpeechSynthesisVoice | null;
};

/**
 * Internal queue item.
 */
type QueueItem = {
  text: string;
  priority: TtsPriority;
};

/**
 * useTts — Web Speech SpeechSynthesis wrapper hook.
 *
 * Picks a voice matching `preferredLang` (default: 'sl-SI') when available,
 * and falls back to the browser's system default voice.
 *
 * Provides a queue-based speak() function. Utterances with 'urgent' priority
 * cancel the current speech and play immediately, bypassing the queue.
 *
 * Volume, rate, and pitch are configurable via hook options.
 *
 * @param options - Configuration for voice selection and speech parameters.
 * @returns An object with speak, cancel, isSupported, voices, and currentVoice.
 *
 * @example
 * const { speak, cancel, isSupported } = useTts({ volume: 0.8, rate: 1.1 });
 * speak('Zavijte desno čez 200 metrov');
 * speak('Preračunavanje poti!', { priority: 'urgent' });
 */
export function useTts({
  volume = 1,
  rate = 1,
  pitch = 1,
  preferredLang = 'sl-SI',
}: UseTtsOptions = {}): UseTtsReturn {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);

  const queueRef = useRef<QueueItem[]>([]);
  const isSpeakingRef = useRef(false);
  const currentVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Keep currentVoiceRef in sync with state
  useEffect(() => {
    currentVoiceRef.current = currentVoice;
  }, [currentVoice]);

  // Load voices and pick the preferred one
  useEffect(() => {
    if (!isSupported) return;

    const synth = window.speechSynthesis;

    const pickVoice = (available: SpeechSynthesisVoice[]) => {
      if (available.length === 0) return;
      setVoices(available);

      const preferred =
        available.find((v) => v.lang === preferredLang) ||
        available.find((v) => v.lang.startsWith(preferredLang.split('-')[0])) ||
        available.find((v) => v.default) ||
        available[0];

      setCurrentVoice(preferred ?? null);
    };

    const available = synth.getVoices();
    if (available.length > 0) {
      pickVoice(available);
    }

    const handleVoicesChanged = () => {
      pickVoice(synth.getVoices());
    };

    synth.addEventListener('voiceschanged', handleVoicesChanged);
    return () => {
      synth.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, [isSupported, preferredLang]);

  const playNext = useCallback(() => {
    if (!isSupported) return;
    const synth = window.speechSynthesis;

    if (queueRef.current.length === 0) {
      isSpeakingRef.current = false;
      return;
    }

    const item = queueRef.current.shift()!;
    isSpeakingRef.current = true;

    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (currentVoiceRef.current) {
      utterance.voice = currentVoiceRef.current;
      utterance.lang = currentVoiceRef.current.lang;
    }

    utterance.onend = () => {
      playNext();
    };

    utterance.onerror = () => {
      isSpeakingRef.current = false;
      playNext();
    };

    synth.speak(utterance);
  }, [isSupported, volume, rate, pitch]);

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      if (!isSupported) return;
      const synth = window.speechSynthesis;
      const priority = options.priority ?? 'normal';

      if (priority === 'urgent') {
        // Cancel everything and play immediately
        synth.cancel();
        queueRef.current = [];
        isSpeakingRef.current = false;
        queueRef.current.push({ text, priority });
        playNext();
        return;
      }

      queueRef.current.push({ text, priority });

      if (!isSpeakingRef.current) {
        playNext();
      }
    },
    [isSupported, playNext]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    queueRef.current = [];
    isSpeakingRef.current = false;
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    cancel,
    isSupported,
    voices,
    currentVoice,
  };
}
