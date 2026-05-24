import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { GarageDashboardPanel } from './garage-dashboard-panel';
import {
  mockBikes,
  mockPrimaryBike,
  mockMaintenanceItems,
  mockAllOkItems,
} from './garage-dashboard-panel.mock';
import styles from './garage-dashboard-panel.module.scss';

function renderPanel(props: React.ComponentProps<typeof GarageDashboardPanel> = {}) {
  return render(
    <MockProvider>
      <GarageDashboardPanel {...props} />
    </MockProvider>
  );
}

it('renders the panel title "Vzdrževanje"', () => {
  const { getByText } = renderPanel({
    bikes: mockBikes,
    maintenanceItems: mockMaintenanceItems,
  });
  expect(getByText(`Vzdrževanje`)).toBeTruthy();
});

it('renders the primary bike name', () => {
  const { getByText } = renderPanel({
    bikes: mockBikes,
    maintenanceItems: mockMaintenanceItems,
  });
  expect(getByText(`KTM 890 Adventure`)).toBeTruthy();
});

it('renders the alert count badge when there are alerts', () => {
  const { container } = renderPanel({
    bikes: mockBikes,
    maintenanceItems: mockMaintenanceItems,
  });
  const badge = container.querySelector(`.${styles.alertBadge}`);
  expect(badge).toBeTruthy();
  const count = Number(badge?.textContent);
  expect(count).toBeGreaterThan(0);
});

it('does not render the alert count badge when all items are ok', () => {
  const { container } = renderPanel({
    bikes: [mockPrimaryBike],
    maintenanceItems: mockAllOkItems,
  });
  const badge = container.querySelector(`.${styles.alertBadge}`);
  expect(badge).toBeFalsy();
});

it('renders the empty state message when all items are ok', () => {
  const { getByText } = renderPanel({
    bikes: [mockPrimaryBike],
    maintenanceItems: mockAllOkItems,
  });
  expect(getByText(`Vsa vzdrževanja so v redu.`)).toBeTruthy();
});

it('renders warn and danger maintenance item names', () => {
  const { getByText } = renderPanel({
    bikes: mockBikes,
    maintenanceItems: mockMaintenanceItems,
  });
  expect(getByText(`Menjava olja`)).toBeTruthy();
  expect(getByText(`Zavorni tekočina`)).toBeTruthy();
});

it('renders item rows with correct status class', () => {
  const { container } = renderPanel({
    bikes: mockBikes,
    maintenanceItems: mockMaintenanceItems,
  });
  const dangerRows = container.querySelectorAll(`.${styles.danger}`);
  const warnRows = container.querySelectorAll(`.${styles.warn}`);
  expect(dangerRows.length + warnRows.length).toBeGreaterThan(0);
});

it('renders the footer link', () => {
  const { getByText } = renderPanel({
    bikes: mockBikes,
    maintenanceItems: mockMaintenanceItems,
  });
  expect(getByText(`Vsa vzdrževanja →`)).toBeTruthy();
});

it('uses a custom maintenanceHref for the footer link', () => {
  const { container } = renderPanel({
    bikes: mockBikes,
    maintenanceItems: mockMaintenanceItems,
    maintenanceHref: `/garage/maintenance`,
  });
  const link = container.querySelector(`a[href="/garage/maintenance"]`);
  expect(link).toBeTruthy();
});

it('renders the panel container element', () => {
  const { container } = renderPanel({
    bikes: mockBikes,
    maintenanceItems: mockMaintenanceItems,
  });
  expect(container.firstChild).toBeTruthy();
});
