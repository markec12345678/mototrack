import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CommunityRoutesGrid } from './community-routes-grid.js';
import { mockCommunityRoutes } from './community-routes-grid.mock.js';
import styles from './community-routes-grid.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the section title', () => {
  const { container } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  const title = container.querySelector(`.${styles.title}`);
  expect(title).toBeTruthy();
  expect(title?.textContent).toBeTruthy();
});

it('should render a card for each route', () => {
  const { container } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  const cards = container.querySelectorAll(`.${styles.routeCard}`);
  expect(cards.length).toBe(mockCommunityRoutes.length);
});

it('should render route names', () => {
  const { getByText } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  expect(getByText('Skrita Logarska')).toBeTruthy();
  expect(getByText('Durmitor Zanka')).toBeTruthy();
});

it('should render route authors', () => {
  const { getByText } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  expect(getByText('Luka Horvat')).toBeTruthy();
});

it('should render the route count', () => {
  const { container } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  const countNumber = container.querySelector(`.${styles.countNumber}`);
  expect(countNumber?.textContent).toBe(String(mockCommunityRoutes.length));
});

it('should render Naloži v Načrtuj buttons', () => {
  const { getAllByText } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  const buttons = getAllByText('Naloži v Načrtuj');
  expect(buttons.length).toBe(mockCommunityRoutes.length);
});

it('should call onLoadRoute when Naloži v Načrtuj is clicked', () => {
  const onLoadRoute = vi.fn();
  const { getAllByText } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} onLoadRoute={onLoadRoute} />
  );
  const buttons = getAllByText('Naloži v Načrtuj');
  fireEvent.click(buttons[0]);
  expect(onLoadRoute).toHaveBeenCalledTimes(1);
  expect(onLoadRoute).toHaveBeenCalledWith(mockCommunityRoutes[0]);
});

it('should render country filter select', () => {
  const { container } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  const selects = container.querySelectorAll(`.${styles.select}`);
  expect(selects.length).toBeGreaterThanOrEqual(2);
});

it('should render sort tabs', () => {
  const { container } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  const sortTabs = container.querySelectorAll(`.${styles.sortTab}`);
  expect(sortTabs.length).toBe(3);
});

it('should activate sort tab on click', () => {
  const { container } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  const sortTabs = container.querySelectorAll(`.${styles.sortTab}`);
  const distanceTab = sortTabs[2] as HTMLButtonElement;
  fireEvent.click(distanceTab);
  expect(distanceTab.classList.contains(styles.sortTabActive)).toBe(true);
});

it('should show empty state when no routes match', () => {
  const { container } = renderWithProvider(
    <CommunityRoutesGrid routes={[]} />
  );
  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState).toBeTruthy();
});

it('should sort by distance when distance tab is clicked', () => {
  const { container } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} initialSort="popularity" />
  );
  const sortTabs = container.querySelectorAll(`.${styles.sortTab}`);
  fireEvent.click(sortTabs[2]);
  const names = container.querySelectorAll(`.${styles.routeName}`);
  expect(names.length).toBe(mockCommunityRoutes.length);
});

it('should render star ratings for each route', () => {
  const { container } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  const ratings = container.querySelectorAll(`.${styles.starRating}`);
  expect(ratings.length).toBe(mockCommunityRoutes.length);
});

it('should render distance stats for each route', () => {
  const { getAllByText } = renderWithProvider(
    <CommunityRoutesGrid routes={mockCommunityRoutes} />
  );
  const distanceEl = getAllByText(/\d+ km/);
  expect(distanceEl.length).toBeGreaterThan(0);
});
