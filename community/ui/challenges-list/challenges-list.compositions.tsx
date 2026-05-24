import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ChallengesList } from './challenges-list.js';
import { mockChallenges } from './challenges-list.mock.js';

const pageStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  padding: `40px 32px`,
};

const maxWidthStyle: React.CSSProperties = {
  maxWidth: `720px`,
  margin: `0 auto`,
};

/**
 * Default — full list with mixed joined/not-joined challenges.
 */
export const Default = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={maxWidthStyle}>
          <ChallengesList challenges={mockChallenges} />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * AllJoined — every challenge is joined with varying progress.
 */
export const AllJoined = () => {
  const joinedChallenges = mockChallenges.map((c, i) => ({
    ...c,
    joined: true,
    progressPct: [25, 55, 80, 100][i] ?? 50,
  }));

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={maxWidthStyle}>
          <ChallengesList
            challenges={joinedChallenges}
            title="My Challenges"
            subtitle="Track your progress and earn XP across all active challenges."
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * EmptyState — no challenges available.
 */
export const EmptyState = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={maxWidthStyle}>
          <ChallengesList
            challenges={[]}
            title="Active Challenges"
            subtitle="No challenges are running right now."
          />
        </div>
      </div>
    </MockProvider>
  );
};
