import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import type { TileProviderEntry } from './tile-provider-slot.js';
import type { CacheStats, CacheTilesForRouteResult } from './cache-types.js';
import { createMapsGqlSchema } from './maps.graphql.js';

/**
 * Node runtime for the maps aspect. The aspect owns no persisted data —
 * tile caching is purely a browser concern via the Cache API — so this
 * runtime simply registers a thin GraphQL surface that mirrors the
 * browser API for parity and future extension.
 */
export class MapsNode {
  private registeredProviders: TileProviderEntry[] = [];

  /**
   * register a tile provider on the server side. Kept in memory so that
   * a UI client can fetch a federated list of provider definitions.
   */
  registerTileProvider(provider: TileProviderEntry): boolean {
    const exists = this.registeredProviders.some((p) => p.key === provider.key);
    if (exists) return false;
    this.registeredProviders = [...this.registeredProviders, provider];
    return true;
  }

  /**
   * list every server-registered tile provider.
   */
  listTileProviders(): TileProviderEntry[] {
    return [...this.registeredProviders];
  }

  /**
   * stateless node-side stub for parity with the browser API. The actual
   * tile caching happens in the browser; here we simply echo a zero result.
   */
  async cacheTilesForRoute(
    _route: { lat: number; lng: number }[],
    _zoomLevels: number[],
    _bufferKm: number
  ): Promise<CacheTilesForRouteResult> {
    return { tilesCached: 0, bytes: 0 };
  }

  /**
   * stateless node-side stub for parity with the browser API.
   */
  async getOfflineCacheStats(): Promise<CacheStats> {
    return { tilesCached: 0, bytes: 0 };
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig = {};

  static async provider([symphonyPlatform]: [SymphonyPlatformNode]) {
    const maps = new MapsNode();
    const gqlSchema = createMapsGqlSchema(maps);

    symphonyPlatform.registerBackendServer([
      {
        gql: gqlSchema,
      },
    ]);

    return maps;
  }
}

export default MapsNode;
