import { describe, it, expect } from 'vitest';
import { MaintenanceItem, MaintenanceHistoryItem } from './maintenance-item.js';
import { mockMaintenanceItem, mockMaintenanceItems } from './maintenance-item.mock.js';

const BASE_NOW = new Date('2024-06-01T00:00:00.000Z').getTime();

function makeItem(overrides: Partial<{
  intervalKm: number;
  intervalDays: number;
  lastServiceKm: number;
  lastServiceAt: number;
}> = {}): MaintenanceItem {
  return MaintenanceItem.from({
    id: 'test-id',
    bikeId: 'bike-1',
    name: 'Oil Change',
    intervalKm: 5_000,
    intervalDays: 180,
    lastServiceKm: 10_000,
    lastServiceAt: BASE_NOW - 30 * 86_400_000, // 30 days ago
    history: [],
    ...overrides,
  });
}

describe('MaintenanceItem', () => {
  it('has a static from() method', () => {
    expect(MaintenanceItem.from).toBeTruthy();
  });

  it('creates an instance with correct properties', () => {
    const item = makeItem();
    expect(item.id).toBe('test-id');
    expect(item.bikeId).toBe('bike-1');
    expect(item.name).toBe('Oil Change');
    expect(item.intervalKm).toBe(5_000);
    expect(item.intervalDays).toBe(180);
    expect(item.lastServiceKm).toBe(10_000);
  });

  describe('kmUsed()', () => {
    it('returns the difference between current mileage and lastServiceKm', () => {
      const item = makeItem({ lastServiceKm: 10_000 });
      expect(item.kmUsed(12_000)).toBe(2_000);
    });

    it('returns 0 when current mileage equals lastServiceKm', () => {
      const item = makeItem({ lastServiceKm: 10_000 });
      expect(item.kmUsed(10_000)).toBe(0);
    });
  });

  describe('daysUsed()', () => {
    it('returns the number of days since last service', () => {
      const item = makeItem({ lastServiceAt: BASE_NOW - 60 * 86_400_000 });
      expect(item.daysUsed(BASE_NOW)).toBeCloseTo(60, 1);
    });
  });

  describe('ratio()', () => {
    it('returns the max of km ratio and day ratio', () => {
      // kmRatio = 2000/5000 = 0.4, dayRatio = 30/180 ≈ 0.167 → max = 0.4
      const item = makeItem({ lastServiceKm: 10_000, lastServiceAt: BASE_NOW - 30 * 86_400_000 });
      const r = item.ratio(12_000, BASE_NOW);
      expect(r).toBeCloseTo(0.4, 2);
    });

    it('uses the day ratio when it is larger', () => {
      // kmRatio = 100/5000 = 0.02, dayRatio = 170/180 ≈ 0.944 → max ≈ 0.944
      const item = makeItem({ lastServiceKm: 11_900, lastServiceAt: BASE_NOW - 170 * 86_400_000 });
      const r = item.ratio(12_000, BASE_NOW);
      expect(r).toBeGreaterThan(0.9);
    });
  });

  describe('status()', () => {
    it('returns "ok" when ratio < 0.5', () => {
      // kmRatio = 500/5000 = 0.1, dayRatio = 10/180 ≈ 0.056
      const item = makeItem({ lastServiceKm: 11_500, lastServiceAt: BASE_NOW - 10 * 86_400_000 });
      expect(item.status(12_000, BASE_NOW)).toBe('ok');
    });

    it('returns "warn" when 0.5 <= ratio < 1', () => {
      // kmRatio = 3000/5000 = 0.6
      const item = makeItem({ lastServiceKm: 9_000, lastServiceAt: BASE_NOW - 5 * 86_400_000 });
      expect(item.status(12_000, BASE_NOW)).toBe('warn');
    });

    it('returns "danger" when ratio >= 1', () => {
      // kmRatio = 6000/5000 = 1.2
      const item = makeItem({ lastServiceKm: 6_000, lastServiceAt: BASE_NOW - 5 * 86_400_000 });
      expect(item.status(12_000, BASE_NOW)).toBe('danger');
    });
  });

  describe('toObject()', () => {
    it('serializes to a plain object with all required fields', () => {
      const item = makeItem();
      const plain = item.toObject();
      expect(plain.id).toBe('test-id');
      expect(plain.bikeId).toBe('bike-1');
      expect(plain.name).toBe('Oil Change');
      expect(plain.intervalKm).toBe(5_000);
      expect(plain.intervalDays).toBe(180);
      expect(plain.lastServiceKm).toBe(10_000);
      expect(typeof plain.lastServiceAt).toBe('number');
      expect(Array.isArray(plain.history)).toBe(true);
    });

    it('round-trips through from() and toObject()', () => {
      const item = makeItem();
      const restored = MaintenanceItem.from(item.toObject());
      expect(restored.toObject()).toEqual(item.toObject());
    });
  });

  describe('history', () => {
    it('defaults to an empty array when history is omitted', () => {
      const item = MaintenanceItem.from({
        id: 'h-id',
        bikeId: 'bike-2',
        name: 'Tyre Check',
        intervalKm: 500,
        intervalDays: 14,
        lastServiceKm: 11_800,
        lastServiceAt: BASE_NOW - 7 * 86_400_000,
      });
      expect(item.history).toEqual([]);
    });

    it('maps history items correctly', () => {
      const item = MaintenanceItem.from({
        id: 'h-id-2',
        bikeId: 'bike-2',
        name: 'Chain Lube',
        intervalKm: 1_000,
        intervalDays: 30,
        lastServiceKm: 11_000,
        lastServiceAt: BASE_NOW - 10 * 86_400_000,
        history: [{ atKm: 11_000, atDate: BASE_NOW - 10 * 86_400_000, note: 'Done' }],
      });
      expect(item.history).toHaveLength(1);
      expect(item.history[0]).toBeInstanceOf(MaintenanceHistoryItem);
      expect(item.history[0].note).toBe('Done');
    });
  });
});

