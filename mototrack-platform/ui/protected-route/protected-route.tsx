import React from 'react';
import { Navigate } from 'react-router-dom';
import classNames from 'classnames';
import { Spinner } from '@markec/mototrack-design.loaders.spinner';
import { useAuth } from '@markec/mototrack-platform.hooks.use-auth';
import type { User } from '@markec/mototrack-platform.entities.user';
import styles from './protected-route.module.scss';

export type ProtectedRouteProps = {
  /**
   * The content to render when the user is authenticated (and authorized).
   */
  children?: React.ReactNode;

  /**
   * Path to redirect unauthenticated users to. Defaults to '/login'.
   */
  redirectTo?: string;

  /**
   * Optional list of roles allowed to access this route.
   * When omitted, any authenticated user is allowed.
   */
  allowedRoles?: string[];

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;

  /**
   * Mock user for testing and compositions. When provided, bypasses GraphQL
   * and treats the user as authenticated without a real token.
   */
  mockUser?: User;
};

/**
 * ProtectedRoute wraps a section of the app that requires authentication.
 * - While auth state is loading, a full-page spinner is shown.
 * - Unauthenticated users are redirected to redirectTo (default: /login).
 * - When allowedRoles is provided, users whose role is not in the list are
 *   redirected to the root path.
 */
export function ProtectedRoute({
  children,
  redirectTo = `/login`,
  allowedRoles,
  className,
  style,
  mockUser,
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth({ mockUser });

  if (isLoading) {
    return (
      <div className={classNames(styles.overlay, className)} style={style}>
        <div className={styles.card}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeLabel}>PROTECTED ROUTE</span>
          </div>
          <Spinner size="lg" label="Verifying your credentials..." />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user) {
    const hasRole = allowedRoles.includes(user.role);
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return (
    <div className={classNames(styles.content, className)} style={style}>
      {children}
    </div>
  );
}
