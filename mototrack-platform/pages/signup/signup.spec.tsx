import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Signup } from './signup.js';
import styles from './signup.module.scss';

function renderSignup() {
  return render(
    <MockProvider>
      <Signup redirectTo="/" loginPath="/login" />
    </MockProvider>
  );
}

it('should render the Registracija heading', () => {
  const { container } = renderSignup();
  const heading = container.querySelector(`h1`);
  expect(heading).toBeTruthy();
  expect(heading?.textContent).toContain(`Registracija`);
});

it('should render the email input', () => {
  const { container } = renderSignup();
  const emailInput = container.querySelector(`input[type="email"]`);
  expect(emailInput).toBeTruthy();
});

it('should render the username input', () => {
  const { container } = renderSignup();
  const inputs = container.querySelectorAll(`input[type="text"]`);
  expect(inputs.length).toBeGreaterThanOrEqual(1);
});

it('should render the password input', () => {
  const { container } = renderSignup();
  const passwordInput = container.querySelector(`input[type="password"]`);
  expect(passwordInput).toBeTruthy();
});

it('should render the country select dropdown', () => {
  const { container } = renderSignup();
  const select = container.querySelector(`select`);
  expect(select).toBeTruthy();
});

it('should render 10 Balkan country options plus placeholder', () => {
  const { container } = renderSignup();
  const select = container.querySelector(`select`);
  const options = select?.querySelectorAll(`option`);
  expect(options?.length).toBe(11);
});

it('should render the primary submit button with Registriraj se text', () => {
  const { container } = renderSignup();
  const buttons = container.querySelectorAll(`button[type="button"]`);
  const submitButton = Array.from(buttons).find((btn) => btn.textContent?.includes(`Registriraj se`));
  expect(submitButton).toBeTruthy();
});

it('should render the login link', () => {
  const { container } = renderSignup();
  const loginLink = container.querySelector(`.${styles.loginLink}`);
  expect(loginLink).toBeTruthy();
  expect(loginLink?.textContent).toContain(`Prijavi se`);
});

it('should update email input value on change', () => {
  const { container } = renderSignup();
  const emailInput = container.querySelector(`input[type="email"]`) as HTMLInputElement;
  fireEvent.change(emailInput, { target: { value: `test@mototrack.com` } });
  const updatedInput = container.querySelector(`input[type="email"]`) as HTMLInputElement;
  expect(updatedInput.value).toBe(`test@mototrack.com`);
});

it('should update password input value on change', () => {
  const { container } = renderSignup();
  const passwordInput = container.querySelector(`input[type="password"]`) as HTMLInputElement;
  fireEvent.change(passwordInput, { target: { value: `geslo1234` } });
  const updatedInput = container.querySelector(`input[type="password"]`) as HTMLInputElement;
  expect(updatedInput.value).toBe(`geslo1234`);
});

it('should render the logo wrapper', () => {
  const { container } = renderSignup();
  const logoWrapper = container.querySelector(`.${styles.logoWrapper}`);
  expect(logoWrapper).toBeTruthy();
});

it('should render the terms links', () => {
  const { container } = renderSignup();
  const termsLinks = container.querySelectorAll(`.${styles.termsLink}`);
  expect(termsLinks.length).toBe(2);
});

it('should render the page container', () => {
  const { container } = renderSignup();
  const page = container.querySelector(`.${styles.page}`);
  expect(page).toBeTruthy();
});
