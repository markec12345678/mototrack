import { useContext } from 'react';
import { MockContext } from './mock-provider-context.js';

/**
 * Determine whether a component is currently
 * rendering inside a mocked context.
 */
export function useIsMock(): boolean {
  const isMock = useContext(MockContext);
  return Boolean(isMock);
}
