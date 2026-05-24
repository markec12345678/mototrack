import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Gauge } from './gauge.js';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
  gap: '48px',
  boxSizing: 'border-box',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#f97316',
  marginBottom: '24px',
  textAlign: 'center',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '32px',
  alignItems: 'center',
  justifyContent: 'center',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '16px',
  padding: '28px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#94a3b8',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

/**
 * Dashboard — three gauges side by side simulating a live MotoTrack HUD.
 */
export const Dashboard = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div>
          <p style={sectionLabelStyle}>MotoTrack HUD — Live Gauges</p>
          <div style={rowStyle}>
            <div style={cardStyle}>
              <span style={cardTitleStyle}>Lean Angle</span>
              <Gauge
                value={38}
                min={0}
                max={60}
                label="Lean Angle"
                unit="°"
                size={200}
                zones={[
                  { from: 0, to: 20, color: 'green' },
                  { from: 20, to: 40, color: 'yellow' },
                  { from: 40, to: 60, color: 'red' },
                ]}
              />
            </div>

            <div style={cardStyle}>
              <span style={cardTitleStyle}>Elevation</span>
              <Gauge
                value={620}
                min={0}
                max={2000}
                label="Elevation"
                unit="m"
                size={200}
                zones={[
                  { from: 0, to: 500, color: 'green' },
                  { from: 500, to: 1200, color: 'yellow' },
                  { from: 1200, to: 2000, color: 'red' },
                ]}
              />
            </div>

            <div style={cardStyle}>
              <span style={cardTitleStyle}>Twistiness</span>
              <Gauge
                value={72}
                min={0}
                max={100}
                label="Twistiness"
                unit="%"
                size={200}
                zones={[
                  { from: 0, to: 33, color: 'green' },
                  { from: 33, to: 66, color: 'yellow' },
                  { from: 66, to: 100, color: 'red' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * SizeVariants — the same gauge rendered at small, medium, and large sizes.
 */
export const SizeVariants = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <p style={sectionLabelStyle}>Size Variants</p>
        <div style={rowStyle}>
          <div style={cardStyle}>
            <span style={cardTitleStyle}>Small (120px)</span>
            <Gauge
              value={55}
              min={0}
              max={100}
              label="Speed"
              unit="km/h"
              size={120}
            />
          </div>

          <div style={cardStyle}>
            <span style={cardTitleStyle}>Medium (200px)</span>
            <Gauge
              value={55}
              min={0}
              max={100}
              label="Speed"
              unit="km/h"
              size={200}
            />
          </div>

          <div style={cardStyle}>
            <span style={cardTitleStyle}>Large (280px)</span>
            <Gauge
              value={55}
              min={0}
              max={100}
              label="Speed"
              unit="km/h"
              size={280}
            />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * ZoneStates — gauges showing values in each color zone (green, yellow, red).
 */
export const ZoneStates = () => {
  const zones = [
    { from: 0, to: 33, color: 'green' as const },
    { from: 33, to: 66, color: 'yellow' as const },
    { from: 66, to: 100, color: 'red' as const },
  ];

  return (
    <MockProvider>
      <div style={pageStyle}>
        <p style={sectionLabelStyle}>Color Zone States</p>
        <div style={rowStyle}>
          <div style={cardStyle}>
            <span style={{ ...cardTitleStyle, color: '#22c55e' }}>Green Zone</span>
            <Gauge
              value={18}
              min={0}
              max={100}
              label="Risk Level"
              unit="%"
              size={200}
              zones={zones}
            />
          </div>

          <div style={cardStyle}>
            <span style={{ ...cardTitleStyle, color: '#eab308' }}>Yellow Zone</span>
            <Gauge
              value={50}
              min={0}
              max={100}
              label="Risk Level"
              unit="%"
              size={200}
              zones={zones}
            />
          </div>

          <div style={cardStyle}>
            <span style={{ ...cardTitleStyle, color: '#ef4444' }}>Red Zone</span>
            <Gauge
              value={88}
              min={0}
              max={100}
              label="Risk Level"
              unit="%"
              size={200}
              zones={zones}
            />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
