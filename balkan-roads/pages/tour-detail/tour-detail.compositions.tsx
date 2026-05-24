import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TourDetail } from './tour-detail.js';
import { mockVrsicTour, mockKotorTour, mockTransfagarasanTour } from './tour-detail.mock.js';

/**
 * VrsicFullLoop — Slovenian mountain tour with hard difficulty.
 * Hero shows Slovenian flag, 9.4 rating, 7 waypoints on the map.
 */
export const VrsicFullLoop = () => {
  return (
    <MockProvider>
      <TourDetail mockTour={mockVrsicTour} />
    </MockProvider>
  );
};

/**
 * KotorLovcenSkadar — Montenegrin coastal + mountain tour, moderate difficulty.
 * Showcases the map polyline from Kotor Bay up to Lovćen and down to Lake Skadar.
 */
export const KotorLovcenSkadar = () => {
  return (
    <MockProvider>
      <TourDetail mockTour={mockKotorTour} />
    </MockProvider>
  );
};

/**
 * TransfagarasanExpert — Romanian expert-level legendary road.
 * Demonstrates the danger difficulty badge and high rating display.
 */
export const TransfagarasanExpert = () => {
  return (
    <MockProvider>
      <TourDetail mockTour={mockTransfagarasanTour} />
    </MockProvider>
  );
};
