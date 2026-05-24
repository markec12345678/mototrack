import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Signup } from './signup.js';

/**
 * Default — full signup page with all fields and Balkan country selector.
 */
export const DefaultSignup = () => {
  return (
    <MockProvider>
      <Signup redirectTo="/" loginPath="/login" />
    </MockProvider>
  );
};

/**
 * MobileView — signup page as seen on a narrow mobile screen.
 */
export const MobileView = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: `390px`, margin: `0 auto`, minHeight: `100vh` }}>
        <Signup redirectTo="/" loginPath="/login" />
      </div>
    </MockProvider>
  );
};

/**
 * WithCustomRedirect — signup configured to redirect to dashboard after success.
 */
export const WithCustomRedirect = () => {
  return (
    <MockProvider>
      <Signup redirectTo="/dashboard" loginPath="/prijava" />
    </MockProvider>
  );
};
