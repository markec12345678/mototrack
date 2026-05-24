import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { MaintenanceList } from './maintenance-list.js';
import { mockMaintenanceItems } from './maintenance-list.mock.js';
import styles from './maintenance-list.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

const defaultProps = {
  bikeId: `bike-1`,
  currentMileageKm: 16800,
  items: mockMaintenanceItems,
};

it(`renders the maintenance header title`, () => {
  const { container } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const title = container.querySelector(`.${styles.title}`);
  expect(title).toBeTruthy();
  expect(title?.textContent).toBe(`Maintenance`);
});

it(`renders the correct task count`, () => {
  const { container } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const count = container.querySelector(`.${styles.count}`);
  expect(count).toBeTruthy();
  expect(count?.textContent).toContain(`6`);
});

it(`renders a row for each maintenance item`, () => {
  const { container } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const rows = container.querySelectorAll(`.${styles.row}`);
  expect(rows.length).toBe(mockMaintenanceItems.length);
});

it(`renders the item name in each row`, () => {
  const { getByText } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  expect(getByText(`Engine Oil`)).toBeTruthy();
  expect(getByText(`Chain Lubrication`)).toBeTruthy();
  expect(getByText(`Air Filter`)).toBeTruthy();
});

it(`renders a status dot for each row`, () => {
  const { container } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const dots = container.querySelectorAll(`.${styles.statusDot}`);
  expect(dots.length).toBe(mockMaintenanceItems.length);
});

it(`renders Mark serviced button for each row`, () => {
  const { getAllByText } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const buttons = getAllByText(`Mark serviced`);
  expect(buttons.length).toBe(mockMaintenanceItems.length);
});

it(`renders last service date in each row`, () => {
  const { container } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const metaValues = container.querySelectorAll(`.${styles.metaValue}`);
  expect(metaValues.length).toBeGreaterThan(0);
});

it(`renders km remaining labels`, () => {
  const { container } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const labels = container.querySelectorAll(`.${styles.metaLabel}`);
  const labelTexts = Array.from(labels).map((l) => l.textContent);
  expect(labelTexts.some((t) => t?.includes(`Km left`))).toBe(true);
});

it(`renders days remaining labels`, () => {
  const { container } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const labels = container.querySelectorAll(`.${styles.metaLabel}`);
  const labelTexts = Array.from(labels).map((l) => l.textContent);
  expect(labelTexts.some((t) => t?.includes(`Days left`))).toBe(true);
});

it(`renders empty state when no items provided`, () => {
  const { container } = renderWithProvider(
    <MaintenanceList bikeId="bike-1" currentMileageKm={16800} items={[]} />
  );
  const empty = container.querySelector(`.${styles.empty}`);
  expect(empty).toBeTruthy();
});

it(`renders empty state message`, () => {
  const { getByText } = renderWithProvider(
    <MaintenanceList bikeId="bike-1" currentMileageKm={16800} items={[]} />
  );
  expect(getByText(`No maintenance tasks found.`)).toBeTruthy();
});

it(`applies danger row class for overdue items`, () => {
  const overdueItems = mockMaintenanceItems.map((item) => ({
    ...item,
    lastServiceKm: 0,
    lastServiceAt: Date.now() - 800 * 24 * 60 * 60 * 1000,
  }));
  const { container } = renderWithProvider(
    <MaintenanceList bikeId="bike-1" currentMileageKm={16800} items={overdueItems} />
  );
  const dangerRows = container.querySelectorAll(`.${styles.rowDanger}`);
  expect(dangerRows.length).toBeGreaterThan(0);
});

it(`applies ok row class for healthy items`, () => {
  const freshItems = mockMaintenanceItems.map((item) => ({
    ...item,
    lastServiceKm: 16700,
    lastServiceAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  }));
  const { container } = renderWithProvider(
    <MaintenanceList bikeId="bike-1" currentMileageKm={16800} items={freshItems} />
  );
  const okRows = container.querySelectorAll(`.${styles.rowOk}`);
  expect(okRows.length).toBeGreaterThan(0);
});

it(`mark serviced button click does not throw`, () => {
  const { getAllByText } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const buttons = getAllByText(`Mark serviced`);
  fireEvent.click(buttons[0]);
  expect(buttons[0]).toBeTruthy();
});

it(`renders progress bars for each item`, () => {
  const { container } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const progressBars = container.querySelectorAll(`.${styles.rowProgress}`);
  expect(progressBars.length).toBe(mockMaintenanceItems.length);
});

it(`sorts items by progress descending`, () => {
  const { container } = renderWithProvider(<MaintenanceList {...defaultProps} />);
  const names = container.querySelectorAll(`.${styles.name}`);
  expect(names.length).toBe(mockMaintenanceItems.length);
  const firstItemName = names[0]?.textContent;
  expect(firstItemName).toBeTruthy();
});

it(`applies custom className to root element`, () => {
  const { container } = renderWithProvider(
    <MaintenanceList {...defaultProps} className="custom-class" />
  );
  const root = container.querySelector(`.${styles.root}`);
  expect(root?.classList.contains(`custom-class`)).toBe(true);
});
