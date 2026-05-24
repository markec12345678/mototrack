export type PlainTileProvider = {
  /**
   * Unique key identifying the tile provider.
   */
  key: string;

  /**
   * Human-readable label for the tile provider.
   */
  label: string;

  /**
   * URL template for fetching tiles.
   * Supports {x}, {y}, {z} and optionally {s} for subdomains.
   */
  urlTemplate: string;

  /**
   * Attribution text required by the tile provider.
   */
  attribution: string;

  /**
   * Maximum zoom level supported by the provider.
   */
  maxZoom?: number;

  /**
   * Optional list of subdomains used in the URL template {s} placeholder.
   */
  subdomains?: string[];
};

export class TileProvider {
  constructor(
    /**
     * Unique key identifying the tile provider.
     */
    readonly key: string,

    /**
     * Human-readable label for the tile provider.
     */
    readonly label: string,

    /**
     * URL template for fetching tiles.
     * Supports {x}, {y}, {z} and optionally {s} for subdomains.
     */
    readonly urlTemplate: string,

    /**
     * Attribution text required by the tile provider.
     */
    readonly attribution: string,

    /**
     * Maximum zoom level supported by the provider.
     */
    readonly maxZoom: number = 19,

    /**
     * Optional list of subdomains used in the URL template {s} placeholder.
     */
    readonly subdomains: string[] = [],
  ) {}

  /**
   * Returns true if this provider uses subdomain rotation ({s} placeholder).
   */
  get hasSubdomains(): boolean {
    return this.subdomains.length > 0;
  }

  /**
   * Resolves a tile URL for the given tile coordinates.
   * Automatically rotates through subdomains when available.
   */
  getTileUrl(x: number, y: number, z: number): string {
    let url = this.urlTemplate
      .replace('{x}', String(x))
      .replace('{y}', String(y))
      .replace('{z}', String(z));

    if (this.hasSubdomains) {
      const subdomain = this.subdomains[(x + y) % this.subdomains.length];
      url = url.replace('{s}', subdomain);
    }

    return url;
  }

  /**
   * Serialize the TileProvider into a plain object.
   */
  toObject(): PlainTileProvider {
    return {
      key: this.key,
      label: this.label,
      urlTemplate: this.urlTemplate,
      attribution: this.attribution,
      maxZoom: this.maxZoom,
      subdomains: this.subdomains,
    };
  }

  /**
   * Create a TileProvider instance from a plain object.
   */
  static from(plain: PlainTileProvider): TileProvider {
    const {
      key = '',
      label = '',
      urlTemplate = '',
      attribution = '',
      maxZoom = 19,
      subdomains = [],
    } = plain;

    return new TileProvider(key, label, urlTemplate, attribution, maxZoom, subdomains);
  }
}

/**
 * Built-in tile providers ready to use out of the box.
 */
export const BUILT_IN_PROVIDERS: PlainTileProvider[] = [
  {
    key: 'carto-voyager',
    label: 'Streets (CARTO Voyager)',
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
  },
  {
    key: 'carto-dark',
    label: 'Dark (CARTO Dark Matter)',
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    subdomains: ['a', 'b', 'c', 'd'],
  },
  {
    key: 'esri-satellite',
    label: 'Satellite (Esri World Imagery)',
    urlTemplate:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
    subdomains: [],
  },
  {
    key: 'opentopomap',
    label: 'Terrain (OpenTopoMap)',
    urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 17,
    subdomains: ['a', 'b', 'c'],
  },
];
