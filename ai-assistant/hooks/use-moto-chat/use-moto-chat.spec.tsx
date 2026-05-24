import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useMotoChat } from './use-moto-chat.js';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockProvider>{children}</MockProvider>
);

describe('useMotoChat', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialise with empty messages when localStorage is empty', () => {
    const { result } = renderHook(() => useMotoChat(), { wrapper });
    expect(result.current.messages).toHaveLength(0);
  });

  it('should start with isThinking false', () => {
    const { result } = renderHook(() => useMotoChat(), { wrapper });
    expect(result.current.isThinking).toBe(false);
  });

  it('should start with isListening false', () => {
    const { result } = renderHook(() => useMotoChat(), { wrapper });
    expect(result.current.isListening).toBe(false);
  });

  it('should expose send, clear, startListening, stopListening as functions', () => {
    const { result } = renderHook(() => useMotoChat(), { wrapper });
    expect(typeof result.current.send).toBe('function');
    expect(typeof result.current.clear).toBe('function');
    expect(typeof result.current.startListening).toBe('function');
    expect(typeof result.current.stopListening).toBe('function');
  });

  it('should expose isVoiceSupported as a boolean', () => {
    const { result } = renderHook(() => useMotoChat(), { wrapper });
    expect(typeof result.current.isVoiceSupported).toBe('boolean');
  });

  it('should clear messages and remove from localStorage', () => {
    localStorage.setItem(
      'mototrack:chat',
      JSON.stringify([{ role: 'user', content: 'Test', id: '1', sessionId: 's1', createdAt: new Date().toISOString() }])
    );

    const { result } = renderHook(() => useMotoChat(), { wrapper });

    act(() => {
      result.current.clear();
    });

    expect(result.current.messages).toHaveLength(0);
    expect(localStorage.getItem('mototrack:chat')).toBeNull();
  });

  it('should load persisted messages from localStorage on mount', () => {
    const stored = [
      { role: 'user', content: 'Zdravo!', id: '1', sessionId: 's1', createdAt: new Date().toISOString() },
      { role: 'assistant', content: 'Živjo, kako ti lahko pomagam?', id: '2', sessionId: 's1', createdAt: new Date().toISOString() },
    ];
    localStorage.setItem('mototrack:chat', JSON.stringify(stored));

    const { result } = renderHook(() => useMotoChat(), { wrapper });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[1].role).toBe('assistant');
  });

  it('should not throw when send is called with empty string', async () => {
    const { result } = renderHook(() => useMotoChat(), { wrapper });

    await act(async () => {
      await result.current.send('');
    });

    expect(result.current.messages).toHaveLength(0);
  });

  it('should not throw when send is called with whitespace only', async () => {
    const { result } = renderHook(() => useMotoChat(), { wrapper });

    await act(async () => {
      await result.current.send('   ');
    });

    expect(result.current.messages).toHaveLength(0);
  });

  it('should not start listening when SpeechRecognition is not supported', () => {
    const { result } = renderHook(() => useMotoChat(), { wrapper });

    // In jsdom, SpeechRecognition is not available, so isVoiceSupported is false
    if (!result.current.isVoiceSupported) {
      act(() => {
        result.current.startListening();
      });
      expect(result.current.isListening).toBe(false);
    }
  });

  it('should stopListening without error when not listening', () => {
    const { result } = renderHook(() => useMotoChat(), { wrapper });

    act(() => {
      result.current.stopListening();
    });

    expect(result.current.isListening).toBe(false);
  });

  it('should persist messages to localStorage after clear', () => {
    localStorage.setItem(
      'mototrack:chat',
      JSON.stringify([{ role: 'user', content: 'Zdravo!', id: '1', sessionId: 's1', createdAt: new Date().toISOString() }])
    );

    const { result } = renderHook(() => useMotoChat(), { wrapper });

    act(() => {
      result.current.clear();
    });

    expect(localStorage.getItem('mototrack:chat')).toBeNull();
  });
});
