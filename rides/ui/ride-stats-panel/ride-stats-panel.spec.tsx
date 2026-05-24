import * as React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RideStatsPanel } from './ride-stats-panel.js';
import {
  mockActiveRideStats,
  mockPausedRideStats,
  mockNoGpsStats,
} from './ride-stats-panel.mock.js';

function renderPanel(props: React.ComponentProps<typeof RideStatsPanel> = {}) {
  return render(
    <MockProvider>
      <RideStatsPanel {...props} />
    </MockProvider>
  );
}

it('should render the panel root element', () => {
  const { container } = renderPanel(mockActiveRideStats);
  expect(container.firstChild).toBeTruthy();
});

it('should show REC label when isRecording is true', () => {
  const { getByText } = renderPanel({ isRecording: true });
  expect(getByText(`REC`)).toBeTruthy();
});

it('should show PAUSED label when isRecording is false', () => {
  const { getByText } = renderPanel({ isRecording: false });
  expect(getByText(`PAUSED`)).toBeTruthy();
});

it('should render the GPS label', () => {
  const { getByText } = renderPanel(mockActiveRideStats);
  expect(getByText(`GPS`)).toBeTruthy();
});

it('should render DIST stat label', () => {
  const { getByText } = renderPanel(mockActiveRideStats);
  expect(getByText(`DIST`)).toBeTruthy();
});

it('should render TIME stat label', () => {
  const { getByText } = renderPanel(mockActiveRideStats);
  expect(getByText(`TIME`)).toBeTruthy();
});

it('should render MAX stat label', () => {
  const { getByText } = renderPanel(mockActiveRideStats);
  expect(getByText(`MAX`)).toBeTruthy();
});

it('should render CLIMB stat label', () => {
  const { getByText } = renderPanel(mockActiveRideStats);
  expect(getByText(`CLIMB`)).toBeTruthy();
});

it('should render ELEV stat label', () => {
  const { getByText } = renderPanel(mockActiveRideStats);
  expect(getByText(`ELEV`)).toBeTruthy();
});

it('should render distance value', () => {
  const { container } = renderPanel({ distanceKm: 24.3 });
  expect(container.textContent?.includes(`24.3`)).toBe(true);
});

it('should render duration in mm:ss format for short durations', () => {
  const { container } = renderPanel({ durationSec: 125 });
  expect(container.textContent?.includes(`02:05`)).toBe(true);
});

it('should render duration in h:mm:ss format for long durations', () => {
  const { container } = renderPanel({ durationSec: 3720 });
  expect(container.textContent?.includes(`1:02:00`)).toBe(true);
});

it('should render max speed value', () => {
  const { container } = renderPanel({ maxSpeedKmh: 134 });
  expect(container.textContent?.includes(`134`)).toBe(true);
});

it('should render climb value', () => {
  const { container } = renderPanel({ climbM: 412 });
  expect(container.textContent?.includes(`412`)).toBe(true);
});

it('should render elevation value', () => {
  const { container } = renderPanel({ elevationM: 876 });
  expect(container.textContent?.includes(`876`)).toBe(true);
});

it('should render with paused stats', () => {
  const { container } = renderPanel(mockPausedRideStats);
  expect(container.firstChild).toBeTruthy();
});

it('should render with no GPS stats', () => {
  const { container } = renderPanel(mockNoGpsStats);
  expect(container.firstChild).toBeTruthy();
});

it('should apply custom className to root element', () => {
  const { container } = renderPanel({ className: `custom-class` });
  const root = container.querySelector(`.custom-class`);
  expect(root).toBeTruthy();
});
