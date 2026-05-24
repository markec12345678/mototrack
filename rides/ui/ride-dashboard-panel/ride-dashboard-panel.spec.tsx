import * as React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RideDashboardPanel } from './ride-dashboard-panel.js';
import { mockRides, mockEmptyRides } from './ride-dashboard-panel.mock.js';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it(`renders the panel heading "Zadnje vožnje"`, () => {
  const { getByText } = renderWithProvider(<RideDashboardPanel rides={mockRides} />);
  expect(getByText(`Zadnje vožnje`)).toBeTruthy();
});

it(`renders the "Vse vožnje →" link`, () => {
  const { getByText } = renderWithProvider(<RideDashboardPanel rides={mockRides} />);
  expect(getByText(`Vse vožnje →`)).toBeTruthy();
});

it(`renders top 3 ride items when 3 rides are provided`, () => {
  const { container } = renderWithProvider(<RideDashboardPanel rides={mockRides} />);
  const items = container.querySelectorAll(`li`);
  expect(items.length).toBe(3);
});

it(`respects the limit prop and shows only the specified number of rides`, () => {
  const { container } = renderWithProvider(<RideDashboardPanel rides={mockRides} limit={2} />);
  const items = container.querySelectorAll(`li`);
  expect(items.length).toBe(2);
});

it(`renders the empty state title when no rides are provided`, () => {
  const { getByText } = renderWithProvider(<RideDashboardPanel rides={mockEmptyRides} />);
  expect(getByText(`Še ni vožnje`)).toBeTruthy();
});

it(`renders the empty state subtitle when no rides are provided`, () => {
  const { getByText } = renderWithProvider(<RideDashboardPanel rides={mockEmptyRides} />);
  expect(getByText(`Začni svojo prvo vožnjo!`)).toBeTruthy();
});

it(`uses the custom allRidesHref for the link`, () => {
  const { container } = renderWithProvider(
    <RideDashboardPanel rides={mockRides} allRidesHref="/moje-voznje" />
  );
  const links = container.querySelectorAll(`a`);
  const hrefs = Array.from(links).map((l) => l.getAttribute(`href`) ?? ``);
  expect(hrefs.some((h) => h.includes(`moje-voznje`))).toBe(true);
});

it(`renders a list element when rides are present`, () => {
  const { container } = renderWithProvider(<RideDashboardPanel rides={mockRides} />);
  const list = container.querySelector(`ul`);
  expect(list).toBeTruthy();
});

it(`does not render a list element when rides array is empty`, () => {
  const { container } = renderWithProvider(<RideDashboardPanel rides={mockEmptyRides} />);
  const list = container.querySelector(`ul`);
  expect(list).toBeNull();
});
