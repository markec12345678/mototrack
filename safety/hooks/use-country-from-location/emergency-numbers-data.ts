/**
 * Static emergency number dataset for the 10 Balkan countries.
 * All countries share the EU emergency number 112.
 */

export type EmergencyNumbers = {
  /** Police emergency number */
  police: string;
  /** Ambulance / medical emergency number */
  ambulance: string;
  /** Fire brigade number */
  fire: string;
  /** EU universal emergency number */
  eu: string;
  /** Roadside assistance number */
  assistance: string;
};

/**
 * Map of ISO 3166-1 alpha-2 country code → emergency numbers.
 */
export const EMERGENCY_NUMBERS: Record<string, EmergencyNumbers> = {
  SI: {
    police: '113',
    ambulance: '112',
    fire: '112',
    eu: '112',
    assistance: '1987', // AMZS
  },
  HR: {
    police: '192',
    ambulance: '194',
    fire: '193',
    eu: '112',
    assistance: '1987', // HAK
  },
  BA: {
    police: '122',
    ambulance: '124',
    fire: '123',
    eu: '112',
    assistance: '1282', // BIHAMK
  },
  RS: {
    police: '192',
    ambulance: '194',
    fire: '193',
    eu: '112',
    assistance: '1987', // AMS
  },
  ME: {
    police: '122',
    ambulance: '124',
    fire: '123',
    eu: '112',
    assistance: '19807', // AMSCG
  },
  MK: {
    police: '192',
    ambulance: '194',
    fire: '193',
    eu: '112',
    assistance: '196', // AMSM
  },
  AL: {
    police: '129',
    ambulance: '127',
    fire: '128',
    eu: '112',
    assistance: '0800 00 00', // ACA Albania
  },
  BG: {
    police: '166',
    ambulance: '150',
    fire: '160',
    eu: '112',
    assistance: '146', // SBA
  },
  RO: {
    police: '112',
    ambulance: '112',
    fire: '112',
    eu: '112',
    assistance: '9271', // ACR
  },
  GR: {
    police: '100',
    ambulance: '166',
    fire: '199',
    eu: '112',
    assistance: '10400', // ELPA
  },
};
