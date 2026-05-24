import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Tooltip } from './tooltip.js';
import styles from './tooltip.module.scss';

function renderTooltip(props: Partial<React.ComponentProps<typeof Tooltip>> = {}) {
  return render(
    <MockProvider>
      <Tooltip content="Test tooltip" {...props}>
        <button type="button">Trigger</button>
      </Tooltip>
    </MockProvider>
  );
}

it('should render the trigger children', () => {
  const { getByText } = renderTooltip();
  expect(getByText('Trigger')).toBeTruthy();
});

it('should render the tooltip content text', () => {
  const { getByText } = renderTooltip();
  expect(getByText('Test tooltip')).toBeTruthy();
});

it('should have role="tooltip" on the tooltip element', () => {
  const { container } = renderTooltip();
  const tooltip = container.querySelector('[role="tooltip"]');
  expect(tooltip).toBeTruthy();
});

it('should not have the visible class initially', () => {
  const { container } = renderTooltip();
  const tooltip = container.querySelector('[role="tooltip"]');
  expect(tooltip?.classList.contains(styles.visible)).toBe(false);
});

it('should apply the top position class by default', () => {
  const { container } = renderTooltip();
  const tooltip = container.querySelector('[role="tooltip"]');
  expect(tooltip?.classList.contains(styles.top)).toBe(true);
});

it('should apply the bottom position class when position is bottom', () => {
  const { container } = renderTooltip({ position: 'bottom' });
  const tooltip = container.querySelector('[role="tooltip"]');
  expect(tooltip?.classList.contains(styles.bottom)).toBe(true);
});

it('should apply the left position class when position is left', () => {
  const { container } = renderTooltip({ position: 'left' });
  const tooltip = container.querySelector('[role="tooltip"]');
  expect(tooltip?.classList.contains(styles.left)).toBe(true);
});

it('should apply the right position class when position is right', () => {
  const { container } = renderTooltip({ position: 'right' });
  const tooltip = container.querySelector('[role="tooltip"]');
  expect(tooltip?.classList.contains(styles.right)).toBe(true);
});

it('should apply a custom className to the wrapper', () => {
  const { container } = renderTooltip({ className: 'my-custom-class' });
  const wrapper = container.querySelector(`.${styles.wrapper}`) as HTMLElement;
  expect(wrapper?.classList.contains('my-custom-class')).toBe(true);
});

it('should not show tooltip when disabled', () => {
  const { container } = renderTooltip({ disabled: true });
  const wrapper = container.querySelector(`.${styles.wrapper}`) as HTMLElement;
  fireEvent.mouseEnter(wrapper);
  const tooltip = container.querySelector('[role="tooltip"]');
  expect(tooltip?.classList.contains(styles.visible)).toBe(false);
});

it('should set aria-hidden to true when tooltip is not visible', () => {
  const { container } = renderTooltip();
  const tooltip = container.querySelector('[role="tooltip"]');
  expect(tooltip?.getAttribute('aria-hidden')).toBe('true');
});

it('should render the arrow element inside the tooltip', () => {
  const { container } = renderTooltip();
  const arrow = container.querySelector(`.${styles.arrow}`);
  expect(arrow).toBeTruthy();
});

it('should apply a custom tooltipClassName to the tooltip bubble', () => {
  const { container } = renderTooltip({ tooltipClassName: 'custom-bubble' });
  const tooltip = container.querySelector('[role="tooltip"]');
  expect(tooltip?.classList.contains('custom-bubble')).toBe(true);
});
