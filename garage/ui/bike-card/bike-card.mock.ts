import { type BikeCardBike } from './bike-card.js';

export const mockKtmBike: BikeCardBike = {
  id: `ktm-890-adv`,
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
  id: `yamaha-mt07`,
  name: `Yamaha MT-07`,
  model: `MT-07`,
  year: 2022,
  mileageKm: 8320,
  tankL: 14,
  consumptionLPer100: 4.8,
  currentFuelL: 3.2,
  color: `#3b82f6`,
  primary: false,
};

export const mockDucatiBike: BikeCardBike = {
  id: `ducati-monster`,
  name: `Ducati Monster 937`,
  model: `Monster 937`,
  year: 2021,
  mileageKm: 5870,
  tankL: 14.5,
  consumptionLPer100: 6.1,
  currentFuelL: 7.5,
  color: `#ef4444`,
  primary: false,
};

export const mockHondaBike: BikeCardBike = {
  id: `honda-cb650r`,
  name: `Honda CB650R`,
  model: `CB650R`,
  year: 2024,
  mileageKm: 1230,
  tankL: 15.4,
  consumptionLPer100: 4.5,
  currentFuelL: 1.8,
  color: `#22c55e`,
  primary: false,
};
