import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RidesList } from './rides-list';
import { mockRides, mockRidesSparse } from './rides-list.mock';

/**
 * Full list — rich grid of rides with date-range filter available.
 */
export const FullRidesList = () => {
  return (
    <MockProvider>
      <RidesList mockRides={mockRides} />
    </MockProvider>
  );
};

/**
 * Calendar view — monthly heatmap with day-drill interaction.
 * Switch to the Calendar tab to explore the heatmap.
 */
export const CalendarView = () => {
  return (
    <MockProvider>
      <RidesList mockRides={mockRides} />
    </MockProvider>
  );
};

/**
 * Sparse rides — only a couple of rides to show the contrast between
 * active and empty days in the calendar heatmap.
 */
export const SparseRides = () => {
  return (
    <MockProvider>
      <RidesList mockRides={mockRidesSparse} />
    </MockProvider>
  );
};

/**
 * Empty state — no rides logged yet.
 */
export const EmptyRidesList = () => {
  return (
    <MockProvider>
      <RidesList mockRides={[]} />
    </MockProvider>
  );
};
