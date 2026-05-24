import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RoadCard } from './road-card.js';
import { mockRoads, mockVrsicPass, mockTransfagarasan, mockAdriaticCoast } from './road-card.mock.js';

/**
 * Default — a single RoadCard with default props.
 */
export const Default = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 32px',
        }}
      >
        <RoadCard {...mockVrsicPass} />
      </div>
    </MockProvider>
  );
};

/**
 * AllDifficulties — showcases all difficulty variants side by side.
 */
export const AllDifficulties = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '48px 32px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
            }}
          >
            Road Card
          </p>
          <h1
            style={{
              margin: '0 0 32px',
              fontSize: '28px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            All Difficulty Levels
          </h1>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            <RoadCard
              id="easy-road"
              name="Adriatic Coastal Road"
              country="HR"
              type="Coastal"
              lengthKm={178.5}
              rating={8.7}
              difficulty="Easy"
            />
            <RoadCard
              id="moderate-road"
              name="Soča Valley Route"
              country="SI"
              type="Forest"
              lengthKm={48.2}
              rating={8.5}
              difficulty="Moderate"
            />
            <RoadCard
              id="hard-road"
              name="Vršič Pass"
              country="SI"
              type="Pass"
              lengthKm={25.4}
              rating={9.2}
              difficulty="Hard"
            />
            <RoadCard
              id="expert-road"
              name="Transfăgărășan"
              country="RO"
              type="Pass"
              lengthKm={90.0}
              rating={9.8}
              difficulty="Expert"
            />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * CountryBrowser — a realistic grid of roads as used in a country browser or search results.
 */
export const CountryBrowser = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '48px 32px',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#f97316',
                }}
              >
                Balkan Roads
              </p>
              <h2
                style={{
                  margin: 0,
                  fontSize: '26px',
                  fontWeight: 800,
                  color: '#f1f5f9',
                  letterSpacing: '-0.03em',
                }}
              >
                Top Rated Roads
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>
                {mockRoads.length} roads across 6 countries
              </p>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'rgba(249,115,22,0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(249,115,22,0.25)',
              }}
            >
              <span style={{ fontSize: '13px', color: '#f97316', fontWeight: 600 }}>🏍️ Explore All</span>
            </div>
          </div>

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            {mockRoads.map((road) => (
              <RoadCard
                key={road.id}
                {...road}
                onClick={(id) => {
                  // eslint-disable-next-line no-console
                  console.log(`Navigating to road: ${id}`);
                }}
              />
            ))}
          </div>

          {/* Featured highlight */}
          <div
            style={{
              marginTop: '40px',
              padding: '24px',
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            <p
              style={{
                margin: '0 0 16px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#f97316',
              }}
            >
              Editor&apos;s Pick
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <RoadCard {...mockTransfagarasan} onClick={(id) => console.log(id)} />
              <RoadCard {...mockAdriaticCoast} onClick={(id) => console.log(id)} />
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
