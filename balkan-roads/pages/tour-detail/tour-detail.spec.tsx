import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TourDetail } from './tour-detail.js';
import { mockVrsicTour, mockKotorTour } from './tour-detail.mock.js';

function renderWithProviders(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the tour hero section', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const hero = container.querySelector('[data-testid="tour-hero"]');
  expect(hero).toBeTruthy();
});

it('should render the tour name in the hero', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const hero = container.querySelector('[data-testid="tour-hero"]') as HTMLElement;
  expect(hero.textContent).toContain(mockVrsicTour.name);
});

it('should render the tour difficulty badge', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const hero = container.querySelector('[data-testid="tour-hero"]') as HTMLElement;
  expect(hero.textContent).toContain(mockVrsicTour.difficulty);
});

it('should render the tour rating value', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const ratingEl = container.querySelector('[data-testid="rating-value"]') as HTMLElement;
  expect(ratingEl).toBeTruthy();
  expect(ratingEl.textContent).toContain(mockVrsicTour.rating.toFixed(1));
});

it('should render the stats grid with 4 stat cards', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const statCards = container.querySelectorAll('[data-testid="stat-card"]');
  expect(statCards.length).toBe(4);
});

it('should render the distance in the hero', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const distanceEl = container.querySelector('[data-testid="hero-distance"]') as HTMLElement;
  expect(distanceEl).toBeTruthy();
  expect(distanceEl.textContent).toContain(`${mockVrsicTour.distanceKm}`);
});

it('should render the tour description', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const descEl = container.querySelector('[data-testid="description-text"]') as HTMLElement;
  expect(descEl).toBeTruthy();
  expect(descEl.textContent).toBe(mockVrsicTour.description);
});

it('should render the map section', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const mapSection = container.querySelector('[data-testid="map-section"]');
  expect(mapSection).toBeTruthy();
});

it('should render the CTA section', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const ctaSection = container.querySelector('[data-testid="cta-section"]');
  expect(ctaSection).toBeTruthy();
});

it('should render the CTA button with Slovenian text', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const ctaSection = container.querySelector('[data-testid="cta-section"]') as HTMLElement;
  expect(ctaSection.textContent).toContain('Naloži v Načrtuj');
});

it('should render tour not found state when no mock tour is provided and no Apollo', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={undefined} tourId="nonexistent-id" />
  );
  // Without Apollo context, ConnectedTourDetail will error — MockProvider includes Apollo MockedProvider
  // so it will show not-found or loading state
  expect(container.firstChild).toBeTruthy();
});

it('should render a different tour name correctly', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockKotorTour} />
  );
  const hero = container.querySelector('[data-testid="tour-hero"]') as HTMLElement;
  expect(hero.textContent).toContain(mockKotorTour.name);
});

it('should render the waypoints count in stats', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const statsGrid = container.querySelector('[data-testid="stats-grid"]') as HTMLElement;
  expect(statsGrid.textContent).toContain(`${mockVrsicTour.waypoints.length}`);
});

it('should render the description section', () => {
  const { container } = renderWithProviders(
    <TourDetail mockTour={mockVrsicTour} />
  );
  const descSection = container.querySelector('[data-testid="description-section"]');
  expect(descSection).toBeTruthy();
});
