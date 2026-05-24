import type { RoadCardProps } from './road-card.js';

export const mockVrsicPass: RoadCardProps = {
  id: `vrsic-pass`,
  name: `Vršič Pass`,
  country: `SI`,
  type: `Pass`,
  lengthKm: 25.4,
  rating: 9.2,
  difficulty: `Hard`,
};

export const mockTransfagarasan: RoadCardProps = {
  id: `transfagarasan`,
  name: `Transfăgărășan`,
  country: `RO`,
  type: `Pass`,
  lengthKm: 90.0,
  rating: 9.8,
  difficulty: `Expert`,
};

export const mockAdriaticCoast: RoadCardProps = {
  id: `adriatic-coast`,
  name: `Adriatic Coastal Road`,
  country: `HR`,
  type: `Coastal`,
  lengthKm: 178.5,
  rating: 8.7,
  difficulty: `Easy`,
};

export const mockSocaValley: RoadCardProps = {
  id: `soca-valley`,
  name: `Soča Valley Route`,
  country: `SI`,
  type: `Forest`,
  lengthKm: 48.2,
  rating: 8.5,
  difficulty: `Moderate`,
};

export const mockLovćen: RoadCardProps = {
  id: `lovcen`,
  name: `Lovćen Mountain Road`,
  country: `ME`,
  type: `Serpentine`,
  lengthKm: 22.1,
  rating: 9.0,
  difficulty: `Hard`,
};

export const mockMeteora: RoadCardProps = {
  id: `meteora`,
  name: `Meteora Scenic Route`,
  country: `GR`,
  type: `Serpentine`,
  lengthKm: 34.6,
  rating: 8.9,
  difficulty: `Moderate`,
};

export const mockRoads: RoadCardProps[] = [
  mockVrsicPass,
  mockTransfagarasan,
  mockAdriaticCoast,
  mockSocaValley,
  mockLovćen,
  mockMeteora,
];
