import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { SelectList } from './select-list.js';
import type { SelectOption } from './select-list.js';
import styles from './select-list.module.scss';

const mockOptions: SelectOption[] = [
  { value: `motogp`, label: `MotoGP` },
  { value: `moto2`, label: `Moto2` },
  { value: `moto3`, label: `Moto3` },
];

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the label', () => {
  const { container } = renderWithProvider(
    <SelectList label="Race Class" options={mockOptions} />
  );
  const label = container.querySelector(`.${styles.label}`);
  expect(label).toBeTruthy();
  expect(label?.textContent).toBe(`Race Class`);
});

it('should render all options', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} />
  );
  const select = container.querySelector(`.${styles.select}`) as HTMLSelectElement;
  expect(select).toBeTruthy();
  const options = select.querySelectorAll(`option`);
  // +1 for the placeholder option
  expect(options.length).toBe(mockOptions.length + 1);
});

it('should render the placeholder option', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} placeholder="Pick a class..." />
  );
  const select = container.querySelector(`.${styles.select}`) as HTMLSelectElement;
  const firstOption = select.querySelector(`option`);
  expect(firstOption?.textContent).toBe(`Pick a class...`);
});

it('should display the selected value', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} value="moto2" />
  );
  const select = container.querySelector(`.${styles.select}`) as HTMLSelectElement;
  expect(select.value).toBe(`moto2`);
});

it('should call onChange with the selected value', () => {
  const handleChange = vi.fn();
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} onChange={handleChange} />
  );
  const select = container.querySelector(`.${styles.select}`) as HTMLSelectElement;
  fireEvent.change(select, { target: { value: `moto3` } });
  expect(handleChange).toHaveBeenCalledWith(`moto3`);
});

it('should render the error message', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} error="Please select a class." />
  );
  const errorMessage = container.querySelector(`.${styles.errorMessage}`);
  expect(errorMessage).toBeTruthy();
  expect(errorMessage?.textContent).toContain(`Please select a class.`);
});

it('should apply error class to select when error is provided', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} error="Required field." />
  );
  const select = container.querySelector(`.${styles.select}`);
  expect(select?.classList.contains(styles.errorSelect)).toBe(true);
});

it('should apply hasError class to wrapper when error is provided', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} error="Error!" />
  );
  const wrapper = container.querySelector(`.${styles.wrapper}`);
  expect(wrapper?.classList.contains(styles.hasError)).toBe(true);
});

it('should disable the select when disabled prop is true', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} disabled />
  );
  const select = container.querySelector(`.${styles.select}`) as HTMLSelectElement;
  expect(select.disabled).toBe(true);
});

it('should apply isDisabled class to wrapper when disabled', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} disabled />
  );
  const wrapper = container.querySelector(`.${styles.wrapper}`);
  expect(wrapper?.classList.contains(styles.isDisabled)).toBe(true);
});

it('should render required indicator on label when required is true', () => {
  const { container } = renderWithProvider(
    <SelectList label="Race Class" options={mockOptions} required />
  );
  const label = container.querySelector(`.${styles.label}`);
  expect(label?.classList.contains(styles.required)).toBe(true);
});

it('should not render error message when no error is provided', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} />
  );
  const errorMessage = container.querySelector(`.${styles.errorMessage}`);
  expect(errorMessage).toBeNull();
});

it('should not render label when label prop is not provided', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} label={undefined} />
  );
  const label = container.querySelector(`.${styles.label}`);
  expect(label).toBeNull();
});

it('should apply custom className to wrapper', () => {
  const { container } = renderWithProvider(
    <SelectList options={mockOptions} className="custom-class" />
  );
  const wrapper = container.querySelector(`.${styles.wrapper}`);
  expect(wrapper?.classList.contains(`custom-class`)).toBe(true);
});
