import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ChallengesList } from './challenges-list.js';
import { mockChallenges } from './challenges-list.mock.js';
import styles from './challenges-list.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it(`renders the list title`, () => {
  const { getByText } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} title="Active Challenges" />
  );
  expect(getByText(`Active Challenges`)).toBeTruthy();
});

it(`renders the subtitle`, () => {
  const { getByText } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} subtitle="Earn XP now" />
  );
  expect(getByText(`Earn XP now`)).toBeTruthy();
});

it(`renders the challenge count badge`, () => {
  const { container } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  const badge = container.querySelector(`.${styles.countBadge}`);
  expect(badge).toBeTruthy();
  expect(badge?.textContent).toBe(String(mockChallenges.length));
});

it(`renders each challenge name`, () => {
  const { getByText } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  mockChallenges.forEach((c) => {
    expect(getByText(c.name)).toBeTruthy();
  });
});

it(`renders each challenge description`, () => {
  const { getByText } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  mockChallenges.forEach((c) => {
    expect(getByText(c.description)).toBeTruthy();
  });
});

it(`renders XP badge for each challenge`, () => {
  const { container } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  const xpBadges = container.querySelectorAll(`.${styles.xpBadge}`);
  expect(xpBadges.length).toBe(mockChallenges.length);
});

it(`renders Join Challenge button for non-joined challenges`, () => {
  const { getAllByText } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  const notJoined = mockChallenges.filter((c) => !c.joined);
  const buttons = getAllByText(`Join Challenge`);
  expect(buttons.length).toBe(notJoined.length);
});

it(`renders Joined badge for joined challenges`, () => {
  const { container } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  const joinedBadges = container.querySelectorAll(`.${styles.joinedBadge}`);
  const joinedCount = mockChallenges.filter((c) => c.joined).length;
  expect(joinedBadges.length).toBe(joinedCount);
});

it(`renders progress section only for joined challenges`, () => {
  const { container } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  const progressSections = container.querySelectorAll(`.${styles.progressSection}`);
  const joinedCount = mockChallenges.filter((c) => c.joined).length;
  expect(progressSections.length).toBe(joinedCount);
});

it(`renders empty state when no challenges provided`, () => {
  const { container } = renderWithProvider(
    <ChallengesList challenges={[]} />
  );
  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState).toBeTruthy();
});

it(`does not render the list when challenges is empty`, () => {
  const { container } = renderWithProvider(
    <ChallengesList challenges={[]} />
  );
  const list = container.querySelector(`.${styles.list}`);
  expect(list).toBeNull();
});

it(`renders participants count for each challenge`, () => {
  const { container } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  const participantItems = container.querySelectorAll(`.${styles.participantsInfo}`);
  expect(participantItems.length).toBe(mockChallenges.length);
});

it(`applies custom className to root`, () => {
  const { container } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} className="custom-class" />
  );
  const root = container.querySelector(`.${styles.root}`);
  expect(root?.classList.contains(`custom-class`)).toBe(true);
});

it(`renders the icon for each challenge`, () => {
  const { container } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  const iconWrappers = container.querySelectorAll(`.${styles.iconWrapper}`);
  expect(iconWrappers.length).toBe(mockChallenges.length);
});

it(`renders time remaining for each challenge`, () => {
  const { container } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  const metaRows = container.querySelectorAll(`.${styles.metaRow}`);
  expect(metaRows.length).toBe(mockChallenges.length);
});

it(`renders a Join button that is clickable`, () => {
  const { getAllByText } = renderWithProvider(
    <ChallengesList challenges={mockChallenges} />
  );
  const buttons = getAllByText(`Join Challenge`);
  expect(buttons.length).toBeGreaterThan(0);
  fireEvent.click(buttons[0]);
});
