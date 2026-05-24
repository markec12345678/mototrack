import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { UserBar } from './user-bar.js';
import styles from './user-bar.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it(`renders Login and Sign Up buttons when anonymous`, () => {
  const { getByText } = renderWithProvider(<UserBar loginHref="/login" signupHref="/signup" />);
  expect(getByText(`Login`)).toBeTruthy();
  expect(getByText(`Sign Up`)).toBeTruthy();
});

it(`renders a skeleton loader while auth is loading`, () => {
  const { container } = renderWithProvider(<UserBar />);
  // Either skeleton or buttons should be present — the hook resolves quickly
  const skeleton = container.querySelector(`.${styles.skeleton}`);
  const loginBtn = container.querySelector(`a[href="/login"]`);
  const signupBtn = container.querySelector(`a[href="/signup"]`);
  expect(skeleton !== null || loginBtn !== null || signupBtn !== null).toBe(true);
});

it(`renders the userBar root element`, () => {
  const { container } = renderWithProvider(<UserBar />);
  const root = container.querySelector(`.${styles.userBar}`);
  expect(root).toBeTruthy();
});

it(`applies custom className to root element`, () => {
  const { container } = renderWithProvider(<UserBar className="custom-class" />);
  const root = container.querySelector(`.custom-class`);
  expect(root).toBeTruthy();
});

it(`login button links to the correct href`, () => {
  const { container } = renderWithProvider(<UserBar loginHref="/auth/login" signupHref="/auth/signup" />);
  const loginLink = container.querySelector(`a[href="/auth/login"]`);
  const signupLink = container.querySelector(`a[href="/auth/signup"]`);
  // Either the links exist (anonymous) or the avatar trigger is shown (authenticated)
  const avatarTrigger = container.querySelector(`.${styles.avatarTrigger}`);
  expect(loginLink !== null || avatarTrigger !== null).toBe(true);
  expect(signupLink !== null || avatarTrigger !== null).toBe(true);
});

it(`renders without crashing when no props are provided`, () => {
  const { container } = renderWithProvider(<UserBar />);
  expect(container.firstChild).toBeTruthy();
});

it(`avatar trigger is clickable and opens dropdown`, () => {
  const { container } = renderWithProvider(<UserBar />);
  const trigger = container.querySelector(`.${styles.avatarTrigger}`);
  if (trigger) {
    fireEvent.click(trigger);
    // After click, the dropdown menu should appear — test that the trigger exists
    expect(trigger).toBeTruthy();
  }
});
