import { FuelPriceReport } from './fuel-price-report.js';
import type { PlainFuelPriceReport } from './fuel-price-report.js';

function generateId(index: number): string {
  return `fuel-report-${String(index).padStart(4, '0')}-${Math.random().toString(36).slice(2, 9)}`;
}

const seedReports: PlainFuelPriceReport[] = [
  {
    id: generateId(1),
    country: 'Serbia',
    brand: 'NIS Petrol',
    petrolEur: 1.52,
    dieselEur: 1.48,
    location: 'Novi Sad, Bulevar Oslobođenja',
    reportedAt: Date.now() - 1000 * 60 * 30,
    confirms: 14,
  },
  {
    id: generateId(2),
    country: 'Croatia',
    brand: 'INA',
    petrolEur: 1.61,
    dieselEur: 1.55,
    location: 'Zagreb, Slavonska avenija',
    reportedAt: Date.now() - 1000 * 60 * 90,
    confirms: 22,
  },
  {
    id: generateId(3),
    country: 'Bosnia and Herzegovina',
    brand: 'Hifa Petrol',
    petrolEur: 1.44,
    dieselEur: 1.39,
    location: 'Sarajevo, Zmaja od Bosne',
    reportedAt: Date.now() - 1000 * 60 * 180,
    confirms: 8,
  },
  {
    id: generateId(4),
    country: 'Slovenia',
    brand: 'Petrol',
    petrolEur: 1.68,
    dieselEur: 1.62,
    location: 'Ljubljana, Dunajska cesta',
    reportedAt: Date.now() - 1000 * 60 * 240,
    confirms: 31,
  },
  {
    id: generateId(5),
    country: 'North Macedonia',
    brand: 'OKTA',
    petrolEur: 1.38,
    dieselEur: 1.33,
    location: 'Skopje, Bulevar Partizanski odredi',
    reportedAt: Date.now() - 1000 * 60 * 360,
    confirms: 5,
  },
  {
    id: generateId(6),
    country: 'Montenegro',
    brand: 'Jugopetrol',
    petrolEur: 1.55,
    dieselEur: 1.49,
    location: 'Podgorica, Bulevar Svetog Petra Cetinjskog',
    reportedAt: Date.now() - 1000 * 60 * 480,
    confirms: 17,
  },
];

export function mockFuelPriceReports(
  overrides: Partial<PlainFuelPriceReport> = {},
): FuelPriceReport[] {
  return seedReports.map((report) =>
    FuelPriceReport.from({ ...report, ...overrides }),
  );
}
