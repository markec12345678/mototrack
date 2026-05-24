import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Gauge } from './gauge.js';
import styles from './gauge.module.scss';

function renderGauge(props = {}) {
  return render(
    <MockProvider>
      <Gauge {...props} />
    </MockProvider>
  );
}

it('should render the gauge SVG element', () => {
  const { container } = renderGauge();
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
});

it('should render the label text', () => {
  const { getByText } = renderGauge({ label: `Lean Angle`, unit: `°` });
  const label = getByText('LEAN ANGLE');
  expect(label).toBeTruthy();
});

it('should render the value as rounded number', () => {
  const { container } = renderGauge({ value: 43, min: 0, max: 100, unit: `°` });
  const texts = container.querySelectorAll('text');
  const textContents = Array.from(texts).map((t) => t.textContent ?? '');
  const hasValue = textContents.some((t) => t.includes('43'));
  expect(hasValue).toBe(true);
});

it('should render the unit', () => {
  const { container } = renderGauge({ value: 50, min: 0, max: 100, unit: `km/h` });
  const texts = container.querySelectorAll('tspan');
  const hasUnit = Array.from(texts).some((t) => t.textContent?.includes('km/h'));
  expect(hasUnit).toBe(true);
});

it('should clamp value to min when below range', () => {
  const { container } = renderGauge({ value: -10, min: 0, max: 100, unit: `°` });
  const texts = container.querySelectorAll('text');
  const textContents = Array.from(texts).map((t) => t.textContent ?? '');
  const hasZero = textContents.some((t) => t.includes('0'));
  expect(hasZero).toBe(true);
});

it('should clamp value to max when above range', () => {
  const { container } = renderGauge({ value: 200, min: 0, max: 100, unit: `°` });
  const texts = container.querySelectorAll('text');
  const textContents = Array.from(texts).map((t) => t.textContent ?? '');
  const hasMax = textContents.some((t) => t.includes('100'));
  expect(hasMax).toBe(true);
});

it('should render the correct number of zone arcs', () => {
  const zones = [
    { from: 0, to: 33, color: 'green' as const },
    { from: 33, to: 66, color: 'yellow' as const },
    { from: 66, to: 100, color: 'red' as const },
  ];
  const { container } = renderGauge({ value: 50, min: 0, max: 100, zones });
  const paths = container.querySelectorAll('path');
  expect(paths.length).toBeGreaterThanOrEqual(7);
});

it('should apply custom className to the root element', () => {
  const { container } = renderGauge({ className: 'my-custom-gauge' });
  const root = container.querySelector(`.${styles.gauge}`);
  expect(root).toBeTruthy();
  expect(root?.classList.contains('my-custom-gauge')).toBe(true);
});

it('should respect the size prop for SVG dimensions', () => {
  const { container } = renderGauge({ size: 160 });
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('width')).toBe('160');
  expect(svg?.getAttribute('height')).toBe('160');
});

it('should render tick marks', () => {
  const { container } = renderGauge({ value: 50, min: 0, max: 100 });
  const lines = container.querySelectorAll('line');
  expect(lines.length).toBe(9);
});
