/**
 * Minimal shape of a route that the navigation aspect can drive.
 * Other aspects (e.g. routes) compose richer types and assign them
 * to the navigation aspect via `setActiveRoute`.
 */
export type ActiveRoute = {
  /**
   * Stable identifier for the route.
   */
  id: string;

  /**
   * Human-readable name (e.g. `Ljubljana → Bled`).
   */
  name: string;

  /**
   * Total distance of the planned route, in kilometres.
   */
  distanceKm?: number;
};
