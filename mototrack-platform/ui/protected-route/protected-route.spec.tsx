import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { demoUser } from '@markec/mototrack-platform.hooks.use-auth';
import { ProtectedRoute } from './protected-route.js';
import styles from './protected-route.module.scss';

it('renders without crashing', () => {
  const { container } = render(
    <MockProvider>
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MockProvider>
  );
  expect(container).toBeTruthy();
});

it('renders either the overlay or the content wrapper', () => {
  const { container } = render(
    <MockProvider>
      <ProtectedRoute>
        <div>Content</div>
      </ProtectedRoute>
    </MockProvider>
  );
  const overlay = container.querySelector(`.${styles.overlay}`);
  const content = container.querySelector(`.${styles.content}`);
  expect(overlay !== null || content !== null).toBe(true);
});

it('applies a custom className', () => {
  const { container } = render(
    <MockProvider>
      <ProtectedRoute className="custom-class">
        <div>Styled</div>
      </ProtectedRoute>
    </MockProvider>
  );
  const el = container.querySelector('.custom-class');
  expect(el).toBeTruthy();
});

it('renders without children without crashing', () => {
  const { container } = render(
    <MockProvider>
      <ProtectedRoute />
    </MockProvider>
  );
  expect(container).toBeTruthy();
});

it('accepts redirectTo and allowedRoles props without crashing', () => {
  const { container } = render(
    <MockProvider>
      <ProtectedRoute redirectTo="/auth/login" allowedRoles={['admin', 'rider']}>
        <div>Role Content</div>
      </ProtectedRoute>
    </MockProvider>
  );
  expect(container).toBeTruthy();
});

it('renders content wrapper when mockUser is provided', () => {
  const { container } = render(
    <MockProvider>
      <ProtectedRoute mockUser={demoUser}>
        <div>Authenticated Content</div>
      </ProtectedRoute>
    </MockProvider>
  );
  const contentDiv = container.querySelector(`.${styles.content}`);
  expect(contentDiv).toBeTruthy();
});

it('renders children when mockUser is provided', () => {
  const { getByText } = render(
    <MockProvider>
      <ProtectedRoute mockUser={demoUser}>
        <div>Protected Content</div>
      </ProtectedRoute>
    </MockProvider>
  );
  expect(getByText('Protected Content')).toBeTruthy();
});
