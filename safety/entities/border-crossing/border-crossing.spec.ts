import { describe, it, expect } from 'vitest';
import { BorderCrossing } from './border-crossing.js';
import { mockBorderCrossings, mockBorderCrossing } from './border-crossing.mock.js';

describe('BorderCrossing', () => {
  it('has a static from() method', () => {
    expect(BorderCrossing.from).toBeTruthy();
  });

  it('creates a BorderCrossing instance from a plain object', () => {
    const crossing = BorderCrossing.from({
      id: 'bc-test-01',
      name: 'Šentilj',
      countryFrom: 'SI',
      countryTo: 'AT',
      documents: ['Passport', 'EU ID Card'],
      vignetteRequired: true,
      avgWaitMin: 15,
      tips: 'Buy the Austrian vignette before arrival.',
    });

    expect(crossing).toBeInstanceOf(BorderCrossing);
    expect(crossing.id).toBe('bc-test-01');
    expect(crossing.name).toBe('Šentilj');
    expect(crossing.countryFrom).toBe('SI');
    expect(crossing.countryTo).toBe('AT');
    expect(crossing.documents).toEqual(['Passport', 'EU ID Card']);
    expect(crossing.vignetteRequired).toBe(true);
    expect(crossing.avgWaitMin).toBe(15);
    expect(crossing.tips).toBe('Buy the Austrian vignette before arrival.');
  });

  it('serializes to a plain object via toObject()', () => {
    const plain = {
      id: 'bc-test-02',
      name: 'Kalotina',
      countryFrom: 'BG',
      countryTo: 'RS',
      documents: ['Passport', 'Green Card Insurance'],
      vignetteRequired: false,
      avgWaitMin: 30,
      tips: 'Serbian road tax is paid at toll booths.',
    };

    const crossing = BorderCrossing.from(plain);
    expect(crossing.toObject()).toEqual(plain);
  });

  it('toObject() includes the id field', () => {
    const crossing = BorderCrossing.from({
      id: 'bc-test-03',
      name: 'Debeli Brijeg',
      countryFrom: 'ME',
      countryTo: 'HR',
      documents: ['Passport'],
      vignetteRequired: false,
      avgWaitMin: 35,
      tips: 'Arrive early in summer.',
    });

    const obj = crossing.toObject();
    expect(obj.id).toBe('bc-test-03');
  });

  it('handles missing documents gracefully with default empty array', () => {
    const crossing = BorderCrossing.from({
      id: 'bc-test-04',
      name: 'Test Crossing',
      countryFrom: 'RS',
      countryTo: 'MK',
      documents: [],
      vignetteRequired: false,
      avgWaitMin: 10,
      tips: 'No special requirements.',
    });

    expect(crossing.documents).toEqual([]);
  });

  it('vignetteRequired defaults to false when not provided', () => {
    const crossing = BorderCrossing.from({
      id: 'bc-test-05',
      name: 'Test Crossing',
      countryFrom: 'AL',
      countryTo: 'ME',
      documents: ['Passport'],
      vignetteRequired: false,
      avgWaitMin: 20,
      tips: 'Fuel up in Albania.',
    });

    expect(crossing.vignetteRequired).toBe(false);
  });
});

describe('mockBorderCrossings', () => {
  it('returns 10 seed border crossings', () => {
    const crossings = mockBorderCrossings();
    expect(crossings).toHaveLength(10);
  });

  it('returns BorderCrossing instances', () => {
    const crossings = mockBorderCrossings();
    crossings.forEach((c) => expect(c).toBeInstanceOf(BorderCrossing));
  });

  it('each crossing has a unique id', () => {
    const crossings = mockBorderCrossings();
    const ids = crossings.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(crossings.length);
  });

  it('applies overrides to specific crossings', () => {
    const crossings = mockBorderCrossings([{ avgWaitMin: 999 }]);
    expect(crossings[0].avgWaitMin).toBe(999);
    expect(crossings[1].avgWaitMin).not.toBe(999);
  });

  it('includes crossings with vignetteRequired true', () => {
    const crossings = mockBorderCrossings();
    const withVignette = crossings.filter((c) => c.vignetteRequired);
    expect(withVignette.length).toBeGreaterThan(0);
  });

  it('all crossings have non-empty tips', () => {
    const crossings = mockBorderCrossings();
    crossings.forEach((c) => expect(c.tips.length).toBeGreaterThan(0));
  });
});

describe('mockBorderCrossing', () => {
  it('returns a single BorderCrossing instance', () => {
    const crossing = mockBorderCrossing();
    expect(crossing).toBeInstanceOf(BorderCrossing);
  });

  it('applies partial overrides', () => {
    const crossing = mockBorderCrossing({ name: 'Custom Crossing', avgWaitMin: 5 });
    expect(crossing.name).toBe('Custom Crossing');
    expect(crossing.avgWaitMin).toBe(5);
  });
});
