import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ExplorePage } from './explore-page.js';
import { mockExploreTours } from './explore-page.mock.js';
import styles from './explore-page.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the hero section', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);
  const hero = container.querySelector(`.${styles.hero}`);
  expect(hero).toBeTruthy();
});

it('should render the hero title', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);
  const heroTitle = container.querySelector(`.${styles.heroTitle}`);
  expect(heroTitle).toBeTruthy();
  expect(heroTitle?.textContent).toBe(`Razišči Balkan`);
});

it('should render the tabs', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);
  const tabsWrapper = container.querySelector(`.${styles.tabsWrapper}`);
  expect(tabsWrapper).toBeTruthy();
});

it('should render tours grid by default', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);
  const grid = container.querySelector(`.${styles.toursGrid}`);
  expect(grid).toBeTruthy();
});

it('should render the correct number of tour cards', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);
  const grid = container.querySelector(`.${styles.toursGrid}`);
  const cards = grid?.children;
  expect(cards?.length).toBe(mockExploreTours.length);
});

it('should show empty state when no tours match', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={[]} />);
  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState).toBeTruthy();
});

it('should render filter chips for countries', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);
  const chips = container.querySelectorAll(`.${styles.filterChip}`);
  expect(chips.length).toBeGreaterThan(0);
});

it('should activate a filter chip when clicked', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);
  const chips = container.querySelectorAll(`.${styles.filterChip}`);
  const firstChip = chips[0] as HTMLButtonElement;
  fireEvent.click(firstChip);
  const activeChip = container.querySelector(`.${styles.filterChipActive}`);
  expect(activeChip).toBeTruthy();
});

it('should deactivate a filter chip when clicked again', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);
  const chips = container.querySelectorAll(`.${styles.filterChip}`);
  const firstChip = chips[0] as HTMLButtonElement;
  fireEvent.click(firstChip);
  fireEvent.click(firstChip);
  const activeChip = container.querySelector(`.${styles.filterChipActive}`);
  expect(activeChip).toBeFalsy();
});

it('should render the community tab content when community tab is clicked', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);
  const tabButtons = container.querySelectorAll(`button[role="tab"]`);
  const communityTab = Array.from(tabButtons).find((btn) =>
    btn.textContent?.includes(`Skupnostne rute`)
  ) as HTMLButtonElement;
  expect(communityTab).toBeTruthy();
  fireEvent.click(communityTab);
  const communityCard = container.querySelector(`.${styles.communityCard}`);
  expect(communityCard).toBeTruthy();
});

it('should render the roads tab content when roads tab is clicked', () => {
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);
  const tabButtons = container.querySelectorAll(`button[role="tab"]`);
  const roadsTab = Array.from(tabButtons).find((btn) =>
    btn.textContent?.includes(`Balkanske ceste`)
  ) as HTMLButtonElement;
  expect(roadsTab).toBeTruthy();
  fireEvent.click(roadsTab);
  const roadsTabContent = container.querySelector(`.${styles.roadsTab}`);
  expect(roadsTabContent).toBeTruthy();
});

it('should apply custom className', () => {
  const { container } = renderWithProvider(
    <ExplorePage mockTours={mockExploreTours} className="custom-class" />
  );
  const root = container.querySelector(`.custom-class`);
  expect(root).toBeTruthy();
});

it('should filter tours by difficulty when difficulty chip is clicked', () => {
  const hardTours = mockExploreTours.filter((t) => t.difficulty === `Hard`);
  const { container } = renderWithProvider(<ExplorePage mockTours={mockExploreTours} />);

  const chips = container.querySelectorAll(`.${styles.filterChip}`);
  const hardChip = Array.from(chips).find((btn) =>
    btn.textContent?.trim() === `Hard`
  ) as HTMLButtonElement;
  expect(hardChip).toBeTruthy();
  fireEvent.click(hardChip);

  const grid = container.querySelector(`.${styles.toursGrid}`);
  const cards = grid?.children;
  expect(cards?.length).toBe(hardTours.length);
});
