/**
 * Plain object representation of emergency numbers for a country.
 */
export type PlainEmergencyNumber = {
  /**
   * ISO 3166-1 alpha-2 country code (e.g. "HR", "SI", "RS").
   */
  iso: string;

  /**
   * Country name in English.
   */
  country: string;

  /**
   * Police emergency number.
   */
  police: string;

  /**
   * Ambulance / medical emergency number.
   */
  ambulance: string;

  /**
   * Fire brigade emergency number.
   */
  fire: string;

  /**
   * EU-wide emergency number (always 112).
   */
  eu: '112';

  /**
   * Roadside / motoring assistance number (e.g. HAK, AMZS, AMS, BIHAMK, AMSM, …).
   */
  assistance: string;
};

export class EmergencyNumber {
  constructor(
    /**
     * ISO 3166-1 alpha-2 country code (e.g. "HR", "SI", "RS").
     */
    readonly iso: string,

    /**
     * Country name in English.
     */
    readonly country: string,

    /**
     * Police emergency number.
     */
    readonly police: string,

    /**
     * Ambulance / medical emergency number.
     */
    readonly ambulance: string,

    /**
     * Fire brigade emergency number.
     */
    readonly fire: string,

    /**
     * EU-wide emergency number (always 112).
     */
    readonly eu: '112',

    /**
     * Roadside / motoring assistance number (e.g. HAK, AMZS, AMS, BIHAMK, AMSM, …).
     */
    readonly assistance: string,
  ) {}

  /**
   * Virtual id — the ISO code serves as the unique identifier.
   */
  get id(): string {
    return this.iso;
  }

  /**
   * Serialize the entity into a plain object.
   */
  toObject(): PlainEmergencyNumber {
    return {
      iso: this.iso,
      country: this.country,
      police: this.police,
      ambulance: this.ambulance,
      fire: this.fire,
      eu: this.eu,
      assistance: this.assistance,
    };
  }

  /**
   * Create an EmergencyNumber instance from a plain object.
   */
  static from(plain: PlainEmergencyNumber): EmergencyNumber {
    const {
      iso = '',
      country = '',
      police = '',
      ambulance = '',
      fire = '',
      eu = '112',
      assistance = '',
    } = plain;

    return new EmergencyNumber(iso, country, police, ambulance, fire, eu, assistance);
  }
}

/**
 * Static dataset — all 10 Balkan countries.
 * Map of ISO 3166-1 alpha-2 → EmergencyNumber instance.
 */
export const EMERGENCY_NUMBERS: Record<string, EmergencyNumber> = {
  /** Croatia */
  HR: EmergencyNumber.from({
    iso: 'HR',
    country: 'Croatia',
    police: '192',
    ambulance: '194',
    fire: '193',
    eu: '112',
    assistance: '1987', // HAK – Hrvatski Autoklub
  }),

  /** Slovenia */
  SI: EmergencyNumber.from({
    iso: 'SI',
    country: 'Slovenia',
    police: '113',
    ambulance: '112',
    fire: '112',
    eu: '112',
    assistance: '1987', // AMZS – Avto-moto zveza Slovenije
  }),

  /** Serbia */
  RS: EmergencyNumber.from({
    iso: 'RS',
    country: 'Serbia',
    police: '192',
    ambulance: '194',
    fire: '193',
    eu: '112',
    assistance: '1987', // AMS – Auto-moto savez Srbije
  }),

  /** Bosnia and Herzegovina */
  BA: EmergencyNumber.from({
    iso: 'BA',
    country: 'Bosnia and Herzegovina',
    police: '122',
    ambulance: '124',
    fire: '123',
    eu: '112',
    assistance: '1282', // BIHAMK – Bosanskohercegovački auto-moto klub
  }),

  /** Montenegro */
  ME: EmergencyNumber.from({
    iso: 'ME',
    country: 'Montenegro',
    police: '122',
    ambulance: '124',
    fire: '123',
    eu: '112',
    assistance: '19807', // AMSCG – Auto-moto savez Crne Gore
  }),

  /** North Macedonia */
  MK: EmergencyNumber.from({
    iso: 'MK',
    country: 'North Macedonia',
    police: '192',
    ambulance: '194',
    fire: '193',
    eu: '112',
    assistance: '1987', // AMSM – Auto-moto sojuz na Makedonija
  }),

  /** Albania */
  AL: EmergencyNumber.from({
    iso: 'AL',
    country: 'Albania',
    police: '129',
    ambulance: '127',
    fire: '128',
    eu: '112',
    assistance: '0800 0001', // ACA – Automobil Club Albania
  }),

  /** Kosovo */
  XK: EmergencyNumber.from({
    iso: 'XK',
    country: 'Kosovo',
    police: '192',
    ambulance: '194',
    fire: '193',
    eu: '112',
    assistance: '038 748 748', // AMRKS – Auto-moto rruga e Kosovës
  }),

  /** Bulgaria */
  BG: EmergencyNumber.from({
    iso: 'BG',
    country: 'Bulgaria',
    police: '166',
    ambulance: '150',
    fire: '160',
    eu: '112',
    assistance: '1300', // SBA – Sŭyuz na bŭlgarskite avtomobilisti
  }),

  /** Greece */
  GR: EmergencyNumber.from({
    iso: 'GR',
    country: 'Greece',
    police: '100',
    ambulance: '166',
    fire: '199',
    eu: '112',
    assistance: '10400', // ELPA – Ellinikí Leschi Periigíseon kai Aftokinítou
  }),
};

/**
 * Returns the EmergencyNumber entry for a given ISO code,
 * or undefined if the country is not in the dataset.
 */
export function getEmergencyNumber(iso: string): EmergencyNumber | undefined {
  return EMERGENCY_NUMBERS[iso.toUpperCase()];
}

/**
 * Returns all EmergencyNumber entries as an array.
 */
export function listEmergencyNumbers(): EmergencyNumber[] {
  return Object.values(EMERGENCY_NUMBERS);
}
