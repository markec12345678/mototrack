import { Expense } from '@markec/garage.entities.expense';
import type { PlainExpense } from '@markec/garage.entities.expense';

const now = Date.now();
const oneDay = 86_400_000;

const plainExpenses: PlainExpense[] = [
  { id: 'exp-1', userId: 'user-1', bikeId: 'bike-1', category: 'fuel', amountEur: 48.5, label: 'Full tank — KTM 890', at: now - 2 * oneDay, notes: 'Highway trip' },
  { id: 'exp-2', userId: 'user-1', bikeId: 'bike-1', category: 'maintenance', amountEur: 120.0, label: 'Oil & filter change', at: now - 10 * oneDay, notes: 'Done at home' },
  { id: 'exp-3', userId: 'user-1', bikeId: 'bike-1', category: 'repair', amountEur: 340.0, label: 'Michelin Road 6 set', at: now - 30 * oneDay },
  { id: 'exp-4', userId: 'user-1', bikeId: 'bike-2', category: 'fuel', amountEur: 35.0, label: 'Full tank — MT-07', at: now - 5 * oneDay },
  { id: 'exp-5', userId: 'user-1', bikeId: 'bike-2', category: 'accessories', amountEur: 89.99, label: 'Handlebar grips & mirrors', at: now - 45 * oneDay, notes: 'Rizoma parts' },
  { id: 'exp-6', userId: 'user-1', bikeId: 'bike-1', category: 'insurance', amountEur: 620.0, label: 'Annual insurance premium', at: now - 60 * oneDay },
];

/**
 * Mock expense data for testing and compositions.
 * Six entries across two bikes and multiple categories.
 */
export const expenseMocks: Expense[] = plainExpenses.map((e) => Expense.from(e));
