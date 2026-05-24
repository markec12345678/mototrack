/**
 * Represents a user with basic identification and roles for authorization.
 */
export interface User {
  id: string;
  roles: string[];
}