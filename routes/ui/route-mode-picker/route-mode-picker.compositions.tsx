import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RouteModePicker } from './route-mode-picker.js';
import type { RouteMode } from './route-mode-picker.js';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '48px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  alignItems: 'flex-start',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  margin: 0,
};

const descStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#64748b',
  margin: 0,
};

const badgeStyle = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 14px',
  borderRadius: '9999px',
  backgroundColor: `${color}1a`,
  border: `1px solid ${color}40`,
  fontSize: '13px',
  fontWeight: 600,
  color,
});

const modeColors: Record<RouteMode, string> = {
  asfalt: '#3b82f6',
  vijugasto: '#f97316',
  terensko: '#22c55e',
};

const modeLabels: Record<RouteMode, string> = {
  asfalt: '🛣️ Asfalt',
  vijugasto: '🌀 Vijugasto',
  terensko: '🏔️ Terensko',
};

/**
 * Interactive — full stateful demo with active mode badge.
 */
export const Interactive = () => {
  const [mode, setMode] = useState<RouteMode>(`asfalt`);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Route Mode Picker — Interactive</p>
          <p style={descStyle}>
            Select a route mode to see the active outline change colour.
          </p>
          <RouteModePicker activeMode={mode} onModeChange={(m) => setMode(m)} />
          <div>
            <span style={badgeStyle(modeColors[mode])}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: modeColors[mode],
                  boxShadow: `0 0 6px ${modeColors[mode]}cc`,
                  display: 'inline-block',
                }}
              />
              {modeLabels[mode]}
            </span>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * AllModes — shows each mode pre-selected side by side for visual reference.
 */
export const AllModes = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Asfalt — Active</p>
          <RouteModePicker activeMode="asfalt" />
        </div>

        <div style={sectionStyle}>
          <p style={labelStyle}>Vijugasto — Active</p>
          <RouteModePicker activeMode="vijugasto" />
        </div>

        <div style={sectionStyle}>
          <p style={labelStyle}>Terensko — Active</p>
          <RouteModePicker activeMode="terensko" />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * InContext — picker embedded in a realistic route-planning card.
 */
export const InContext = () => {
  const [mode, setMode] = useState<RouteMode>(`vijugasto`);

  const routeInfo: Record<RouteMode, { distance: string; duration: string; desc: string }> = {
    asfalt: {
      distance: `142 km`,
      duration: `1h 48min`,
      desc: `Fastest paved route via motorway and main roads.`,
    },
    vijugasto: {
      distance: `178 km`,
      duration: `2h 35min`,
      desc: `Twisty mountain passes and scenic switchbacks.`,
    },
    terensko: {
      distance: `95 km`,
      duration: `3h 10min`,
      desc: `Off-road gravel tracks through forest and hills.`,
    },
  };

  const info = routeInfo[mode];
  const color = modeColors[mode];

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(148,163,184,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            maxWidth: '480px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div>
            <p
              style={{
                margin: '0 0 4px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: '#f97316',
              }}
            >
              Plan Your Route
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 800,
                color: '#f1f5f9',
                letterSpacing: '-0.02em',
              }}
            >
              Ljubljana → Maribor
            </h2>
          </div>

          <div>
            <p
              style={{
                margin: '0 0 10px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
              }}
            >
              Route Type
            </p>
            <RouteModePicker activeMode={mode} onModeChange={(m) => setMode(m)} />
          </div>

          <div
            style={{
              borderRadius: '12px',
              padding: '16px 20px',
              backgroundColor: `${color}12`,
              border: `1px solid ${color}30`,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              transition: 'all 0.2s ease',
            }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
              {info.desc}
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                  Distance
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color, letterSpacing: '-0.02em' }}>
                  {info.distance}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                  Duration
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color, letterSpacing: '-0.02em' }}>
                  {info.duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
