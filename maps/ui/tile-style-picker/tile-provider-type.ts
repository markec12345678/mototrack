export type TileProvider = {
  key: string;
  label: string;
  urlTemplate: string;
  attribution: string;
  maxZoom?: number;
  /**
   * Optional preview thumbnail URL shown in the picker grid.
   */
  previewUrl?: string;
};
