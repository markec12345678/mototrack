import { Expense } from './expense.js';
import type { PlainExpense, ExpenseCategory } from './expense.js';

/**
 * Demo user ID used for seeded mock data.
 */
export const DEMO_USER_ID = 'demo-user-001';

/**
 * Demo bike ID used for seeded mock data.
 */
export const DEMO_BIKE_ID = 'demo-bike-001';

/**
 * Generate a simple sequential mock ID.
 */
function mockId(index: number): string {
  return `expense-mock-${String(index).padStart(3, '0')}`;
}

/**
 * Seed expenses for the demo user (~6 entries covering different categories).
 */
const SEED_EXPENSES: PlainExpense[] = [
  {
    id: mockId(1),
    userId: DEMO_USER_ID,
    bikeId: DEMO_BIKE_ID,
    category: 'fuel',
    amountEur: 28.5,
    label: 'Full tank — Shell station',
    at: new Date('2024-03-15').getTime(),
    notes: '14.2 L @ €2.01/L',
  },
  {
    id: mockId(2),
    userId: DEMO_USER_ID,
    bikeId: DEMO_BIKE_ID,
    category: 'maintenance',
    amountEur: 120.0,
    label: 'Oil & filter change',
    at: new Date('2024-02-20').getTime(),
    notes: 'Motul 7100 10W-40, K&N filter',
  },
  {
    id: mockId(3),
    userId: DEMO_USER_ID,
    bikeId: DEMO_BIKE_ID,
    category: 'insurance',
    amountEur: 340.0,
    label: 'Annual insurance premium',
    at: new Date('2024-01-01').getTime(),
    notes: 'Comprehensive cover, 12 months',
  },
  {
    id: mockId(4),
    userId: DEMO_USER_ID,
    bikeId: DEMO_BIKE_ID,
    category: 'registration',
    amountEur: 75.0,
    label: 'Vehicle registration renewal',
    at: new Date('2024-01-10').getTime(),
  },
  {
    id: mockId(5),
    userId: DEMO_USER_ID,
    bikeId: DEMO_BIKE_ID,
    category: 'gear',
    amountEur: 210.0,
    label: 'Alpinestars jacket',
    at: new Date('2024-03-05').getTime(),
    notes: 'CE Level 2 armour',
  },
  {
    id: mockId(6),
    userId: DEMO_USER_ID,
    bikeId: DEMO_BIKE_ID,
    category: 'repair',
    amountEur: 55.0,
    label: 'Rear tyre puncture repair',
    at: new Date('2024-03-22').getTime(),
  },
];

/**
 * Returns mock Expense instances for the demo user.
 * Pass partial overrides to customise individual fields.
 */
export function mockExpenses(overrides: Partial<PlainExpense>[] = []): Expense[] {
  return SEED_EXPENSES.map((seed, i) =>
    Expense.from({ ...seed, ...(overrides[i] ?? {}) })
  );
}

/**
 * Returns a single mock Expense with optional field overrides.
 */
export function mockExpense(override: Partial<PlainExpense> = {}): Expense {
  return Expense.from({ ...SEED_EXPENSES[0], ...override });
}

/**
 * Returns the raw seed data (plain objects) for the demo user.
 * Useful for database seeding scripts.
 */
export function seedExpenses(): PlainExpense[] {
  return SEED_EXPENSES.map((e) => ({ ...e }));
}

/**
 * All available expense categories.
 */
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'fuel',
  'maintenance',
  'insurance',
  'registration',
  'gear',
  'accessories',
  'repair',
  'other',
];
