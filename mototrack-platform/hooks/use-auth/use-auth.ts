import { useState, useEffect, useCallback } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { User } from '@markec/mototrack-platform.entities.user';
import type { PlainUser, UserLanguage, UserRole } from '@markec/mototrack-platform.entities.user';

const TOKEN_KEY = 'mototrack_token';

// ─── GraphQL Operations ───────────────────────────────────────────────────────

const GET_CURRENT_USER = gql`
  query GetCurrentUser($options: GetCurrentUserOptions!) {
    getCurrentUser(options: $options) {
      id
      email
      username
      displayName
      country
      language
      primaryBikeId
      points
      role
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($options: LoginOptions!) {
    login(options: $options) {
      token
      user {
        id
        email
        username
        displayName
        country
        language
        primaryBikeId
        points
        role
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        id
        email
        username
        displayName
        country
        language
        primaryBikeId
        points
        role
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout($options: LogoutOptions!) {
    logout(options: $options) {
      success
      message
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type SignupInput = {
  email: string;
  password: string;
  username: string;
  displayName: string;
  country: string;
};

type GqlUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  country: string;
  language: string;
  primaryBikeId?: string;
  points: number;
  role: string;
};

type GqlAuthPayload = {
  token: string;
  user: GqlUser;
};

export type UseAuthOptions = {
  /**
   * Provide a mock user to bypass GraphQL fetching in tests or compositions.
   */
  mockUser?: User;
};

export type UseAuthResult = {
  /**
   * The currently authenticated user, or null if not authenticated.
   */
  user: User | null;

  /**
   * Whether an auth operation or the initial user fetch is in progress.
   */
  isLoading: boolean;

  /**
   * Whether a user is currently authenticated.
   */
  isAuthenticated: boolean;

  /**
   * Log in with email and password. Stores the returned token in localStorage.
   */
  login: (email: string, password: string) => Promise<void>;

  /**
   * Sign up a new user. Stores the returned token in localStorage.
   */
  signup: (input: SignupInput) => Promise<void>;

  /**
   * Log out the current user. Clears the token from localStorage.
   */
  logout: () => Promise<void>;

  /**
   * Update the local user state with new data (e.g. after a profile update).
   */
  updateUser: (updated: User) => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (_e) {
    return null;
  }
}

function setStoredToken(tok: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, tok);
  } catch (_e) {
    // storage unavailable
  }
}

function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (_e) {
    // storage unavailable
  }
}

function userFromGql(gqlUser: GqlUser): User {
  const plain: PlainUser = {
    id: gqlUser.id,
    email: gqlUser.email,
    username: gqlUser.username,
    displayName: gqlUser.displayName,
    country: gqlUser.country,
    language: gqlUser.language as UserLanguage,
    primaryBikeId: gqlUser.primaryBikeId,
    points: gqlUser.points,
    role: gqlUser.role as UserRole,
    createdAt: new Date(),
  };
  return User.from(plain);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useAuth manages authentication state for the MotoTrack platform.
 *
 * Persists the JWT token in localStorage under the key mototrack_token.
 * On mount, if a token is found, it fetches the current user via GraphQL.
 *
 * Returns user, isLoading, isAuthenticated, login, signup, logout, updateUser.
 *
 * @param options - Optional configuration including mockUser for testing.
 */
export function useAuth(options?: UseAuthOptions): UseAuthResult {
  const { mockUser } = options ?? {};

  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<User | null>(mockUser ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(!mockUser && !!token);

  // ── Fetch current user on mount when token exists ──────────────────────────
  const { data: meData, loading: meLoading } = useQuery<{ getCurrentUser: GqlUser }>(
    GET_CURRENT_USER,
    {
      variables: { options: { token: token ?? '' } },
      skip: !!mockUser || !token,
    }
  );

  useEffect(() => {
    if (mockUser) return;
    if (meLoading) return;

    if (meData?.getCurrentUser) {
      setUser(userFromGql(meData.getCurrentUser));
    }
    setIsLoading(false);
  }, [meData, meLoading, mockUser]);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const [loginMutation, { loading: loginLoading }] = useMutation<{ login: GqlAuthPayload }>(LOGIN_MUTATION);
  const [signupMutation, { loading: signupLoading }] = useMutation<{ signup: GqlAuthPayload }>(SIGNUP_MUTATION);
  const [logoutMutation, { loading: logoutLoading }] = useMutation<{ logout: { success: boolean } }>(LOGOUT_MUTATION);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginMutation({
        variables: { options: { email, password } },
      });

      const payload = result.data?.login;
      if (!payload) throw new Error('Login failed: no payload returned');

      setStoredToken(payload.token);
      setToken(payload.token);
      setUser(userFromGql(payload.user));
    },
    [loginMutation]
  );

  // ── signup ─────────────────────────────────────────────────────────────────
  const signup = useCallback(
    async (input: SignupInput) => {
      const result = await signupMutation({
        variables: { input },
      });

      const payload = result.data?.signup;
      if (!payload) throw new Error('Signup failed: no payload returned');

      setStoredToken(payload.token);
      setToken(payload.token);
      setUser(userFromGql(payload.user));
    },
    [signupMutation]
  );

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const currentToken = getStoredToken();

    if (currentToken) {
      try {
        await logoutMutation({ variables: { options: { token: currentToken } } });
      } catch (_e) {
        // Swallow server errors — always clear local state
      }
    }

    removeStoredToken();
    setToken(null);
    setUser(null);
  }, [logoutMutation]);

  // ── updateUser ─────────────────────────────────────────────────────────────
  const updateUser = useCallback((updated: User) => {
    setUser(updated);
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────
  const mutating = loginLoading || signupLoading || logoutLoading;
  const resolvedLoading = mockUser ? false : isLoading || mutating;

  return {
    user,
    isLoading: resolvedLoading,
    isAuthenticated: user !== null,
    login,
    signup,
    logout,
    updateUser,
  };
}
