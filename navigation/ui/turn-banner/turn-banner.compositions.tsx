import React, { useState, useEffect } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TurnBanner } from './turn-banner.js';
import {
  mockTurnRight,
  mockTurnLeft,
  mockUturn,
  mockContinue,
  mockSharpRight,
  mockImminentTurn,
} from './turn-banner.mock.js';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '40px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const sectionLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  margin: '0 0 12px',
};

const maxWidth: React.CSSProperties = {
  maxWidth: '480px',
};

/**
 * All Modifiers — shows every turn type side by side.
 */
export const AllModifiers = () => {
  const instructions = [
    { instruction: mockTurnRight, streetName: `Dunajska cesta`, label: `Turn Right` },
    { instruction: mockTurnLeft, streetName: `Tržaška cesta`, label: `Turn Left` },
    { instruction: mockSharpRight, streetName: `Gorenjska cesta`, label: `Sharp Right` },
    { instruction: mockContinue, streetName: `Avtocesta A1`, label: `Continue Straight` },
    { instruction: mockUturn, streetName: `Celovška ulica`, label: `U-Turn` },
  ];

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div>
          <p style={sectionLabel}>All Turn Modifiers</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '520px' }}>
            {instructions.map(({ instruction, streetName, label }) => (
              <div key={label}>
                <p style={{ ...sectionLabel, color: '#64748b', marginBottom: '6px' }}>{label}</p>
                <TurnBanner
                  instruction={instruction}
                  streetName={streetName}
                  voiceEnabled
                  btConnected={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * With BT Helmet — shows the helmet badge and voice toggle in action.
 */
export const WithBtHelmet = () => {
  const [voice, setVoice] = useState(true);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={maxWidth}>
          <p style={sectionLabel}>BT Helmet Connected + Voice Toggle</p>
          <TurnBanner
            instruction={mockTurnRight}
            streetName="Dunajska cesta"
            voiceEnabled={voice}
            onVoiceToggle={(enabled) => setVoice(enabled)}
            btConnected
            btDeviceName="Sena 50S"
          />
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: '#0f172a',
              borderRadius: '10px',
              border: '1px solid rgba(148,163,184,0.12)',
              fontSize: '13px',
              color: '#94a3b8',
            }}
          >
            Voice guidance:{' '}
            <strong style={{ color: voice ? '#34d399' : '#ef4444' }}>
              {voice ? `ON` : `OFF`}
            </strong>
            {` `}· BT Device:{' '}
            <strong style={{ color: '#f97316' }}>Sena 50S</strong>
          </div>
        </div>

        <div style={maxWidth}>
          <p style={sectionLabel}>No BT — Voice Only</p>
          <TurnBanner
            instruction={mockTurnLeft}
            streetName="Tržaška cesta"
            voiceEnabled
            btConnected={false}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Imminent Turn — simulates a live countdown approaching the turn.
 */
export const ImminentTurnLive = () => {
  const [distance, setDistance] = useState(900);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance((d) => {
        if (d <= 10) return 900;
        return Math.max(10, d - 15);
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const instruction = {
    ...mockTurnRight,
    distanceM: distance,
  };

  const isImminent = distance <= 300;

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={maxWidth}>
          <p style={sectionLabel}>Live Distance Countdown</p>
          <TurnBanner
            instruction={instruction}
            streetName="Dunajska cesta"
            voiceEnabled
            btConnected
            btDeviceName="Cardo Packtalk"
          />
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: '#0f172a',
              borderRadius: '10px',
              border: `1px solid ${isImminent ? 'rgba(52,211,153,0.3)' : 'rgba(148,163,184,0.12)'}`,
              fontSize: '13px',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isImminent ? '#34d399' : '#64748b',
                boxShadow: isImminent ? '0 0 8px rgba(52,211,153,0.8)' : 'none',
                flexShrink: 0,
              }}
            />
            Distance:{' '}
            <strong style={{ color: isImminent ? '#34d399' : '#f1f5f9', fontVariantNumeric: 'tabular-nums' }}>
              {distance} m
            </strong>
            {isImminent && (
              <span style={{ color: '#34d399', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em' }}>
                IMMINENT
              </span>
            )}
          </div>
        </div>

        <div style={maxWidth}>
          <p style={sectionLabel}>U-Turn — Imminent</p>
          <TurnBanner
            instruction={mockImminentTurn}
            streetName="Celovška ulica"
            voiceEnabled={false}
            btConnected={false}
          />
        </div>
      </div>
    </MockProvider>
  );
};
