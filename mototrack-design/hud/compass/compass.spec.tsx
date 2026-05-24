import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Compass } from './compass.js';
import styles from './compass.module.scss';

function renderCompass(props: React.ComponentProps<typeof Compass> = {}) {
  return render(
    <MemoryRouter>
      <Compass {...props} />
    </MemoryRouter>
  );
}

it('should render the compass container', () => {
  const { container } = renderCompass({ heading: 0 });
  const el = container.querySelector(`.${styles.compass}`);
  expect(el).toBeTruthy();
});

it('should display the degree value when showDegrees is true', () => {
  const { container } = renderCompass({ heading: 90, showDegrees: true });
  const el = container.querySelector(`.${styles.degreesValue}`);
  expect(el).toBeTruthy();
  expect(el?.textContent).toBe('90');
});

it('should not render the degrees readout when showDegrees is false', () => {
  const { container } = renderCompass({ heading: 45, showDegrees: false });
  const el = container.querySelector(`.${styles.degreesValue}`);
  expect(el).toBeNull();
});

it('should display the cardinal label for north (0°)', () => {
  const { container } = renderCompass({ heading: 0 });
  const el = container.querySelector(`.${styles.cardinalBig}`);
  expect(el?.textContent).toBe('N');
});

it('should display the cardinal label for east (90°)', () => {
  const { container } = renderCompass({ heading: 90 });
  const el = container.querySelector(`.${styles.cardinalBig}`);
  expect(el?.textContent).toBe('E');
});

it('should display the cardinal label for south (180°)', () => {
  const { container } = renderCompass({ heading: 180 });
  const el = container.querySelector(`.${styles.cardinalBig}`);
  expect(el?.textContent).toBe('S');
});

it('should display the cardinal label for west (270°)', () => {
  const { container } = renderCompass({ heading: 270 });
  const el = container.querySelector(`.${styles.cardinalBig}`);
  expect(el?.textContent).toBe('W');
});

it('should show the source badge when showSource is true', () => {
  const { container } = renderCompass({ heading: 0, showSource: true });
  const el = container.querySelector(`.${styles.sourceBadge}`);
  expect(el).toBeTruthy();
});

it('should not show the source badge when showSource is false', () => {
  const { container } = renderCompass({ heading: 0, showSource: false });
  const el = container.querySelector(`.${styles.sourceBadge}`);
  expect(el).toBeNull();
});

it('should show MANUAL source badge for manual heading', () => {
  const { container } = renderCompass({ heading: 45, showSource: true });
  const el = container.querySelector(`.${styles.sourceBadge}`);
  expect(el?.textContent?.includes('MANUAL')).toBe(true);
});

it('should apply custom className to root element', () => {
  const { container } = renderCompass({ heading: 0, className: 'my-custom-class' });
  const el = container.querySelector('.my-custom-class');
  expect(el).toBeTruthy();
});

it('should apply custom size via style', () => {
  const { container } = renderCompass({ heading: 0, size: 300 });
  const el = container.querySelector(`.${styles.compass}`) as HTMLElement | null;
  expect(el?.style.width).toBe('300px');
  expect(el?.style.height).toBe('300px');
});

it('should call onHeadingChange when heading prop changes', () => {
  const onHeadingChange = vi.fn();
  const { rerender } = renderCompass({ heading: 0, onHeadingChange });
  rerender(
    <MemoryRouter>
      <Compass heading={120} onHeadingChange={onHeadingChange} />
    </MemoryRouter>
  );
  expect(onHeadingChange).toHaveBeenCalledWith(120, 'manual');
});

it('should normalise heading values above 360', () => {
  const { container } = renderCompass({ heading: 450 }); // 450 % 360 = 90
  const el = container.querySelector(`.${styles.degreesValue}`);
  expect(el?.textContent).toBe('90');
});

it('should normalise negative heading values', () => {
  const { container } = renderCompass({ heading: -90 }); // -90 → 270
  const el = container.querySelector(`.${styles.degreesValue}`);
  expect(el?.textContent).toBe('270');
});

it('should render the SVG element', () => {
  const { container } = renderCompass({ heading: 0 });
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
});

it('should render the rotating ring group', () => {
  const { container } = renderCompass({ heading: 0 });
  const ring = container.querySelector(`.${styles.rotatingRing}`);
  expect(ring).toBeTruthy();
});
