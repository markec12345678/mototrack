import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { GaragePage } from './garage-page.js';
import { mockGarageBikes, mockKtmBike } from './garage-page.mock.js';

/**
 * MotorjiTab — garage page opened on the Motorji tab with multiple bikes loaded.
 */
export const MotorjiTab = () => {
  return (
    <MockProvider>
      <GaragePage initialTab="motorji" bikes={mockGarageBikes} />
    </MockProvider>
  );
};

/**
 * VzdrzevanjeTab — garage page opened on the Vzdrževanje tab.
 * Shows per-bike maintenance accordion sections.
 */
export const VzdrzevanjeTab = () => {
  return (
    <MockProvider>
      <GaragePage initialTab="vzdrzevanje" bikes={mockGarageBikes} />
    </MockProvider>
  );
};

/**
 * StroskiTab — garage page opened on the Stroški tab.
 * Shows the expense summary with add-expense form.
 */
export const StroskiTab = () => {
  return (
    <MockProvider>
      <GaragePage initialTab="stroski" bikes={mockGarageBikes} />
    </MockProvider>
  );
};

/**
 * EmptyGarage — garage page with no bikes, showing the empty state prompt.
 */
export const EmptyGarage = () => {
  return (
    <MockProvider>
      <GaragePage initialTab="motorji" bikes={[]} />
    </MockProvider>
  );
};

/**
 * SingleBike — garage page with a single primary bike.
 */
export const SingleBike = () => {
  return (
    <MockProvider>
      <GaragePage initialTab="motorji" bikes={[mockKtmBike]} />
    </MockProvider>
  );
};
