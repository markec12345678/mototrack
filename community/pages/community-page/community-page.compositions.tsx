import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CommunityPage } from './community-page.js';

/**
 * DefaultLestvica — /community page landing on the Leaderboard tab.
 */
export const DefaultLestvica = () => {
  return (
    <MockProvider>
      <CommunityPage defaultTab="lestvica" />
    </MockProvider>
  );
};

/**
 * DosežkiTab — /community page opened on the Achievements tab.
 */
export const DosežkiTab = () => {
  return (
    <MockProvider>
      <CommunityPage defaultTab="dosezki" />
    </MockProvider>
  );
};

/**
 * GrupneVožnjeTab — /community page opened on the Group Rides chat tab.
 */
export const GrupneVožnjeTab = () => {
  return (
    <MockProvider>
      <CommunityPage defaultTab="grupne-voznje" />
    </MockProvider>
  );
};
