import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { Expense } from '@markec/garage.entities.expense';
import type { PlainExpense } from '@markec/garage.entities.expense';

// ─── GraphQL Operations ───────────────────────────────────────────────────────

const LIST_EXPENSES_QUERY = gql`
  query ListExpenses($filter: ListExpensesOptions) {
    listExpenses(filter: $filter) {
      id
      userId
      bikeId
      category
      amountEur
      label
      at
      notes
    }
  }
`;

const SAVE_EXPENSE_MUTATION = gql`
  mutation SaveExpense($input: ExpenseInput!) {
    saveExpense(input: $input) {
      id
      userId
      bikeId
      category
      amountEur
      label
      at
      notes
    }
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Filter options for listing expenses.
 */
export type UseExpensesOptions = {
  /** Optional bike ID to filter expenses by. */
  bikeId?: string;
  /** Optional start timestamp (ms) to filter expenses from. */
  from?: number;
  /** Optional end timestamp (ms) to filter expenses to. */
  to?: number;
  /** Optional mock data for testing — skips the network query when provided. */
  mockData?: Expense[];
};

/**
 * Input for saving (creating or updating) an expense.
 */
export type SaveExpenseInput = {
  id?: string;
  bikeId?: string;
  category: string;
  amountEur: number;
  label: string;
  at: number;
  notes?: string;
};

/**
 * Monthly total aggregation.
 */
export type MonthlyTotal = {
  /** Year-month key in YYYY-MM format. */
  month: string;
  /** Total amount in EUR for that month. */
  totalEur: number;
};

/**
 * Per-category aggregation.
 */
export type CategoryTotal = {
  /** Expense category name. */
  category: string;
  /** Total amount in EUR for that category. */
  totalEur: number;
  /** Number of expenses in this category. */
  count: number;
};

/**
 * Return value of the useExpenses hook.
 */
export type UseExpensesResult = {
  /** Flat list of expenses matching the current filter. */
  expenses: Expense[];
  /** Whether the list query is in flight. */
  loading: boolean;
  /** Error from the list query, if any. */
  error: Error | undefined;
  /** Refetch the expense list. */
  refetch: () => void;
  /**
   * Save (create or update) an expense.
   * Pass an id to update an existing record.
   */
  save: (input: SaveExpenseInput) => Promise<Expense | undefined>;
  /** Whether the save mutation is in flight. */
  saving: boolean;
  /** Error from the save mutation, if any. */
  saveError: Error | undefined;
  /** Monthly totals sorted chronologically. */
  monthlyTotal: MonthlyTotal[];
  /** Per-category totals sorted by total descending. */
  byCategory: CategoryTotal[];
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useExpenses — fetch, save, and aggregate garage expenses.
 *
 * @param options - Filter options (bikeId, from, to) and optional mockData for testing.
 * @returns expenses list, save helper, loading/error states, and aggregations.
 *
 * Aggregations:
 * - monthlyTotal: array of { month: 'YYYY-MM', totalEur } sorted chronologically.
 * - byCategory: array of { category, totalEur, count } sorted by totalEur descending.
 */
export function useExpenses(options: UseExpensesOptions = {}): UseExpensesResult {
  const { bikeId, from, to, mockData } = options;

  const filter = useMemo(
    () => ({
      ...(bikeId !== undefined && { bikeId }),
      ...(from !== undefined && { from }),
      ...(to !== undefined && { to }),
    }),
    [bikeId, from, to]
  );

  const {
    data,
    loading,
    error: queryError,
    refetch,
  } = useQuery<{ listExpenses: PlainExpense[] }>(LIST_EXPENSES_QUERY, {
    variables: { filter },
    skip: !!mockData,
  });

  const [saveExpenseMutation, { loading: saving, error: saveMutationError }] =
    useMutation<{ saveExpense: PlainExpense }>(SAVE_EXPENSE_MUTATION);

  const expenses = useMemo<Expense[]>(() => {
    if (mockData) return mockData;
    return (data?.listExpenses ?? []).map((e) => Expense.from(e));
  }, [mockData, data]);

  // ── Aggregations ────────────────────────────────────────────────────────────

  const monthlyTotal = useMemo<MonthlyTotal[]>(() => {
    const map = new Map<string, number>();
    for (const expense of expenses) {
      const date = new Date(expense.at);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      map.set(month, (map.get(month) ?? 0) + expense.amountEur);
    }
    return Array.from(map.entries())
      .map(([month, totalEur]) => ({ month, totalEur }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [expenses]);

  const byCategory = useMemo<CategoryTotal[]>(() => {
    const map = new Map<string, { totalEur: number; count: number }>();
    for (const expense of expenses) {
      const existing = map.get(expense.category) ?? { totalEur: 0, count: 0 };
      map.set(expense.category, {
        totalEur: existing.totalEur + expense.amountEur,
        count: existing.count + 1,
      });
    }
    return Array.from(map.entries())
      .map(([category, { totalEur, count }]) => ({ category, totalEur, count }))
      .sort((a, b) => b.totalEur - a.totalEur);
  }, [expenses]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const save = async (input: SaveExpenseInput): Promise<Expense | undefined> => {
    const result = await saveExpenseMutation({
      variables: { input },
      refetchQueries: [{ query: LIST_EXPENSES_QUERY, variables: { filter } }],
    });
    const saved = result.data?.saveExpense;
    return saved ? Expense.from(saved) : undefined;
  };

  return {
    expenses,
    loading: mockData ? false : loading,
    error: mockData ? undefined : queryError,
    refetch,
    save,
    saving,
    saveError: saveMutationError,
    monthlyTotal,
    byCategory,
  };
}
