import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { WeatherPanel } from './weather-panel.js';
import {
  mockClearSnapshot,
  mockRainSnapshot,
  mockSnowSnapshot,
  mockThunderSnapshot,
  mockSunnySnapshot,
} from './weather-panel.mock.js';

const panelWrapStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.06) 0%, transparent 60%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '24px',
  width: '100%',
  maxWidth: '900px',
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: '0 0 24px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: '#f97316',
      }}
    >
      {children}
    </p>
  );
}

/**
 * Compact variant — default floating panel showing temperature, feels like, and wind.
 */
export const CompactVariant = () => {
  return (
    <MockProvider>
      <div style={panelWrapStyle}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '32px', alignItems: 'center' }}>
          <SectionLabel>Compact Variant — All Conditions</SectionLabel>
          <div style={gridStyle}>
            <WeatherPanel variant="compact" snapshot={mockSunnySnapshot} />
            <WeatherPanel variant="compact" snapshot={mockClearSnapshot} />
            <WeatherPanel variant="compact" snapshot={mockRainSnapshot} />
            <WeatherPanel variant="compact" snapshot={mockSnowSnapshot} />
            <WeatherPanel variant="compact" snapshot={mockThunderSnapshot} />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Expanded variant — full panel with visibility, humidity, and gusts.
 */
export const ExpandedVariant = () => {
  return (
    <MockProvider>
      <div style={panelWrapStyle}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '32px', alignItems: 'center' }}>
          <SectionLabel>Expanded Variant — Full Weather Details</SectionLabel>
          <div style={gridStyle}>
            <WeatherPanel variant="expanded" snapshot={mockSunnySnapshot} />
            <WeatherPanel variant="expanded" snapshot={mockRainSnapshot} />
            <WeatherPanel variant="expanded" snapshot={mockThunderSnapshot} />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Track Page Context — realistic floating panel overlaid on a map/track background.
 */
export const TrackPageContext = () => {
  const [activeSnapshot, setActiveSnapshot] = useState(mockClearSnapshot);

  const conditions = [
    { label: `Clear`, snapshot: mockClearSnapshot },
    { label: `Rain`, snapshot: mockRainSnapshot },
    { label: `Snow`, snapshot: mockSnowSnapshot },
    { label: `Storm`, snapshot: mockThunderSnapshot },
    { label: `Sunny`, snapshot: mockSunnySnapshot },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          backgroundImage: `
            radial-gradient(ellipse at 60% 30%, rgba(249,115,22,0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.04) 0%, transparent 50%)
          `,
          position: 'relative' as const,
          overflow: 'hidden',
        }}
      >
        {/* Simulated track map background */}
        <div
          style={{
            position: 'absolute' as const,
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.06,
          }}
        >
          <svg width="600" height="400" viewBox="0 0 600 400" fill="none">
            <ellipse cx="300" cy="200" rx="240" ry="140" stroke="#f97316" strokeWidth="24" fill="none" />
            <ellipse cx="300" cy="200" rx="180" ry="90" stroke="#f97316" strokeWidth="8" fill="none" />
            <line x1="60" y1="200" x2="540" y2="200" stroke="#f97316" strokeWidth="2" strokeDasharray="12 8" />
          </svg>
        </div>

        {/* Floating panel — top-right corner like on a real track page */}
        <div
          style={{
            position: 'absolute' as const,
            top: '24px',
            right: '24px',
          }}
        >
          <WeatherPanel variant="compact" snapshot={activeSnapshot} />
        </div>

        {/* Condition switcher */}
        <div
          style={{
            position: 'absolute' as const,
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap' as const,
            justifyContent: 'center',
          }}
        >
          {conditions.map(({ label, snapshot }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveSnapshot(snapshot)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: `1px solid ${activeSnapshot === snapshot ? 'rgba(249,115,22,0.6)' : 'rgba(148,163,184,0.2)'}`,
                backgroundColor: activeSnapshot === snapshot ? 'rgba(249,115,22,0.15)' : 'rgba(15,23,42,0.8)',
                color: activeSnapshot === snapshot ? '#f97316' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              {snapshot.icon} {label}
            </button>
          ))}
        </div>

        {/* Center label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <div style={{ textAlign: 'center' as const }}>
            <p
              style={{
                margin: '0 0 8px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: '#f97316',
              }}
            >
              Track Page Preview
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 800,
                color: '#f1f5f9',
                letterSpacing: '-0.02em',
              }}
            >
              Circuit de Catalunya
            </p>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#64748b' }}>
              Switch conditions using the buttons below
            </p>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
