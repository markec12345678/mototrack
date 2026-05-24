import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Spinner } from './spinner.js';
import styles from './spinner.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the spinner root element', () => {
  const { container } = renderWithProvider(<Spinner />);
  const root = container.querySelector(`.${styles.root}`);
  expect(root).toBeTruthy();
});

it('should render the ring element', () => {
  const { container } = renderWithProvider(<Spinner />);
  const ring = container.querySelector(`.${styles.ring}`);
  expect(ring).toBeTruthy();
});

it('should apply the md size class by default', () => {
  const { container } = renderWithProvider(<Spinner />);
  const ring = container.querySelector(`.${styles.ring}`);
  expect(ring?.classList.contains(styles.md)).toBe(true);
});

it('should apply the sm size class when size is sm', () => {
  const { container } = renderWithProvider(<Spinner size="sm" />);
  const ring = container.querySelector(`.${styles.ring}`);
  expect(ring?.classList.contains(styles.sm)).toBe(true);
});

it('should apply the lg size class when size is lg', () => {
  const { container } = renderWithProvider(<Spinner size="lg" />);
  const ring = container.querySelector(`.${styles.ring}`);
  expect(ring?.classList.contains(styles.lg)).toBe(true);
});

it('should not render a label element when label is not provided', () => {
  const { container } = renderWithProvider(<Spinner />);
  const label = container.querySelector(`.${styles.label}`);
  expect(label).toBeNull();
});

it('should render the label text when label prop is provided', () => {
  const { getByText } = renderWithProvider(<Spinner label="Loading race data…" />);
  const label = getByText('Loading race data…');
  expect(label).toBeTruthy();
});

it('should apply the label class when label is provided', () => {
  const { container } = renderWithProvider(<Spinner label="Authenticating…" />);
  const label = container.querySelector(`.${styles.label}`);
  expect(label).toBeTruthy();
});

it('should apply a custom className to the root element', () => {
  const { container } = renderWithProvider(<Spinner className="custom-spinner" />);
  const root = container.querySelector('.custom-spinner');
  expect(root).toBeTruthy();
});

it('should set aria-label to the label text when label is provided', () => {
  const { container } = renderWithProvider(<Spinner label="Fetching data" />);
  const root = container.querySelector(`.${styles.root}`);
  expect(root?.getAttribute('aria-label')).toBe('Fetching data');
});

it('should set a default aria-label when no label is provided', () => {
  const { container } = renderWithProvider(<Spinner />);
  const root = container.querySelector(`.${styles.root}`);
  expect(root?.getAttribute('aria-label')).toBe('Loading');
});
