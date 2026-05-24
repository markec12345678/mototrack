import type { ActiveRoute } from './active-route.js';

export type ActiveRouteListener = (route: ActiveRoute | null) => void;

/**
 * Tiny pub/sub store used by the navigation aspect to share the currently
 * active route across the runtime API and the React overlays it registers.
 */
export class ActiveRouteStore {
  private current: ActiveRoute | null = null;

  private listeners = new Set<ActiveRouteListener>();

  get(): ActiveRoute | null {
    return this.current;
  }

  set(route: ActiveRoute | null): void {
    this.current = route;
    this.listeners.forEach((listener) => listener(this.current));
  }

  subscribe(listener: ActiveRouteListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
