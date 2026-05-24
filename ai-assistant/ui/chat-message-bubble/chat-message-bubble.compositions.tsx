import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ChatMessageBubble } from './chat-message-bubble.js';
import {
  mockUserMessage,
  mockAssistantMessage,
  mockAssistantSimple,
  mockAssistantNoCitations,
} from './chat-message-bubble.mock.js';

function ChatContainer({ children }: { children: React.ReactNode }) {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <div style={{ maxWidth: '720px', width: '100%', margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </MockProvider>
  );
}

/**
 * ConversationThread — a realistic back-and-forth conversation
 * with user and assistant messages, including citations.
 */
export const ConversationThread = () => {
  return (
    <ChatContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <ChatMessageBubble
          role={mockUserMessage.role}
          content={mockUserMessage.content}
        />
        <ChatMessageBubble
          role={mockAssistantMessage.role}
          content={mockAssistantMessage.content}
          citations={mockAssistantMessage.citations}
        />
        <ChatMessageBubble
          role="user"
          content={`Kakšno bo vreme jutri v Bovcu?`}
        />
        <ChatMessageBubble
          role={mockAssistantSimple.role}
          content={mockAssistantSimple.content}
          citations={mockAssistantSimple.citations}
        />
      </div>
    </ChatContainer>
  );
};

/**
 * UserBubble — isolated user message bubble with accent gradient.
 */
export const UserBubble = () => {
  return (
    <ChatContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ChatMessageBubble
          role="user"
          content={`Predlagaj vijugasto pot po Soški dolini za vikend izlet z motorjem.`}
        />
        <ChatMessageBubble
          role="user"
          content={`Ali je danes primerno za vožnjo čez Kotor serpentine?`}
        />
        <ChatMessageBubble
          role="user"
          content={`Kje je najbližja bencinska črpalka na Transfăgărășan?`}
        />
      </div>
    </ChatContainer>
  );
};

/**
 * AssistantBubble — assistant messages with markdown bullets, bold text and citations.
 */
export const AssistantBubble = () => {
  return (
    <ChatContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <ChatMessageBubble
          role={mockAssistantMessage.role}
          content={mockAssistantMessage.content}
          citations={mockAssistantMessage.citations}
        />
        <ChatMessageBubble
          role={mockAssistantNoCitations.role}
          content={mockAssistantNoCitations.content}
        />
      </div>
    </ChatContainer>
  );
};
