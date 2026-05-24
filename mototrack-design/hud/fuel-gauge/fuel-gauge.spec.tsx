import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FuelGauge } from './fuel-gauge.js';
import styles from './fuel-gauge.module.scss';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

it('should render the fuel title', () => {
  const { container } = renderWithRouter(<FuelGauge />);
  const title = container.querySelector(`.${styles.title}`);
  expect(title).toBeTruthy();
  expect(title?.textContent).toBe('Fuel');
});

it('should render current liters and tank capacity', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={12} tankCapacity={18} />
  );
  const litersValue = container.querySelector(`.${styles.litersValue}`);
  const capacityValue = container.querySelector(`.${styles.capacityValue}`);
  expect(litersValue?.textContent).toBe('12.0');
  expect(capacityValue?.textContent).toBe('18.0 L');
});

it('should render the estimated range', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={12} tankCapacity={18} estimatedRange={180} />
  );
  const rangeValue = container.querySelector(`.${styles.rangeValue}`);
  expect(rangeValue?.textContent).toContain('180');
});

it('should calculate estimated range from consumption rate when estimatedRange is not provided', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={13} tankCapacity={18} consumptionRate={6.5} />
  );
  const rangeValue = container.querySelector(`.${styles.rangeValue}`);
  // 13 / 6.5 * 100 = 200
  expect(rangeValue?.textContent).toContain('200');
});

it('should show the success status badge when fuel is above 40%', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={10} tankCapacity={18} />
  );
  const badge = container.querySelector(`.${styles.statusBadge}`);
  expect(badge?.classList.contains(styles.statusSuccess)).toBe(true);
  expect(badge?.textContent).toBe('Full');
});

it('should show the warning status badge when fuel is between 20% and 40%', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={5} tankCapacity={18} />
  );
  const badge = container.querySelector(`.${styles.statusBadge}`);
  expect(badge?.classList.contains(styles.statusWarning)).toBe(true);
  expect(badge?.textContent).toBe('Low');
});

it('should show the danger status badge when fuel is below 20%', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={2} tankCapacity={18} />
  );
  const badge = container.querySelector(`.${styles.statusBadge}`);
  expect(badge?.classList.contains(styles.statusDanger)).toBe(true);
  expect(badge?.textContent).toBe('Critical');
});

it('should hide the range row when showRange is false', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={10} tankCapacity={18} showRange={false} />
  );
  const rangeRow = container.querySelector(`.${styles.rangeRow}`);
  expect(rangeRow).toBeNull();
});

it('should hide the liters label when showLiters is false', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={10} tankCapacity={18} showLiters={false} />
  );
  const litersLabel = container.querySelector(`.${styles.litersLabel}`);
  expect(litersLabel).toBeNull();
});

it('should clamp currentLiters to tankCapacity', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={25} tankCapacity={18} />
  );
  const litersValue = container.querySelector(`.${styles.litersValue}`);
  expect(litersValue?.textContent).toBe('18.0');
});

it('should clamp currentLiters to 0 when negative', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={-5} tankCapacity={18} />
  );
  const litersValue = container.querySelector(`.${styles.litersValue}`);
  expect(litersValue?.textContent).toBe('0.0');
});

it('should render the percentage label in the footer', () => {
  const { container } = renderWithRouter(
    <FuelGauge currentLiters={9} tankCapacity={18} />
  );
  const percentageLabel = container.querySelector(`.${styles.percentageLabel}`);
  expect(percentageLabel?.textContent).toBe('50%');
});

it('should apply a custom className to the root element', () => {
  const { container } = renderWithRouter(
    <FuelGauge className="custom-class" />
  );
  const root = container.querySelector(`.${styles.root}`);
  expect(root?.classList.contains('custom-class')).toBe(true);
});
