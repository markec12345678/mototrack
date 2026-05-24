import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CountryBrowser } from './country-browser.js';
import { mockCountryBrowserRoads } from './country-browser.mock.js';

const pageWrapper: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  padding: `48px 32px`,
};

const innerWrapper: React.CSSProperties = {
  maxWidth: `900px`,
  margin: `0 auto`,
};

/**
 * Default — full accordion with all Balkan countries, none expanded.
 */
export const Default = () => {
  return (
    <MockProvider>
      <div style={pageWrapper}>
        <div style={innerWrapper}>
          <CountryBrowser roads={mockCountryBrowserRoads} />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * WithDefaultOpen — two countries pre-expanded on mount.
 */
export const WithDefaultOpen = () => {
  return (
    <MockProvider>
      <div style={pageWrapper}>
        <div style={innerWrapper}>
          <CountryBrowser
            roads={mockCountryBrowserRoads}
            title="Top Balkan Roads"
            subtitle="Slovenia and Croatia are expanded by default. Click any header to toggle."
            defaultOpenCountries={[`SI`, `HR`]}
            onRoadClick={(id) => {
              // eslint-disable-next-line no-console
              console.log(`Road clicked: ${id}`);
            }}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * SingleCountry — only roads from Romania, accordion pre-expanded.
 */
export const SingleCountry = () => {
  const romaniaRoads = mockCountryBrowserRoads.filter((r) => r.country === `RO`);

  return (
    <MockProvider>
      <div style={pageWrapper}>
        <div style={innerWrapper}>
          <CountryBrowser
            roads={romaniaRoads}
            title="Romania — Mountain Passes"
            subtitle="The most legendary mountain roads in Eastern Europe."
            defaultOpenCountries={[`RO`]}
          />
        </div>
      </div>
    </MockProvider>
  );
};
