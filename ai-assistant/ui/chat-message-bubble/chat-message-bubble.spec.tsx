import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ChatMessageBubble } from './chat-message-bubble.js';
import styles from './chat-message-bubble.module.scss';
import {
  mockUserMessage,
  mockAssistantMessage,
  mockAssistantNoCitations,
} from './chat-message-bubble.mock.js';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('renders user message content', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble role="user" content="Hello from user" />
  );
  const text = container.querySelector(`.${styles.userText}`);
  expect(text).toBeTruthy();
  expect(text?.textContent).toBe('Hello from user');
});

it('applies userWrapper class for user role', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble role="user" content="User message" />
  );
  const wrapper = container.querySelector(`.${styles.userWrapper}`);
  expect(wrapper).toBeTruthy();
});

it('applies assistantWrapper class for assistant role', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble role="assistant" content="Assistant message" />
  );
  const wrapper = container.querySelector(`.${styles.assistantWrapper}`);
  expect(wrapper).toBeTruthy();
});

it('renders assistant avatar for assistant role', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble role="assistant" content="Hello from assistant" />
  );
  const avatar = container.querySelector(`.${styles.avatar}`);
  expect(avatar).toBeTruthy();
});

it('does not render avatar for user role', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble role="user" content="User message" />
  );
  const avatar = container.querySelector(`.${styles.avatar}`);
  expect(avatar).toBeNull();
});

it('renders bold text from **markdown** syntax', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble role="assistant" content="This is **bold** text" />
  );
  const bold = container.querySelector(`.${styles.bold}`);
  expect(bold).toBeTruthy();
  expect(bold?.textContent).toBe('bold');
});

it('renders bullet list items', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble
      role="assistant"
      content={`Intro line\n- First item\n- Second item\n- Third item`}
    />
  );
  const bullets = container.querySelectorAll(`.${styles.bulletItem}`);
  expect(bullets.length).toBe(3);
});

it('renders citations when provided', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble
      role={mockAssistantMessage.role}
      content={mockAssistantMessage.content}
      citations={mockAssistantMessage.citations}
    />
  );
  const citationLinks = container.querySelectorAll(`.${styles.citationLink}`);
  expect(citationLinks.length).toBe(mockAssistantMessage.citations.length);
});

it('renders citation titles', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble
      role="assistant"
      content="Some content"
      citations={[{ title: `Slovenija.info`, url: `https://www.slovenia.info` }]}
    />
  );
  const title = container.querySelector(`.${styles.citationTitle}`);
  expect(title?.textContent).toBe(`Slovenija.info`);
});

it('does not render citations section when citations are absent', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble
      role={mockAssistantNoCitations.role}
      content={mockAssistantNoCitations.content}
    />
  );
  const citationsSection = container.querySelector(`.${styles.citationsSection}`);
  expect(citationsSection).toBeNull();
});

it('applies custom className to wrapper', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble role="user" content="Test" className="custom-class" />
  );
  const wrapper = container.querySelector('.custom-class');
  expect(wrapper).toBeTruthy();
});

it('renders user bubble with accent gradient class', () => {
  const { container } = renderWithProvider(
    <ChatMessageBubble role={mockUserMessage.role} content={mockUserMessage.content} />
  );
  const bubble = container.querySelector(`.${styles.userBubble}`);
  expect(bubble).toBeTruthy();
});

it('renders citation links with correct href', () => {
  const citations = [{ title: `Test Source`, url: `https://example.com` }];
  const { container } = renderWithProvider(
    <ChatMessageBubble role="assistant" content="Content" citations={citations} />
  );
  const link = container.querySelector(`.${styles.citationLink}`) as HTMLAnchorElement;
  expect(link?.href.includes('example.com')).toBe(true);
});
