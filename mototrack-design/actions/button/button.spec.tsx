import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Button } from './button.js';
import styles from './button.module.scss';

function renderButton(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the button label', () => {
  const { container } = renderButton(<Button>Race Entry</Button>);
  const label = container.querySelector(`.${styles.label}`);
  expect(label).toBeTruthy();
  expect(label?.textContent).toBe('Race Entry');
});

it('should apply the primary variant class by default', () => {
  const { container } = renderButton(<Button>Primary</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.primary)).toBe(true);
});

it('should apply the secondary variant class', () => {
  const { container } = renderButton(<Button variant="secondary">Secondary</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.secondary)).toBe(true);
});

it('should apply the ghost variant class', () => {
  const { container } = renderButton(<Button variant="ghost">Ghost</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.ghost)).toBe(true);
});

it('should apply the danger variant class', () => {
  const { container } = renderButton(<Button variant="danger">Danger</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.danger)).toBe(true);
});

it('should apply the success variant class', () => {
  const { container } = renderButton(<Button variant="success">Success</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.success)).toBe(true);
});

it('should apply the md size class by default', () => {
  const { container } = renderButton(<Button>Medium</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.md)).toBe(true);
});

it('should apply the sm size class', () => {
  const { container } = renderButton(<Button size="sm">Small</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.sm)).toBe(true);
});

it('should apply the lg size class', () => {
  const { container } = renderButton(<Button size="lg">Large</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.lg)).toBe(true);
});

it('should apply the xl size class', () => {
  const { container } = renderButton(<Button size="xl">Extra Large</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.xl)).toBe(true);
});

it('should apply the fullWidth class when fullWidth is true', () => {
  const { container } = renderButton(<Button fullWidth>Full Width</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.fullWidth)).toBe(true);
});

it('should be disabled when disabled prop is true', () => {
  const { container } = renderButton(<Button disabled>Disabled</Button>);
  const button = container.querySelector('button');
  expect(button?.disabled).toBe(true);
});

it('should show spinner when loading', () => {
  const { container } = renderButton(<Button loading>Loading</Button>);
  const spinner = container.querySelector(`.${styles.spinner}`);
  expect(spinner).toBeTruthy();
});

it('should apply loading class when loading', () => {
  const { container } = renderButton(<Button loading>Loading</Button>);
  const button = container.querySelector('button');
  expect(button?.classList.contains(styles.loading)).toBe(true);
});

it('should be disabled when loading', () => {
  const { container } = renderButton(<Button loading>Loading</Button>);
  const button = container.querySelector('button');
  expect(button?.disabled).toBe(true);
});

it('should render left icon slot', () => {
  const { container } = renderButton(
    <Button leftIcon={<span data-testid="left-icon">★</span>}>With Icon</Button>
  );
  const iconLeft = container.querySelector(`.${styles.iconLeft}`);
  expect(iconLeft).toBeTruthy();
});

it('should render right icon slot', () => {
  const { container } = renderButton(
    <Button rightIcon={<span>→</span>}>With Icon</Button>
  );
  const iconRight = container.querySelector(`.${styles.iconRight}`);
  expect(iconRight).toBeTruthy();
});

it('should not render left icon when loading', () => {
  const { container } = renderButton(
    <Button loading leftIcon={<span>★</span>}>Loading</Button>
  );
  const iconLeft = container.querySelector(`.${styles.iconLeft}`);
  expect(iconLeft).toBeNull();
});

it('should call onClick when clicked', () => {
  let clicked = false;
  const { container } = renderButton(
    <Button onClick={() => { clicked = true; }}>Click Me</Button>
  );
  const button = container.querySelector('button');
  fireEvent.click(button as Element);
  expect(clicked).toBe(true);
});

it('should not call onClick when disabled', () => {
  let clicked = false;
  const { container } = renderButton(
    <Button disabled onClick={() => { clicked = true; }}>Disabled</Button>
  );
  const button = container.querySelector('button');
  fireEvent.click(button as Element);
  expect(clicked).toBe(false);
});

it('should render as an anchor tag when href is provided', () => {
  const { container } = renderButton(
    <Button href="/races">Race Calendar</Button>
  );
  const anchor = container.querySelector('a');
  expect(anchor).toBeTruthy();
});

it('should apply a custom className', () => {
  const { container } = renderButton(
    <Button className="custom-class">Custom</Button>
  );
  const button = container.querySelector('button');
  expect(button?.classList.contains('custom-class')).toBe(true);
});

it('should set aria-busy when loading', () => {
  const { container } = renderButton(<Button loading>Loading</Button>);
  const button = container.querySelector('button');
  expect(button?.getAttribute('aria-busy')).toBe('true');
});

it('should set aria-label when provided', () => {
  const { container } = renderButton(
    <Button aria-label="Submit race entry">Submit</Button>
  );
  const button = container.querySelector('button');
  expect(button?.getAttribute('aria-label')).toBe('Submit race entry');
});
