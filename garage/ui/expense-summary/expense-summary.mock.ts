import type { ExpenseItem } from './expense-summary.js';

export const mockExpenses: ExpenseItem[] = [
  { category: `Gorivo`, icon: `⛽`, amountEur: 412, percentage: 38 },
  { category: `Servis`, icon: `🔧`, amountEur: 285, percentage: 26 },
  { category: `Zavarovanje`, icon: `🛡️`, amountEur: 180, percentage: 17 },
  { category: `Pnevmatike`, icon: `🛞`, amountEur: 120, percentage: 11 },
  { category: `Cestnina`, icon: `🛣️`, amountEur: 65, percentage: 6 },
  { category: `Drugo`, icon: `📦`, amountEur: 18, percentage: 2 },
];

export const mockExpensesEmpty: ExpenseItem[] = [];
