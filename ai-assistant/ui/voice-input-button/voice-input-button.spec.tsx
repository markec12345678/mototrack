import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { VoiceInputButton } from './voice-input-button.js';
import styles from './voice-input-button.module.scss';

type MockRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
};

let mockRecognitionInstance: MockRecognition | null = null;

const MockSpeechRecognition = vi.fn(() => {
  const instance: MockRecognition = {
    lang: ``,
    continuous: false,
    interimResults: false,
    start: vi.fn(),
    stop: vi.fn(),
    onresult: null,
    onerror: null,
    onend: null,
  };
  mockRecognitionInstance = instance;
  return instance;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

describe('VoiceInputButton', () => {
  beforeEach(() => {
    mockRecognitionInstance = null;
    g.SpeechRecognition = MockSpeechRecognition;
    delete g.webkitSpeechRecognition;
  });

  afterEach(() => {
    delete g.SpeechRecognition;
    delete g.webkitSpeechRecognition;
  });

  it('renders the button when SpeechRecognition is supported', () => {
    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={() => {}} />
      </MockProvider>
    );
    const wrapper = container.querySelector(`.${styles.wrapper}`);
    expect(wrapper).toBeTruthy();
  });

  it('does not render when SpeechRecognition is unsupported', () => {
    delete g.SpeechRecognition;
    delete g.webkitSpeechRecognition;

    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={() => {}} />
      </MockProvider>
    );
    const wrapper = container.querySelector(`.${styles.wrapper}`);
    expect(wrapper).toBeNull();
  });

  it('starts recognition with sl-SI locale by default when button is clicked', () => {
    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={() => {}} />
      </MockProvider>
    );
    const button = container.querySelector(`button`);
    expect(button).toBeTruthy();
    fireEvent.click(button!);
    expect(mockRecognitionInstance).toBeTruthy();
    expect(mockRecognitionInstance!.lang).toBe(`sl-SI`);
    expect(mockRecognitionInstance!.start).toHaveBeenCalledTimes(1);
  });

  it('uses a custom locale when provided', () => {
    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={() => {}} locale="en-US" />
      </MockProvider>
    );
    const button = container.querySelector(`button`);
    expect(button).toBeTruthy();
    fireEvent.click(button!);
    expect(mockRecognitionInstance!.lang).toBe(`en-US`);
  });

  it('shows pulse rings while listening', () => {
    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={() => {}} />
      </MockProvider>
    );
    const button = container.querySelector(`button`);
    expect(button).toBeTruthy();
    act(() => {
      fireEvent.click(button!);
    });
    const pulses = container.querySelectorAll(`.${styles.pulse}`);
    expect(pulses.length).toBe(2);
  });

  it('does not show pulse rings before listening starts', () => {
    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={() => {}} />
      </MockProvider>
    );
    const pulses = container.querySelectorAll(`.${styles.pulse}`);
    expect(pulses.length).toBe(0);
  });

  it('calls onResult with the transcript when speech is recognised', () => {
    const handleResult = vi.fn();
    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={(text) => handleResult(text)} />
      </MockProvider>
    );
    const button = container.querySelector(`button`);
    expect(button).toBeTruthy();
    fireEvent.click(button!);
    expect(mockRecognitionInstance).toBeTruthy();

    const fakeEvent = {
      results: {
        length: 1,
        item: () => null,
        0: { isFinal: true, 0: { transcript: `Zdravo svet` } },
      },
    };

    act(() => {
      mockRecognitionInstance!.onresult!(fakeEvent);
    });
    expect(handleResult).toHaveBeenCalledWith(`Zdravo svet`);
  });

  it('stops recognition when button is clicked while listening', () => {
    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={() => {}} />
      </MockProvider>
    );
    const button = container.querySelector(`button`);
    expect(button).toBeTruthy();
    act(() => {
      fireEvent.click(button!);
    });
    const savedInstance = mockRecognitionInstance;
    expect(savedInstance).toBeTruthy();
    expect(savedInstance!.start).toHaveBeenCalledTimes(1);
    const button2 = container.querySelector(`button`);
    act(() => {
      fireEvent.click(button2!);
    });
    expect(savedInstance!.stop).toHaveBeenCalledTimes(1);
  });

  it('applies the wrapper class', () => {
    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={() => {}} />
      </MockProvider>
    );
    const wrapper = container.querySelector(`.${styles.wrapper}`);
    expect(wrapper).toBeTruthy();
  });

  it('applies a custom className to the wrapper', () => {
    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={() => {}} className="my-custom-class" />
      </MockProvider>
    );
    const wrapper = container.querySelector(`.my-custom-class`);
    expect(wrapper).toBeTruthy();
  });

  it('applies the listening class to the wrapper while listening', () => {
    const { container } = render(
      <MockProvider>
        <VoiceInputButton onResult={() => {}} />
      </MockProvider>
    );
    const button = container.querySelector(`button`);
    expect(button).toBeTruthy();
    act(() => {
      fireEvent.click(button!);
    });
    const wrapper = container.querySelector(`.${styles.listening}`);
    expect(wrapper).toBeTruthy();
  });
});
