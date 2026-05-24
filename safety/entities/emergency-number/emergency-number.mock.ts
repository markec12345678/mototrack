import { EmergencyNumber } from './emergency-number.js';
import type { PlainEmergencyNumber } from './emergency-number.js';

/**
 * Returns a single mock EmergencyNumber (Croatia by default).
 * Accepts a partial override to customise individual fields.
 */
export function mockEmergencyNumber(
  overrides: Partial<PlainEmergencyNumber> = {},
): EmergencyNumber {
  return EmergencyNumber.from({
    iso: 'HR',
    country: 'Croatia',
    police: '192',
    ambulance: '194',
    fire: '193',
    eu: '112',
    assistance: '1987',
    ...overrides,
  });
}

/**
 * Returns a list of mock EmergencyNumber entries covering
 * a representative subset of Balkan countries.
 */
export function mockEmergencyNumbers(): EmergencyNumber[] {
  return [
    mockEmergencyNumber(),
    mockEmergencyNumber({
      iso: 'SI',
      country: 'Slovenia',
      police: '113',
      ambulance: '112',
      fire: '112',
      assistance: '1987',
    }),
    mockEmergencyNumber({
      iso: 'RS',
      country: 'Serbia',
      police: '192',
      ambulance: '194',
      fire: '193',
      assistance: '1987',
    }),
    mockEmergencyNumber({
      iso: 'BA',
      country: 'Bosnia and Herzegovina',
      police: '122',
      ambulance: '124',
      fire: '123',
      assistance: '1282',
    }),
    mockEmergencyNumber({
      iso: 'GR',
      country: 'Greece',
      police: '100',
      ambulance: '166',
      fire: '199',
      assistance: '10400',
    }),
  ];
}
