import React from 'react';
import styles from './expense-summary.module.scss';

export type ExpenseItem = {
  category: string;
  icon: string;
  amountEur: number;
  percentage: number;
};

export type ExpenseSummaryProps = {
  /** List of expense items by category. */
  expenses?: ExpenseItem[];
  /** Monthly total in EUR. */
  monthlyTotal?: number;
  /** Period label. */
  periodLabel?: string;
  /** Called when "Add expense" is clicked. */
  onAdd?: () => void;
  /** Additional class name. */
  className?: string;
};

const DEFAULT_EXPENSES: ExpenseItem[] = [
  { category: 'Gorivo', icon: '⛽', amountEur: 412, percentage: 38 },
  { category: 'Servis', icon: '🔧', amountEur: 285, percentage: 26 },
  { category: 'Zavarovanje', icon: '🛡️', amountEur: 180, percentage: 17 },
  { category: 'Pnevmatike', icon: '🛞', amountEur: 120, percentage: 11 },
  { category: 'Cestnina', icon: '🛣️', amountEur: 65, percentage: 6 },
  { category: 'Drugo', icon: '📦', amountEur: 18, percentage: 2 },
];

/**
 * Visual breakdown of motorcycle expenses by category with progress bars.
 */
export function ExpenseSummary({
  expenses = DEFAULT_EXPENSES,
  monthlyTotal = 1080,
  periodLabel = 'zadnjih 30 dni',
  onAdd,
  className,
}: ExpenseSummaryProps) {
  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      <div className={styles.total}>
        <span className={styles.totalLbl}>Skupno ({periodLabel})</span>
        <span className={styles.totalVal}>€{monthlyTotal.toLocaleString('sl-SI')}</span>
      </div>
      <div className={styles.list}>
        {expenses.map((e) => (
          <div key={e.category} className={styles.row}>
            <span className={styles.icon}>{e.icon}</span>
            <div className={styles.body}>
              <span className={styles.cat}>{e.category}</span>
              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: `${e.percentage}%` }} />
              </div>
            </div>
            <span className={styles.amount}>€{e.amountEur}</span>
          </div>
        ))}
      </div>
      {onAdd && (
        <button type="button" className={styles.addBtn} onClick={onAdd}>
          + Dodaj strošek
        </button>
      )}
    </div>
  );
}
