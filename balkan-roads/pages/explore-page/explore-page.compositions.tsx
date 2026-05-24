import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ExplorePage } from './explore-page.js';
import { mockExploreTours } from './explore-page.mock.js';

/**
 * Default — full explore page with mock tours data, starting on the Tours tab.
 */
export const DefaultExplorePage = () => {
  return (
    <MockProvider>
      <ExplorePage mockTours={mockExploreTours} />
    </MockProvider>
  );
};

/**
 * ToursTabFiltered — explore page with a subset of tours (only Hard difficulty).
 */
export const HardToursOnly = () => {
  const hardTours = mockExploreTours.filter((t) => t.difficulty === `Hard`);
  return (
    <MockProvider>
      <ExplorePage mockTours={hardTours} />
    </MockProvider>
  );
};

/**
 * EmptyTours — explore page with no tours to show the empty state.
 */
export const EmptyToursState = () => {
  return (
    <MockProvider>
      <ExplorePage mockTours={[]} />
    </MockProvider>
  );
};
