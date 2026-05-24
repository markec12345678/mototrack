import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TextInput } from './text-input.js';
import styles from './text-input.module.scss';

function renderInput(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

it('should render the label text', () => {
  const { container } = renderInput(<TextInput label="Rider Name" />);
  const label = container.querySelector('label') as HTMLLabelElement;
  expect(label).toBeTruthy();
  expect(label.textContent).toContain('Rider Name');
});

it('should render the input element', () => {
  const { container } = renderInput(<TextInput label="Email" type="email" />);
  const input = container.querySelector('input') as HTMLInputElement;
  expect(input).toBeTruthy();
  expect(input.type).toBe('email');
});

it('should render placeholder text', () => {
  const { container } = renderInput(
    <TextInput placeholder="Enter your name…" />
  );
  const input = container.querySelector('input') as HTMLInputElement;
  expect(input.placeholder).toBe('Enter your name…');
});

it('should call onChange with the new value when typing', () => {
  const handleChange = vi.fn();
  const { container } = renderInput(
    <TextInput label="Name" onChange={(v) => handleChange(v)} />
  );
  const input = container.querySelector('input') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'Marco Rossi' } });
  expect(handleChange).toHaveBeenCalledWith('Marco Rossi');
});

it('should display the error message when errorMessage is set', () => {
  const { container } = renderInput(
    <TextInput label="Email" errorMessage="Invalid email address." />
  );
  const errorSpan = container.querySelector(`.${styles.errorMessage}`) as HTMLSpanElement;
  expect(errorSpan).toBeTruthy();
  expect(errorSpan.textContent).toContain('Invalid email address.');
});

it('should apply the error class to the input wrapper when errorMessage is set', () => {
  const { container } = renderInput(
    <TextInput label="Email" errorMessage="Required." />
  );
  const wrapper = container.querySelector(`.${styles.inputWrapper}`) as HTMLDivElement;
  expect(wrapper.classList.contains(styles.error)).toBe(true);
});

it('should display helper text when no error is present', () => {
  const { container } = renderInput(
    <TextInput label="Name" helperText="Enter your full name." />
  );
  const helper = container.querySelector(`.${styles.helperText}`) as HTMLSpanElement;
  expect(helper).toBeTruthy();
  expect(helper.textContent).toContain('Enter your full name.');
});

it('should not display helper text when an error message is present', () => {
  const { container } = renderInput(
    <TextInput
      label="Name"
      helperText="Enter your full name."
      errorMessage="This field is required."
    />
  );
  const helper = container.querySelector(`.${styles.helperText}`);
  expect(helper).toBeNull();
});

it('should render the left icon when provided', () => {
  const { container } = renderInput(
    <TextInput
      label="Search"
      leftIcon={<span data-testid="icon">🔍</span>}
    />
  );
  const iconWrapper = container.querySelector(`.${styles.leftIcon}`) as HTMLSpanElement;
  expect(iconWrapper).toBeTruthy();
});

it('should apply the hasIcon class when a left icon is provided', () => {
  const { container } = renderInput(
    <TextInput leftIcon={<span>icon</span>} />
  );
  const wrapper = container.querySelector(`.${styles.inputWrapper}`) as HTMLDivElement;
  expect(wrapper.classList.contains(styles.hasIcon)).toBe(true);
});

it('should disable the input when disabled prop is true', () => {
  const { container } = renderInput(
    <TextInput label="Name" disabled />
  );
  const input = container.querySelector('input') as HTMLInputElement;
  expect(input.disabled).toBe(true);
});

it('should show the required asterisk when required is true', () => {
  const { container } = renderInput(
    <TextInput label="Name" required />
  );
  const required = container.querySelector(`.${styles.required}`) as HTMLSpanElement;
  expect(required).toBeTruthy();
  expect(required.textContent).toContain('*');
});

it('should call onFocus when the input is focused', () => {
  const handleFocus = vi.fn();
  const { container } = renderInput(
    <TextInput label="Name" onFocus={() => handleFocus()} />
  );
  const input = container.querySelector('input') as HTMLInputElement;
  fireEvent.focus(input);
  expect(handleFocus).toHaveBeenCalledTimes(1);
});

it('should call onBlur when the input loses focus', () => {
  const handleBlur = vi.fn();
  const { container } = renderInput(
    <TextInput label="Name" onBlur={() => handleBlur()} />
  );
  const input = container.querySelector('input') as HTMLInputElement;
  fireEvent.blur(input);
  expect(handleBlur).toHaveBeenCalledTimes(1);
});

it('should apply focused class to the wrapper on focus', () => {
  const { container } = renderInput(<TextInput label="Name" />);
  const input = container.querySelector('input') as HTMLInputElement;
  fireEvent.focus(input);
  const wrapper = container.querySelector(`.${styles.inputWrapper}`) as HTMLDivElement;
  expect(wrapper.classList.contains(styles.focused)).toBe(true);
});

it('should remove focused class from the wrapper on blur', () => {
  const { container } = renderInput(<TextInput label="Name" />);
  const input = container.querySelector('input') as HTMLInputElement;
  fireEvent.focus(input);
  fireEvent.blur(input);
  const wrapper = container.querySelector(`.${styles.inputWrapper}`) as HTMLDivElement;
  expect(wrapper.classList.contains(styles.focused)).toBe(false);
});

it('should render with type password', () => {
  const { container } = renderInput(<TextInput type="password" />);
  const input = container.querySelector('input') as HTMLInputElement;
  expect(input.type).toBe('password');
});

it('should render with type search', () => {
  const { container } = renderInput(<TextInput type="search" />);
  const input = container.querySelector('input') as HTMLInputElement;
  expect(input.type).toBe('search');
});

it('should render with type number', () => {
  const { container } = renderInput(<TextInput type="number" />);
  const input = container.querySelector('input') as HTMLInputElement;
  expect(input.type).toBe('number');
});

it('should apply a custom className to the root wrapper', () => {
  const { container } = renderInput(
    <TextInput className="custom-class" />
  );
  const wrapper = container.querySelector(`.${styles.wrapper}`) as HTMLDivElement;
  expect(wrapper.classList.contains('custom-class')).toBe(true);
});

it('should bind the label htmlFor to the input id', () => {
  const { container } = renderInput(<TextInput label="Email" type="email" />);
  const label = container.querySelector('label') as HTMLLabelElement;
  const input = container.querySelector('input') as HTMLInputElement;
  expect(label.htmlFor).toBe(input.id);
});
