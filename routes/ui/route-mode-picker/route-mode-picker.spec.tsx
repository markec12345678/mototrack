import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { RouteModePicker } from './route-mode-picker.js';
import styles from './route-mode-picker.module.scss';

function renderPicker(props: React.ComponentProps<typeof RouteModePicker> = {}) {
  return render(
    <MemoryRouter>
      <RouteModePicker {...props} />
    </MemoryRouter>
  );
}

it('renders all three mode segments', () => {
  const { container } = renderPicker();
  const segments = container.querySelectorAll(`.${styles.segment}`);
  expect(segments.length).toBe(3);
});

it('renders the correct labels for each mode', () => {
  const { getByText } = renderPicker();
  expect(getByText('Asfalt')).toBeTruthy();
  expect(getByText('Vijugasto')).toBeTruthy();
  expect(getByText('Terensko')).toBeTruthy();
});

it('renders the correct emojis for each mode', () => {
  const { getByText } = renderPicker();
  expect(getByText('🛣️')).toBeTruthy();
  expect(getByText('🌀')).toBeTruthy();
  expect(getByText('🏔️')).toBeTruthy();
});

it('applies the active class to the default active segment (asfalt)', () => {
  const { container } = renderPicker({ activeMode: `asfalt` });
  const activeSegment = container.querySelector(`.${styles.asfalt}.${styles.active}`);
  expect(activeSegment).toBeTruthy();
});

it('applies the active class to vijugasto when set as active', () => {
  const { container } = renderPicker({ activeMode: `vijugasto` });
  const activeSegment = container.querySelector(`.${styles.vijugasto}.${styles.active}`);
  expect(activeSegment).toBeTruthy();
});

it('applies the active class to terensko when set as active', () => {
  const { container } = renderPicker({ activeMode: `terensko` });
  const activeSegment = container.querySelector(`.${styles.terensko}.${styles.active}`);
  expect(activeSegment).toBeTruthy();
});

it('does not apply active class to inactive segments', () => {
  const { container } = renderPicker({ activeMode: `asfalt` });
  const inactiveVijugasto = container.querySelector(`.${styles.vijugasto}.${styles.active}`);
  const inactiveTerensko = container.querySelector(`.${styles.terensko}.${styles.active}`);
  expect(inactiveVijugasto).toBeNull();
  expect(inactiveTerensko).toBeNull();
});

it('calls onModeChange with the correct mode when a segment is clicked', () => {
  const onModeChange = vi.fn();
  const { getByText } = renderPicker({ activeMode: `asfalt`, onModeChange });
  fireEvent.click(getByText('Vijugasto'));
  expect(onModeChange).toHaveBeenCalledWith('vijugasto');
});

it('calls onModeChange with terensko when terensko segment is clicked', () => {
  const onModeChange = vi.fn();
  const { getByText } = renderPicker({ activeMode: `asfalt`, onModeChange });
  fireEvent.click(getByText('Terensko'));
  expect(onModeChange).toHaveBeenCalledWith('terensko');
});

it('does not throw when onModeChange is not provided', () => {
  const { getByText } = renderPicker({ activeMode: `asfalt` });
  expect(() => fireEvent.click(getByText('Vijugasto'))).not.toThrow();
});

it('renders custom options when provided', () => {
  const customOptions = [
    { mode: 'asfalt' as const, label: 'Paved', emoji: '🛣️' },
    { mode: 'terensko' as const, label: 'Offroad', emoji: '🏔️' },
  ];
  const { getByText, container } = renderPicker({ options: customOptions });
  expect(getByText('Paved')).toBeTruthy();
  expect(getByText('Offroad')).toBeTruthy();
  const segments = container.querySelectorAll(`.${styles.segment}`);
  expect(segments.length).toBe(2);
});

it('sets aria-pressed true on the active segment', () => {
  const { container } = renderPicker({ activeMode: `terensko` });
  const activeBtn = container.querySelector(`.${styles.terensko}.${styles.active}`) as HTMLButtonElement;
  expect(activeBtn.getAttribute('aria-pressed')).toBe('true');
});

it('sets aria-pressed false on inactive segments', () => {
  const { container } = renderPicker({ activeMode: `asfalt` });
  const inactiveBtn = container.querySelector(`.${styles.vijugasto}`) as HTMLButtonElement;
  expect(inactiveBtn.getAttribute('aria-pressed')).toBe('false');
});

it('applies a custom className to the root element', () => {
  const { container } = renderPicker({ className: 'my-custom-class' });
  const root = container.querySelector('.my-custom-class');
  expect(root).toBeTruthy();
});
