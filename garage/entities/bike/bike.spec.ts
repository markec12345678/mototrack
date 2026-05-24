import { describe, it, expect } from 'vitest';
import { Bike } from './bike.js';
import { mockBikes, mockKtm890, mockYamahaMt07, DEMO_USER_ID } from './bike.mock.js';

describe('Bike.from()', () => {
  it('creates a Bike instance from a plain object', () => {
    const bike = Bike.from({
      id: 'bike-001',
      userId: 'user-001',
      name: 'KTM 890 Adventure',
      model: '890 Adventure',
      year: 2022,
      mileageKm: 14320,
      tankL: 20,
      consumptionLPer100: 5.2,
      currentFuelL: 14,
      color: '#f97316',
      primary: true,
    });

    expect(bike).toBeInstanceOf(Bike);
    expect(bike.name).toBe('KTM 890 Adventure');
    expect(bike.model).toBe('890 Adventure');
    expect(bike.year).toBe(2022);
    expect(bike.primary).toBe(true);
  });

  it('defaults missing fields safely', () => {
    const bike = Bike.from({} as any);
    expect(bike.id).toBe('');
    expect(bike.userId).toBe('');
    expect(bike.name).toBe('');
    expect(bike.mileageKm).toBe(0);
    expect(bike.primary).toBe(false);
  });
});

describe('Bike.rangeKm', () => {
  it('computes rangeKm correctly: (currentFuelL * 100) / consumptionLPer100', () => {
    const bike = Bike.from({
      id: 'bike-001',
      userId: 'user-001',
      name: 'Test Bike',
      model: 'Test',
      year: 2020,
      mileageKm: 1000,
      tankL: 20,
      consumptionLPer100: 5,
      currentFuelL: 10,
      color: '#000',
      primary: false,
    });

    // (10 * 100) / 5 = 200
    expect(bike.rangeKm).toBe(200);
  });

  it('returns 0 when consumptionLPer100 is 0 to avoid division by zero', () => {
    const bike = Bike.from({
      id: 'bike-002',
      userId: 'user-001',
      name: 'Test Bike',
      model: 'Test',
      year: 2020,
      mileageKm: 0,
      tankL: 20,
      consumptionLPer100: 0,
      currentFuelL: 10,
      color: '#000',
      primary: false,
    });

    expect(bike.rangeKm).toBe(0);
  });

  it('computes rangeKm for KTM 890 mock: (14 * 100) / 5.2 ≈ 269.23', () => {
    const ktm = mockKtm890({ id: 'ktm-fixed' });
    expect(ktm.rangeKm).toBeCloseTo(269.23, 1);
  });

  it('computes rangeKm for Yamaha MT-07 mock: (7 * 100) / 4.8 ≈ 145.83', () => {
    const yamaha = mockYamahaMt07({ id: 'yamaha-fixed' });
    expect(yamaha.rangeKm).toBeCloseTo(145.83, 1);
  });
});

describe('Bike.toObject()', () => {
  it('serializes all fields including rangeKm', () => {
    const bike = mockKtm890({ id: 'ktm-001' });
    const obj = bike.toObject();

    expect(obj.id).toBe('ktm-001');
    expect(obj.userId).toBe(DEMO_USER_ID);
    expect(obj.name).toBe('KTM 890 Adventure');
    expect(obj.primary).toBe(true);
    expect(typeof obj.rangeKm).toBe('number');
    expect(obj.rangeKm).toBeCloseTo(269.23, 1);
  });

  it('round-trips through from() and toObject()', () => {
    const original = mockYamahaMt07({ id: 'yamaha-001' });
    const plain = original.toObject();
    const restored = Bike.from(plain);

    expect(restored.name).toBe(original.name);
    expect(restored.model).toBe(original.model);
    expect(restored.year).toBe(original.year);
    expect(restored.mileageKm).toBe(original.mileageKm);
    expect(restored.primary).toBe(original.primary);
  });
});

describe('mockBikes()', () => {
  it('returns two bikes', () => {
    const bikes = mockBikes();
    expect(bikes).toHaveLength(2);
  });

  it('first bike is KTM 890 Adventure and is primary', () => {
    const [ktm] = mockBikes();
    expect(ktm.name).toBe('KTM 890 Adventure');
    expect(ktm.primary).toBe(true);
  });

  it('second bike is Yamaha MT-07 and is not primary', () => {
    const [, yamaha] = mockBikes();
    expect(yamaha.name).toBe('Yamaha MT-07');
    expect(yamaha.primary).toBe(false);
  });

  it('both bikes belong to the demo user', () => {
    const bikes = mockBikes();
    bikes.forEach((bike) => {
      expect(bike.userId).toBe(DEMO_USER_ID);
    });
  });

  it('accepts overrides applied to both bikes', () => {
    const bikes = mockBikes({ color: '#ff0000' });
    bikes.forEach((bike) => {
      expect(bike.color).toBe('#ff0000');
    });
  });
});
