import type { BikeCardBike } from '@markec/garage.ui.bike-card';

export const mockKtmBike: BikeCardBike = {
  id: `bike-ktm-890`,
  name: `KTM 890 Adventure`,
  model: `890 Adventure`,
  year: 2023,
  mileageKm: 12450,
  tankL: 20,
  consumptionLPer100: 5.2,
  currentFuelL: 14,
  color: `#f97316`,
  primary: true,
};

export const mockYamahaBike: BikeCardBike = {
  id: `bike-yamaha-mt07`,
  name: `Yamaha MT-07`,
  model: `MT-07`,
  year: 2022,
  mileageKm: 8320,
  tankL: 13,
  consumptionLPer100: 4.8,
  currentFuelL: 6,
  color: `#3b82f6`,
  primary: false,
};

export const mockDucatiBike: BikeCardBike = {
  id: `bike-ducati-monster`,
  name: `Ducati Monster 937`,
  model: `Monster 937`,
  year: 2021,
  mileageKm: 21800,
  tankL: 14.5,
  consumptionLPer100: 6.1,
  currentFuelL: 3,
  color: `#ef4444`,
  primary: false,
};

export const mockGarageBikes: BikeCardBike[] = [
  mockKtmBike,
  mockYamahaBike,
  mockDucatiBike,
];
