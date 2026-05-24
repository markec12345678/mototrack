import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { LeaderboardTable } from './leaderboard-table.js';
import {
  mockLeaderboardEntries,
  mockLeaderboardEntriesWithMe,
} from './leaderboard-table.mock.js';
import styles from './leaderboard-table.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it(`renders the leaderboard title`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} />
  );
  const title = container.querySelector(`.${styles.title}`);
  expect(title).toBeTruthy();
  expect(title?.textContent).toBe(`Leaderboard`);
});

it(`renders the correct number of rows`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} />
  );
  const rows = container.querySelectorAll(`.${styles.row}`);
  expect(rows.length).toBe(mockLeaderboardEntries.length);
});

it(`respects the limit prop`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} limit={5} />
  );
  const rows = container.querySelectorAll(`.${styles.row}`);
  expect(rows.length).toBe(5);
});

it(`renders medal emojis for top 3 rows`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} />
  );
  const medals = container.querySelectorAll(`.${styles.medal}`);
  expect(medals.length).toBe(3);
  const medalTexts = Array.from(medals).map((m) => m.textContent);
  expect(medalTexts).toContain(`🥇`);
  expect(medalTexts).toContain(`🥈`);
  expect(medalTexts).toContain(`🥉`);
});

it(`highlights the current user row`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntriesWithMe} />
  );
  const meRow = container.querySelector(`.${styles.rowMe}`);
  expect(meRow).toBeTruthy();
});

it(`renders the "You" badge for the current user`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntriesWithMe} />
  );
  const meBadge = container.querySelector(`.${styles.meBadge}`);
  expect(meBadge).toBeTruthy();
  expect(meBadge?.textContent).toBe(`You`);
});

it(`renders period selector buttons`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} />
  );
  const buttons = container.querySelectorAll(`.${styles.selectorBtn}`);
  expect(buttons.length).toBe(6);
});

it(`marks the default period button as active`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} defaultPeriod="month" />
  );
  const activeButtons = container.querySelectorAll(`.${styles.selectorBtnActive}`);
  const activeTexts = Array.from(activeButtons).map((b) => b.textContent);
  expect(activeTexts).toContain(`This Month`);
});

it(`marks the default sortBy button as active`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} defaultSortBy="km" />
  );
  const activeButtons = container.querySelectorAll(`.${styles.selectorBtnActive}`);
  const activeTexts = Array.from(activeButtons).map((b) => b.textContent);
  expect(activeTexts).toContain(`Distance`);
});

it(`switches active period when a period button is clicked`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} defaultPeriod="week" />
  );
  const buttons = Array.from(container.querySelectorAll(`.${styles.selectorBtn}`)) as HTMLButtonElement[];
  const alltimeBtn = buttons.find((b) => b.textContent === `All Time`);
  expect(alltimeBtn).toBeTruthy();
  fireEvent.click(alltimeBtn!);
  const activeButtons = container.querySelectorAll(`.${styles.selectorBtnActive}`);
  const activeTexts = Array.from(activeButtons).map((b) => b.textContent);
  expect(activeTexts).toContain(`All Time`);
});

it(`switches active sortBy when a sort button is clicked`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} defaultSortBy="points" />
  );
  const buttons = Array.from(container.querySelectorAll(`.${styles.selectorBtn}`)) as HTMLButtonElement[];
  const ridesBtn = buttons.find((b) => b.textContent === `Rides`);
  expect(ridesBtn).toBeTruthy();
  fireEvent.click(ridesBtn!);
  const activeButtons = container.querySelectorAll(`.${styles.selectorBtnActive}`);
  const activeTexts = Array.from(activeButtons).map((b) => b.textContent);
  expect(activeTexts).toContain(`Rides`);
});

it(`renders rider display names`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} />
  );
  const names = container.querySelectorAll(`.${styles.riderName}`);
  expect(names.length).toBe(mockLeaderboardEntries.length);
  expect(names[0].textContent).toContain(`Luka Horvat`);
});

it(`renders the footer with entry count`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} />
  );
  const footer = container.querySelector(`.${styles.footer}`);
  expect(footer).toBeTruthy();
  expect(footer?.textContent).toContain(`10`);
});

it(`renders empty state when no entries are provided`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={[]} />
  );
  const stateBox = container.querySelector(`.${styles.stateBox}`);
  expect(stateBox).toBeTruthy();
});

it(`applies custom className to root element`, () => {
  const { container } = renderWithProvider(
    <LeaderboardTable entries={mockLeaderboardEntries} className="custom-class" />
  );
  const root = container.querySelector(`.${styles.leaderboardTable}`);
  expect(root?.classList.contains(`custom-class`)).toBe(true);
});
