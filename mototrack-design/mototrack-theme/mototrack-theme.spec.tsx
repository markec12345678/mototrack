import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MototrackTheme } from './mototrack-theme.js';
import { useThemeController } from './theme-controller.js';
import styles from './mototrack-theme.module.scss';

it('renders children correctly', () => {
  const { getByText } = render(
    <MototrackTheme>
      <span>Hello MotoTrack</span>
    </MototrackTheme>
  );
  expect(getByText('Hello MotoTrack')).toBeTruthy();
});

it('applies the theme class to the root element', () => {
  const { container } = render(
    <MototrackTheme>
      <span>content</span>
    </MototrackTheme>
  );
  const root = container.querySelector(`.${styles.mototrackTheme}`);
  expect(root).toBeTruthy();
});

it('applies a custom className alongside the theme class', () => {
  const { container } = render(
    <MototrackTheme className="custom-class">
      <span>content</span>
    </MototrackTheme>
  );
  const root = container.querySelector('.custom-class');
  expect(root).toBeTruthy();
});

it('renders multiple children', () => {
  const { getByText } = render(
    <MototrackTheme>
      <span>First</span>
      <span>Second</span>
    </MototrackTheme>
  );
  expect(getByText('First')).toBeTruthy();
  expect(getByText('Second')).toBeTruthy();
});

it('renders with dark initialTheme without errors', () => {
  const { getByText } = render(
    <MototrackTheme initialTheme="dark">
      <span>Dark mode</span>
    </MototrackTheme>
  );
  expect(getByText('Dark mode')).toBeTruthy();
});

function ThemeConsumer() {
  const { themeMode, toggleTheme } = useThemeController();
  return (
    <div>
      <span className="mode">{themeMode}</span>
      <button type="button" onClick={() => toggleTheme()}>
        Toggle
      </button>
    </div>
  );
}

it('provides theme context with default mode', () => {
  const { container } = render(
    <MototrackTheme>
      <ThemeConsumer />
    </MototrackTheme>
  );
  const modeEl = container.querySelector('.mode') as HTMLSpanElement;
  expect(modeEl.textContent).toBe('default');
});

it('provides theme context with dark initial mode', () => {
  const { container } = render(
    <MototrackTheme initialTheme="dark">
      <ThemeConsumer />
    </MototrackTheme>
  );
  const modeEl = container.querySelector('.mode') as HTMLSpanElement;
  expect(modeEl.textContent).toBe('dark');
});

it('toggles theme mode when toggleTheme is called', () => {
  const { container, getByText } = render(
    <MototrackTheme>
      <ThemeConsumer />
    </MototrackTheme>
  );

  const modeEl = container.querySelector('.mode') as HTMLSpanElement;
  expect(modeEl.textContent).toBe('default');

  const button = getByText('Toggle') as HTMLButtonElement;
  fireEvent.click(button);

  const updatedModeEl = container.querySelector('.mode') as HTMLSpanElement;
  expect(updatedModeEl.textContent).toBe('dark');
});

it('throws when useThemeController is used outside MototrackTheme', () => {
  const originalError = console.error;
  console.error = () => {};
  expect(() => render(<ThemeConsumer />)).toThrow();
  console.error = originalError;
});
