export type RoutesConfig = {
  /**
   * base URL of the public OSRM router.
   */
  osrmBaseUrl?: string;

  /**
   * TTL of a shared route, in seconds. Defaults to 24 hours.
   */
  sharedRouteTtlSec?: number;
};
