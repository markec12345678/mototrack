import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Card } from './card.js';
import styles from './card.module.scss';

function renderCard(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render children inside the card', () => {
  const { getByText } = renderCard(<Card>Race Dashboard</Card>);
  expect(getByText('Race Dashboard')).toBeTruthy();
});

it('should apply the default variant class by default', () => {
  const { container } = renderCard(<Card>Content</Card>);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card.classList.contains(styles.default)).toBe(true);
});

it('should apply the elevated variant class', () => {
  const { container } = renderCard(<Card variant="elevated">Content</Card>);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card.classList.contains(styles.elevated)).toBe(true);
});

it('should apply the outlined variant class', () => {
  const { container } = renderCard(<Card variant="outlined">Content</Card>);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card.classList.contains(styles.outlined)).toBe(true);
});

it('should apply the danger variant class', () => {
  const { container } = renderCard(<Card variant="danger">Content</Card>);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card.classList.contains(styles.danger)).toBe(true);
});

it('should apply the correct padding class', () => {
  const { container } = renderCard(<Card padding="lg">Content</Card>);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card.classList.contains(styles['padding-lg'])).toBe(true);
});

it('should apply padding-none class when padding is none', () => {
  const { container } = renderCard(<Card padding="none">Content</Card>);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card.classList.contains(styles['padding-none'])).toBe(true);
});

it('should apply hoverLift class when hoverLift is true', () => {
  const { container } = renderCard(<Card hoverLift>Content</Card>);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card.classList.contains(styles.hoverLift)).toBe(true);
});

it('should NOT apply hoverLift class when hoverLift is false', () => {
  const { container } = renderCard(<Card hoverLift={false}>Content</Card>);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card.classList.contains(styles.hoverLift)).toBe(false);
});

it('should apply clickable class when onClick is provided', () => {
  const { container } = renderCard(<Card onClick={() => {}}>Content</Card>);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card.classList.contains(styles.clickable)).toBe(true);
});

it('should call onClick when the card is clicked', () => {
  let clicked = false;
  const { container } = renderCard(
    <Card onClick={() => { clicked = true; }}>Clickable</Card>
  );
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  fireEvent.click(card);
  expect(clicked).toBe(true);
});

it('should accept and apply a custom className', () => {
  const { container } = renderCard(<Card className="custom-class">Content</Card>);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card.classList.contains('custom-class')).toBe(true);
});

it('should render without children', () => {
  const { container } = renderCard(<Card />);
  const card = container.querySelector(`.${styles.card}`) as HTMLElement;
  expect(card).toBeTruthy();
});