describe('MaintenanceHistoryItem', () => {
  it('serializes to a plain object', () => {
    const h = new MaintenanceHistoryItem(11_000, BASE_NOW, 'Test note');
    expect(h.toObject()).toEqual({ atKm: 11_000, atDate: BASE_NOW, note: 'Test note' });
  });

  it('omits note when undefined', () => {
    const h = new MaintenanceHistoryItem(11_000, BASE_NOW);
    expect(h.toObject()).not.toHaveProperty('note');
  });
});

describe('mockMaintenanceItems()', () => {
  it('returns exactly 6 items', () => {
    const items = mockMaintenanceItems('bike-abc');
    expect(items).toHaveLength(6);
  });

  it('all items belong to the given bikeId', () => {
    const items = mockMaintenanceItems('bike-xyz');
    items.forEach((item) => expect(item.bikeId).toBe('bike-xyz'));
  });

  it('each item has a unique id', () => {
    const items = mockMaintenanceItems('bike-abc');
    const ids = items.map((i) => i.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(6);
  });

  it('produces items with varied statuses', () => {
    const items = mockMaintenanceItems('bike-abc');
    const statuses = items.map((i) => i.status(12_000));
    expect(statuses).toContain('ok');
    expect(statuses).toContain('warn');
    expect(statuses).toContain('danger');
  });

  it('respects overrides', () => {
    const items = mockMaintenanceItems('bike-abc', { name: 'Custom Task' });
    items.forEach((item) => expect(item.name).toBe('Custom Task'));
  });
});

describe('mockMaintenanceItem()', () => {
  it('creates a single item for the given bikeId and task index', () => {
    const item = mockMaintenanceItem('bike-1', 0);
    expect(item).toBeInstanceOf(MaintenanceItem);
    expect(item.bikeId).toBe('bike-1');
  });
});
