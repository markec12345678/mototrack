import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CountryFlag } from './country-flag.js';
import { COUNTRY_MAP } from './country-flag.js';
import styles from './country-flag.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the flag emoji for Slovenia', () => {
  const { container } = renderWithProvider(<CountryFlag code="SI" />);
  const emoji = container.querySelector(`.${styles.emoji}`);
  expect(emoji).toBeTruthy();
  expect(emoji?.textContent).toBe('🇸🇮');
});

it('should render the country name label by default', () => {
  const { container } = renderWithProvider(<CountryFlag code="HR" />);
  const label = container.querySelector(`.${styles.label}`);
  expect(label).toBeTruthy();
  expect(label?.textContent).toBe('Croatia');
});

it('should not render the label when showLabel is false', () => {
  const { container } = renderWithProvider(<CountryFlag code="RS" showLabel={false} />);
  const label = container.querySelector(`.${styles.label}`);
  expect(label).toBeNull();
});

it('should apply the sm size class', () => {
  const { container } = renderWithProvider(<CountryFlag code="GR" size="sm" />);
  const root = container.querySelector(`.${styles.sm}`);
  expect(root).toBeTruthy();
});

it('should apply the md size class by default', () => {
  const { container } = renderWithProvider(<CountryFlag code="BG" />);
  const root = container.querySelector(`.${styles.md}`);
  expect(root).toBeTruthy();
});

it('should apply the lg size class', () => {
  const { container } = renderWithProvider(<CountryFlag code="RO" size="lg" />);
  const root = container.querySelector(`.${styles.lg}`);
  expect(root).toBeTruthy();
});

it('should apply a custom className to the root element', () => {
  const { container } = renderWithProvider(
    <CountryFlag code="AL" className="custom-class" />
  );
  const root = container.querySelector('.custom-class');
  expect(root).toBeTruthy();
});

it('should render the correct flag for all 10 Balkan countries', () => {
  const codes = Object.keys(COUNTRY_MAP) as Array<keyof typeof COUNTRY_MAP>;
  codes.forEach((code) => {
    const { container } = renderWithProvider(<CountryFlag code={code} />);
    const emoji = container.querySelector(`.${styles.emoji}`);
    expect(emoji?.textContent).toBe(COUNTRY_MAP[code].flag);
  });
});

it('should render the correct label for North Macedonia', () => {
  const { container } = renderWithProvider(<CountryFlag code="MK" />);
  const label = container.querySelector(`.${styles.label}`);
  expect(label?.textContent).toBe('North Macedonia');
});

it('should render the correct label for Bosnia & Herzegovina', () => {
  const { container } = renderWithProvider(<CountryFlag code="BA" />);
  const label = container.querySelector(`.${styles.label}`);
  expect(label?.textContent).toBe('Bosnia & Herzegovina');
});

it('should set the title attribute to the country name', () => {
  const { container } = renderWithProvider(<CountryFlag code="ME" />);
  const root = container.querySelector(`.${styles.countryFlag}`);
  expect(root?.getAttribute('title')).toBe('Montenegro');
});
