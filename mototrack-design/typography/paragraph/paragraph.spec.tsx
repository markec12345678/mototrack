import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Paragraph } from './paragraph.js';
import styles from './paragraph.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render children text', () => {
  const { getByText } = renderWithProvider(
    <Paragraph>Race telemetry data</Paragraph>
  );
  expect(getByText('Race telemetry data')).toBeTruthy();
});

it('should render as a paragraph element', () => {
  const { container } = renderWithProvider(
    <Paragraph>Lap time</Paragraph>
  );
  const el = container.querySelector('p');
  expect(el).toBeTruthy();
});

it('should apply the body variant class by default', () => {
  const { container } = renderWithProvider(
    <Paragraph>Default body</Paragraph>
  );
  const el = container.querySelector('p');
  expect(el?.classList.contains(styles.body)).toBe(true);
});

it('should apply the caption variant class', () => {
  const { container } = renderWithProvider(
    <Paragraph variant="caption">Caption text</Paragraph>
  );
  const el = container.querySelector('p');
  expect(el?.classList.contains(styles.caption)).toBe(true);
});

it('should apply the label variant class', () => {
  const { container } = renderWithProvider(
    <Paragraph variant="label">Label text</Paragraph>
  );
  const el = container.querySelector('p');
  expect(el?.classList.contains(styles.label)).toBe(true);
});

it('should apply the mono variant class', () => {
  const { container } = renderWithProvider(
    <Paragraph variant="mono">1:23.456</Paragraph>
  );
  const el = container.querySelector('p');
  expect(el?.classList.contains(styles.mono)).toBe(true);
});

it('should apply the primary color class by default', () => {
  const { container } = renderWithProvider(
    <Paragraph>Primary color</Paragraph>
  );
  const el = container.querySelector('p');
  expect(el?.classList.contains(styles.primary)).toBe(true);
});

it('should apply the secondary color class', () => {
  const { container } = renderWithProvider(
    <Paragraph color="secondary">Secondary color</Paragraph>
  );
  const el = container.querySelector('p');
  expect(el?.classList.contains(styles.secondary)).toBe(true);
});

it('should apply the muted color class', () => {
  const { container } = renderWithProvider(
    <Paragraph color="muted">Muted color</Paragraph>
  );
  const el = container.querySelector('p');
  expect(el?.classList.contains(styles.muted)).toBe(true);
});

it('should apply a custom className', () => {
  const { container } = renderWithProvider(
    <Paragraph className="custom-class">Custom class</Paragraph>
  );
  const el = container.querySelector('p');
  expect(el?.classList.contains('custom-class')).toBe(true);
});

it('should apply inline style', () => {
  const { container } = renderWithProvider(
    <Paragraph style={{ marginTop: '8px' }}>Styled paragraph</Paragraph>
  );
  const el = container.querySelector('p') as HTMLElement;
  expect(el?.style.marginTop).toBe('8px');
});
