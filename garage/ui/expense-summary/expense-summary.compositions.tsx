import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ExpenseSummary } from './expense-summary.js';
import { mockExpenses, mockExpensesEmpty } from './expense-summary.mock.js';

/**
 * Full breakdown — monthly total tile + category bars + add-expense form.
 */
export const FullBreakdown = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 24px`,
          display: `flex`,
          justifyContent: `center`,
        }}
      >
        <div style={{ width: `100%`, maxWidth: `520px` }}>
          <div style={{ marginBottom: `24px` }}>
            <p
              style={{
                margin: `0 0 4px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.12em`,
                textTransform: `uppercase` as const,
                color: `#f97316`,
              }}
            >
              Garage — Expenses
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: `24px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.03em`,
              }}
            >
              KTM 890 Adventure
            </h2>
          </div>
          <ExpenseSummary mockExpenses={mockExpenses} bikeId="bike-1" />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Empty state — no expenses recorded yet, prompts user to add first expense.
 */
export const EmptyState = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 24px`,
          display: `flex`,
          justifyContent: `center`,
        }}
      >
        <div style={{ width: `100%`, maxWidth: `520px` }}>
          <div style={{ marginBottom: `24px` }}>
            <p
              style={{
                margin: `0 0 4px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.12em`,
                textTransform: `uppercase` as const,
                color: `#f97316`,
              }}
            >
              Garage — Expenses
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: `24px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.03em`,
              }}
            >
              Yamaha MT-07
            </h2>
          </div>
          <ExpenseSummary mockExpenses={mockExpensesEmpty} bikeId="bike-2" />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Compact — no bikeId filter, all expenses across the garage.
 */
export const AllBikes = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 24px`,
          display: `flex`,
          justifyContent: `center`,
        }}
      >
        <div style={{ width: `100%`, maxWidth: `520px` }}>
          <div style={{ marginBottom: `24px` }}>
            <p
              style={{
                margin: `0 0 4px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.12em`,
                textTransform: `uppercase` as const,
                color: `#f97316`,
              }}
            >
              Garage — All Bikes
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: `24px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.03em`,
              }}
            >
              Total Expense Summary
            </h2>
          </div>
          <ExpenseSummary mockExpenses={mockExpenses} />
        </div>
      </div>
    </MockProvider>
  );
};
