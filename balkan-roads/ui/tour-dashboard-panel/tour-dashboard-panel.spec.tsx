import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TourDashboardPanel } from './tour-dashboard-panel.js';
import styles from './tour-dashboard-panel.module.scss';

function renderPanel(props: Partial<React.ComponentProps<typeof TourDashboardPanel>> = {}) {
  return render(
    <MockProvider>
      <TourDashboardPanel {...props} />
    </MockProvider>
  );
}

it(`should render the panel section element`, () => {
  const { container } = renderPanel();
  const panel = container.querySelector(`section`);
  expect(panel).toBeTruthy();
});

it(`should apply the panel class`, () => {
  const { container } = renderPanel();
  const panel = container.querySelector(`.${styles.panel}`);
  expect(panel).toBeTruthy();
});

it(`should render the panel header`, () => {
  const { container } = renderPanel();
  const header = container.querySelector(`.${styles.header}`);
  expect(header).toBeTruthy();
});

it(`should render the accent bar`, () => {
  const { container } = renderPanel();
  const bar = container.querySelector(`.${styles.accentBar}`);
  expect(bar).toBeTruthy();
});

it(`should render the icon wrap`, () => {
  const { container } = renderPanel();
  const icon = container.querySelector(`.${styles.iconWrap}`);
  expect(icon).toBeTruthy();
});

it(`should render the title text`, () => {
  const { getByText } = renderPanel();
  const title = getByText(`Predlagane ture`);
  expect(title).toBeTruthy();
});

it(`should render the grid container`, () => {
  const { container } = renderPanel();
  const grid = container.querySelector(`.${styles.grid}`);
  expect(grid).toBeTruthy();
});

it(`should render the refresh hint`, () => {
  const { container } = renderPanel();
  const hint = container.querySelector(`.${styles.refreshHint}`);
  expect(hint).toBeTruthy();
});

it(`should render the naključno label`, () => {
  const { getByText } = renderPanel();
  const label = getByText(`Naključno`);
  expect(label).toBeTruthy();
});

it(`should accept a custom className`, () => {
  const { container } = renderPanel({ className: `custom-class` });
  const panel = container.querySelector(`section`);
  expect(panel?.classList.contains(`custom-class`)).toBe(true);
});

it(`should render the view all link`, () => {
  const { getByText } = renderPanel();
  const link = getByText(`Vse ture`);
  expect(link).toBeTruthy();
});

it(`should render skeleton cards while loading`, () => {
  const { container } = renderPanel();
  // Skeleton cards or tour cards should be present in the grid
  const grid = container.querySelector(`.${styles.grid}`);
  expect(grid?.children.length).toBeGreaterThan(0);
});

it(`should render with count=2 prop`, () => {
  const { container } = renderPanel({ count: 2 });
  const panel = container.querySelector(`.${styles.panel}`);
  expect(panel).toBeTruthy();
});
