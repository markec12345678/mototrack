import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProgressBar } from './progress-bar.js';
import styles from './progress-bar.module.scss';

function renderBar(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

it('should render the track element', () => {
  const { container } = renderBar(<ProgressBar value={50} />);
  const track = container.querySelector(`.${styles.track}`);
  expect(track).toBeTruthy();
});

it('should render the fill element', () => {
  const { container } = renderBar(<ProgressBar value={50} />);
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill).toBeTruthy();
});

it('should render the label when provided', () => {
  const { container } = renderBar(<ProgressBar value={50} label="Fuel Level" />);
  const label = container.querySelector(`.${styles.label}`);
  expect(label).toBeTruthy();
  expect(label?.textContent).toBe('Fuel Level');
});

it('should not render the label row when no label and no showPercentage', () => {
  const { container } = renderBar(<ProgressBar value={50} />);
  const labelRow = container.querySelector(`.${styles.labelRow}`);
  expect(labelRow).toBeFalsy();
});

it('should render the percentage when showPercentage is true', () => {
  const { container } = renderBar(<ProgressBar value={75} showPercentage />);
  const pct = container.querySelector(`.${styles.percentage}`);
  expect(pct).toBeTruthy();
  expect(pct?.textContent).toBe('75%');
});

it('should clamp value above 100 to 100', () => {
  const { container } = renderBar(<ProgressBar value={150} showPercentage />);
  const pct = container.querySelector(`.${styles.percentage}`);
  expect(pct?.textContent).toBe('100%');
});

it('should clamp value below 0 to 0', () => {
  const { container } = renderBar(<ProgressBar value={-20} showPercentage />);
  const pct = container.querySelector(`.${styles.percentage}`);
  expect(pct?.textContent).toBe('0%');
});

it('should apply the accent variant class by default', () => {
  const { container } = renderBar(<ProgressBar value={50} />);
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill?.classList.contains(styles.variantAccent)).toBe(true);
});

it('should apply the success variant class', () => {
  const { container } = renderBar(<ProgressBar value={50} variant="success" />);
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill?.classList.contains(styles.variantSuccess)).toBe(true);
});

it('should apply the warning variant class', () => {
  const { container } = renderBar(<ProgressBar value={50} variant="warning" />);
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill?.classList.contains(styles.variantWarning)).toBe(true);
});

it('should apply the danger variant class', () => {
  const { container } = renderBar(<ProgressBar value={50} variant="danger" />);
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill?.classList.contains(styles.variantDanger)).toBe(true);
});

it('should apply the indeterminate class when no value is provided', () => {
  const { container } = renderBar(<ProgressBar variant="accent" />);
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill?.classList.contains(styles.indeterminate)).toBe(true);
});

it('should NOT apply the indeterminate class when a value is provided', () => {
  const { container } = renderBar(<ProgressBar value={60} />);
  const fill = container.querySelector(`.${styles.fill}`);
  expect(fill?.classList.contains(styles.indeterminate)).toBe(false);
});

it('should render the dash placeholder for percentage in indeterminate mode', () => {
  const { container } = renderBar(<ProgressBar showPercentage />);
  const pct = container.querySelector(`.${styles.percentage}`);
  expect(pct?.textContent).toBe('—');
});

it('should apply a custom className to the root element', () => {
  const { container } = renderBar(<ProgressBar value={50} className="custom-class" />);
  const root = container.querySelector(`.${styles.root}`);
  expect(root?.classList.contains('custom-class')).toBe(true);
});

it('should set the track height via inline style', () => {
  const { container } = renderBar(<ProgressBar value={50} height={16} />);
  const track = container.querySelector(`.${styles.track}`) as HTMLElement | null;
  expect(track?.style.height).toBe('16px');
});

it('should set aria-valuenow on the track', () => {
  const { container } = renderBar(<ProgressBar value={42} />);
  const track = container.querySelector(`.${styles.track}`);
  expect(track?.getAttribute('aria-valuenow')).toBe('42');
});

it('should not set aria-valuenow in indeterminate mode', () => {
  const { container } = renderBar(<ProgressBar />);
  const track = container.querySelector(`.${styles.track}`);
  expect(track?.getAttribute('aria-valuenow')).toBeNull();
});
