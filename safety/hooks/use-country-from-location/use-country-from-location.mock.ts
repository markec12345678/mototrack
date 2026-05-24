import { CountryFromLocationResult, LatLng } from './use-country-from-location.js';

/**
 * Mock lat/lng coordinates for each of the 10 supported Balkan countries.
 */
export const mockLocations: Record<string, LatLng> = {
  /** Ljubljana, Slovenia */
  SI: { lat: 46.05, lng: 14.51 },
  /** Zagreb, Croatia */
  HR: { lat: 45.81, lng: 15.98 },
  /** Sarajevo, Bosnia and Herzegovina */
  BA: { lat: 43.85, lng: 18.39 },
  /** Belgrade, Serbia */
  RS: { lat: 44.79, lng: 20.46 },
  /** Podgorica, Montenegro */
  ME: { lat: 42.44, lng: 19.26 },
  /** Skopje, North Macedonia */
  MK: { lat: 41.99, lng: 21.43 },
  /** Tirana, Albania */
  AL: { lat: 41.33, lng: 19.82 },
  /** Sofia, Bulgaria */
  BG: { lat: 42.70, lng: 23.32 },
  /** Bucharest, Romania */
  RO: { lat: 44.43, lng: 26.10 },
  /** Athens, Greece */
  GR: { lat: 37.98, lng: 23.73 },
  /** Middle of the Atlantic — outside all bounding boxes */
  UNKNOWN: { lat: 0.0, lng: 0.0 },
};

/**
 * Pre-built mock results for each supported country.
 */
export const mockResults: Record<string, CountryFromLocationResult> = {
  SI: {
    country: 'SI',
    flag: '🇸🇮',
    emergencyNumbers: {
      police: '113',
      ambulance: '112',
      fire: '112',
      eu: '112',
      assistance: '1987',
    },
  },
  HR: {
    country: 'HR',
    flag: '🇭🇷',
    emergencyNumbers: {
      police: '192',
      ambulance: '194',
      fire: '193',
      eu: '112',
      assistance: '1987',
    },
  },
  BA: {
    country: 'BA',
    flag: '🇧🇦',
    emergencyNumbers: {
      police: '122',
      ambulance: '124',
      fire: '123',
      eu: '112',
      assistance: '1282',
    },
  },
  RS: {
    country: 'RS',
    flag: '🇷🇸',
    emergencyNumbers: {
      police: '192',
      ambulance: '194',
      fire: '193',
      eu: '112',
      assistance: '1987',
    },
  },
  ME: {
    country: 'ME',
    flag: '🇲🇪',
    emergencyNumbers: {
      police: '122',
      ambulance: '124',
      fire: '123',
      eu: '112',
      assistance: '19807',
    },
  },
  MK: {
    country: 'MK',
    flag: '🇲🇰',
    emergencyNumbers: {
      police: '192',
      ambulance: '194',
      fire: '193',
      eu: '112',
      assistance: '196',
    },
  },
  AL: {
    country: 'AL',
    flag: '🇦🇱',
    emergencyNumbers: {
      police: '129',
      ambulance: '127',
      fire: '128',
      eu: '112',
      assistance: '0800 00 00',
    },
  },
  BG: {
    country: 'BG',
    flag: '🇧🇬',
    emergencyNumbers: {
      police: '166',
      ambulance: '150',
      fire: '160',
      eu: '112',
      assistance: '146',
    },
  },
  RO: {
    country: 'RO',
    flag: '🇷🇴',
    emergencyNumbers: {
      police: '112',
      ambulance: '112',
      fire: '112',
      eu: '112',
      assistance: '9271',
    },
  },
  GR: {
    country: 'GR',
    flag: '🇬🇷',
    emergencyNumbers: {
      police: '100',
      ambulance: '166',
      fire: '199',
      eu: '112',
      assistance: '10400',
    },
  },
  UNKNOWN: {
    country: null,
    flag: null,
    emergencyNumbers: null,
  },
};
