import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Link } from './link.js';
import styles from './link.module.scss';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render link children text', () => {
  const { getByText } = renderWithRouter(
    <Link href="/races">Race Calendar</Link>
  );
  expect(getByText('Race Calendar')).toBeTruthy();
});

it('should render as an anchor tag for external links', () => {
  const { container } = renderWithRouter(
    <Link href="https://www.motogp.com" external>MotoGP</Link>
  );
  const anchor = container.querySelector('a');
  expect(anchor).toBeTruthy();
  expect(anchor?.getAttribute('target')).toBe('_blank');
  expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
});

it('should include the external icon for external links', () => {
  const { container } = renderWithRouter(
    <Link href="https://www.motogp.com" external>MotoGP</Link>
  );
  const icon = container.querySelector(`.${styles.externalIcon}`);
  expect(icon).toBeTruthy();
});

it('should not render external icon for internal links', () => {
  const { container } = renderWithRouter(
    <Link href="/races">Races</Link>
  );
  const icon = container.querySelector(`.${styles.externalIcon}`);
  expect(icon).toBeFalsy();
});

it('should apply the default variant class by default', () => {
  const { container } = renderWithRouter(
    <Link href="/races">Races</Link>
  );
  const link = container.querySelector(`.${styles.default}`);
  expect(link).toBeTruthy();
});

it('should apply the button variant class', () => {
  const { container } = renderWithRouter(
    <Link href="/register" variant="button">Register</Link>
  );
  const link = container.querySelector(`.${styles.button}`);
  expect(link).toBeTruthy();
});

it('should apply the subtle variant class', () => {
  const { container } = renderWithRouter(
    <Link href="/privacy" variant="subtle">Privacy</Link>
  );
  const link = container.querySelector(`.${styles.subtle}`);
  expect(link).toBeTruthy();
});

it('should apply a custom className', () => {
  const { container } = renderWithRouter(
    <Link href="/races" className="custom-class">Races</Link>
  );
  const link = container.querySelector('.custom-class');
  expect(link).toBeTruthy();
});

it('should call onClick when clicked', () => {
  let clicked = false;
  const { container } = renderWithRouter(
    <Link href="/races" onClick={() => { clicked = true; }}>Races</Link>
  );
  const link = container.querySelector('a');
  if (link) fireEvent.click(link);
  expect(clicked).toBe(true);
});

it('should render the href for external links', () => {
  const { container } = renderWithRouter(
    <Link href="https://www.motogp.com" external>MotoGP</Link>
  );
  const anchor = container.querySelector('a') as HTMLAnchorElement;
  expect(anchor.href.includes('motogp.com')).toBe(true);
});

it('should apply aria-label when provided', () => {
  const { container } = renderWithRouter(
    <Link href="/races" aria-label="View all races">Races</Link>
  );
  const link = container.querySelector('[aria-label="View all races"]');
  expect(link).toBeTruthy();
});
