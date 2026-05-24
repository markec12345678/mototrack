import { Bike } from './bike.js';
import type { PlainBike } from './bike.js';

/** Demo user ID shared across seed data. */
export const DEMO_USER_ID = 'demo-user-001';

/**
 * Generate a simple sequential mock ID without relying on Node crypto.
 */
let _mockIdCounter = 1;
function mockId(): string {
  return `bike-mock-${String(_mockIdCounter++).padStart(4, '0')}`;
}

/**
 * Returns a mock KTM 890 Adventure bike (primary) with optional overrides.
 */
export function mockKtm890(overrides: Partial<PlainBike> = {}): Bike {
  return Bike.from({
    id: mockId(),
    userId: DEMO_USER_ID,
    name: 'KTM 890 Adventure',
    model: '890 Adventure',
    year: 2022,
    mileageKm: 14_320,
    tankL: 20,
    consumptionLPer100: 5.2,
    currentFuelL: 14,
    color: '#f97316',
    primary: true,
    ...overrides,
  });
}

/**
 * Returns a mock Yamaha MT-07 bike with optional overrides.
 */
export function mockYamahaMt07(overrides: Partial<PlainBike> = {}): Bike {
  return Bike.from({
    id: mockId(),
    userId: DEMO_USER_ID,
    name: 'Yamaha MT-07',
    model: 'MT-07',
    year: 2021,
    mileageKm: 8_750,
    tankL: 13,
    consumptionLPer100: 4.8,
    currentFuelL: 7,
    color: '#1e40af',
    primary: false,
    ...overrides,
  });
}

/**
 * Returns the two seeded demo bikes: KTM 890 Adventure (primary) and Yamaha MT-07.
 */
export function mockBikes(overrides: Partial<PlainBike> = {}): Bike[] {
  return [mockKtm890(overrides), mockYamahaMt07(overrides)];
}
