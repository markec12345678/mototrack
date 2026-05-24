import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Login } from './login.js';

/**
 * Default — standard login page with Slovenian UI and demo credentials hint.
 */
export const DefaultLogin = () => {
  return (
    <MockProvider>
      <Login />
    </MockProvider>
  );
};

/**
 * MobileView — login page as seen on a narrow mobile screen.
 */
export const MobileView = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: `390px`, margin: `0 auto`, minHeight: `100vh` }}>
        <Login />
      </div>
    </MockProvider>
  );
};

/**
 * WithCustomRedirect — login that redirects to a custom path on success.
 */
export const WithCustomRedirect = () => {
  return (
    <MockProvider>
      <Login redirectTo="/nadzorna-plosca" signupPath="/registracija" />
    </MockProvider>
  );
};
