import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { WeatherPanel } from './weather-panel.js';
import {
  mockClearSnapshot,
  mockRainSnapshot,
  mockSnowSnapshot,
  mockThunderSnapshot,
  mockSunnySnapshot,
} from './weather-panel.mock.js';
import styles from './weather-panel.module.scss';

function renderPanel(props: React.ComponentProps<typeof WeatherPanel> = {}) {
  return render(
    <MockProvider>
      <WeatherPanel {...props} />
    </MockProvider>
  );
}

it('renders temperature from snapshot', () => {
  const { container } = renderPanel({ snapshot: mockSunnySnapshot });
  const temp = container.querySelector(`.${styles.temp}`);
  expect(temp).toBeTruthy();
  expect(temp?.textContent).toContain('28');
});

it('renders the weather icon from snapshot', () => {
  const { container } = renderPanel({ snapshot: mockSunnySnapshot });
  const icon = container.querySelector(`.${styles.weatherIcon}`);
  expect(icon).toBeTruthy();
  expect(icon?.textContent).toContain('☀️');
});

it('renders the weather label from snapshot', () => {
  const { container } = renderPanel({ snapshot: mockSunnySnapshot });
  const label = container.querySelector(`.${styles.label}`);
  expect(label).toBeTruthy();
  expect(label?.textContent).toContain('Clear sky');
});

it('renders feels like temperature', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot });
  const feelsLike = container.querySelector(`.${styles.feelsLike}`);
  expect(feelsLike).toBeTruthy();
  expect(feelsLike?.textContent).toContain('21');
});

it('renders wind speed', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot });
  const statRow = container.querySelector(`.${styles.statRow}`);
  expect(statRow).toBeTruthy();
  expect(statRow?.textContent).toContain('14');
});

it('shows rain alert pill for rain WMO code', () => {
  const { container } = renderPanel({ snapshot: mockRainSnapshot });
  const alertPill = container.querySelector(`.${styles.alertPill}`);
  expect(alertPill).toBeTruthy();
  expect(alertPill?.textContent).toContain('Rain nearby');
});

it('shows snow alert pill for snow WMO code', () => {
  const { container } = renderPanel({ snapshot: mockSnowSnapshot });
  const alertPill = container.querySelector(`.${styles.alertPill}`);
  expect(alertPill).toBeTruthy();
  expect(alertPill?.textContent).toContain('Snow nearby');
});

it('shows storm alert pill for thunder WMO code', () => {
  const { container } = renderPanel({ snapshot: mockThunderSnapshot });
  const alertPill = container.querySelector(`.${styles.alertPill}`);
  expect(alertPill).toBeTruthy();
  expect(alertPill?.textContent).toContain('Storm nearby');
});

it('does not show alert pill for clear weather', () => {
  const { container } = renderPanel({ snapshot: mockSunnySnapshot });
  const alertPill = container.querySelector(`.${styles.alertPill}`);
  expect(alertPill).toBeFalsy();
});

it('does not render expanded stats in compact variant', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot, variant: 'compact' });
  const expandedStats = container.querySelector(`.${styles.expandedStats}`);
  expect(expandedStats).toBeFalsy();
});

it('renders expanded stats in expanded variant', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot, variant: 'expanded' });
  const expandedStats = container.querySelector(`.${styles.expandedStats}`);
  expect(expandedStats).toBeTruthy();
});

it('shows visibility in expanded variant', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot, variant: 'expanded' });
  const expandedStats = container.querySelector(`.${styles.expandedStats}`);
  expect(expandedStats?.textContent).toContain('25');
});

it('shows humidity in expanded variant', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot, variant: 'expanded' });
  const expandedStats = container.querySelector(`.${styles.expandedStats}`);
  expect(expandedStats?.textContent).toContain('48');
});

it('toggles from compact to expanded on button click', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot, variant: 'compact' });
  const toggleBtn = container.querySelector(`.${styles.toggleBtn}`) as HTMLButtonElement;
  expect(toggleBtn).toBeTruthy();

  fireEvent.click(toggleBtn);

  const expandedStats = container.querySelector(`.${styles.expandedStats}`);
  expect(expandedStats).toBeTruthy();
});

it('toggles from expanded to compact on button click', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot, variant: 'expanded' });
  const toggleBtn = container.querySelector(`.${styles.toggleBtn}`) as HTMLButtonElement;
  expect(toggleBtn).toBeTruthy();

  fireEvent.click(toggleBtn);

  const expandedStats = container.querySelector(`.${styles.expandedStats}`);
  expect(expandedStats).toBeFalsy();
});

it('applies expanded class when variant is expanded', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot, variant: 'expanded' });
  const panel = container.querySelector(`.${styles.panel}`);
  expect(panel?.classList.contains(styles.expanded)).toBe(true);
});

it('does not apply expanded class when variant is compact', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot, variant: 'compact' });
  const panel = container.querySelector(`.${styles.panel}`);
  expect(panel?.classList.contains(styles.expanded)).toBe(false);
});

it('applies custom className to panel root', () => {
  const { container } = renderPanel({ snapshot: mockSunnySnapshot, className: 'my-custom-class' });
  const panel = container.querySelector('.my-custom-class');
  expect(panel).toBeTruthy();
});

it('renders gust speed in expanded variant when gustKmh is provided', () => {
  const { container } = renderPanel({ snapshot: mockClearSnapshot, variant: 'expanded' });
  const expandedStats = container.querySelector(`.${styles.expandedStats}`);
  expect(expandedStats?.textContent).toContain('22');
});
