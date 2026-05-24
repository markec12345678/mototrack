import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { CountryFlag } from './country-flag.js';
import { COUNTRY_MAP } from './country-flag.js';
import type { CountryCode } from './country-flag.js';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '40px 32px',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '20px',
  marginTop: '0',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'rgba(148,163,184,0.12)',
  margin: '36px 0',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '12px',
  padding: '20px 24px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
};

/**
 * All Balkan Countries — shows all 10 supported ISO codes at medium size.
 */
export const AllBalkanCountries = () => {
  const codes = Object.keys(COUNTRY_MAP) as CountryCode[];

  return (
    <MockProvider>
      <div style={containerStyle}>
        <p style={sectionLabelStyle}>All Balkan Countries — md size</p>
        <div style={cardStyle}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {codes.map((code) => (
              <div
                key={code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  border: '1px solid rgba(148,163,184,0.08)',
                }}
              >
                <CountryFlag code={code} size="md" />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#64748b',
                    fontFamily: 'monospace',
                    letterSpacing: '0.08em',
                  }}
                >
                  {code}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Size Variants — sm, md, lg side by side for the same country.
 */
export const SizeVariants = () => {
  const showcaseCodes: CountryCode[] = ['SI', 'HR', 'GR'];

  return (
    <MockProvider>
      <div style={containerStyle}>
        <p style={sectionLabelStyle}>Size Variants — sm / md / lg</p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '24px' }}>
          {showcaseCodes.map((code) => (
            <div key={code} style={cardStyle}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#64748b',
                  textTransform: 'uppercase' as const,
                  marginBottom: '16px',
                }}
              >
                {COUNTRY_MAP[code].name}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '32px',
                  flexWrap: 'wrap' as const,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', alignItems: 'flex-start' }}>
                  <CountryFlag code={code} size="sm" />
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>sm</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', alignItems: 'flex-start' }}>
                  <CountryFlag code={code} size="md" />
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>md</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', alignItems: 'flex-start' }}>
                  <CountryFlag code={code} size="lg" />
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>lg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Race Leaderboard — realistic HUD usage showing flags in a race results table.
 */
export const RaceLeaderboard = () => {
  const riders = [
    { position: 1, name: 'Luka Horvat', code: 'SI' as CountryCode, lapTime: '1:23.456', gap: '—' },
    { position: 2, name: 'Marko Petrović', code: 'RS' as CountryCode, lapTime: '1:23.891', gap: '+0.435' },
    { position: 3, name: 'Ivan Kovač', code: 'HR' as CountryCode, lapTime: '1:24.102', gap: '+0.646' },
    { position: 4, name: 'Nikola Dimitrov', code: 'MK' as CountryCode, lapTime: '1:24.567', gap: '+1.111' },
    { position: 5, name: 'Aris Papadopoulos', code: 'GR' as CountryCode, lapTime: '1:25.013', gap: '+1.557' },
    { position: 6, name: 'Bogdan Ionescu', code: 'RO' as CountryCode, lapTime: '1:25.340', gap: '+1.884' },
    { position: 7, name: 'Emir Begić', code: 'BA' as CountryCode, lapTime: '1:25.780', gap: '+2.324' },
    { position: 8, name: 'Arben Krasniqi', code: 'AL' as CountryCode, lapTime: '1:26.012', gap: '+2.556' },
    { position: 9, name: 'Stefan Georgiev', code: 'BG' as CountryCode, lapTime: '1:26.450', gap: '+2.994' },
    { position: 10, name: 'Dario Vuković', code: 'ME' as CountryCode, lapTime: '1:26.901', gap: '+3.445' },
  ];

  const positionColors: Record<number, string> = {
    1: '#f59e0b',
    2: '#94a3b8',
    3: '#b45309',
  };

  return (
    <MockProvider>
      <div style={containerStyle}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <div>
              <p style={{ ...sectionLabelStyle, marginBottom: '4px' }}>Live Race</p>
              <h2
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#f1f5f9',
                  letterSpacing: '-0.02em',
                }}
              >
                Balkan Grand Prix — Leaderboard
              </h2>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                backgroundColor: 'rgba(239,68,68,0.15)',
                borderRadius: '9999px',
                border: '1px solid rgba(239,68,68,0.35)',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 6px rgba(239,68,68,0.8)',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', letterSpacing: '0.08em' }}>
                LIVE
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {riders.map(({ position, name, code, lapTime, gap }) => {
              const posColor = positionColors[position] ?? '#475569';
              return (
                <div
                  key={position}
                  style={{
                    backgroundColor: '#0f172a',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    border: '1px solid rgba(148,163,184,0.10)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: posColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                      color: '#020617',
                      flexShrink: 0,
                    }}
                  >
                    {position}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
                      {name}
                    </div>
                    <CountryFlag code={code} size="sm" />
                  </div>

                  <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#f97316',
                        fontFamily: 'monospace',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {lapTime}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontFamily: 'monospace' }}>
                      {gap}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
