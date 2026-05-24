import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { BottomNav } from './bottom-nav.js';
import { mockNavigationItems, mockMinimalNavItems, mockNavigationItemsWithNonPrimary } from './bottom-nav.mock.js';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: '32px 24px',
  paddingBottom: '96px',
};

const headingStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '16px',
  marginTop: 0,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '12px',
  padding: '20px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
  marginBottom: '16px',
};

const statRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px',
  marginBottom: '16px',
};

const statCardStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '10px',
  padding: '16px 12px',
  border: '1px solid rgba(148,163,184,0.12)',
  textAlign: 'center' as const,
};

/**
 * Default — full five-tab bottom nav with Home active.
 * Simulates the dashboard route.
 */
export const Default = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={contentStyle}>
          <p style={headingStyle}>Dashboard</p>

          <div style={statRowStyle}>
            {[
              { label: `Total Rides`, value: `142` },
              { label: `Distance`, value: `8,430 km` },
              { label: `Level`, value: `8` },
            ].map(({ label, value }) => (
              <div key={label} style={statCardStyle}>
                <div style={{ fontSize: `22px`, fontWeight: 800, color: `#f1f5f9`, marginBottom: `4px` }}>
                  {value}
                </div>
                <div style={{ fontSize: `10px`, color: `#64748b`, fontWeight: 600, letterSpacing: `0.08em`, textTransform: `uppercase` }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: `13px`, fontWeight: 700, color: `#f1f5f9`, marginBottom: `8px` }}>
              Recent Activity
            </div>
            {[
              { name: `Vršič Pass`, km: `87 km`, time: `2h 14m` },
              { name: `Soča Valley Loop`, km: `124 km`, time: `3h 02m` },
              { name: `Mangart Saddle`, km: `56 km`, time: `1h 38m` },
            ].map((ride) => (
              <div
                key={ride.name}
                style={{
                  display: `flex`,
                  justifyContent: `space-between`,
                  alignItems: `center`,
                  padding: `10px 0`,
                  borderBottom: `1px solid rgba(148,163,184,0.08)`,
                }}
              >
                <div>
                  <div style={{ fontSize: `13px`, color: `#f1f5f9`, fontWeight: 600 }}>{ride.name}</div>
                  <div style={{ fontSize: `11px`, color: `#64748b`, marginTop: `2px` }}>{ride.time}</div>
                </div>
                <div style={{ fontSize: `13px`, color: `#f97316`, fontWeight: 700 }}>{ride.km}</div>
              </div>
            ))}
          </div>
        </div>

        <BottomNav navigationItems={mockNavigationItems} />
      </div>
    </MockProvider>
  );
};

/**
 * ActiveMapTab — bottom nav with the Map tab active.
 * Uses MemoryRouter initialEntries to set the current path.
 */
export const ActiveMapTab = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={contentStyle}>
          <p style={headingStyle}>Map View</p>
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `16px`,
              height: `320px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `center`,
              flexDirection: `column` as const,
              gap: `12px`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3L15 5.5L21 3V17L15 19.5L9 17L3 19.5V5.5L9 3Z" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 3V17M15 5.5V19.5" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: `14px`, color: `#64748b` }}>Interactive map loads here</span>
          </div>
        </div>

        <BottomNav
          navigationItems={mockNavigationItems.map((item) => ({
            ...item,
          }))}
        />
      </div>
    </MockProvider>
  );
};

/**
 * MinimalTabs — three-tab variant for a simplified navigation setup.
 * Non-primary items are filtered out automatically.
 */
export const MinimalTabs = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={contentStyle}>
          <p style={headingStyle}>Minimal Navigation</p>
          <div style={cardStyle}>
            <div style={{ fontSize: `13px`, color: `#94a3b8`, lineHeight: 1.6 }}>
              This composition demonstrates the bottom nav with only three primary tabs.
              Non-primary items are automatically excluded from the rendered tab bar.
            </div>
          </div>

          <div style={{ display: `flex`, flexDirection: `column` as const, gap: `10px` }}>
            {mockNavigationItemsWithNonPrimary.map((item) => (
              <div
                key={item.key}
                style={{
                  display: `flex`,
                  alignItems: `center`,
                  justifyContent: `space-between`,
                  padding: `12px 16px`,
                  backgroundColor: `#0f172a`,
                  borderRadius: `8px`,
                  border: `1px solid rgba(148,163,184,0.12)`,
                }}
              >
                <span style={{ fontSize: `13px`, color: `#f1f5f9`, fontWeight: 600 }}>{item.label}</span>
                <span
                  style={{
                    fontSize: `10px`,
                    fontWeight: 700,
                    letterSpacing: `0.08em`,
                    padding: `3px 8px`,
                    borderRadius: `9999px`,
                    backgroundColor: item.primary ? `rgba(249,115,22,0.15)` : `rgba(100,116,139,0.15)`,
                    color: item.primary ? `#f97316` : `#64748b`,
                    border: `1px solid ${item.primary ? `rgba(249,115,22,0.3)` : `rgba(100,116,139,0.2)`}`,
                  }}
                >
                  {item.primary ? `PRIMARY` : `HIDDEN`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <BottomNav navigationItems={mockMinimalNavItems} />
      </div>
    </MockProvider>
  );
};
