import type { BikeModel } from './bike.model.js';
import type { MaintenanceItemModel } from './maintenance-item.model.js';
import type { ExpenseModel } from './expense.model.js';

const DAY_MS = 86400000;

export type GarageSeedData = {
  bikes: Partial<BikeModel>[];
  maintenanceItems: Partial<MaintenanceItemModel>[];
  expenses: Partial<ExpenseModel>[];
};

/**
 * builds the demo seed for a user — two bikes, six maintenance items on the
 * primary bike, and six expenses across categories.
 */
export function createGarageSeed(userId: string): GarageSeedData {
  const now = Date.now();

  const ktmId = 'seed-bike-ktm-890';
  const yamahaId = 'seed-bike-yamaha-mt07';

  const bikes: Partial<BikeModel>[] = [
    {
      id: ktmId,
      userId,
      name: 'KTM 890 Adventure',
      model: '890 Adventure',
      year: 2023,
      mileageKm: 14_820,
      tankL: 20,
      consumptionLPer100: 4.6,
      currentFuelL: 12.5,
      color: '#f97316',
      primary: true,
    },
    {
      id: yamahaId,
      userId,
      name: 'Yamaha MT-07',
      model: 'MT-07',
      year: 2021,
      mileageKm: 22_140,
      tankL: 14,
      consumptionLPer100: 4.2,
      currentFuelL: 6.0,
      color: '#3b82f6',
      primary: false,
    },
  ];

  const maintenanceItems: Partial<MaintenanceItemModel>[] = [
    {
      id: 'seed-maint-oil',
      bikeId: ktmId,
      name: 'Menjava olja',
      intervalKm: 7_500,
      intervalDays: 365,
      lastServiceKm: 8_200,
      lastServiceAt: now - 280 * DAY_MS,
      history: [],
    },
    {
      id: 'seed-maint-chain',
      bikeId: ktmId,
      name: 'Mazanje verige',
      intervalKm: 800,
      intervalDays: 30,
      lastServiceKm: 14_300,
      lastServiceAt: now - 18 * DAY_MS,
      history: [],
    },
    {
      id: 'seed-maint-tires',
      bikeId: ktmId,
      name: 'Pregled pnevmatik',
      intervalKm: 5_000,
      intervalDays: 180,
      lastServiceKm: 10_500,
      lastServiceAt: now - 120 * DAY_MS,
      history: [],
    },
    {
      id: 'seed-maint-brakes',
      bikeId: ktmId,
      name: 'Zavorne ploščice',
      intervalKm: 15_000,
      intervalDays: 540,
      lastServiceKm: 0,
      lastServiceAt: now - 400 * DAY_MS,
      history: [],
    },
    {
      id: 'seed-maint-filter',
      bikeId: ktmId,
      name: 'Zračni filter',
      intervalKm: 12_000,
      intervalDays: 365,
      lastServiceKm: 6_500,
      lastServiceAt: now - 230 * DAY_MS,
      history: [],
    },
    {
      id: 'seed-maint-coolant',
      bikeId: ktmId,
      name: 'Hladilna tekočina',
      intervalKm: 20_000,
      intervalDays: 720,
      lastServiceKm: 4_000,
      lastServiceAt: now - 500 * DAY_MS,
      history: [],
    },
  ];

  const expenses: Partial<ExpenseModel>[] = [
    {
      id: 'seed-exp-fuel-1',
      userId,
      bikeId: ktmId,
      category: 'fuel',
      amountEur: 28.4,
      label: 'OMV — Ljubljana',
      at: now - 3 * DAY_MS,
    },
    {
      id: 'seed-exp-service-1',
      userId,
      bikeId: ktmId,
      category: 'service',
      amountEur: 184.0,
      label: 'Servis 15.000 km',
      at: now - 22 * DAY_MS,
      notes: 'Menjava olja in filtra',
    },
    {
      id: 'seed-exp-insurance-1',
      userId,
      bikeId: ktmId,
      category: 'insurance',
      amountEur: 312.5,
      label: 'Letno zavarovanje',
      at: now - 45 * DAY_MS,
    },
    {
      id: 'seed-exp-parts-1',
      userId,
      bikeId: yamahaId,
      category: 'parts',
      amountEur: 96.9,
      label: 'Nova veriga DID',
      at: now - 60 * DAY_MS,
    },
    {
      id: 'seed-exp-tolls-1',
      userId,
      bikeId: ktmId,
      category: 'tolls',
      amountEur: 12.6,
      label: 'Vinjeta Avstrija — 10 dni',
      at: now - 80 * DAY_MS,
    },
    {
      id: 'seed-exp-parking-1',
      userId,
      bikeId: yamahaId,
      category: 'parking',
      amountEur: 4.2,
      label: 'Parkirnina BTC',
      at: now - 9 * DAY_MS,
    },
  ];

  return { bikes, maintenanceItems, expenses };
}
