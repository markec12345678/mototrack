export type SignupInput = {
  /**
   * The user's email address.
   */
  email: string;

  /**
   * The user's chosen password.
   */
  password: string;

  /**
   * The user's unique username.
   */
  username: string;

  /**
   * The user's display name.
   */
  displayName: string;

  /**
   * The user's country.
   */
  country: string;
};