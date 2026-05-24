import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Toggle } from './toggle.js';
import styles from './toggle.module.scss';

function renderToggle(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the toggle track', () => {
  const { container } = renderToggle(<Toggle />);
  const track = container.querySelector(`.${styles.track}`);
  expect(track).toBeTruthy();
});

it('should render the toggle knob', () => {
  const { container } = renderToggle(<Toggle />);
  const knob = container.querySelector(`.${styles.knob}`);
  expect(knob).toBeTruthy();
});

it('should render a label when provided', () => {
  const { getByText } = renderToggle(<Toggle label="Voice Guidance" />);
  expect(getByText('Voice Guidance')).toBeTruthy();
});

it('should render a description when provided', () => {
  const { getByText } = renderToggle(<Toggle description="Spoken turn-by-turn instructions" />);
  expect(getByText('Spoken turn-by-turn instructions')).toBeTruthy();
});

it('should be unchecked by default', () => {
  const { container } = renderToggle(<Toggle />);
  const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
  expect(input.checked).toBe(false);
});

it('should reflect defaultChecked prop', () => {
  const { container } = renderToggle(<Toggle defaultChecked />);
  const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
  expect(input.checked).toBe(true);
});

it('should toggle state when clicked (uncontrolled)', () => {
  const { container } = renderToggle(<Toggle />);
  const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
  expect(input.checked).toBe(false);
  fireEvent.click(input);
  const updatedInput = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
  expect(updatedInput.checked).toBe(true);
});

it('should call onChange with the new value', () => {
  const handleChange = vi.fn();
  const { container } = renderToggle(<Toggle onChange={handleChange} />);
  const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
  fireEvent.click(input);
  expect(handleChange).toHaveBeenCalledWith(true);
});

it('should reflect controlled checked prop', () => {
  const { container } = renderToggle(<Toggle checked />);
  const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
  expect(input.checked).toBe(true);
});

it('should be disabled when disabled prop is set', () => {
  const { container } = renderToggle(<Toggle disabled />);
  const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
  expect(input.disabled).toBe(true);
});

it('should apply disabled class when disabled', () => {
  const { container } = renderToggle(<Toggle disabled />);
  const root = container.querySelector(`.${styles.disabled}`);
  expect(root).toBeTruthy();
});

it('should not call onChange when disabled', () => {
  const handleChange = vi.fn();
  const { container } = renderToggle(<Toggle disabled onChange={handleChange} />);
  const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
  fireEvent.click(input);
  expect(handleChange).not.toHaveBeenCalled();
});

it('should apply sm size class', () => {
  const { container } = renderToggle(<Toggle size="sm" />);
  const root = container.querySelector(`.${styles.sm}`);
  expect(root).toBeTruthy();
});

it('should apply lg size class', () => {
  const { container } = renderToggle(<Toggle size="lg" />);
  const root = container.querySelector(`.${styles.lg}`);
  expect(root).toBeTruthy();
});

it('should apply trackChecked class when checked', () => {
  const { container } = renderToggle(<Toggle checked />);
  const track = container.querySelector(`.${styles.trackChecked}`);
  expect(track).toBeTruthy();
});

it('should apply knobChecked class when checked', () => {
  const { container } = renderToggle(<Toggle checked />);
  const knob = container.querySelector(`.${styles.knobChecked}`);
  expect(knob).toBeTruthy();
});

it('should apply a custom className to the root element', () => {
  const { container } = renderToggle(<Toggle className="custom-toggle" />);
  const root = container.querySelector('.custom-toggle');
  expect(root).toBeTruthy();
});

it('should render an icon inside the knob', () => {
  const { getByText } = renderToggle(<Toggle icon={<span>★</span>} />);
  expect(getByText('★')).toBeTruthy();
});
