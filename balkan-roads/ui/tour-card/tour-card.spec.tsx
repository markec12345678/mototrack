import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TourCard } from './tour-card.js';
import { mockVrsicTour, mockKotorTour, mockEasyTour } from './tour-card.mock.js';
import styles from './tour-card.module.scss';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

it('renders the tour name', () => {
  const { container } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const name = container.querySelector(`.${styles.name}`);
  expect(name?.textContent).toContain(mockVrsicTour.name);
});

it('renders the tour description', () => {
  const { container } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const desc = container.querySelector(`.${styles.description}`);
  expect(desc?.textContent).toContain(mockVrsicTour.description);
});

it('renders the distance stat', () => {
  const { container } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const stats = container.querySelectorAll(`.${styles.statValue}`);
  const statTexts = Array.from(stats).map((el) => el.textContent ?? ``);
  expect(statTexts.some((t) => t.includes(`${mockVrsicTour.distanceKm}`))).toBe(true);
});

it('renders the waypoint count', () => {
  const { container } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const stats = container.querySelectorAll(`.${styles.statValue}`);
  const statTexts = Array.from(stats).map((el) => el.textContent ?? ``);
  expect(statTexts.some((t) => t.includes(`${mockVrsicTour.waypoints.length}`))).toBe(true);
});

it('renders the rating value', () => {
  const { container } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const ratingEl = container.querySelector(`.${styles.ratingValue}`);
  expect(ratingEl?.textContent).toContain(mockVrsicTour.rating.toFixed(1));
});

it('renders the country name', () => {
  const { container } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const countryEl = container.querySelector(`.${styles.countryName}`);
  expect(countryEl?.textContent).toContain(mockVrsicTour.country);
});

it('renders the CTA button with correct label', () => {
  const { getByText } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const btn = getByText(`Naloži v Načrtuj`);
  expect(btn).toBeTruthy();
});

it('renders the difficulty badge', () => {
  const { getByText } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const badge = getByText(mockVrsicTour.difficulty);
  expect(badge).toBeTruthy();
});

it('renders easy difficulty badge for easy tour', () => {
  const { getByText } = renderWithRouter(<TourCard tour={mockEasyTour} />);
  const badge = getByText(mockEasyTour.difficulty);
  expect(badge).toBeTruthy();
});

it('renders moderate difficulty badge', () => {
  const { getByText } = renderWithRouter(<TourCard tour={mockKotorTour} />);
  const badge = getByText(mockKotorTour.difficulty);
  expect(badge).toBeTruthy();
});

it('renders the flag row', () => {
  const { container } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const flagRow = container.querySelector(`.${styles.flagRow}`);
  expect(flagRow).toBeTruthy();
});

it('renders the header strip', () => {
  const { container } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const header = container.querySelector(`.${styles.header}`);
  expect(header).toBeTruthy();
});

it('renders the footer with CTA', () => {
  const { container } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const footer = container.querySelector(`.${styles.footer}`);
  expect(footer).toBeTruthy();
});

it('applies custom className to wrapper', () => {
  const { container } = renderWithRouter(
    <TourCard tour={mockVrsicTour} className="custom-class" />
  );
  const wrapper = container.querySelector(`.${styles.wrapper}`);
  expect(wrapper?.classList.contains(`custom-class`)).toBe(true);
});

it('clicking CTA button does not throw', () => {
  const { getByText } = renderWithRouter(<TourCard tour={mockVrsicTour} />);
  const btn = getByText(`Naloži v Načrtuj`);
  expect(() => fireEvent.click(btn)).not.toThrow();
});
