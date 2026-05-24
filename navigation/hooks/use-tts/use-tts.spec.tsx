import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useTts } from './use-tts.js';

// ─── SpeechSynthesis mock ─────────────────────────────────────────────────────

const mockVoices: SpeechSynthesisVoice[] = [
  {
    voiceURI: 'sl-SI-voice',
    name: 'Slovenian Voice',
    lang: 'sl-SI',
    localService: true,
    default: false,
  } as SpeechSynthesisVoice,
  {
    voiceURI: 'en-US-voice',
    name: 'English Voice',
    lang: 'en-US',
    localService: true,
    default: true,
  } as SpeechSynthesisVoice,
];

const mockSpeak = vi.fn();
const mockCancel = vi.fn();
const mockGetVoices = vi.fn(() => mockVoices);

const voicesChangedListeners: EventListener[] = [];

const mockSpeechSynthesis = {
  speak: mockSpeak,
  cancel: mockCancel,
  getVoices: mockGetVoices,
  addEventListener: vi.fn((event: string, listener: EventListener) => {
    if (event === 'voiceschanged') {
      voicesChangedListeners.push(listener);
    }
  }),
  removeEventListener: vi.fn(),
  speaking: false,
  pending: false,
  paused: false,
};

// Mock SpeechSynthesisUtterance
const utteranceInstances: SpeechSynthesisUtterance[] = [];

class MockSpeechSynthesisUtterance {
  text: string;
  voice: SpeechSynthesisVoice | null = null;
  lang = '';
  volume = 1;
  rate = 1;
  pitch = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
    utteranceInstances.push(this as unknown as SpeechSynthesisUtterance);
  }
}

beforeAll(() => {
  Object.defineProperty(window, 'speechSynthesis', {
    value: mockSpeechSynthesis,
    writable: true,
  });
  (window as Window & { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance =
    MockSpeechSynthesisUtterance;
});

beforeEach(() => {
  mockSpeak.mockClear();
  mockCancel.mockClear();
  mockGetVoices.mockClear();
  utteranceInstances.length = 0;
});

// ─── Wrapper ──────────────────────────────────────────────────────────────────

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

it('should report isSupported as true when speechSynthesis is available', () => {
  const { result } = renderHook(() => useTts(), { wrapper });
  expect(result.current.isSupported).toBe(true);
});

it('should load voices from speechSynthesis', () => {
  const { result } = renderHook(() => useTts(), { wrapper });
  expect(result.current.voices.length).toBe(2);
});

it('should pick the sl-SI voice as currentVoice by default', () => {
  const { result } = renderHook(() => useTts(), { wrapper });
  expect(result.current.currentVoice?.lang).toBe('sl-SI');
});

it('should fall back to default voice when preferred lang is not found', () => {
  const { result } = renderHook(() => useTts({ preferredLang: 'fr-FR' }), { wrapper });
  // Falls back to the voice marked as default (en-US)
  expect(result.current.currentVoice?.lang).toBe('en-US');
});

it('should call speechSynthesis.speak when speak() is called', () => {
  const { result } = renderHook(() => useTts(), { wrapper });

  act(() => {
    result.current.speak('Zavijte desno');
  });

  expect(mockSpeak).toHaveBeenCalledTimes(1);
});

it('should create an utterance with the correct text', () => {
  const { result } = renderHook(() => useTts(), { wrapper });

  act(() => {
    result.current.speak('Nadaljujte naravnost');
  });

  const utterance = utteranceInstances[0] as unknown as MockSpeechSynthesisUtterance;
  expect(utterance.text).toBe('Nadaljujte naravnost');
});

it('should apply volume, rate and pitch to the utterance', () => {
  const { result } = renderHook(
    () => useTts({ volume: 0.5, rate: 1.5, pitch: 0.8 }),
    { wrapper }
  );

  act(() => {
    result.current.speak('Test');
  });

  const utterance = utteranceInstances[0] as unknown as MockSpeechSynthesisUtterance;
  expect(utterance.volume).toBe(0.5);
  expect(utterance.rate).toBe(1.5);
  expect(utterance.pitch).toBe(0.8);
});

it('should cancel and play immediately for urgent priority', () => {
  const { result } = renderHook(() => useTts(), { wrapper });

  act(() => {
    result.current.speak('Preračunavanje poti!', { priority: 'urgent' });
  });

  expect(mockCancel).toHaveBeenCalled();
  expect(mockSpeak).toHaveBeenCalledTimes(1);
});

it('should cancel all speech when cancel() is called', () => {
  const { result } = renderHook(() => useTts(), { wrapper });

  act(() => {
    result.current.speak('First utterance');
    result.current.cancel();
  });

  expect(mockCancel).toHaveBeenCalled();
});

it('should expose a speak function and a cancel function', () => {
  const { result } = renderHook(() => useTts(), { wrapper });
  expect(typeof result.current.speak).toBe('function');
  expect(typeof result.current.cancel).toBe('function');
});

it('should queue multiple normal-priority utterances', () => {
  const { result } = renderHook(() => useTts(), { wrapper });

  act(() => {
    result.current.speak('First');
    result.current.speak('Second');
    result.current.speak('Third');
  });

  // Only the first utterance should be spoken immediately; others are queued
  expect(mockSpeak).toHaveBeenCalledTimes(1);
  const firstUtterance = utteranceInstances[0] as unknown as MockSpeechSynthesisUtterance;
  expect(firstUtterance.text).toBe('First');
});

it('should play next queued item after current utterance ends', () => {
  const { result } = renderHook(() => useTts(), { wrapper });

  act(() => {
    result.current.speak('First');
    result.current.speak('Second');
  });

  // Simulate the first utterance ending
  act(() => {
    const firstUtterance = utteranceInstances[0] as unknown as MockSpeechSynthesisUtterance;
    firstUtterance.onend?.();
  });

  expect(mockSpeak).toHaveBeenCalledTimes(2);
  const secondUtterance = utteranceInstances[1] as unknown as MockSpeechSynthesisUtterance;
  expect(secondUtterance.text).toBe('Second');
});
