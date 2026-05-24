import { describe, it, expect } from 'vitest';
import { Expense } from './expense.js';
import { mockExpense, mockExpenses, seedExpenses, DEMO_USER_ID, DEMO_BIKE_ID } from './expense.mock.js';

describe('Expense entity', () => {
  it('has a static from() method', () => {
    expect(typeof Expense.from).toBe('function');
  });

  it('creates an Expense via Expense.from()', () => {
    const expense = Expense.from({
      id: 'exp-1',
      userId: 'user-1',
      category: 'fuel',
      amountEur: 30.0,
      label: 'Fuel stop',
      at: 1710000000000,
    });

    expect(expense).toBeInstanceOf(Expense);
    expect(expense.id).toBe('exp-1');
    expect(expense.userId).toBe('user-1');
    expect(expense.category).toBe('fuel');
    expect(expense.amountEur).toBe(30.0);
    expect(expense.label).toBe('Fuel stop');
    expect(expense.at).toBe(1710000000000);
  });

  it('supports optional bikeId and notes fields', () => {
    const withBike = Expense.from({
      id: 'exp-2',
      userId: 'user-1',
      bikeId: 'bike-1',
      category: 'maintenance',
      amountEur: 100,
      label: 'Oil change',
      at: 1710000000000,
      notes: 'Motul 7100',
    });

    expect(withBike.bikeId).toBe('bike-1');
    expect(withBike.notes).toBe('Motul 7100');

    const withoutBike = Expense.from({
      id: 'exp-3',
      userId: 'user-1',
      category: 'gear',
      amountEur: 200,
      label: 'Helmet',
      at: 1710000000000,
    });

    expect(withoutBike.bikeId).toBeUndefined();
    expect(withoutBike.notes).toBeUndefined();
  });

  it('serializes to a plain object via toObject()', () => {
    const plain = {
      id: 'exp-4',
      userId: 'user-1',
      bikeId: 'bike-1',
      category: 'insurance' as const,
      amountEur: 340,
      label: 'Annual insurance',
      at: 1704067200000,
      notes: '12 months',
    };

    const expense = Expense.from(plain);
    const obj = expense.toObject();

    expect(obj).toEqual(plain);
    expect(obj.id).toBe('exp-4');
  });

  it('toObject() includes an id property', () => {
    const expense = Expense.from({
      id: 'exp-5',
      userId: 'user-1',
      category: 'repair',
      amountEur: 55,
      label: 'Tyre repair',
      at: 1710000000000,
    });

    const obj = expense.toObject();
    expect(obj).toHaveProperty('id', 'exp-5');
  });

  it('round-trips through from() and toObject()', () => {
    const plain = {
      id: 'exp-6',
      userId: 'user-2',
      bikeId: 'bike-2',
      category: 'accessories' as const,
      amountEur: 89.99,
      label: 'Phone mount',
      at: 1709000000000,
      notes: 'RAM mount kit',
    };

    const obj = Expense.from(plain).toObject();
    expect(obj).toEqual(plain);
  });
});

describe('mockExpense()', () => {
  it('returns an Expense instance', () => {
    const expense = mockExpense();
    expect(expense).toBeInstanceOf(Expense);
  });

  it('applies partial overrides', () => {
    const expense = mockExpense({ label: 'Custom label', amountEur: 999 });
    expect(expense.label).toBe('Custom label');
    expect(expense.amountEur).toBe(999);
  });

  it('uses the demo user ID by default', () => {
    const expense = mockExpense();
    expect(expense.userId).toBe(DEMO_USER_ID);
  });

  it('uses the demo bike ID by default', () => {
    const expense = mockExpense();
    expect(expense.bikeId).toBe(DEMO_BIKE_ID);
  });
});

describe('mockExpenses()', () => {
  it('returns 6 Expense instances', () => {
    const expenses = mockExpenses();
    expect(expenses).toHaveLength(6);
    expenses.forEach((e) => expect(e).toBeInstanceOf(Expense));
  });

  it('covers distinct categories', () => {
    const expenses = mockExpenses();
    const categories = expenses.map((e) => e.category);
    const unique = new Set(categories);
    expect(unique.size).toBeGreaterThanOrEqual(4);
  });

  it('applies per-item overrides', () => {
    const expenses = mockExpenses([{ label: 'Override first' }]);
    expect(expenses[0].label).toBe('Override first');
    expect(expenses[1].label).not.toBe('Override first');
  });
});

describe('seedExpenses()', () => {
  it('returns 6 plain expense objects', () => {
    const seeds = seedExpenses();
    expect(seeds).toHaveLength(6);
    seeds.forEach((s) => {
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('userId', DEMO_USER_ID);
      expect(s).toHaveProperty('category');
      expect(s).toHaveProperty('amountEur');
      expect(s).toHaveProperty('label');
      expect(s).toHaveProperty('at');
    });
  });

  it('returns independent copies (no shared references)', () => {
    const [a, b] = [seedExpenses(), seedExpenses()];
    expect(a[0]).not.toBe(b[0]);
  });
});
