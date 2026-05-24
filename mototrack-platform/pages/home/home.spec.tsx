import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Home } from './home.js';
import styles from './home.module.scss';

function renderHome(props = {}) {
  return render(
    <MockProvider>
      <Home {...props} />
    </MockProvider>
  );
}

it('should render the hero heading for anonymous users', () => {
  const { getByText } = renderHome();
  const heading = getByText(/MotoTrack/i);
  expect(heading).toBeTruthy();
});

it('should render the marketing subline for anonymous users', () => {
  const { getByText } = renderHome();
  const subline = getByText(/OSRM/i);
  expect(subline).toBeTruthy();
});

it('should render all default feature pills', () => {
  const { getByText } = renderHome();
  expect(getByText(`Real GPS`)).toBeTruthy();
  expect(getByText(`OSRM routing`)).toBeTruthy();
  expect(getByText(`63 cest`)).toBeTruthy();
  expect(getByText(`MotoChat AI`)).toBeTruthy();
  expect(getByText(`Crash detection`)).toBeTruthy();
});

it('should render custom feature pills when provided', () => {
  const pills = [
    { icon: `🏔️`, label: `Gorske poti` },
    { icon: `⚡`, label: `Hitro usmerjanje` },
  ];
  const { getByText } = renderHome({ featurePills: pills });
  expect(getByText(`Gorske poti`)).toBeTruthy();
  expect(getByText(`Hitro usmerjanje`)).toBeTruthy();
});

it('should render the signup CTA button', () => {
  const { getByText } = renderHome();
  const btn = getByText(`Začni brezplačno`);
  expect(btn).toBeTruthy();
});

it('should render the login CTA button', () => {
  const { getByText } = renderHome();
  const btn = getByText(`Prijava`);
  expect(btn).toBeTruthy();
});

it('should render the live badge', () => {
  const { getByText } = renderHome();
  const badge = getByText(/MotoTrack · Balkan Edition/i);
  expect(badge).toBeTruthy();
});

it('should render the features section heading', () => {
  const { getByText } = renderHome();
  const heading = getByText(/Navigacija, ki razume motoriste/i);
  expect(heading).toBeTruthy();
});

it('should render the bottom CTA section', () => {
  const { getByText } = renderHome();
  const heading = getByText(/Pridruži se skupnosti motoristov/i);
  expect(heading).toBeTruthy();
});

it('should render the hero image', () => {
  const { container } = renderHome();
  const img = container.querySelector(`.${styles.heroImage}`);
  expect(img).toBeTruthy();
});

it('should render feature items in the features list', () => {
  const { getByText } = renderHome();
  expect(getByText(`Real GPS sledenje`)).toBeTruthy();
  expect(getByText(`OSRM usmerjanje`)).toBeTruthy();
  expect(getByText(`MotoChat AI`)).toBeTruthy();
  expect(getByText(`Crash detection`)).toBeTruthy();
});

it('should render stat cards with correct values', () => {
  const { getByText } = renderHome();
  expect(getByText(`63`)).toBeTruthy();
  expect(getByText(`98%`)).toBeTruthy();
});
