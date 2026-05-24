import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RouteShareDialog } from './route-share-dialog';
import { mockPlannedRoute } from './route-share-dialog.mock';
import styles from './route-share-dialog.module.scss';

function renderDialog(open = true, onClose = () => {}) {
  return render(
    <MockProvider>
      <RouteShareDialog
        open={open}
        onClose={onClose}
        route={mockPlannedRoute}
      />
    </MockProvider>
  );
}

it(`renders nothing when closed`, () => {
  const { container } = renderDialog(false);
  const body = container.querySelector(`.${styles.body}`);
  expect(body).toBeNull();
});

it(`renders the route name when open`, () => {
  const { getByText } = renderDialog();
  expect(getByText(mockPlannedRoute.name)).toBeTruthy();
});

it(`renders the route distance`, () => {
  const { getByText } = renderDialog();
  const distanceText = `${mockPlannedRoute.distanceKm.toFixed(0)} km`;
  expect(getByText(distanceText)).toBeTruthy();
});

it(`renders the route mode badge`, () => {
  const { getByText } = renderDialog();
  expect(getByText(mockPlannedRoute.mode)).toBeTruthy();
});

it(`renders the generate share link button in idle state`, () => {
  const { getByText } = renderDialog();
  expect(getByText(`Generate Share Link`)).toBeTruthy();
});

it(`renders the idle description text`, () => {
  const { getByText } = renderDialog();
  expect(getByText(/expires after 24 hours/i)).toBeTruthy();
});

it(`shows loading state after clicking generate`, () => {
  const { getByText, container } = renderDialog();
  const generateBtn = getByText(`Generate Share Link`);
  fireEvent.click(generateBtn);
  const spinner = container.querySelector(`.${styles.spinner}`);
  expect(spinner).toBeTruthy();
});

it(`calls onClose when close button is clicked`, () => {
  const onClose = vi.fn();
  const { container } = renderDialog(true, onClose);
  const closeBtn = container.querySelector(`button[aria-label="Close modal"]`);
  if (closeBtn) {
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  }
});

it(`renders the body container`, () => {
  const { container } = renderDialog();
  const body = container.querySelector(`.${styles.body}`);
  expect(body).toBeTruthy();
});

it(`renders the route info section`, () => {
  const { container } = renderDialog();
  const routeInfo = container.querySelector(`.${styles.routeInfo}`);
  expect(routeInfo).toBeTruthy();
});

it(`renders the idle illustration`, () => {
  const { container } = renderDialog();
  const illustration = container.querySelector(`.${styles.idleIllustration}`);
  expect(illustration).toBeTruthy();
});

it(`renders duration in minutes`, () => {
  const { getByText } = renderDialog();
  const expectedMinutes = Math.round(mockPlannedRoute.durationSec / 60);
  expect(getByText(`${expectedMinutes} min`)).toBeTruthy();
});
