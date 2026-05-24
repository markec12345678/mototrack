import React, { useEffect, useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Speedometer } from './speedometer.js';

// ─── Shared layout helpers ────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 32px',
  gap: '48px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#64748b',
  marginBottom: '16px',
  textAlign: 'center',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '16px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 40px',
};

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * AllSizes — compact, normal, and driving-mode side by side at a safe speed.
 */
export const AllSizes = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {/* Compact */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={labelStyle}>Compact — 60px</p>
            <div style={cardStyle}>
              <Speedometer speed={87} size="compact" warningThreshold={120} />
            </div>
          </div>

          {/* Normal */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={labelStyle}>Normal — 120px</p>
            <div style={cardStyle}>
              <Speedometer speed={87} size="normal" warningThreshold={120} />
            </div>
          </div>

          {/* Driving mode */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={labelStyle}>Driving Mode — 240px</p>
            <div style={{ ...cardStyle, padding: '40px 56px' }}>
              <Speedometer speed={87} size="driving-mode" warningThreshold={120} />
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * ColorStates — green, amber, and red thresholds demonstrated.
 */
export const ColorStates = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Green — safe */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={labelStyle}>Safe — Green</p>
            <div style={cardStyle}>
              <Speedometer speed={95} size="normal" warningThreshold={120} />
            </div>
            <p style={{ ...labelStyle, marginTop: '12px', color: '#22c55e' }}>95 km/h</p>
          </div>

          {/* Amber — warning */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={labelStyle}>Warning — Amber</p>
            <div style={cardStyle}>
              <Speedometer speed={135} size="normal" warningThreshold={120} />
            </div>
            <p style={{ ...labelStyle, marginTop: '12px', color: '#eab308' }}>135 km/h</p>
          </div>

          {/* Red — danger */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={labelStyle}>Danger — Red</p>
            <div style={cardStyle}>
              <Speedometer speed={175} size="normal" warningThreshold={120} />
            </div>
            <p style={{ ...labelStyle, marginTop: '12px', color: '#ef4444' }}>175 km/h</p>
          </div>
        </div>

        {/* Threshold legend */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            border: '1px solid rgba(148,163,184,0.12)',
            padding: '16px 24px',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { label: 'Green', desc: '< 120 km/h', color: '#22c55e' },
            { label: 'Amber', desc: '≥ 120 km/h', color: '#eab308' },
            { label: 'Red', desc: '≥ 168 km/h (120 × 1.4)', color: '#ef4444' },
          ].map(({ label, desc, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  boxShadow: `0 0 6px ${color}`,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>{label}</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * LiveDrivingMode — animated speedometer simulating a real ride.
 */
export const LiveDrivingMode = () => {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    let current = 0;
    let direction = 1;
    const interval = setInterval(() => {
      current += direction * (Math.random() * 6 + 1);
      if (current >= 210) direction = -1;
      if (current <= 0) direction = 1;
      setSpeed(Math.max(0, Math.min(220, current)));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const colorState =
    speed >= 120 * 1.4 ? '#ef4444' : speed >= 120 ? '#eab308' : '#22c55e';

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          padding: '32px',
        }}
      >
        {/* HUD header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 16px',
            backgroundColor: 'rgba(249,115,22,0.12)',
            borderRadius: '9999px',
            border: '1px solid rgba(249,115,22,0.3)',
          }}
        >
          <div
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#f97316',
              boxShadow: '0 0 8px rgba(249,115,22,0.9)',
              animation: 'none',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#f97316',
              textTransform: 'uppercase',
            }}
          >
            Live HUD — Driving Mode
          </span>
        </div>

        {/* Main speedometer */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '24px',
            border: '1px solid rgba(148,163,184,0.1)',
            boxShadow: `0 0 60px ${colorState}22, 0 20px 60px rgba(0,0,0,0.85)`,
            padding: '48px 64px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'box-shadow 0.4s ease-in-out',
          }}
        >
          <Speedometer
            speed={speed}
            size="driving-mode"
            warningThreshold={120}
            showUnit
          />
        </div>

        {/* Speed bar */}
        <div
          style={{
            width: '320px',
            maxWidth: '100%',
            backgroundColor: '#0f172a',
            borderRadius: '8px',
            border: '1px solid rgba(148,163,184,0.12)',
            overflow: 'hidden',
            height: '6px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(speed / 220) * 100}%`,
              backgroundColor: colorState,
              boxShadow: `0 0 8px ${colorState}`,
              borderRadius: '8px',
              transition: 'width 0.12s ease-out, background-color 0.4s ease-in-out',
            }}
          />
        </div>

        <p
          style={{
            fontSize: '12px',
            color: '#64748b',
            margin: 0,
            letterSpacing: '0.06em',
          }}
        >
          Warning threshold: 120 km/h · Red zone: 168 km/h
        </p>
      </div>
    </MockProvider>
  );
};
