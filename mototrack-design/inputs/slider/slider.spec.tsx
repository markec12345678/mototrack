import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Slider } from './slider.js';
import styles from './slider.module.scss';

function renderSlider(props = {}) {
  return render(
    <MockProvider>
      <Slider {...props} />
    </MockProvider>
  );
}

it('should render the label', () => {
  const { getByText } = renderSlider({ label: `Twistiness` });
  expect(getByText(`Twistiness`)).toBeTruthy();
});

it('should render the default value', () => {
  const { container } = renderSlider({ defaultValue: 42, unit: `%` });
  const valueEl = container.querySelector(`.${styles.valueNumber}`);
  expect(valueEl).toBeTruthy();
  expect(valueEl?.textContent).toBe(`42`);
});

it('should render the unit', () => {
  const { container } = renderSlider({ unit: ` km` });
  const unitEl = container.querySelector(`.${styles.valueUnit}`);
  expect(unitEl).toBeTruthy();
  expect(unitEl?.textContent).toBe(` km`);
});

it('should render the controlled value', () => {
  const { container } = renderSlider({ value: 75, unit: `%` });
  const valueEl = container.querySelector(`.${styles.valueNumber}`);
  expect(valueEl?.textContent).toBe(`75`);
});

it('should call onChange with the new numeric value', () => {
  const handleChange = vi.fn();
  const { container } = renderSlider({ value: 30, onChange: handleChange });
  const input = container.querySelector(`input[type="range"]`) as HTMLInputElement;
  fireEvent.change(input, { target: { value: `60` } });
  expect(handleChange).toHaveBeenCalledWith(60);
});

it('should update the displayed value when uncontrolled', () => {
  const { container } = renderSlider({ defaultValue: 20, unit: `%` });
  const input = container.querySelector(`input[type="range"]`) as HTMLInputElement;
  fireEvent.change(input, { target: { value: `80` } });
  const valueEl = container.querySelector(`.${styles.valueNumber}`);
  expect(valueEl?.textContent).toBe(`80`);
});

it('should render the min and max tick labels', () => {
  const { container } = renderSlider({ min: 10, max: 200, unit: ` km` });
  const ticks = container.querySelectorAll(`.${styles.tick}`);
  expect(ticks.length).toBe(2);
  expect(ticks[0].textContent).toBe(`10 km`);
  expect(ticks[1].textContent).toBe(`200 km`);
});

it('should apply the disabled class when disabled', () => {
  const { container } = renderSlider({ disabled: true });
  const root = container.querySelector(`.${styles.sliderRoot}`);
  expect(root?.classList.contains(styles.disabled)).toBe(true);
});

it('should disable the native input when disabled', () => {
  const { container } = renderSlider({ disabled: true });
  const input = container.querySelector(`input[type="range"]`) as HTMLInputElement;
  expect(input.disabled).toBe(true);
});

it('should apply a custom className to the root', () => {
  const { container } = renderSlider({ className: `my-custom-class` });
  const root = container.querySelector(`.${styles.sliderRoot}`);
  expect(root?.classList.contains(`my-custom-class`)).toBe(true);
});

it('should render the track fill and thumb elements', () => {
  const { container } = renderSlider({ defaultValue: 50 });
  expect(container.querySelector(`.${styles.trackFill}`)).toBeTruthy();
  expect(container.querySelector(`.${styles.thumb}`)).toBeTruthy();
});

it('should not render the unit span when unit is empty string', () => {
  const { container } = renderSlider({ unit: `` });
  const unitEl = container.querySelector(`.${styles.valueUnit}`);
  expect(unitEl).toBeNull();
});
