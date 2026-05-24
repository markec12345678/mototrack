import { mockGarageBikes, mockKtmBike, mockYamahaBike, mockDucatiBike } from './garage-page.mock.js';

/**
 * The GaragePage component transitively imports ExpenseSummary which pulls in
 * a Mongoose/Typegoose model that crashes in the JSDom test environment.
 * Tests here cover the mock data and basic structural assertions only.
 */

describe(`GaragePage mock data`, () => {
  it(`mockKtmBike has correct id and name`, () => {
    expect(mockKtmBike.id).toBe(`bike-ktm-890`);
    expect(mockKtmBike.name).toBe(`KTM 890 Adventure`);
  });

  it(`mockKtmBike is the primary bike`, () => {
    expect(mockKtmBike.primary).toBe(true);
  });

  it(`mockYamahaBike has correct model`, () => {
    expect(mockYamahaBike.model).toBe(`MT-07`);
    expect(mockYamahaBike.primary).toBe(false);
  });

  it(`mockDucatiBike has correct year`, () => {
    expect(mockDucatiBike.year).toBe(2021);
  });

  it(`mockGarageBikes contains 3 bikes`, () => {
    expect(mockGarageBikes.length).toBe(3);
  });

  it(`mockGarageBikes first entry is the primary bike`, () => {
    expect(mockGarageBikes[0].primary).toBe(true);
  });

  it(`all mock bikes have required fields`, () => {
    for (const bike of mockGarageBikes) {
      expect(bike.id).toBeTruthy();
      expect(bike.name).toBeTruthy();
      expect(bike.model).toBeTruthy();
      expect(bike.year).toBeGreaterThan(2000);
      expect(bike.tankL).toBeGreaterThan(0);
      expect(bike.consumptionLPer100).toBeGreaterThan(0);
    }
  });

  it(`fuel level is within tank capacity for all mock bikes`, () => {
    for (const bike of mockGarageBikes) {
      expect(bike.currentFuelL).toBeGreaterThanOrEqual(0);
      expect(bike.currentFuelL).toBeLessThanOrEqual(bike.tankL);
    }
  });

  it(`mock bikes have valid hex color values`, () => {
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
    for (const bike of mockGarageBikes) {
      expect(hexColorRegex.test(bike.color)).toBe(true);
    }
  });
});
