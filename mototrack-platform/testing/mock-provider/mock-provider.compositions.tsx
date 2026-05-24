import React, { useState } from 'react';
import { MockProvider } from './mock-provider.js';
import { useIsMock } from './use-is-mock.js';

// ─── Demo components used inside compositions ─────────────────────────────────

function MockStatusBadge() {
  const isMock = useIsMock();
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '9999px',
        backgroundColor: isMock ? 'rgba(249,115,22,0.15)' : 'rgba(100,116,139,0.15)',
        border: `1px solid ${isMock ? 'rgba(249,115,22,0.4)' : 'rgba(100,116,139,0.3)'}`,
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isMock ? '#f97316' : '#64748b',
          boxShadow: isMock ? '0 0 6px rgba(249,115,22,0.8)' : 'none',
        }}
      />
      <span
        style={{
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.08em',
          color: isMock ? '#f97316' : '#64748b',
        }}
      >
        {isMock ? 'MOCK MODE ACTIVE' : 'LIVE MODE'}
      </span>
    </div>
  );
}

function RiderCard({
  name,
  country,
  position,
  lapTime,
}: {
  name: string;
  country: string;
  position: number;
  lapTime: string;
}) {
  const positionColors: Record<number, string> = {
    1: '#f59e0b',
    2: '#94a3b8',
    3: '#b45309',
  };
  const posColor = positionColors[position] ?? '#64748b';

  return (
    <div
      style={{
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        padding: '16px 20px',
        border: '1px solid rgba(148,163,184,0.12)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: posColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '14px',
          color: '#020617',
          flexShrink: 0,
        }}
      >
        {position}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>{name}</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{country}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#f97316', fontFamily: 'monospace' }}>
          {lapTime}
        </div>
        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Best Lap</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div
      style={{
        backgroundColor: '#0f172a',
        borderRadius: '10px',
        padding: '16px',
        border: '1px solid rgba(148,163,184,0.12)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontSize: '26px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.03em' }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{unit}</span>
        )}
      </div>
    </div>
  );
}

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * Basic — minimal usage of MockProvider with mock context detection.
 */
export const BasicMockProvider = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ marginBottom: '24px' }}>
            <MockStatusBadge />
          </div>
          <h1
            style={{
              margin: '0 0 12px',
              fontSize: '28px',
              fontWeight: '800',
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            MockProvider Ready
          </h1>
          <p style={{ margin: '0', fontSize: '15px', color: '#94a3b8', lineHeight: '1.6' }}>
            This component is wrapped by{' '}
            <span style={{ color: '#f97316', fontWeight: '600' }}>MototrackTheme</span>,{' '}
            <span style={{ color: '#f97316', fontWeight: '600' }}>MemoryRouter</span>, and{' '}
            <span style={{ color: '#f97316', fontWeight: '600' }}>Apollo MockedProvider</span>.
            All compositions across scopes use this provider.
          </p>
          <div
            style={{
              marginTop: '32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}
          >
            {[
              { label: 'Theme', icon: '🏍️', desc: 'MototrackTheme' },
              { label: 'Router', icon: '🗺️', desc: 'MemoryRouter' },
              { label: 'Apollo', icon: '🚀', desc: 'MockedProvider' },
            ].map(({ label, icon, desc }) => (
              <div
                key={label}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '10px',
                  padding: '16px 12px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#f1f5f9', marginBottom: '4px' }}>
                  {label}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * WithRaceData — MockProvider wrapping a realistic MotoTrack race leaderboard.
 */
export const WithRaceData = () => {
  const riders = [
    { name: 'Marco Bianchi', country: '🇮🇹 Italy', position: 1, lapTime: '1:23.456' },
    { name: 'Luka Horvat', country: '🇸🇮 Slovenia', position: 2, lapTime: '1:23.891' },
    { name: 'Carlos Ruiz', country: '🇪🇸 Spain', position: 3, lapTime: '1:24.102' },
    { name: 'Jan Novák', country: '🇨🇿 Czechia', position: 4, lapTime: '1:24.567' },
    { name: 'Tomáš Kováč', country: '🇸🇰 Slovakia', position: 5, lapTime: '1:25.013' },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '32px',
        }}
      >
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#f97316',
                }}
              >
                Live Race
              </p>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                Race Leaderboard
              </h2>
            </div>
            <MockStatusBadge />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <StatCard label="Lap" value="14" unit="/ 20" />
            <StatCard label="Top Speed" value="312" unit="km/h" />
            <StatCard label="Gap P1" value="+0.435" unit="s" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {riders.map((rider) => (
              <RiderCard key={rider.name} {...rider} />
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * NoRouterNoTheme — MockProvider with both router and theme disabled.
 */
export const NoRouterNoTheme = () => {
  const [count, setCount] = useState(0);

  return (
    <MockProvider noRouter noTheme>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <MockStatusBadge />
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '16px 0 24px' }}>
            Running without <strong style={{ color: '#f1f5f9' }}>MemoryRouter</strong> or{' '}
            <strong style={{ color: '#f1f5f9' }}>MototrackTheme</strong>. Apollo MockedProvider is still active.
          </p>
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              padding: '24px 32px',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              display: 'inline-block',
            }}
          >
            <div style={{ fontSize: '40px', fontWeight: '800', color: '#f97316', marginBottom: '12px' }}>
              {count}
            </div>
            <button
              type="button"
              onClick={() => setCount((c) => c + 1)}
              style={{
                padding: '8px 20px',
                backgroundColor: '#f97316',
                color: '#020617',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Increment
            </button>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
