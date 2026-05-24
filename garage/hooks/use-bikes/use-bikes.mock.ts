import { Bike } from '@markec/garage.entities.bike';

export const mockBikeKtm = Bike.from({
  id: 'bike-001',
  userId: 'user-demo',
  name: 'KTM Adventure',
  model: 'KTM 890 Adventure',
  year: 2022,
  mileageKm: 14320,
  tankL: 20,
  consumptionLPer100: 5.2,
  currentFuelL: 12.5,
  color: '#f97316',
  primary: true,
});

export const mockBikeYamaha = Bike.from({
  id: 'bike-002',
  userId: 'user-demo',
  name: 'Yamaha MT',
  model: 'Yamaha MT-07',
  year: 2021,
  mileageKm: 8750,
  tankL: 14,
  consumptionLPer100: 4.8,
  currentFuelL: 7,
  color: '#3b82f6',
  primary: false,
});

export const mockBikeHonda = Bike.from({
  id: 'bike-003',
  userId: 'user-demo',
  name: 'Honda CB',
  model: 'Honda CB500F',
  year: 2020,
  mileageKm: 22100,
  tankL: 17.7,
  consumptionLPer100: 4.5,
  currentFuelL: 4,
  color: '#ef4444',
  primary: false,
});

export const mockBikes = [mockBikeKtm, mockBikeYamaha, mockBikeHonda];
