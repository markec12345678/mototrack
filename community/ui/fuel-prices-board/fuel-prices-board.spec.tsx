import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { FuelPricesBoard } from './fuel-prices-board.js';
import { mockFuelPriceReports, mockCountryAverages } from './fuel-prices-board.mock.js';
import styles from './fuel-prices-board.module.scss';

function renderBoard() {
  return render(
    <MockProvider>
      <FuelPricesBoard
        mockReports={mockFuelPriceReports}
        mockAverages={mockCountryAverages}
      />
    </MockProvider>
  );
}

it(`renders the country averages section title`, () => {
  const { getByText } = renderBoard();
  expect(getByText(`Country Fuel Averages`)).toBeTruthy();
});

it(`renders the contribute section title`, () => {
  const { getByText } = renderBoard();
  expect(getByText(`Report a Price`)).toBeTruthy();
});

it(`renders a row for each country average`, () => {
  const { container } = renderBoard();
  const rows = container.querySelectorAll(`.${styles.tableRow}`);
  expect(rows.length).toBe(mockCountryAverages.length);
});

it(`expands per-country reports when a row is clicked`, () => {
  const { container } = renderBoard();
  const rows = container.querySelectorAll(`.${styles.tableRow}`);
  const firstRow = rows[0] as HTMLElement;
  fireEvent.click(firstRow);
  const panels = container.querySelectorAll(`.${styles.reportsPanelInner}`);
  expect(panels.length).toBe(1);
});

it(`collapses the expanded row when clicked again`, () => {
  const { container } = renderBoard();
  const rows = container.querySelectorAll(`.${styles.tableRow}`);
  const firstRow = rows[0] as HTMLElement;
  fireEvent.click(firstRow);
  fireEvent.click(firstRow);
  const panels = container.querySelectorAll(`.${styles.reportsPanelInner}`);
  expect(panels.length).toBe(0);
});

it(`shows report cards inside expanded country panel`, () => {
  const { container } = renderBoard();
  const rows = container.querySelectorAll(`.${styles.tableRow}`);
  const firstRow = rows[0] as HTMLElement;
  fireEvent.click(firstRow);
  const reportCards = container.querySelectorAll(`.${styles.reportCard}`);
  expect(reportCards.length).toBeGreaterThan(0);
});

it(`renders the report form with required fields`, () => {
  const { getByText } = renderBoard();
  expect(getByText(`Station Brand`)).toBeTruthy();
  expect(getByText(`Petrol (€/L)`)).toBeTruthy();
  expect(getByText(`Diesel (€/L)`)).toBeTruthy();
  expect(getByText(`Location`)).toBeTruthy();
});

it(`renders the submit button`, () => {
  const { getByText } = renderBoard();
  expect(getByText(`Submit Report`)).toBeTruthy();
});

it(`renders the reset button`, () => {
  const { getByText } = renderBoard();
  expect(getByText(`Reset`)).toBeTruthy();
});

it(`renders the live community badge`, () => {
  const { getByText } = renderBoard();
  expect(getByText(`Community Updated`)).toBeTruthy();
});

it(`renders rank badges for each row`, () => {
  const { container } = renderBoard();
  const rankBadges = container.querySelectorAll(`.${styles.rankBadge}`);
  expect(rankBadges.length).toBe(mockCountryAverages.length);
});

it(`renders the first rank badge with gold styling`, () => {
  const { container } = renderBoard();
  const firstRankBadge = container.querySelector(`.${styles.rankBadgeFirst}`);
  expect(firstRankBadge).toBeTruthy();
  expect(firstRankBadge?.textContent).toBe(`1`);
});

it(`renders report count badges for each country`, () => {
  const { container } = renderBoard();
  const countBadges = container.querySelectorAll(`.${styles.reportCount}`);
  expect(countBadges.length).toBe(mockCountryAverages.length);
});

it(`renders the form description text`, () => {
  const { getByText } = renderBoard();
  expect(getByText(`Help fellow riders with accurate, real-time fuel prices across the Balkans.`)).toBeTruthy();
});

it(`renders an empty board without mock data`, () => {
  const { container } = render(
    <MockProvider>
      <FuelPricesBoard mockReports={[]} mockAverages={[]} />
    </MockProvider>
  );
  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState).toBeTruthy();
});
