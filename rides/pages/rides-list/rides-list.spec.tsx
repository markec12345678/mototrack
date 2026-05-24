import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RidesList } from './rides-list';
import { mockRides } from './rides-list.mock';
import styles from './rides-list.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the page heading', () => {
  const { getByText } = renderWithProvider(<RidesList mockRides={mockRides} />);
  expect(getByText(`My Rides`)).toBeTruthy();
});

it('should render the List and Calendar tabs', () => {
  const { getByText } = renderWithProvider(<RidesList mockRides={mockRides} />);
  expect(getByText(`List`)).toBeTruthy();
  expect(getByText(`Calendar`)).toBeTruthy();
});

it('should render ride cards in list view', () => {
  const { getByText } = renderWithProvider(<RidesList mockRides={mockRides} />);
  expect(getByText(`Alpine Pass Sprint`)).toBeTruthy();
  expect(getByText(`Coast Road Cruise`)).toBeTruthy();
});

it('should display the correct ride count', () => {
  const { getByText } = renderWithProvider(<RidesList mockRides={mockRides} />);
  expect(getByText(`${mockRides.length} rides`)).toBeTruthy();
});

it('should show empty state when no rides are provided', () => {
  const { getByText } = renderWithProvider(<RidesList mockRides={[]} />);
  expect(getByText(`No rides yet`)).toBeTruthy();
});

it('should toggle the filter panel when the Filter button is clicked', () => {
  const { getByText } = renderWithProvider(<RidesList mockRides={mockRides} />);
  const filterBtn = getByText(`Filter`).closest(`button`);
  expect(filterBtn).toBeTruthy();

  fireEvent.click(filterBtn!);

  expect(getByText(`From`)).toBeTruthy();
  expect(getByText(`To`)).toBeTruthy();
});

it('should switch to calendar tab when Calendar is clicked', () => {
  const { getByText, container } = renderWithProvider(<RidesList mockRides={mockRides} />);
  const calendarTab = getByText(`Calendar`);
  fireEvent.click(calendarTab);

  const calendarSection = container.querySelector(`[data-section="calendar"]`);
  expect(calendarSection).toBeTruthy();
});

it('should show a Clear button when a date filter is applied', () => {
  const { getByText, container } = renderWithProvider(<RidesList mockRides={mockRides} />);

  const filterBtn = getByText(`Filter`).closest(`button`);
  fireEvent.click(filterBtn!);

  const fromInput = container.querySelector(`#from-date`) as HTMLInputElement;
  fireEvent.change(fromInput, { target: { value: `2024-01-01` } });

  expect(getByText(`Clear`)).toBeTruthy();
});

it('should clear filters when Clear button is clicked', () => {
  const { getByText, container, queryByText } = renderWithProvider(<RidesList mockRides={mockRides} />);

  const filterBtn = getByText(`Filter`).closest(`button`);
  fireEvent.click(filterBtn!);

  const fromInput = container.querySelector(`#from-date`) as HTMLInputElement;
  fireEvent.change(fromInput, { target: { value: `2024-01-01` } });

  const clearBtn = getByText(`Clear`);
  fireEvent.click(clearBtn);

  expect(queryByText(`Clear`)).toBeNull();
});

it('should show singular "ride" label when only one ride matches', () => {
  const singleRide = [mockRides[0]];
  const { getByText } = renderWithProvider(<RidesList mockRides={singleRide} />);
  expect(getByText(`1 ride`)).toBeTruthy();
});

it('should apply the calendarSection class when calendar tab is active', () => {
  const { getByText, container } = renderWithProvider(<RidesList mockRides={mockRides} />);
  fireEvent.click(getByText(`Calendar`));

  const section = container.querySelector(`.${styles.calendarSection}`);
  expect(section).toBeTruthy();
});
