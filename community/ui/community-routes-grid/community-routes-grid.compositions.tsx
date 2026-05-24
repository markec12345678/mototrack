import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CommunityRoutesGrid } from './community-routes-grid.js';
import { mockCommunityRoutes } from './community-routes-grid.mock.js';
import type { CommunityRoute } from '@markec/community.entities.community-route';

/**
 * DefaultGrid — full grid with all mock routes, default filters and sorting.
 */
export const DefaultGrid = () => {
  return (
    <MockProvider>
      <CommunityRoutesGrid routes={mockCommunityRoutes} />
    </MockProvider>
  );
};

/**
 * WithLoadRouteCallback — demonstrates the 'Naloži v Načrtuj' action with a toast notification.
 */
export const WithLoadRouteCallback = () => {
  const [loaded, setLoaded] = useState<CommunityRoute | null>(null);

  return (
    <MockProvider>
      <div style={{ position: 'relative' }}>
        {loaded && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 1000,
              backgroundColor: '#0f172a',
              border: '1px solid rgba(249,115,22,0.4)',
              borderRadius: '12px',
              padding: '16px 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.8), 0 0 20px rgba(249,115,22,0.15)',
              maxWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#f97316',
              }}
            >
              ✓ Pot naložena v Načrtuj
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>
              {loaded.name}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {loaded.distanceKm.toFixed(0)} km · {loaded.author}
            </div>
          </div>
        )}
        <CommunityRoutesGrid
          routes={mockCommunityRoutes}
          onLoadRoute={(route) => setLoaded(route)}
        />
      </div>
    </MockProvider>
  );
};

/**
 * FilteredBySlovenia — grid pre-filtered to Slovenian routes only.
 */
export const FilteredBySlovenia = () => {
  const slovenianRoutes = mockCommunityRoutes.filter((r) => r.country === 'SI');

  return (
    <MockProvider>
      <CommunityRoutesGrid
        routes={slovenianRoutes}
        initialCountry="SI"
        initialSort="popularity"
      />
    </MockProvider>
  );
};
