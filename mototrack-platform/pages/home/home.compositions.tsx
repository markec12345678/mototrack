import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Home } from './home.js';

/**
 * AnonymousLanding — marketing landing page shown to unauthenticated visitors.
 * Displays the hero, feature pills, and CTA buttons.
 */
export const AnonymousLanding = () => {
  return (
    <MockProvider>
      <Home signupPath="/signup" loginPath="/login" />
    </MockProvider>
  );
};

/**
 * CustomFeaturePills — landing page with a custom set of feature pills.
 */
export const CustomFeaturePills = () => {
  const pills = [
    { icon: `🏔️`, label: `Gorske poti` },
    { icon: `⚡`, label: `Hitro usmerjanje` },
    { icon: `🌦️`, label: `Vreme v živo` },
    { icon: `👥`, label: `Skupnost` },
    { icon: `🔒`, label: `Zasebnost` },
  ];

  return (
    <MockProvider>
      <Home featurePills={pills} signupPath="/signup" loginPath="/login" />
    </MockProvider>
  );
};
