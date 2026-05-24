import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QuickPrompts } from './quick-prompts.js';
import type { QuickPrompt } from './quick-prompts.js';
import styles from './quick-prompts.module.scss';

const mockPrompts: QuickPrompt[] = [
  { id: `1`, label: `Predlagaj vijugasto pot po Soški dolini` },
  { id: `2`, label: `Kakšno bo vreme jutri v Bovcu?` },
  { id: `3`, label: `Pripravi seznam pred vožnjo na Vršič` },
];

function renderComponent(props: Partial<React.ComponentProps<typeof QuickPrompts>> = {}) {
  return render(
    <MemoryRouter>
      <QuickPrompts prompts={mockPrompts} {...props} />
    </MemoryRouter>
  );
}

it('renders all prompt chips', () => {
  const { container } = renderComponent();
  const chips = container.querySelectorAll(`.${styles.chip}`);
  expect(chips.length).toBe(3);
});

it('renders the correct label text for each chip', () => {
  const { getByText } = renderComponent();
  expect(getByText(`Predlagaj vijugasto pot po Soški dolini`)).toBeTruthy();
  expect(getByText(`Kakšno bo vreme jutri v Bovcu?`)).toBeTruthy();
  expect(getByText(`Pripravi seznam pred vožnjo na Vršič`)).toBeTruthy();
});

it('calls onSelect with the correct label when a chip is clicked', () => {
  const onSelect = vi.fn();
  const { container } = renderComponent({ onSelect });
  const chips = container.querySelectorAll(`.${styles.chip}`);
  fireEvent.click(chips[1] as HTMLElement);
  expect(onSelect).toHaveBeenCalledWith(`Kakšno bo vreme jutri v Bovcu?`);
});

it('calls onSelect with the first chip label when clicked', () => {
  const onSelect = vi.fn();
  const { container } = renderComponent({ onSelect });
  const chips = container.querySelectorAll(`.${styles.chip}`);
  fireEvent.click(chips[0] as HTMLElement);
  expect(onSelect).toHaveBeenCalledWith(`Predlagaj vijugasto pot po Soški dolini`);
});

it('does not throw when onSelect is not provided', () => {
  const { container } = renderComponent({ onSelect: undefined });
  const chips = container.querySelectorAll(`.${styles.chip}`);
  expect(() => fireEvent.click(chips[0] as HTMLElement)).not.toThrow();
});

it('renders default prompts when no prompts prop is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <QuickPrompts />
    </MemoryRouter>
  );
  const chips = container.querySelectorAll(`.${styles.chip}`);
  expect(chips.length).toBe(5);
});

it('applies a custom className to the root element', () => {
  const { container } = renderComponent({ className: `myCustomClass` });
  const root = container.querySelector(`.${styles.root}`);
  expect(root?.classList.contains(`myCustomClass`)).toBe(true);
});

it('renders chips as button elements', () => {
  const { container } = renderComponent();
  const buttons = container.querySelectorAll(`button.${styles.chip}`);
  expect(buttons.length).toBe(3);
});

it('renders the track container', () => {
  const { container } = renderComponent();
  const track = container.querySelector(`.${styles.track}`);
  expect(track).toBeTruthy();
});
