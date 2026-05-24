import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { MotoChatPanel } from './moto-chat-panel.js';

function renderPanel(props: Partial<React.ComponentProps<typeof MotoChatPanel>> = {}) {
  const onClose = props.onClose ?? (() => {});
  return render(
    <MockProvider>
      <MotoChatPanel open={false} onClose={onClose} {...props} />
    </MockProvider>
  );
}

it(`renders the panel header with MotoChat title`, () => {
  const { container } = renderPanel({ open: true });
  const spans = container.querySelectorAll(`span`);
  const title = Array.from(spans).find((s) => s.textContent === `MotoChat`);
  expect(title).toBeTruthy();
});

it(`renders the default subtitle`, () => {
  const { container } = renderPanel({ open: true });
  const spans = container.querySelectorAll(`span`);
  const subtitle = Array.from(spans).find((s) => s.textContent === `Vaš AI asistent za motocikliste`);
  expect(subtitle).toBeTruthy();
});

it(`renders a custom subtitle when provided`, () => {
  const { container } = renderPanel({ open: true, subtitle: `Alpski vodnik` });
  const spans = container.querySelectorAll(`span`);
  const subtitle = Array.from(spans).find((s) => s.textContent === `Alpski vodnik`);
  expect(subtitle).toBeTruthy();
});

it(`renders the dialog panel`, () => {
  const { container } = renderPanel({ open: true });
  const dialog = container.querySelector(`[role="dialog"]`);
  expect(dialog).toBeTruthy();
});

it(`renders the input field`, () => {
  const { container } = renderPanel({ open: true });
  const input = container.querySelector(`input[aria-label="Sporočilo"]`) as HTMLInputElement;
  expect(input).toBeTruthy();
});

it(`renders the send button`, () => {
  const { container } = renderPanel({ open: true });
  const sendBtn = container.querySelector(`button[aria-label="Pošlji sporočilo"]`);
  expect(sendBtn).toBeTruthy();
});

it(`send button is disabled when input is empty`, () => {
  const { container } = renderPanel({ open: true });
  const sendBtn = container.querySelector(`button[aria-label="Pošlji sporočilo"]`) as HTMLButtonElement;
  expect(sendBtn.disabled).toBe(true);
});

it(`send button becomes enabled when input has text`, () => {
  const { container } = renderPanel({ open: true });
  const input = container.querySelector(`input[aria-label="Sporočilo"]`) as HTMLInputElement;
  fireEvent.change(input, { target: { value: `Kakšno bo vreme?` } });
  const sendBtn = container.querySelector(`button[aria-label="Pošlji sporočilo"]`) as HTMLButtonElement;
  expect(sendBtn.disabled).toBe(false);
});

it(`input value updates on change`, () => {
  const { container } = renderPanel({ open: true });
  const input = container.querySelector(`input[aria-label="Sporočilo"]`) as HTMLInputElement;
  fireEvent.change(input, { target: { value: `Test sporočilo` } });
  expect(input.value).toBe(`Test sporočilo`);
});

it(`calls onClose when close button is clicked`, () => {
  const onClose = vi.fn();
  const { container } = renderPanel({ open: true, onClose });
  const closeBtn = container.querySelector(`button[aria-label="Zapri MotoChat"]`) as HTMLButtonElement;
  expect(closeBtn).toBeTruthy();
  fireEvent.click(closeBtn);
  expect(onClose).toHaveBeenCalledTimes(1);
});

it(`calls onClose when backdrop is clicked`, () => {
  const onClose = vi.fn();
  const { container } = renderPanel({ open: true, onClose });
  const backdrop = container.querySelector(`[aria-hidden]`) as HTMLElement;
  fireEvent.click(backdrop);
  expect(onClose).toHaveBeenCalledTimes(1);
});

it(`renders the empty state welcome message`, () => {
  const { container } = renderPanel({ open: true });
  const paragraphs = container.querySelectorAll(`p`);
  const welcome = Array.from(paragraphs).find((p) => p.textContent?.includes(`Pozdravljeni`));
  expect(welcome).toBeTruthy();
});

it(`renders the input bar`, () => {
  const { container } = renderPanel({ open: true });
  const inputBar = container.querySelector(`input[aria-label="Sporočilo"]`);
  expect(inputBar).toBeTruthy();
});

it(`applies custom className to the panel`, () => {
  const { container } = renderPanel({ open: true, className: `my-custom-class` });
  const panel = container.querySelector(`.my-custom-class`);
  expect(panel).toBeTruthy();
});
