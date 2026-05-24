import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { AchievementsGrid } from './achievements-grid.js';
import { mockAchievements, mockAchievementsAllUnlocked, mockAchievementsAllLocked } from './achievements-grid.mock.js';

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 32px`,
        }}
      >
        <div style={{ maxWidth: `1100px`, margin: `0 auto` }}>
          {children}
        </div>
      </div>
    </MockProvider>
  );
}

/**
 * Default — mixed locked and unlocked achievements, as seen in production.
 */
export const DefaultMixed = () => {
  return (
    <PageWrapper>
      <AchievementsGrid achievements={mockAchievements} />
    </PageWrapper>
  );
};

/**
 * AllUnlocked — every achievement is earned; full-color grid with check badges.
 */
export const AllUnlocked = () => {
  return (
    <PageWrapper>
      <AchievementsGrid achievements={mockAchievementsAllUnlocked} />
    </PageWrapper>
  );
};

/**
 * AllLocked — no achievements unlocked yet; grayscale grid with progress bars.
 */
export const AllLocked = () => {
  return (
    <PageWrapper>
      <AchievementsGrid achievements={mockAchievementsAllLocked} />
    </PageWrapper>
  );
};
