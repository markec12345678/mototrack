import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CtaButton } from './cta-button.js';
import styles from './cta-button.module.scss';

function renderCtaButton(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the button label', () => {
  const { getByText } = renderCtaButton(<CtaButton>Start Ride</CtaButton>);
  expect(getByText('Start Ride')).toBeTruthy();
});

it('should apply the default variant class by default', () => {
  const { container } = renderCtaButton(<CtaButton>Get Started</CtaButton>);
  const wrapper = container.querySelector(`.${styles.ctaWrapper}`);
  expect(wrapper).toBeTruthy();
  expect(wrapper?.classList.contains(styles.default)).toBe(true);
});

it('should apply the sos variant class', () => {
  const { container } = renderCtaButton(<CtaButton variant="sos">SOS</CtaButton>);
  const wrapper = container.querySelector(`.${styles.ctaWrapper}`);
  expect(wrapper?.classList.contains(styles.sos)).toBe(true);
});

it('should apply the start-ride variant class', () => {
  const { container } = renderCtaButton(<CtaButton variant="start-ride">Start Ride</CtaButton>);
  const wrapper = container.querySelector(`.${styles.ctaWrapper}`);
  expect(wrapper?.classList.contains(styles['start-ride'])).toBe(true);
});

it('should apply the save-route variant class', () => {
  const { container } = renderCtaButton(<CtaButton variant="save-route">Save Route</CtaButton>);
  const wrapper = container.querySelector(`.${styles.ctaWrapper}`);
  expect(wrapper?.classList.contains(styles['save-route'])).toBe(true);
});

it('should apply the fullWidth class when fullWidth prop is set', () => {
  const { container } = renderCtaButton(<CtaButton fullWidth>Start Ride</CtaButton>);
  const wrapper = container.querySelector(`.${styles.ctaWrapper}`);
  expect(wrapper?.classList.contains(styles.fullWidth)).toBe(true);
});

it('should apply the disabled class when disabled prop is set', () => {
  const { container } = renderCtaButton(<CtaButton disabled>Start Ride</CtaButton>);
  const wrapper = container.querySelector(`.${styles.ctaWrapper}`);
  expect(wrapper?.classList.contains(styles.disabled)).toBe(true);
});

it('should apply the disabled class when loading prop is set', () => {
  const { container } = renderCtaButton(<CtaButton loading>Loading...</CtaButton>);
  const wrapper = container.querySelector(`.${styles.ctaWrapper}`);
  expect(wrapper?.classList.contains(styles.disabled)).toBe(true);
});

it('should apply a custom className to the wrapper', () => {
  const { container } = renderCtaButton(<CtaButton className="my-custom-class">Start Ride</CtaButton>);
  const wrapper = container.querySelector('.my-custom-class');
  expect(wrapper).toBeTruthy();
});

it('should call onClick when clicked', () => {
  let clicked = false;
  const { container } = renderCtaButton(
    <CtaButton onClick={() => { clicked = true; }}>Start Ride</CtaButton>
  );
  const button = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(button);
  expect(clicked).toBe(true);
});

it('should not call onClick when disabled', () => {
  let clicked = false;
  const { container } = renderCtaButton(
    <CtaButton disabled onClick={() => { clicked = true; }}>Start Ride</CtaButton>
  );
  const button = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(button);
  expect(clicked).toBe(false);
});

it('should render left icon when provided', () => {
  const { getByText } = renderCtaButton(
    <CtaButton leftIcon={<span>🏍️</span>}>Start Ride</CtaButton>
  );
  expect(getByText('🏍️')).toBeTruthy();
});

it('should render right icon when provided', () => {
  const { getByText } = renderCtaButton(
    <CtaButton rightIcon={<span>→</span>}>Get Started</CtaButton>
  );
  expect(getByText('→')).toBeTruthy();
});

it('should render as an anchor when href is provided', () => {
  const { container } = renderCtaButton(
    <CtaButton href="/start">Start Ride</CtaButton>
  );
  const anchor = container.querySelector('a');
  expect(anchor).toBeTruthy();
  expect(anchor?.getAttribute('href')?.includes('/start')).toBe(true);
});

it('should apply ctaButton class to the inner button', () => {
  const { container } = renderCtaButton(<CtaButton>Start Ride</CtaButton>);
  const button = container.querySelector(`.${styles.ctaButton}`);
  expect(button).toBeTruthy();
});
