import { BorderCrossing } from './border-crossing.js';
import type { PlainBorderCrossing } from './border-crossing.js';

/**
 * Seed data for 10 key Balkan border crossings.
 */
const BORDER_CROSSING_SEEDS: PlainBorderCrossing[] = [
  {
    id: 'bc-001',
    name: 'Šentilj',
    countryFrom: 'SI',
    countryTo: 'AT',
    documents: ['Passport', 'EU ID Card'],
    vignetteRequired: true,
    avgWaitMin: 15,
    tips:
      'Austrian vignette (Pickerl) is mandatory. Buy it at the border petrol station or online before arrival. Busy on Friday afternoons — plan accordingly.',
  },
  {
    id: 'bc-002',
    name: 'Gruškovje / Macelj',
    countryFrom: 'HR',
    countryTo: 'SI',
    documents: ['Passport', 'EU ID Card'],
    vignetteRequired: true,
    avgWaitMin: 25,
    tips:
      'Slovenian vignette required. E-vignette can be purchased online. Peak summer queues can exceed 2 hours — use the Rogatec crossing as an alternative.',
  },
  {
    id: 'bc-003',
    name: 'Metković / Doljani',
    countryFrom: 'BA',
    countryTo: 'HR',
    documents: ['Passport', 'EU ID Card', 'Vehicle Registration', 'Green Card Insurance'],
    vignetteRequired: false,
    avgWaitMin: 20,
    tips:
      'No vignette needed in Bosnia. Carry Green Card insurance — it is checked regularly. Currency exchange available at the crossing.',
  },
  {
    id: 'bc-004',
    name: 'Debeli Brijeg',
    countryFrom: 'ME',
    countryTo: 'HR',
    documents: ['Passport', 'EU ID Card', 'Vehicle Registration', 'Green Card Insurance'],
    vignetteRequired: false,
    avgWaitMin: 35,
    tips:
      'One of the busiest crossings in summer due to Adriatic tourism. Arrive early morning to avoid long queues. Duty-free shop available on the Montenegrin side.',
  },
  {
    id: 'bc-005',
    name: 'Kalotina',
    countryFrom: 'BG',
    countryTo: 'RS',
    documents: ['Passport', 'EU ID Card', 'Vehicle Registration', 'Green Card Insurance'],
    vignetteRequired: false,
    avgWaitMin: 30,
    tips:
      'Main road corridor between Sofia and Belgrade. Serbian road tax (putarina) is paid at toll booths, not the border. Currency exchange available nearby.',
  },
  {
    id: 'bc-006',
    name: 'Albița / Leușeni',
    countryFrom: 'RO',
    countryTo: 'MD',
    documents: ['Passport', 'EU ID Card', 'Vehicle Registration', 'Green Card Insurance'],
    vignetteRequired: false,
    avgWaitMin: 45,
    tips:
      'Busiest Romania–Moldova crossing. Queues can be very long on weekends. Moldovan Green Card extension may be required. Carry local currency (MDL) for small fees.',
  },
  {
    id: 'bc-007',
    name: 'Iași / Sculeni',
    countryFrom: 'RO',
    countryTo: 'MD',
    documents: ['Passport', 'EU ID Card', 'Vehicle Registration', 'Green Card Insurance'],
    vignetteRequired: false,
    avgWaitMin: 40,
    tips:
      'Alternative to Albița for travellers from northern Moldova. Less congested than Leușeni. Petrol is cheaper in Moldova — fill up on the way back.',
  },
  {
    id: 'bc-008',
    name: 'Tabanovce / Preševo',
    countryFrom: 'MK',
    countryTo: 'RS',
    documents: ['Passport', 'EU ID Card', 'Vehicle Registration', 'Green Card Insurance'],
    vignetteRequired: false,
    avgWaitMin: 20,
    tips:
      'Key crossing on Corridor X (E75). Usually fast outside peak season. Serbian vignette not required — tolls are paid at booths. Keep documents ready for both sides.',
  },
  {
    id: 'bc-009',
    name: 'Hani i Hotit',
    countryFrom: 'AL',
    countryTo: 'ME',
    documents: ['Passport', 'Vehicle Registration', 'Green Card Insurance'],
    vignetteRequired: false,
    avgWaitMin: 25,
    tips:
      'EU ID cards are accepted for EU citizens. Road conditions on the Albanian approach can be poor — drive carefully. Fuel up in Albania as it is cheaper.',
  },
  {
    id: 'bc-010',
    name: 'Bogorodica / Evzoni',
    countryFrom: 'MK',
    countryTo: 'GR',
    documents: ['Passport', 'EU ID Card'],
    vignetteRequired: false,
    avgWaitMin: 20,
    tips:
      'Main crossing between North Macedonia and Greece. Greek motorway tolls apply after the border. Currency changes from MKD to EUR — exchange at the border or in Thessaloniki.',
  },
];

/**
 * Returns mock BorderCrossing instances, optionally overriding specific fields.
 */
export function mockBorderCrossings(
  overrides: Partial<PlainBorderCrossing>[] = [],
): BorderCrossing[] {
  return BORDER_CROSSING_SEEDS.map((seed, index) => {
    const override = overrides[index] ?? {};
    return BorderCrossing.from({ ...seed, ...override });
  });
}

/**
 * Returns a single mock BorderCrossing, optionally overriding specific fields.
 */
export function mockBorderCrossing(
  overrides: Partial<PlainBorderCrossing> = {},
): BorderCrossing {
  return BorderCrossing.from({ ...BORDER_CROSSING_SEEDS[0], ...overrides });
}
