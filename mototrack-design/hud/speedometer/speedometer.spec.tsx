import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Speedometer } from './speedometer.js';
import styles from './speedometer.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the speed value', () => {
  const { container } = renderWithProvider(<Speedometer speed={87} />);
  const digits = container.querySelector(`.${styles.digits}`);
  expect(digits).toBeTruthy();
  expect(digits?.textContent).toBe('87');
});

it('should render 0 when no speed is provided', () => {
  const { container } = renderWithProvider(<Speedometer />);
  const digits = container.querySelector(`.${styles.digits}`);
  expect(digits?.textContent).toBe('0');
});

it('should round the speed value', () => {
  const { container } = renderWithProvider(<Speedometer speed={87.7} />);
  const digits = container.querySelector(`.${styles.digits}`);
  expect(digits?.textContent).toBe('88');
});

it('should clamp negative speed to 0', () => {
  const { container } = renderWithProvider(<Speedometer speed={-10} />);
  const digits = container.querySelector(`.${styles.digits}`);
  expect(digits?.textContent).toBe('0');
});

it('should render the km/h unit label by default', () => {
  const { container } = renderWithProvider(<Speedometer speed={60} />);
  const unit = container.querySelector(`.${styles.unit}`);
  expect(unit).toBeTruthy();
  expect(unit?.textContent).toBe('km/h');
});

it('should hide the unit label when showUnit is false', () => {
  const { container } = renderWithProvider(<Speedometer speed={60} showUnit={false} />);
  const unit = container.querySelector(`.${styles.unit}`);
  expect(unit).toBeNull();
});

it('should apply the compact size class', () => {
  const { container } = renderWithProvider(<Speedometer speed={60} size="compact" />);
  const root = container.querySelector(`.${styles.compact}`);
  expect(root).toBeTruthy();
});

it('should apply the normal size class by default', () => {
  const { container } = renderWithProvider(<Speedometer speed={60} />);
  const root = container.querySelector(`.${styles.normal}`);
  expect(root).toBeTruthy();
});

it('should apply the driving-mode size class', () => {
  const { container } = renderWithProvider(<Speedometer speed={60} size="driving-mode" />);
  const root = container.querySelector(`.${styles['driving-mode']}`);
  expect(root).toBeTruthy();
});

it('should apply green color class when speed is below warning threshold', () => {
  const { container } = renderWithProvider(
    <Speedometer speed={80} warningThreshold={120} />
  );
  const root = container.querySelector(`.${styles.green}`);
  expect(root).toBeTruthy();
});

it('should apply amber color class when speed meets warning threshold', () => {
  const { container } = renderWithProvider(
    <Speedometer speed={130} warningThreshold={120} />
  );
  const root = container.querySelector(`.${styles.amber}`);
  expect(root).toBeTruthy();
});

it('should apply red color class when speed exceeds 1.4x warning threshold', () => {
  const { container } = renderWithProvider(
    <Speedometer speed={170} warningThreshold={120} />
  );
  const root = container.querySelector(`.${styles.red}`);
  expect(root).toBeTruthy();
});

it('should apply a custom className to the root element', () => {
  const { container } = renderWithProvider(
    <Speedometer speed={60} className="my-custom-class" />
  );
  const root = container.querySelector('.my-custom-class');
  expect(root).toBeTruthy();
});

it('should respect a custom warningThreshold', () => {
  const { container } = renderWithProvider(
    <Speedometer speed={60} warningThreshold={50} />
  );
  // 60 >= 50 → amber
  const amber = container.querySelector(`.${styles.amber}`);
  expect(amber).toBeTruthy();
});

it('should apply red when speed >= warningThreshold * 1.4 with custom threshold', () => {
  const { container } = renderWithProvider(
    <Speedometer speed={84} warningThreshold={60} />
  );
  // 84 >= 60 * 1.4 = 84 → red
  const red = container.querySelector(`.${styles.red}`);
  expect(red).toBeTruthy();
});
