import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ForecastCard } from './forecast-card.js';
import { mockForecastDays, mockForecastDaysStorm, mockForecastDaysSunny } from './forecast-card.mock.js';
import styles from './forecast-card.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it(`should render the card title`, () => {
  const { getByText } = renderWithProvider(
    <ForecastCard days={mockForecastDays} title="3-dnevna napoved" />
  );
  expect(getByText(`3-dnevna napoved`)).toBeTruthy();
});

it(`should render all 3 day rows`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDays} />
  );
  const rows = container.querySelectorAll(`.${styles.dayRow}`);
  expect(rows.length).toBe(3);
});

it(`should render weather icons for each day`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDays} />
  );
  const icons = container.querySelectorAll(`.${styles.weatherIcon}`);
  expect(icons.length).toBe(3);
});

it(`should render temperature max and min for each day`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDays} />
  );
  const maxTemps = container.querySelectorAll(`.${styles.tempMax}`);
  const minTemps = container.querySelectorAll(`.${styles.tempMin}`);
  expect(maxTemps.length).toBe(3);
  expect(minTemps.length).toBe(3);
});

it(`should display correct max temperature for first day`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDays} />
  );
  const maxTemps = container.querySelectorAll(`.${styles.tempMax}`);
  const firstMax = maxTemps[0] as HTMLElement;
  expect(firstMax.textContent).toContain(`22`);
});

it(`should display correct min temperature for first day`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDays} />
  );
  const minTemps = container.querySelectorAll(`.${styles.tempMin}`);
  const firstMin = minTemps[0] as HTMLElement;
  expect(firstMin.textContent).toContain(`12`);
});

it(`should render wind and precip meta blocks`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDays} />
  );
  const metaBlocks = container.querySelectorAll(`.${styles.metaBlock}`);
  // 2 meta blocks per row (wind + precip) × 3 rows = 6
  expect(metaBlocks.length).toBe(6);
});

it(`should apply danger wind class for wind >= 60 km/h`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDaysStorm} />
  );
  const dangerWind = container.querySelector(`.${styles['wind-danger']}`);
  expect(dangerWind).toBeTruthy();
});

it(`should apply strong wind class for wind between 40-60 km/h`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDaysStorm} />
  );
  const strongWind = container.querySelector(`.${styles['wind-strong']}`);
  expect(strongWind).toBeTruthy();
});

it(`should apply normal wind class for calm conditions`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDaysSunny} />
  );
  const normalWind = container.querySelector(`.${styles['wind-normal']}`);
  expect(normalWind).toBeTruthy();
});

it(`should apply heavy precip class for precip >= 5mm`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDaysStorm} />
  );
  const heavyPrecip = container.querySelector(`.${styles['precip-heavy']}`);
  expect(heavyPrecip).toBeTruthy();
});

it(`should apply none precip class for zero precipitation`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDaysSunny} />
  );
  const nonePrecip = container.querySelector(`.${styles['precip-none']}`);
  expect(nonePrecip).toBeTruthy();
});

it(`should render the legend`, () => {
  const { container } = renderWithProvider(
    <ForecastCard days={mockForecastDays} />
  );
  const legend = container.querySelector(`.${styles.legend}`);
  expect(legend).toBeTruthy();
});

it(`should limit display to 3 days even if more are passed`, () => {
  const extraDays = [
    ...mockForecastDays,
    {
      date: `2025-06-13`,
      tempMinC: 11,
      tempMaxC: 20,
      precipMm: 0,
      windKmh: 10,
      wmoCode: 0,
      label: `Jasno`,
      icon: `☀️`,
    },
  ];
  const { container } = renderWithProvider(
    <ForecastCard days={extraDays} />
  );
  const rows = container.querySelectorAll(`.${styles.dayRow}`);
  expect(rows.length).toBe(3);
});

it(`should render a custom title`, () => {
  const { getByText } = renderWithProvider(
    <ForecastCard days={mockForecastDays} title="Moja napoved" />
  );
  expect(getByText(`Moja napoved`)).toBeTruthy();
});
