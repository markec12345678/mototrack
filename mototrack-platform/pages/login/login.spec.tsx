import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Login } from './login.js';
import styles from './login.module.scss';

function renderLogin(props?: Partial<React.ComponentProps<typeof Login>>) {
  return render(
    <MockProvider>
      <Login {...props} />
    </MockProvider>
  );
}

it('should render the Prijava heading', () => {
  const { container } = renderLogin();
  const heading = container.querySelector('h1');
  expect(heading).toBeTruthy();
  expect(heading?.textContent).toBe('Prijava');
});

it('should render the email input', () => {
  const { container } = renderLogin();
  const emailInput = container.querySelector('input[type="email"]');
  expect(emailInput).toBeTruthy();
});

it('should render the password input', () => {
  const { container } = renderLogin();
  const passwordInput = container.querySelector('input[type="password"]');
  expect(passwordInput).toBeTruthy();
});

it('should render the Prijavi se submit button', () => {
  const { container } = renderLogin();
  const button = container.querySelector('button[type="submit"]');
  expect(button).toBeTruthy();
  expect(button?.textContent).toContain('Prijavi se');
});

it('should render the demo credentials hint', () => {
  const { getByText } = renderLogin();
  const hint = getByText(/markec@mototrack\.app/);
  expect(hint).toBeTruthy();
});

it('should render the signup link', () => {
  const { container } = renderLogin();
  const links = container.querySelectorAll('a');
  const signupLink = Array.from(links).find((l) => l.textContent?.includes('Registracija'));
  expect(signupLink).toBeTruthy();
});

it('should render the logo wordmark', () => {
  const { getByText } = renderLogin();
  const moto = getByText('Moto');
  expect(moto).toBeTruthy();
});

it('should update email input value when typed', () => {
  const { container } = renderLogin();
  const emailInput = container.querySelector('input[type="email"]') as HTMLInputElement;
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  const updatedInput = container.querySelector('input[type="email"]') as HTMLInputElement;
  expect(updatedInput.value).toBe('test@example.com');
});

it('should update password input value when typed', () => {
  const { container } = renderLogin();
  const passwordInput = container.querySelector('input[type="password"]') as HTMLInputElement;
  fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
  const updatedInput = container.querySelector('input[type="password"]') as HTMLInputElement;
  expect(updatedInput.value).toBe('mypassword');
});

it('should render the demo hint section', () => {
  const { container } = renderLogin();
  const demoHint = container.querySelector(`.${styles.demoHint}`);
  expect(demoHint).toBeTruthy();
});

it('should render the signup row', () => {
  const { container } = renderLogin();
  const signupRow = container.querySelector(`.${styles.signupRow}`);
  expect(signupRow).toBeTruthy();
});

it('should render the background decoration', () => {
  const { container } = renderLogin();
  const bgDecoration = container.querySelector(`.${styles.bgDecoration}`);
  expect(bgDecoration).toBeTruthy();
});

it('should use the custom signupPath for the registration link', () => {
  const { container } = renderLogin({ signupPath: '/moja-registracija' });
  const links = container.querySelectorAll('a');
  const signupLink = Array.from(links).find((l) =>
    l.textContent?.includes('Registracija')
  ) as HTMLAnchorElement | undefined;
  expect(signupLink?.href).toContain('/moja-registracija');
});
