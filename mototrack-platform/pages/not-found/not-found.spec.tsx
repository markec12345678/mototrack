import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { NotFound } from './not-found.js';
import styles from './not-found.module.scss';

function renderWithProviders(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the default Slovenian title', () => {
  const { getByText } = renderWithProviders(<NotFound />);
  const title = getByText('Hopla, stran ni najdena 🏍️💨');
  expect(title).toBeTruthy();
});

it('should render the default subtitle', () => {
  const { getByText } = renderWithProviders(<NotFound />);
  const subtitle = getByText(
    'Zdi se, da ste zapeljali s poti. Ta stran ne obstaja ali je bila premaknjena.'
  );
  expect(subtitle).toBeTruthy();
});

it('should render the return-home button with default label', () => {
  const { getByText } = renderWithProviders(<NotFound />);
  const button = getByText('Nazaj na domačo stran');
  expect(button).toBeTruthy();
});

it('should render the go-back button', () => {
  const { getByText } = renderWithProviders(<NotFound />);
  const backButton = getByText('Pojdi nazaj');
  expect(backButton).toBeTruthy();
});

it('should render the 404 error code', () => {
  const { container } = renderWithProviders(<NotFound />);
  const errorCode = container.querySelector(`.${styles.errorCode}`);
  expect(errorCode).toBeTruthy();
  expect(errorCode?.textContent).toBe('404');
});

it('should render the badge label', () => {
  const { container } = renderWithProviders(<NotFound />);
  const badge = container.querySelector(`.${styles.badgeLabel}`);
  expect(badge).toBeTruthy();
  expect(badge?.textContent).toBe('Izgubljena pot');
});

it('should render a custom title when provided', () => {
  const { getByText } = renderWithProviders(
    <NotFound title="Ups, ta stran ne obstaja 🏁" />
  );
  const title = getByText('Ups, ta stran ne obstaja 🏁');
  expect(title).toBeTruthy();
});

it('should render a custom subtitle when provided', () => {
  const { getByText } = renderWithProviders(
    <NotFound subtitle="Proga ni na voljo." />
  );
  const subtitle = getByText('Proga ni na voljo.');
  expect(subtitle).toBeTruthy();
});

it('should render a custom home button label when provided', () => {
  const { getByText } = renderWithProviders(
    <NotFound homeLabel="Na glavno stran" />
  );
  const button = getByText('Na glavno stran');
  expect(button).toBeTruthy();
});

it('should render the hero image', () => {
  const { container } = renderWithProviders(<NotFound />);
  const img = container.querySelector(`.${styles.heroImage}`);
  expect(img).toBeTruthy();
  expect(img?.getAttribute('alt')).toBe('404 — stran ni najdena');
});

it('should apply a custom className to the root element', () => {
  const { container } = renderWithProviders(
    <NotFound className="custom-class" />
  );
  const root = container.querySelector(`.${styles.root}`);
  expect(root?.classList.contains('custom-class')).toBe(true);
});

it('should render the hint text', () => {
  const { getByText } = renderWithProviders(<NotFound />);
  const hint = getByText('Preverite URL ali se vrnite na začetek.');
  expect(hint).toBeTruthy();
});
