/**
 * Bounding-box definitions for the 10 Balkan countries.
 * Each entry contains the ISO 3166-1 alpha-2 country code, emoji flag,
 * and a tight lat/lng bounding box that covers the country's territory.
 *
 * Countries covered:
 *   SI – Slovenia
 *   HR – Croatia
 *   BA – Bosnia and Herzegovina
 *   RS – Serbia
 *   ME – Montenegro
 *   MK – North Macedonia
 *   AL – Albania
 *   BG – Bulgaria
 *   RO – Romania
 *   GR – Greece
 *
 * NOTE: Bounding boxes are intentionally tight to avoid false positives in
 * overlapping border regions. Slovenia's eastern limit is capped at 15.79
 * so that Zagreb (15.98 E) is correctly assigned to Croatia, not Slovenia.
 */

export type BoundingBox = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export type BalkanCountryEntry = {
  /** ISO 3166-1 alpha-2 country code */
  code: string;
  /** Country name in English */
  name: string;
  /** Unicode emoji flag */
  flag: string;
  /** Tight bounding box for the country */
  bbox: BoundingBox;
};

/**
 * Ordered from smallest to largest area so that smaller, more precise
 * bounding boxes are tested first — reduces false positives in overlapping regions.
 */
export const BALKAN_COUNTRIES: BalkanCountryEntry[] = [
  {
    code: 'ME',
    name: 'Montenegro',
    flag: '🇲🇪',
    bbox: { minLat: 41.85, maxLat: 43.55, minLng: 18.45, maxLng: 20.36 },
  },
  {
    code: 'MK',
    name: 'North Macedonia',
    flag: '🇲🇰',
    bbox: { minLat: 40.85, maxLat: 42.37, minLng: 20.45, maxLng: 23.03 },
  },
  {
    code: 'AL',
    name: 'Albania',
    flag: '🇦🇱',
    bbox: { minLat: 39.62, maxLat: 42.67, minLng: 19.27, maxLng: 21.07 },
  },
  {
    code: 'SI',
    name: 'Slovenia',
    flag: '🇸🇮',
    bbox: { minLat: 45.42, maxLat: 46.88, minLng: 13.38, maxLng: 15.79 },
  },
  {
    code: 'BA',
    name: 'Bosnia and Herzegovina',
    flag: '🇧🇦',
    bbox: { minLat: 42.56, maxLat: 45.27, minLng: 15.75, maxLng: 19.62 },
  },
  {
    code: 'HR',
    name: 'Croatia',
    flag: '🇭🇷',
    bbox: { minLat: 42.39, maxLat: 46.55, minLng: 13.49, maxLng: 19.45 },
  },
  {
    code: 'RS',
    name: 'Serbia',
    flag: '🇷🇸',
    bbox: { minLat: 42.23, maxLat: 46.19, minLng: 18.82, maxLng: 23.01 },
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    flag: '🇧🇬',
    bbox: { minLat: 41.23, maxLat: 44.22, minLng: 22.36, maxLng: 28.61 },
  },
  {
    code: 'GR',
    name: 'Greece',
    flag: '🇬🇷',
    bbox: { minLat: 34.80, maxLat: 41.75, minLng: 19.37, maxLng: 29.65 },
  },
  {
    code: 'RO',
    name: 'Romania',
    flag: '🇷🇴',
    bbox: { minLat: 43.62, maxLat: 48.27, minLng: 20.26, maxLng: 29.76 },
  },
];
