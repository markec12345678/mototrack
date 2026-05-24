import * as React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LeaderboardDashboardPanel } from './leaderboard-dashboard-panel.js';
import { mockLeaderboardEntries, mockLeaderboardEntriesNoMe } from './leaderboard-dashboard-panel.mock.js';

function renderPanel(props: Partial<React.ComponentProps<typeof LeaderboardDashboardPanel>> = {}) {
  return render(
    <MemoryRouter>
      <LeaderboardDashboardPanel {...props} />
    </MemoryRouter>
  );
}

it('should render the panel title', () => {
  const { getByText } = renderPanel({ mockEntries: mockLeaderboardEntries });
  expect(getByText(`Weekly Leaderboard`)).toBeTruthy();
});

it('should render the subtitle', () => {
  const { getByText } = renderPanel({ mockEntries: mockLeaderboardEntries });
  expect(getByText(`Top riders by kilometres this week`)).toBeTruthy();
});

it('should render the period badge', () => {
  const { getByText } = renderPanel({ mockEntries: mockLeaderboardEntries });
  expect(getByText(`This Week`)).toBeTruthy();
});

it('should render all 5 rider names', () => {
  const { getByText } = renderPanel({ mockEntries: mockLeaderboardEntries });
  expect(getByText(`Luka Horvat`)).toBeTruthy();
  expect(getByText(`Marco Bianchi`)).toBeTruthy();
  expect(getByText(`Carlos Ruiz`)).toBeTruthy();
  expect(getByText(`Jan Novák`)).toBeTruthy();
  expect(getByText(`Tomáš Kováč`)).toBeTruthy();
});

it('should render km values for each entry', () => {
  const { getByText } = renderPanel({ mockEntries: mockLeaderboardEntries });
  expect(getByText(`1,248`)).toBeTruthy();
  expect(getByText(`1,105`)).toBeTruthy();
});

it('should render the You badge for the current user', () => {
  const { getByText } = renderPanel({ mockEntries: mockLeaderboardEntries });
  expect(getByText(`You`)).toBeTruthy();
});

it('should not render the You badge when no entry has me=true', () => {
  const { queryByText } = renderPanel({ mockEntries: mockLeaderboardEntriesNoMe });
  expect(queryByText(`You`)).toBeNull();
});

it('should render medal emojis for top 3 ranks', () => {
  const { getByText } = renderPanel({ mockEntries: mockLeaderboardEntries });
  expect(getByText(`🥇`)).toBeTruthy();
  expect(getByText(`🥈`)).toBeTruthy();
  expect(getByText(`🥉`)).toBeTruthy();
});

it('should render numeric rank for positions 4 and 5', () => {
  const { getAllByText } = renderPanel({ mockEntries: mockLeaderboardEntries });
  const rank4 = getAllByText(`4`);
  const rank5 = getAllByText(`5`);
  expect(rank4.length).toBeGreaterThan(0);
  expect(rank5.length).toBeGreaterThan(0);
});

it('should render the full leaderboard link', () => {
  const { container } = renderPanel({ mockEntries: mockLeaderboardEntries });
  const link = container.querySelector(`a`);
  expect(link).toBeTruthy();
  expect(link?.getAttribute(`href`)?.includes(`leaderboard`)).toBe(true);
});

it('should render country flags', () => {
  const { getByText } = renderPanel({ mockEntries: mockLeaderboardEntries });
  expect(getByText(`🇸🇮 SI`)).toBeTruthy();
  expect(getByText(`🇮🇹 IT`)).toBeTruthy();
});

it('should render the empty state when entries list is empty', () => {
  const { getByText } = renderPanel({ mockEntries: [] });
  expect(getByText(`No riders yet this week`)).toBeTruthy();
});
