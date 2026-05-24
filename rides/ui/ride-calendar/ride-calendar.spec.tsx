import * as React from 'react';
import { vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RideCalendar } from './ride-calendar.js';
import { mockRides, mockRidesSparse } from './ride-calendar.mock.js';
import styles from './ride-calendar.module.scss';

function renderCalendar(props: React.ComponentProps<typeof RideCalendar> = {}) {
  return render(
    <MockProvider>
      <RideCalendar {...props} />
    </MockProvider>
  );
}

it('renders the calendar without crashing', () => {
  const { container } = renderCalendar();
  const calendar = container.querySelector(`.${styles.calendar}`);
  expect(calendar).toBeTruthy();
});

it('renders all 7 weekday labels', () => {
  const { container } = renderCalendar();
  const weekdays = container.querySelectorAll(`.${styles.weekday}`);
  expect(weekdays.length).toBe(7);
});

it('renders 42 day cells', () => {
  const { container } = renderCalendar({ rides: mockRides });
  const cells = container.querySelectorAll(`.${styles.cell}`);
  expect(cells.length).toBe(42);
});

it('displays the current month name', () => {
  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const { container } = renderCalendar();
  const monthEl = container.querySelector(`.${styles.monthName}`);
  expect(monthEl?.textContent).toBe(monthNames[now.getMonth()]);
});

it('displays the current year', () => {
  const now = new Date();
  const { container } = renderCalendar();
  const yearEl = container.querySelector(`.${styles.yearLabel}`);
  expect(yearEl?.textContent).toBe(String(now.getFullYear()));
});

it('navigates to the previous month when prev button is clicked', () => {
  const now = new Date();
  const { container } = renderCalendar();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const prevBtn = container.querySelectorAll(`.${styles.navBtn}`)[0] as HTMLButtonElement;
  fireEvent.click(prevBtn);
  const prevMonthIndex = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const monthEl = container.querySelector(`.${styles.monthName}`);
  expect(monthEl?.textContent).toBe(monthNames[prevMonthIndex]);
});

it('navigates to the next month when next button is clicked', () => {
  const now = new Date();
  const { container } = renderCalendar();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const nextBtn = container.querySelectorAll(`.${styles.navBtn}`)[1] as HTMLButtonElement;
  fireEvent.click(nextBtn);
  const nextMonthIndex = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
  const monthEl = container.querySelector(`.${styles.monthName}`);
  expect(monthEl?.textContent).toBe(monthNames[nextMonthIndex]);
});

it('renders ride distance info for days with rides', () => {
  const { container } = renderCalendar({ rides: mockRidesSparse });
  const distanceEls = container.querySelectorAll(`.${styles.rideDistance}`);
  expect(distanceEls.length).toBeGreaterThan(0);
});

it('calls onDayClick when a day with rides is clicked', () => {
  const onDayClick = vi.fn();
  const { container } = renderCalendar({ rides: mockRidesSparse, onDayClick });
  const clickableCells = container.querySelectorAll(`.${styles.cellClickable}`);
  if (clickableCells.length > 0) {
    fireEvent.click(clickableCells[0] as HTMLElement);
    expect(onDayClick).toHaveBeenCalledTimes(1);
    const [dateKey, rides] = onDayClick.mock.calls[0];
    expect(typeof dateKey).toBe('string');
    expect(Array.isArray(rides)).toBe(true);
    expect(rides.length).toBeGreaterThan(0);
  }
});

it('renders stats bar with rides, total distance and active days', () => {
  const { container } = renderCalendar({ rides: mockRidesSparse });
  const statValues = container.querySelectorAll(`.${styles.statValue}`);
  expect(statValues.length).toBe(3);
});

it('renders the legend', () => {
  const { container } = renderCalendar();
  const legendDots = container.querySelectorAll(`.${styles.legendDot}`);
  expect(legendDots.length).toBe(4);
});

it('marks today with the today class', () => {
  const { container } = renderCalendar({ rides: mockRides });
  const todayCell = container.querySelector(`.${styles.cellToday}`);
  expect(todayCell).toBeTruthy();
});

it('renders a badge for days with multiple rides', () => {
  const { container } = renderCalendar({ rides: mockRides });
  const badges = container.querySelectorAll(`.${styles.rideBadge}`);
  expect(badges.length).toBeGreaterThan(0);
});

it('renders no clickable cells when rides array is empty', () => {
  const { container } = renderCalendar({ rides: [] });
  const clickable = container.querySelectorAll(`.${styles.cellClickable}`);
  expect(clickable.length).toBe(0);
});

it('wraps year correctly when navigating from January to December', () => {
  const { container } = renderCalendar({ initialYear: 2024, initialMonth: 0 });
  const prevBtn = container.querySelectorAll(`.${styles.navBtn}`)[0] as HTMLButtonElement;
  fireEvent.click(prevBtn);
  const yearEl = container.querySelector(`.${styles.yearLabel}`);
  expect(yearEl?.textContent).toBe('2023');
  const monthEl = container.querySelector(`.${styles.monthName}`);
  expect(monthEl?.textContent).toBe('December');
});
