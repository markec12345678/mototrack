import { TileProvider } from '@markec/maps.entities.tile-provider';

type ProviderWithPreview = PlainTileProvider & { previewUrl?: string };

type PlainTileProvider = {
  key: string;
  label: string;
  urlTemplate: string;
  attribution: string;
  maxZoom?: number;
  previewUrl?: string;
};

/** Convert a plain provider config into a TileProvider instance. */
function makeProvider(cfg: PlainTileProvider): TileProvider & { previewUrl?: string } {
  const tp = TileProvider.from({
    key: cfg.key,
    label: cfg.label,
    urlTemplate: cfg.urlTemplate,
    attribution: cfg.attribution,
    maxZoom: cfg.maxZoom ?? 19,
  });
  (tp as any).previewUrl = cfg.previewUrl;
  return tp as TileProvider & { previewUrl?: string };
}

export const BUILT_IN_PROVIDERS: (TileProvider & { previewUrl?: string })[] = [
  makeProvider({
    key: 'streets',
    label: 'Streets',
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap © CARTO',
    maxZoom: 19,
    previewUrl: 'https://storage.googleapis.com/bit-generated-images/images/image_miniature_map_tile_preview_sho_0_1779622612814.png',
  }),
  makeProvider({
    key: 'dark',
    label: 'Dark',
    urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© OpenStreetMap © CARTO',
    maxZoom: 19,
    previewUrl: 'https://storage.googleapis.com/bit-generated-images/images/image_miniature_map_tile_preview_in__0_1779622612243.png',
  }),
  makeProvider({
    key: 'satellite',
    label: 'Satellite',
    urlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri',
    maxZoom: 18,
    previewUrl: 'https://storage.googleapis.com/bit-generated-images/images/image_miniature_satellite_map_tile_p_0_1779622625201.png',
  }),
  makeProvider({
    key: 'topo',
    label: 'Terrain',
    urlTemplate: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap (CC-BY-SA)',
    maxZoom: 17,
    previewUrl: 'https://storage.googleapis.com/bit-generated-images/images/image_miniature_topographic_map_tile_0_1779622626072.png',
  }),
  makeProvider({
    key: 'osm',
    label: 'Standard',
    urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
    previewUrl: 'https://storage.googleapis.com/bit-generated-images/images/image_miniature_openstreetmap_tile_p_0_1779622625017.png',
  }),
];
