import { ChatMessage, PlainChatMessage } from './chat-message.js';

const SESSION_A = 'session-001';
const SESSION_B = 'session-002';

/**
 * Returns a list of mock ChatMessage instances.
 * Accepts an optional partial override applied to each message.
 */
export function mockChatMessages(override: Partial<PlainChatMessage> = {}): ChatMessage[] {
  return [
    ChatMessage.from({
      id: 'msg-0001',
      sessionId: SESSION_A,
      role: 'system',
      content: 'You are a helpful AI assistant.',
      createdAt: new Date('2024-01-01T10:00:00Z'),
      ...override,
    }),
    ChatMessage.from({
      id: 'msg-0002',
      sessionId: SESSION_A,
      role: 'user',
      content: 'What is the capital of France?',
      createdAt: new Date('2024-01-01T10:01:00Z'),
      ...override,
    }),
    ChatMessage.from({
      id: 'msg-0003',
      sessionId: SESSION_A,
      role: 'assistant',
      content: 'The capital of France is Paris.',
      createdAt: new Date('2024-01-01T10:01:05Z'),
      ...override,
    }),
    ChatMessage.from({
      id: 'msg-0004',
      sessionId: SESSION_B,
      role: 'user',
      content: 'Tell me a fun fact about space.',
      createdAt: new Date('2024-01-02T09:00:00Z'),
      ...override,
    }),
    ChatMessage.from({
      id: 'msg-0005',
      sessionId: SESSION_B,
      role: 'assistant',
      content: 'A day on Venus is longer than a year on Venus!',
      createdAt: new Date('2024-01-02T09:00:08Z'),
      ...override,
    }),
  ];
}
