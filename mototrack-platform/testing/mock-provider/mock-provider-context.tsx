import { createContext } from 'react';

/**
 * Context for tracking whether the app is running in mock mode.
 */
export const MockContext = createContext<boolean>(false);
