import React, { type ReactNode } from 'react';
import { MototrackTheme } from '@markec/mototrack-design.mototrack-theme';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { EmptyContainer } from './empty-container.js';
import { MockContext } from './mock-provider-context.js';

export type MockProviderProps = {
  /**
   * Child components to render inside the mock provider.
   */
  children?: ReactNode;

  /**
   * Disable the MemoryRouter wrapper.
   */
  noRouter?: boolean;

  /**
   * Disable the MototrackTheme wrapper.
   */
  noTheme?: boolean;
};

/**
 * A mock provider for testing and previewing components
 * across the MotoTrack platform.
 *
 * Wraps children with:
 * - MockContext (isMock = true)
 * - MemoryRouter (react-router-dom)
 * - MototrackTheme (dark motorcycle theme)
 * - Apollo MockedProvider (for GraphQL mocking)
 */
export function MockProvider({ children, noRouter, noTheme }: MockProviderProps) {
  const Theme = noTheme ? EmptyContainer : MototrackTheme;
  const Router = noRouter ? EmptyContainer : MemoryRouter;

  return (
    <MockContext.Provider value>
      <Router>
        <Theme>
          <MockedProvider showWarnings={false}>
            {children}
          </MockedProvider>
        </Theme>
      </Router>
    </MockContext.Provider>
  );
}
