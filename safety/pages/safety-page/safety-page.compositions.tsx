import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { SafetyPage } from './safety-page.js';
import {
  mockIceContacts,
  mockEmergencyOverrideSlovenia,
  mockEmergencyOverrideCroatia,
} from './safety-page.mock.js';

/**
 * IceTab — Safety page with ICE contacts tab active and pre-filled mock contacts.
 */
export const IceTab = () => {
  return (
    <MockProvider>
      <SafetyPage
        initialTab="ice"
        mockContacts={mockIceContacts}
      />
    </MockProvider>
  );
};

/**
 * NumbersTab — Safety page with emergency numbers tab active, Slovenian override.
 */
export const NumbersTab = () => {
  return (
    <MockProvider>
      <SafetyPage
        initialTab="numbers"
        mockEmergencyOverride={mockEmergencyOverrideSlovenia}
      />
    </MockProvider>
  );
};

/**
 * BordersTab — Safety page with border crossings tab active.
 */
export const BordersTab = () => {
  return (
    <MockProvider>
      <SafetyPage
        initialTab="borders"
      />
    </MockProvider>
  );
};

/**
 * ReportsTab — Safety page with hazard reports tab active.
 */
export const ReportsTab = () => {
  return (
    <MockProvider>
      <SafetyPage
        initialTab="reports"
        mockContacts={mockIceContacts}
        mockEmergencyOverride={mockEmergencyOverrideCroatia}
      />
    </MockProvider>
  );
};
