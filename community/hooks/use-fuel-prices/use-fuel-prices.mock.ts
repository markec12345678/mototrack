import { FuelPriceReport } from '@markec/community.entities.fuel-price-report';

/**
 * Seeded mock FuelPriceReport data covering 6 Balkan countries.
 * Used in tests and compositions to avoid real network calls.
 */
export const mockFuelPriceReports: FuelPriceReport[] = [
  FuelPriceReport.from({
    id: 'fpr-001',
    country: 'Slovenia',
    brand: 'OMV',
    petrolEur: 1.589,
    dieselEur: 1.479,
    location: 'Ljubljana, Tržaška cesta',
    reportedAt: Date.now() - 1000 * 60 * 60 * 2,
    confirms: 14,
  }),
  FuelPriceReport.from({
    id: 'fpr-002',
    country: 'Slovenia',
    brand: 'Petrol',
    petrolEur: 1.599,
    dieselEur: 1.489,
    location: 'Maribor, Ptujska cesta',
    reportedAt: Date.now() - 1000 * 60 * 60 * 5,
    confirms: 8,
  }),
  FuelPriceReport.from({
    id: 'fpr-003',
    country: 'Croatia',
    brand: 'INA',
    petrolEur: 1.529,
    dieselEur: 1.419,
    location: 'Zagreb, Slavonska avenija',
    reportedAt: Date.now() - 1000 * 60 * 60 * 8,
    confirms: 21,
  }),
  FuelPriceReport.from({
    id: 'fpr-004',
    country: 'Croatia',
    brand: 'Lukoil',
    petrolEur: 1.509,
    dieselEur: 1.399,
    location: 'Split, Vukovarska ulica',
    reportedAt: Date.now() - 1000 * 60 * 60 * 12,
    confirms: 6,
  }),
  FuelPriceReport.from({
    id: 'fpr-005',
    country: 'Serbia',
    brand: 'NIS',
    petrolEur: 1.389,
    dieselEur: 1.289,
    location: 'Beograd, Bulevar Mihajla Pupina',
    reportedAt: Date.now() - 1000 * 60 * 60 * 24,
    confirms: 33,
  }),
  FuelPriceReport.from({
    id: 'fpr-006',
    country: 'Montenegro',
    brand: 'Jugopetrol',
    petrolEur: 1.449,
    dieselEur: 1.349,
    location: 'Podgorica, Bulevar Ivana Crnojevića',
    reportedAt: Date.now() - 1000 * 60 * 60 * 36,
    confirms: 11,
  }),
];

/**
 * Expected country averages for the mock reports above.
 * Useful for asserting computed output in tests.
 */
export const mockCountryAverages = [
  {
    country: 'Slovenia',
    avgPetrolEur: 1.594,
    avgDieselEur: 1.484,
    reportCount: 2,
  },
  {
    country: 'Croatia',
    avgPetrolEur: 1.519,
    avgDieselEur: 1.409,
    reportCount: 2,
  },
  {
    country: 'Serbia',
    avgPetrolEur: 1.389,
    avgDieselEur: 1.289,
    reportCount: 1,
  },
  {
    country: 'Montenegro',
    avgPetrolEur: 1.449,
    avgDieselEur: 1.349,
    reportCount: 1,
  },
];
