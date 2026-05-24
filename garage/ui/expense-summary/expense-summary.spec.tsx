import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ExpenseSummary } from './expense-summary.js';
import { mockExpenses, mockExpensesEmpty } from './expense-summary.mock.js';
import styles from './expense-summary.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('renders the monthly total tile', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const totalValue = container.querySelector(`.${styles.totalValue}`);
  expect(totalValue).toBeTruthy();
});

it('renders the currency symbol', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const currency = container.querySelector(`.${styles.currency}`);
  expect(currency).toBeTruthy();
  expect(currency?.textContent).toBe(`€`);
});

it('renders category breakdown rows for expenses with data', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const rows = container.querySelectorAll(`.${styles.categoryRow}`);
  expect(rows.length).toBeGreaterThan(0);
});

it('shows empty state when no expenses', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpensesEmpty} />
  );
  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState).toBeTruthy();
});

it('shows the add expense button by default', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const addButton = container.querySelector(`.${styles.addButton}`);
  expect(addButton).toBeTruthy();
  expect(addButton?.textContent).toContain(`Add Expense`);
});

it('opens the form when add expense button is clicked', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const addButton = container.querySelector(`.${styles.addButton}`) as HTMLButtonElement;
  fireEvent.click(addButton);
  const form = container.querySelector(`.${styles.form}`);
  expect(form).toBeTruthy();
});

it('renders category chips in the form', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const addButton = container.querySelector(`.${styles.addButton}`) as HTMLButtonElement;
  fireEvent.click(addButton);
  const chips = container.querySelectorAll(`.${styles.categoryChip}`);
  expect(chips.length).toBeGreaterThan(0);
});

it('activates a category chip on click', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const addButton = container.querySelector(`.${styles.addButton}`) as HTMLButtonElement;
  fireEvent.click(addButton);
  const chips = container.querySelectorAll(`.${styles.categoryChip}`);
  const secondChip = chips[1] as HTMLButtonElement;
  fireEvent.click(secondChip);
  expect(secondChip.classList.contains(styles.categoryChipActive)).toBe(true);
});

it('shows validation error when submitting without a label', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const addButton = container.querySelector(`.${styles.addButton}`) as HTMLButtonElement;
  fireEvent.click(addButton);
  const saveButton = container.querySelector(`.${styles.saveButton}`) as HTMLButtonElement;
  fireEvent.click(saveButton);
  const error = container.querySelector(`.${styles.formError}`);
  expect(error).toBeTruthy();
  expect(error?.textContent).toContain(`Label is required`);
});

it('shows validation error when amount is invalid', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const addButton = container.querySelector(`.${styles.addButton}`) as HTMLButtonElement;
  fireEvent.click(addButton);

  const labelInput = container.querySelector(`#expense-label`) as HTMLInputElement;
  fireEvent.change(labelInput, { target: { value: `Test expense` } });

  const saveButton = container.querySelector(`.${styles.saveButton}`) as HTMLButtonElement;
  fireEvent.click(saveButton);
  const error = container.querySelector(`.${styles.formError}`);
  expect(error).toBeTruthy();
  expect(error?.textContent).toContain(`valid amount`);
});

it('closes the form when cancel is clicked', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const addButton = container.querySelector(`.${styles.addButton}`) as HTMLButtonElement;
  fireEvent.click(addButton);
  const cancelButton = container.querySelector(`.${styles.cancelButton}`) as HTMLButtonElement;
  fireEvent.click(cancelButton);
  const form = container.querySelector(`.${styles.form}`);
  expect(form).toBeFalsy();
  const addButtonAgain = container.querySelector(`.${styles.addButton}`);
  expect(addButtonAgain).toBeTruthy();
});

it('renders percentage values for categories', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const pcts = container.querySelectorAll(`.${styles.categoryPct}`);
  expect(pcts.length).toBeGreaterThan(0);
  const firstPct = pcts[0]?.textContent ?? ``;
  expect(firstPct).toContain(`%`);
});

it('renders euro amounts for categories', () => {
  const { container } = renderWithProvider(
    <ExpenseSummary mockExpenses={mockExpenses} />
  );
  const amounts = container.querySelectorAll(`.${styles.categoryEur}`);
  expect(amounts.length).toBeGreaterThan(0);
  const firstAmount = amounts[0]?.textContent ?? ``;
  expect(firstAmount).toContain(`€`);
});
