import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TurnBanner } from './turn-banner.js';
import {
  mockTurnRight,
  mockTurnLeft,
  mockUturn,
  mockContinue,
  mockImminentTurn,
} from './turn-banner.mock.js';
import styles from './turn-banner.module.scss';

function renderBanner(props: Partial<React.ComponentProps<typeof TurnBanner>> = {}) {
  return render(
    <MockProvider>
      <TurnBanner instruction={mockTurnRight} {...props} />
    </MockProvider>
  );
}

it('renders the instruction text', () => {
  const { getByText } = renderBanner({ instruction: mockTurnRight });
  expect(getByText(`Zavijte desno`)).toBeTruthy();
});

it('renders the street name when provided', () => {
  const { getByText } = renderBanner({ streetName: `Dunajska cesta` });
  expect(getByText(`Dunajska cesta`)).toBeTruthy();
});

it('does not render street name when empty string is passed', () => {
  const { queryByText } = renderBanner({ streetName: `` });
  expect(queryByText(`Dunajska cesta`)).toBeNull();
});

it('renders formatted distance in meters', () => {
  const { getByText } = renderBanner({ instruction: mockTurnRight });
  expect(getByText(`320 m`)).toBeTruthy();
});

it('renders formatted distance in km for large distances', () => {
  const { getByText } = renderBanner({ instruction: mockContinue });
  expect(getByText(`1.4 km`)).toBeTruthy();
});

it('shows BT helmet badge when btConnected is true', () => {
  const { getByText } = renderBanner({ btConnected: true, btDeviceName: `Sena 50S` });
  expect(getByText(`Sena 50S`)).toBeTruthy();
});

it('does not show BT badge when btConnected is false', () => {
  const { queryByText } = renderBanner({ btConnected: false, btDeviceName: `Sena 50S` });
  expect(queryByText(`Sena 50S`)).toBeNull();
});

it('shows default BT label when btDeviceName is empty and btConnected is true', () => {
  const { getByText } = renderBanner({ btConnected: true, btDeviceName: `` });
  expect(getByText(`BT Helmet`)).toBeTruthy();
});

it('calls onVoiceToggle when voice button is clicked', () => {
  const onVoiceToggle = vi.fn();
  const { container } = renderBanner({ voiceEnabled: true, onVoiceToggle });
  const button = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(button);
  expect(onVoiceToggle).toHaveBeenCalledWith(false);
});

it('calls onVoiceToggle with true when voice is off and toggled', () => {
  const onVoiceToggle = vi.fn();
  const { container } = renderBanner({ voiceEnabled: false, onVoiceToggle });
  const button = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(button);
  expect(onVoiceToggle).toHaveBeenCalledWith(true);
});

it('applies imminent class when distanceM <= announceAt', () => {
  const { container } = renderBanner({ instruction: mockImminentTurn });
  const banner = container.querySelector(`.${styles.banner}`) as HTMLElement;
  expect(banner.classList.contains(styles.imminent)).toBe(true);
});

it('does not apply imminent class when distanceM > announceAt', () => {
  const { container } = renderBanner({ instruction: mockTurnRight });
  const banner = container.querySelector(`.${styles.banner}`) as HTMLElement;
  expect(banner.classList.contains(styles.imminent)).toBe(false);
});

it('renders turn-left instruction text', () => {
  const { getByText } = renderBanner({ instruction: mockTurnLeft });
  expect(getByText(`Zavijte levo`)).toBeTruthy();
});

it('renders uturn instruction text', () => {
  const { getByText } = renderBanner({ instruction: mockUturn });
  expect(getByText(`Obrnite se`)).toBeTruthy();
});

it('renders the progress bar element', () => {
  const { container } = renderBanner();
  const bar = container.querySelector(`.${styles.progressBar}`);
  expect(bar).toBeTruthy();
});

it('accepts and applies a custom className', () => {
  const { container } = renderBanner({ className: `my-custom-class` });
  const banner = container.querySelector(`.${styles.banner}`) as HTMLElement;
  expect(banner.classList.contains(`my-custom-class`)).toBe(true);
});
