import type { BikeData, MaintenanceItemData } from './garage-dashboard-panel';

export const mockPrimaryBike: BikeData = {
  id: `bike-1`,
  name: `KTM 890 Adventure`,
  mileageKm: 18500,
  primary: true,
};

export const mockSecondaryBike: BikeData = {
  id: `bike-2`,
  name: `Yamaha MT-07`,
  mileageKm: 9200,
  primary: false,
};

export const mockBikes: BikeData[] = [mockPrimaryBike, mockSecondaryBike];

const now = Date.now();
const dayMs = 86400000;

export const mockMaintenanceItems: MaintenanceItemData[] = [
  {
    id: `m-1`,
    name: `Menjava olja`,
    intervalKm: 5000,
    intervalDays: 365,
    lastServiceKm: 14000,
    lastServiceAt: now - 280 * dayMs,
  },
  {
    id: `m-2`,
    name: `Zavorni tekočina`,
    intervalKm: 20000,
    intervalDays: 730,
    lastServiceKm: 0,
    lastServiceAt: now - 800 * dayMs,
  },
  {
    id: `m-3`,
    name: `Svečke`,
    intervalKm: 10000,
    intervalDays: 730,
    lastServiceKm: 9000,
    lastServiceAt: now - 400 * dayMs,
  },
  {
    id: `m-4`,
    name: `Zračni filter`,
    intervalKm: 15000,
    intervalDays: 365,
    lastServiceKm: 5000,
    lastServiceAt: now - 100 * dayMs,
  },
  {
    id: `m-5`,
    name: `Veriga`,
    intervalKm: 3000,
    intervalDays: 180,
    lastServiceKm: 16000,
    lastServiceAt: now - 60 * dayMs,
  },
  {
    id: `m-6`,
    name: `Hladilna tekočina`,
    intervalKm: 30000,
    intervalDays: 1095,
    lastServiceKm: 0,
    lastServiceAt: now - 200 * dayMs,
  },
];

export const mockAllOkItems: MaintenanceItemData[] = [
  {
    id: `ok-1`,
    name: `Menjava olja`,
    intervalKm: 5000,
    intervalDays: 365,
    lastServiceKm: 18000,
    lastServiceAt: now - 10 * dayMs,
  },
  {
    id: `ok-2`,
    name: `Svečke`,
    intervalKm: 10000,
    intervalDays: 730,
    lastServiceKm: 15000,
    lastServiceAt: now - 30 * dayMs,
  },
];
