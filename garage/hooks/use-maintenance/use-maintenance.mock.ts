import { MaintenanceItem } from '@markec/garage.entities.maintenance-item';

const now = Date.now();
const daysAgo = (d: number) => now - d * 86_400_000;
const kmAgo = (mileage: number, km: number) => mileage - km;

const BIKE_ID = 'bike-ktm-890';

/**
 * Mock maintenance items for the KTM 890 Adventure (primary bike).
 */
export const mockMaintenanceItems: MaintenanceItem[] = [
  MaintenanceItem.from({
    id: 'maint-001',
    bikeId: BIKE_ID,
    name: 'Engine Oil & Filter',
    intervalKm: 7500,
    intervalDays: 365,
    lastServiceKm: kmAgo(24_800, 3_200),
    lastServiceAt: daysAgo(120),
    history: [
      { atKm: kmAgo(24_800, 10_700), atDate: daysAgo(485), note: 'Motul 7100 10W-40' },
      { atKm: kmAgo(24_800, 3_200), atDate: daysAgo(120), note: 'Motul 7100 10W-40' },
    ],
  }),
  MaintenanceItem.from({
    id: 'maint-002',
    bikeId: BIKE_ID,
    name: 'Chain Lubrication',
    intervalKm: 500,
    intervalDays: 30,
    lastServiceKm: kmAgo(24_800, 420),
    lastServiceAt: daysAgo(18),
    history: [
      { atKm: kmAgo(24_800, 920), atDate: daysAgo(48), note: undefined },
      { atKm: kmAgo(24_800, 420), atDate: daysAgo(18), note: 'Motul Chain Lube Road' },
    ],
  }),
  MaintenanceItem.from({
    id: 'maint-003',
    bikeId: BIKE_ID,
    name: 'Air Filter',
    intervalKm: 15_000,
    intervalDays: 730,
    lastServiceKm: kmAgo(24_800, 9_800),
    lastServiceAt: daysAgo(310),
    history: [
      { atKm: kmAgo(24_800, 9_800), atDate: daysAgo(310), note: 'OEM replacement' },
    ],
  }),
  MaintenanceItem.from({
    id: 'maint-004',
    bikeId: BIKE_ID,
    name: 'Brake Fluid',
    intervalKm: 20_000,
    intervalDays: 730,
    lastServiceKm: kmAgo(24_800, 12_300),
    lastServiceAt: daysAgo(520),
    history: [
      { atKm: kmAgo(24_800, 12_300), atDate: daysAgo(520), note: 'DOT 4' },
    ],
  }),
  MaintenanceItem.from({
    id: 'maint-005',
    bikeId: BIKE_ID,
    name: 'Spark Plugs',
    intervalKm: 12_000,
    intervalDays: 730,
    lastServiceKm: kmAgo(24_800, 4_800),
    lastServiceAt: daysAgo(200),
    history: [
      { atKm: kmAgo(24_800, 4_800), atDate: daysAgo(200), note: 'NGK Iridium' },
    ],
  }),
  MaintenanceItem.from({
    id: 'maint-006',
    bikeId: BIKE_ID,
    name: 'Coolant',
    intervalKm: 30_000,
    intervalDays: 1095,
    lastServiceKm: kmAgo(24_800, 24_800),
    lastServiceAt: daysAgo(900),
    history: [
      { atKm: 0, atDate: daysAgo(900), note: 'Factory fill' },
    ],
  }),
];
