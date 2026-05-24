export type MototrackPlatformConfig = {
  /**
   * mongo connection uri.
   */
  mongoUrl?: string;

  /**
   * secret key for signing JWT auth tokens.
   */
  sessionSecretKey?: string;
};
