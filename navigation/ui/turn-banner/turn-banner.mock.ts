import { NavInstruction } from '@markec/navigation.entities.nav-instruction';

export const mockTurnRight = NavInstruction.from({
  id: 'mock-turn-right',
  text: 'Zavijte desno',
  distanceM: 320,
  modifier: 'turn-right',
  announceAt: 300,
});

export const mockTurnLeft = NavInstruction.from({
  id: 'mock-turn-left',
  text: 'Zavijte levo',
  distanceM: 150,
  modifier: 'turn-left',
  announceAt: 200,
});

export const mockUturn = NavInstruction.from({
  id: 'mock-uturn',
  text: 'Obrnite se',
  distanceM: 80,
  modifier: 'uturn',
  announceAt: 150,
});

export const mockContinue = NavInstruction.from({
  id: 'mock-continue',
  text: 'Nadaljujte naravnost',
  distanceM: 1400,
  modifier: 'continue',
  announceAt: 300,
});

export const mockSharpRight = NavInstruction.from({
  id: 'mock-sharp-right',
  text: 'Ostro desno',
  distanceM: 60,
  modifier: 'sharp-right',
  announceAt: 150,
});

export const mockImminentTurn = NavInstruction.from({
  id: 'mock-imminent',
  text: 'Zavijte desno',
  distanceM: 50,
  modifier: 'turn-right',
  announceAt: 300,
});

export const mockStreetNames: Record<string, string> = {
  'turn-right': 'Dunajska cesta',
  'turn-left': 'Tržaška cesta',
  uturn: 'Celovška ulica',
  continue: 'Avtocesta A1',
  'sharp-right': 'Gorenjska cesta',
};
