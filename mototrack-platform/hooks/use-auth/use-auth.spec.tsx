import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { useAuth } from './use-auth.js';
import { demoUser } from './use-auth.mock.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('should return null user when no mockUser is provided', () => {
  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(result.current.user).toBeNull();
});

it('should return the mockUser when provided', () => {
  const { result } = renderHook(() => useAuth({ mockUser: demoUser }), { wrapper });

  expect(result.current.user?.username).toBe('markec');
  expect(result.current.user?.email).toBe('markec@mototrack.app');
  expect(result.current.user?.displayName).toBe('Markec');
  expect(result.current.user?.country).toBe('SI');
  expect(result.current.user?.level).toBe(8);
  expect(result.current.user?.points).toBe(5430);
});

it('should be authenticated when mockUser is provided', () => {
  const { result } = renderHook(() => useAuth({ mockUser: demoUser }), { wrapper });

  expect(result.current.isAuthenticated).toBe(true);
});

it('should not be authenticated when no user is set', () => {
  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(result.current.isAuthenticated).toBe(false);
});

it('should not be loading when mockUser is provided', () => {
  const { result } = renderHook(() => useAuth({ mockUser: demoUser }), { wrapper });

  expect(result.current.isLoading).toBe(false);
});

it('should update user via updateUser', () => {
  const { result } = renderHook(() => useAuth({ mockUser: demoUser }), { wrapper });

  const updatedUser = demoUser;

  act(() => {
    result.current.updateUser(updatedUser);
  });

  expect(result.current.user?.username).toBe('markec');
});

it('should logout and clear the user', async () => {
  const { result } = renderHook(() => useAuth({ mockUser: demoUser }), { wrapper });

  expect(result.current.isAuthenticated).toBe(true);

  await act(async () => {
    await result.current.logout();
  });

  expect(result.current.user).toBeNull();
  expect(result.current.isAuthenticated).toBe(false);
});

it('should expose login, signup, logout, updateUser as functions', () => {
  const { result } = renderHook(() => useAuth(), { wrapper });

  expect(typeof result.current.login).toBe('function');
  expect(typeof result.current.signup).toBe('function');
  expect(typeof result.current.logout).toBe('function');
  expect(typeof result.current.updateUser).toBe('function');
});
