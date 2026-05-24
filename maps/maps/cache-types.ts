/**
 * Aggregated statistics about the local offline tile cache.
 */
export type CacheStats = {
  /**
   * Number of tiles currently stored in the offline cache.
   */
  tilesCached: number;

  /**
   * Total bytes occupied by the cached tiles.
   */
  bytes: number;

  /**
   * Unix timestamp (ms) of the oldest cached tile, when known.
   */
  oldest?: number;

  /**
   * Unix timestamp (ms) of the newest cached tile, when known.
   */
  newest?: number;
};

/**
 * Result of a cacheTilesForRoute call.
 */
export type CacheTilesForRouteResult = {
  /**
   * Number of tiles successfully fetched and stored.
   */
  tilesCached: number;

  /**
   * Total bytes added to the cache during this operation.
   */
  bytes: number;
};
