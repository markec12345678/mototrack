import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { NotFound } from './not-found.js';

/**
 * Default — standard 404 page with Slovenian message and return-home button.
 */
export const DefaultNotFound = () => {
  return (
    <MockProvider>
      <NotFound />
    </MockProvider>
  );
};

/**
 * CustomMessage — 404 page with a custom title and subtitle.
 */
export const CustomMessage = () => {
  return (
    <MockProvider>
      <NotFound
        title="Ups, ta stran ne obstaja 🏁"
        subtitle="Proga, ki jo iščete, ni na voljo. Morda je bila premaknjena ali izbrisana."
        homeLabel="Na glavno stran"
        homePath="/"
      />
    </MockProvider>
  );
};

/**
 * MinimalNotFound — 404 page with short, minimal copy.
 */
export const MinimalNotFound = () => {
  return (
    <MockProvider>
      <NotFound
        title="Stran ni najdena 🏍️"
        subtitle="Ta URL ne obstaja."
        homeLabel="Domov"
      />
    </MockProvider>
  );
};
