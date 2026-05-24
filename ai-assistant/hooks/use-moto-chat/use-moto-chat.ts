import { useState, useEffect, useCallback, useRef } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { ChatMessage } from '@markec/ai-assistant.entities.chat-message';

// Browser SpeechRecognition types - not always present in lib.dom.d.ts
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultEntry {
  readonly length: number;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionResultListEntry {
  readonly length: number;
  [index: number]: SpeechRecognitionResultEntry;
}

interface SpeechRecognitionEventData extends Event {
  readonly results: SpeechRecognitionResultListEntry;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventData) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const STORAGE_KEY = 'mototrack:chat';

const CHAT_MUTATION = gql`
  mutation Chat($messages: [ChatMessageInput!]!, $context: ChatContextInput) {
    chat(messages: $messages, context: $context) {
      reply
      citations {
        title
        url
      }
    }
  }
`;

export type ChatCitation = {
  title: string;
  url: string;
};

export type ChatResult = {
  reply: string;
  citations?: ChatCitation[];
};

export type ChatLocationInput = {
  lat?: number;
  lng?: number;
};

export type ChatContextInput = {
  currentLocation?: ChatLocationInput;
};

export type UseMotoChat = {
  /**
   * The full in-memory + persisted session message history.
   */
  messages: ChatMessage[];

  /**
   * Send a new user message and await the assistant reply.
   * @param text - The user's message text.
   * @param context - Optional location context to send with the mutation.
   */
  send: (text: string, context?: ChatContextInput) => Promise<void>;

  /**
   * Whether the assistant is currently generating a reply.
   */
  isThinking: boolean;

  /**
   * Clear all messages from memory and localStorage.
   */
  clear: () => void;

  /**
   * Whether voice input (SpeechRecognition) is supported in this browser.
   */
  isVoiceSupported: boolean;

  /**
   * Whether the hook is currently listening for voice input.
   */
  isListening: boolean;

  /**
   * Start listening for voice input via SpeechRecognition (sl-SI locale).
   * Automatically calls send() when speech ends.
   */
  startListening: () => void;

  /**
   * Stop listening for voice input.
   */
  stopListening: () => void;
};

function loadFromStorage(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ChatMessage[];
  } catch {
    return [];
  }
}

function saveToStorage(messages: ChatMessage[]): void {
  try {
    if (messages.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  } catch {
    // Silently ignore storage errors (e.g. private browsing quota)
  }
}

function buildInputMessages(messages: ChatMessage[]) {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

/**
 * useMotoChat - manages a full AI chat session for the MotoTrack assistant.
 *
 * Executes the GraphQL chat mutation with the full session history on every
 * send, persists messages to localStorage under the key mototrack:chat, and
 * optionally captures voice input via the browser SpeechRecognition API (sl-SI).
 *
 * @returns An object with messages, send, isThinking, clear,
 *          isVoiceSupported, isListening, startListening, stopListening.
 */
export function useMotoChat(): UseMotoChat {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadFromStorage());
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
    typeof window !== 'undefined'
      ? ((window as WindowWithSpeech).SpeechRecognition ?? (window as WindowWithSpeech).webkitSpeechRecognition)
      : undefined;

  const isVoiceSupported = Boolean(SpeechRecognitionCtor);

  const [chatMutation] = useMutation<{ chat: ChatResult }>(CHAT_MUTATION);

  useEffect(() => {
    saveToStorage(messages);
  }, [messages]);

  const send = useCallback(
    async (text: string, context?: ChatContextInput) => {
      const trimmed = text.trim();
      if (!trimmed || isThinking) return;

      const userMessage = ChatMessage.user(trimmed);
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setIsThinking(true);

      try {
        const result = await chatMutation({
          variables: {
            messages: buildInputMessages(nextMessages),
            context: context ?? null,
          },
        });

        const reply = result.data?.chat.reply;
        if (reply) {
          const assistantMessage = ChatMessage.assistant(reply);
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (err) {
        const errorMessage = ChatMessage.assistant(
          'Oprostite, prislo je do napake. Prosim poskusite znova.'
        );
        setMessages((prev) => [...prev, errorMessage]);
        console.error('[useMotoChat] chat mutation error:', err);
      } finally {
        setIsThinking(false);
      }
    },
    [messages, isThinking, chatMutation]
  );

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionCtor || isListening) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'sl-SI';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      if (transcript) {
        send(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [SpeechRecognitionCtor, isListening, send]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  return {
    messages,
    send,
    isThinking,
    clear,
    isVoiceSupported,
    isListening,
    startListening,
    stopListening,
  };
}
