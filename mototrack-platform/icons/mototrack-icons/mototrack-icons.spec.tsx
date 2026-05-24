import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import {
  MapIcon,
  PlanIcon,
  TrackIcon,
  ExploreIcon,
  ProfileIcon,
  SosIcon,
  ChatIcon,
  MenuIcon,
  LogoutIcon,
  SettingsIcon,
  BellIcon,
} from './mototrack-icons.js';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it(`renders MapIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<MapIcon />);
  const icon = container.querySelector(`[aria-label="Map"]`);
  expect(icon).toBeTruthy();
});

it(`renders PlanIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<PlanIcon />);
  const icon = container.querySelector(`[aria-label="Plan"]`);
  expect(icon).toBeTruthy();
});

it(`renders TrackIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<TrackIcon />);
  const icon = container.querySelector(`[aria-label="Track"]`);
  expect(icon).toBeTruthy();
});

it(`renders ExploreIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<ExploreIcon />);
  const icon = container.querySelector(`[aria-label="Explore"]`);
  expect(icon).toBeTruthy();
});

it(`renders ProfileIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<ProfileIcon />);
  const icon = container.querySelector(`[aria-label="Profile"]`);
  expect(icon).toBeTruthy();
});

it(`renders SosIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<SosIcon />);
  const icon = container.querySelector(`[aria-label="SOS"]`);
  expect(icon).toBeTruthy();
});

it(`renders ChatIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<ChatIcon />);
  const icon = container.querySelector(`[aria-label="Chat"]`);
  expect(icon).toBeTruthy();
});

it(`renders MenuIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<MenuIcon />);
  const icon = container.querySelector(`[aria-label="Menu"]`);
  expect(icon).toBeTruthy();
});

it(`renders LogoutIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<LogoutIcon />);
  const icon = container.querySelector(`[aria-label="Logout"]`);
  expect(icon).toBeTruthy();
});

it(`renders SettingsIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<SettingsIcon />);
  const icon = container.querySelector(`[aria-label="Settings"]`);
  expect(icon).toBeTruthy();
});

it(`renders BellIcon with correct aria-label`, () => {
  const { container } = renderWithProvider(<BellIcon />);
  const icon = container.querySelector(`[aria-label="Notifications"]`);
  expect(icon).toBeTruthy();
});

it(`renders MenuIcon with an SVG child`, () => {
  const { container } = renderWithProvider(<MenuIcon />);
  const svg = container.querySelector(`svg`);
  expect(svg).toBeTruthy();
});

it(`renders LogoutIcon with an SVG child`, () => {
  const { container } = renderWithProvider(<LogoutIcon />);
  const svg = container.querySelector(`svg`);
  expect(svg).toBeTruthy();
});

it(`renders SettingsIcon with an SVG child`, () => {
  const { container } = renderWithProvider(<SettingsIcon />);
  const svg = container.querySelector(`svg`);
  expect(svg).toBeTruthy();
});

it(`renders BellIcon with an SVG child`, () => {
  const { container } = renderWithProvider(<BellIcon />);
  const svg = container.querySelector(`svg`);
  expect(svg).toBeTruthy();
});

it(`passes onClick to MapIcon`, () => {
  let clicked = false;
  const { container } = renderWithProvider(
    <MapIcon onClick={() => { clicked = true; }} />
  );
  const icon = container.querySelector(`[aria-label="Map"]`) as HTMLElement;
  icon?.click();
  expect(clicked).toBe(true);
});

it(`applies custom className to SosIcon`, () => {
  const { container } = renderWithProvider(<SosIcon className="custom-sos" />);
  const icon = container.querySelector(`.custom-sos`);
  expect(icon).toBeTruthy();
});
