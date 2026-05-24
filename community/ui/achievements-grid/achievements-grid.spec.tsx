import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { AchievementsGrid } from './achievements-grid.js';
import { mockAchievements, mockAchievementsAllUnlocked, mockAchievementsAllLocked } from './achievements-grid.mock.js';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it(`renders the Achievements heading`, () => {
  const { getByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievements} />
  );
  expect(getByText(`Achievements`)).toBeTruthy();
});

it(`renders the eyebrow label`, () => {
  const { getByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievements} />
  );
  expect(getByText(`Your Progress`)).toBeTruthy();
});

it(`renders unlocked section label when there are unlocked achievements`, () => {
  const unlockedCount = mockAchievements.filter((a) => a.unlocked).length;
  const { getByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievements} />
  );
  expect(getByText(`Unlocked (${unlockedCount})`)).toBeTruthy();
});

it(`renders locked section label when there are locked achievements`, () => {
  const lockedCount = mockAchievements.filter((a) => !a.unlocked).length;
  const { getByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievements} />
  );
  expect(getByText(`Locked (${lockedCount})`)).toBeTruthy();
});

it(`renders all achievement names`, () => {
  const { getAllByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievements} />
  );
  // Each achievement name should appear exactly once
  mockAchievements.forEach((a) => {
    expect(getAllByText(a.name).length).toBeGreaterThan(0);
  });
});

it(`renders achievement descriptions`, () => {
  const { getAllByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievements} />
  );
  mockAchievements.forEach((a) => {
    expect(getAllByText(a.description).length).toBeGreaterThan(0);
  });
});

it(`renders stat value for unlocked count`, () => {
  const unlockedCount = mockAchievements.filter((a) => a.unlocked).length;
  const { getAllByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievements} />
  );
  // The unlocked count appears in the stats area
  expect(getAllByText(String(unlockedCount)).length).toBeGreaterThan(0);
});

it(`renders stat value for total count`, () => {
  const { getAllByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievements} />
  );
  expect(getAllByText(String(mockAchievements.length)).length).toBeGreaterThan(0);
});

it(`renders empty state when no achievements are provided`, () => {
  const { getByText } = renderWithProvider(
    <AchievementsGrid achievements={[]} />
  );
  expect(getByText(`No achievements yet`)).toBeTruthy();
});

it(`renders unlocked label for unlocked achievements`, () => {
  const { getAllByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievementsAllUnlocked} />
  );
  // Each unlocked achievement shows "Unlocked ..." label
  const unlockedLabels = getAllByText((content) => content.startsWith(`Unlocked`) && content !== `Unlocked (${mockAchievementsAllUnlocked.length})`);
  expect(unlockedLabels.length).toBeGreaterThan(0);
});

it(`renders overall completion progress bar label`, () => {
  const { getByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievements} />
  );
  expect(getByText(`Overall completion`)).toBeTruthy();
});

it(`renders only locked section when all achievements are locked`, () => {
  const lockedCount = mockAchievementsAllLocked.length;
  const { getByText, queryByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievementsAllLocked} />
  );
  expect(getByText(`Locked (${lockedCount})`)).toBeTruthy();
  expect(queryByText(/^Unlocked \(\d+\)$/)).toBeNull();
});

it(`renders only unlocked section when all achievements are unlocked`, () => {
  const unlockedCount = mockAchievementsAllUnlocked.length;
  const { getByText, queryByText } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievementsAllUnlocked} />
  );
  expect(getByText(`Unlocked (${unlockedCount})`)).toBeTruthy();
  expect(queryByText(/^Locked \(\d+\)$/)).toBeNull();
});

it(`accepts a custom className on the root element`, () => {
  const { container } = renderWithProvider(
    <AchievementsGrid achievements={mockAchievements} className="custom-class" />
  );
  const root = container.firstElementChild?.firstElementChild;
  expect(root?.classList.contains(`custom-class`)).toBe(true);
});
