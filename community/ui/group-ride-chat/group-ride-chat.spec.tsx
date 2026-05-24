import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { GroupRideChat } from './group-ride-chat.js';
import { MOCK_MESSAGES, MOCK_MY_SENDER_ID } from './group-ride-chat.mock.js';
import { ChatMessage } from './chat-message-type.js';
import styles from './group-ride-chat.module.scss';

function renderChat(props: Partial<React.ComponentProps<typeof GroupRideChat>> = {}) {
  return render(
    <MockProvider>
      <GroupRideChat
        rideId="test-ride"
        rideName="Test Ride"
        currentUserId={MOCK_MY_SENDER_ID}
        initialMessages={MOCK_MESSAGES}
        {...props}
      />
    </MockProvider>
  );
}

it('renders the ride name in the header', () => {
  const { getByText } = renderChat({ rideName: `Vršič Adventure Ride` });
  expect(getByText(`Vršič Adventure Ride`)).toBeTruthy();
});

it('renders all mock messages', () => {
  const { getByText } = renderChat();
  expect(getByText(MOCK_MESSAGES[0].text)).toBeTruthy();
  expect(getByText(MOCK_MESSAGES[1].text)).toBeTruthy();
});

it('renders sender names for non-own messages', () => {
  const { container } = renderChat();
  const otherMsg = MOCK_MESSAGES.find((m) => m.senderId !== MOCK_MY_SENDER_ID);
  expect(otherMsg).toBeTruthy();
  const senderNameEls = container.querySelectorAll(`.${styles.senderName}`);
  const found = Array.from(senderNameEls).some((el) => el.textContent === otherMsg!.senderName);
  expect(found).toBe(true);
});

it('renders country flags for messages', () => {
  const { container } = renderChat();
  const flags = container.querySelectorAll(`.${styles.countryFlag}`);
  expect(flags.length).toBeGreaterThan(0);
});

it('renders status pills', () => {
  const { getByText } = renderChat();
  expect(getByText(`Pripravljen`)).toBeTruthy();
  expect(getByText(`Na poti`)).toBeTruthy();
  expect(getByText(`Odmor`)).toBeTruthy();
  expect(getByText(`Konec`)).toBeTruthy();
});

it('renders the send input', () => {
  const { container } = renderChat();
  const input = container.querySelector(`.${styles.sendInput}`);
  expect(input).toBeTruthy();
});

it('renders the send button disabled when input is empty', () => {
  const { container } = renderChat();
  const sendBtn = container.querySelector(`.${styles.sendBtn}`) as HTMLButtonElement;
  expect(sendBtn).toBeTruthy();
  expect(sendBtn.disabled).toBe(true);
});

it('enables send button when input has text', () => {
  const { container } = renderChat();
  const input = container.querySelector(`.${styles.sendInput}`) as HTMLInputElement;
  fireEvent.change(input, { target: { value: `Zdravo!` } });
  const sendBtn = container.querySelector(`.${styles.sendBtn}`) as HTMLButtonElement;
  expect(sendBtn.disabled).toBe(false);
});

it('clears input after sending a message', () => {
  const { container } = renderChat();
  const input = container.querySelector(`.${styles.sendInput}`) as HTMLInputElement;
  fireEvent.change(input, { target: { value: `Test sporočilo` } });
  const sendBtn = container.querySelector(`.${styles.sendBtn}`) as HTMLButtonElement;
  fireEvent.click(sendBtn);
  const updatedInput = container.querySelector(`.${styles.sendInput}`) as HTMLInputElement;
  expect(updatedInput.value).toBe(``);
});

it('sends message on Enter key press', () => {
  const { container } = renderChat();
  const input = container.querySelector(`.${styles.sendInput}`) as HTMLInputElement;
  fireEvent.change(input, { target: { value: `Enter test` } });
  fireEvent.keyDown(input, { key: `Enter` });
  const updatedInput = container.querySelector(`.${styles.sendInput}`) as HTMLInputElement;
  expect(updatedInput.value).toBe(``);
});

it('renders empty state when no messages', () => {
  const { container } = renderChat({ initialMessages: [] });
  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState).toBeTruthy();
});

it('renders the location share button', () => {
  const { container } = renderChat();
  const iconBtns = container.querySelectorAll(`.${styles.iconBtn}`);
  expect(iconBtns.length).toBeGreaterThan(0);
});

it('applies active class to selected status pill', () => {
  const { getByText } = renderChat();
  const naPotiPill = getByText(`Na poti`).closest(`button`);
  fireEvent.click(naPotiPill!);
  expect(naPotiPill!.className).toContain(styles.pillNaPoti);
});

it('renders participant count badge', () => {
  const { container } = renderChat();
  const badge = container.querySelector(`.${styles.participantCount}`);
  expect(badge).toBeTruthy();
  expect(badge!.textContent).toContain(`udeležencev`);
});

it('renders own messages with own bubble class', () => {
  const ownMessages: ChatMessage[] = [
    {
      id: `own-1`,
      senderId: `me`,
      senderName: `Jaz`,
      senderCountry: `🇸🇮`,
      text: `Moje sporočilo`,
      at: Date.now(),
    },
  ];
  const { container } = renderChat({ currentUserId: `me`, initialMessages: ownMessages });
  const ownBubble = container.querySelector(`.${styles.bubbleOwn}`);
  expect(ownBubble).toBeTruthy();
});
