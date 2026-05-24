import { describe, it, expect } from 'vitest';
import { ChatMessage } from './chat-message.js';
import { mockChatMessages } from './chat-message.mock.js';

describe('ChatMessage', () => {
  describe('ChatMessage.from()', () => {
    it('should create a ChatMessage from a plain object', () => {
      const plain = {
        id: 'test-id',
        sessionId: 'session-1',
        role: 'user' as const,
        content: 'Hello!',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };
      const msg = ChatMessage.from(plain);
      expect(msg).toBeInstanceOf(ChatMessage);
      expect(msg.id).toBe('test-id');
      expect(msg.sessionId).toBe('session-1');
      expect(msg.role).toBe('user');
      expect(msg.content).toBe('Hello!');
    });

    it('should handle missing optional fields with safe defaults', () => {
      const msg = ChatMessage.from({
        id: '',
        sessionId: '',
        role: 'user',
        content: '',
        createdAt: new Date(),
      });
      expect(msg.id).toBe('');
      expect(msg.sessionId).toBe('');
      expect(msg.content).toBe('');
    });
  });

  describe('ChatMessage.system()', () => {
    it('should create a message with role "system"', () => {
      const msg = ChatMessage.system('You are a helpful assistant.');
      expect(msg.role).toBe('system');
      expect(msg.content).toBe('You are a helpful assistant.');
    });

    it('should generate a unique id', () => {
      const a = ChatMessage.system('prompt');
      const b = ChatMessage.system('prompt');
      expect(a.id).not.toBe(b.id);
    });
  });

  describe('ChatMessage.user()', () => {
    it('should create a message with role "user"', () => {
      const msg = ChatMessage.user('What is 2 + 2?');
      expect(msg.role).toBe('user');
      expect(msg.content).toBe('What is 2 + 2?');
    });

    it('should accept a sessionId', () => {
      const msg = ChatMessage.user('Hello', 'session-42');
      expect(msg.sessionId).toBe('session-42');
    });
  });

  describe('ChatMessage.assistant()', () => {
    it('should create a message with role "assistant"', () => {
      const msg = ChatMessage.assistant('The answer is 4.');
      expect(msg.role).toBe('assistant');
      expect(msg.content).toBe('The answer is 4.');
    });
  });

  describe('toObject()', () => {
    it('should serialize to a plain object with an id field', () => {
      const msg = ChatMessage.user('Serialize me', 'sess-1');
      const obj = msg.toObject();
      expect(obj).toHaveProperty('id');
      expect(obj).toHaveProperty('sessionId', 'sess-1');
      expect(obj).toHaveProperty('role', 'user');
      expect(obj).toHaveProperty('content', 'Serialize me');
      expect(obj).toHaveProperty('createdAt');
    });

    it('should return a plain object (not a class instance)', () => {
      const msg = ChatMessage.assistant('Hi there');
      const obj = msg.toObject();
      expect(obj.constructor).toBe(Object);
    });
  });

  describe('mockChatMessages()', () => {
    it('should return an array of ChatMessage instances', () => {
      const messages = mockChatMessages();
      expect(messages.length).toBeGreaterThan(0);
      messages.forEach((m) => expect(m).toBeInstanceOf(ChatMessage));
    });

    it('should apply partial overrides', () => {
      const messages = mockChatMessages({ sessionId: 'override-session' });
      messages.forEach((m) => expect(m.sessionId).toBe('override-session'));
    });

    it('should include all three roles in the default mock set', () => {
      const messages = mockChatMessages();
      const roles = messages.map((m) => m.role);
      expect(roles).toContain('system');
      expect(roles).toContain('user');
      expect(roles).toContain('assistant');
    });
  });
});
