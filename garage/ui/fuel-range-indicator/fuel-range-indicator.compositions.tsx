import { useState, useEffect, type ReactNode } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { FuelRangeIndicator } from './fuel-range-indicator.js';
import { mockFuelOk, mockFuelWarn, mockFuelEmpty } from './fuel-range-indicator.mock.js';

// ─── Shared map background ────────────────────────────────────────────────────

function MapBackground({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(249,115,22,0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 70%, rgba(59,130,246,0.05) 0%, transparent 50%),
          #020617
        `,
        overflow: 'hidden',
      }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 0 55% Q 35% 45%, 60% 50% T 100% 48%" stroke="#64748b" strokeWidth="6" fill="none" />
        <path d="M 0 55% Q 35% 45%, 60% 50% T 100% 48%" stroke="#f97316" strokeWidth="2" fill="none" strokeDasharray="12 8" />
        <path d="M 20% 0 Q 30% 30%, 40% 55%" stroke="#64748b" strokeWidth="4" fill="none" />
        <path d="M 65% 100% Q 70% 70%, 80% 55%" stroke="#64748b" strokeWidth="4" fill="none" />
      </svg>

      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          backgroundColor: 'rgba(15,23,42,0.85)',
          borderRadius: 9999,
          border: '1px solid rgba(148,163,184,0.15)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            boxShadow: '0 0 6px rgba(34,197,94,0.8)',
          }}
        />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em' }}>
          LIVE RIDE
        </span>
      </div>

      {children}
    </div>
  );
}

// ─── Composition 1 — Full tank (ok) ──────────────────────────────────────────

/**
 * Compact pill in the bottom-right corner — full tank, green state.
 * Click the pill to expand the fuel gauge panel.
 */
export const FullTankOverlay = () => {
  return (
    <MockProvider>
      <MapBackground>
        <FuelRangeIndicator mockData={mockFuelOk} />
      </MapBackground>
    </MockProvider>
  );
};

// ─── Composition 2 — Low fuel warning ────────────────────────────────────────

/**
 * Low fuel state (warn) — pill shows amber percent, panel shows warning banner.
 */
export const LowFuelWarning = () => {
  return (
    <MockProvider>
      <MapBackground>
        <FuelRangeIndicator
          mockData={mockFuelWarn}
          onFindStation={() => {
            // eslint-disable-next-line no-console
            console.log('Navigating to nearest station…');
          }}
        />
      </MapBackground>
    </MockProvider>
  );
};

// ─── Composition 3 — Critical / empty + animated drain ───────────────────────

/**
 * Critical fuel state — pulsing red pill, urgent warning banner, animated drain simulation.
 */
export const CriticalFuelDrain = () => {
  const [liters, setLiters] = useState(1.8);
  const tankL = 18;
  const consumptionLPer100 = 5.8;

  useEffect(() => {
    const interval = setInterval(() => {
      setLiters((prev) => {
        if (prev <= 0.1) return 1.8;
        return Math.max(0, prev - 0.04);
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const rangeKm = Math.round((liters / consumptionLPer100) * 100);
  const percent = Math.round((liters / tankL) * 100);

  return (
    <MockProvider>
      <MapBackground>
        <FuelRangeIndicator
          mockData={{
            tankL,
            currentFuelL: Number(liters.toFixed(2)),
            consumptionLPer100,
            rangeKm,
            percent,
            status: 'empty',
            refuelThresholdKm: 50,
          }}
          onFindStation={() => {
            // eslint-disable-next-line no-console
            console.log('SOS: finding nearest fuel station…');
          }}
        />
      </MapBackground>
    </MockProvider>
  );
};

// ─── Composition 4 — All three states side by side ───────────────────────────

/**
 * Three pills rendered simultaneously to compare all fuel states.
 */
export const AllStatesPreview = () => {
  const states = [
    { data: mockFuelOk, label: 'Ok — 75%' },
    { data: mockFuelWarn, label: 'Warn — 30%' },
    { data: mockFuelEmpty, label: 'Empty — 10%' },
  ];

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
          gap: 40,
          padding: 40,
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
              textAlign: 'center',
            }}
          >
            Map Overlay
          </p>
          <h2
            style={{
              margin: '0 0 32px',
              fontSize: 22,
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
              textAlign: 'center',
            }}
          >
            Fuel Range Indicator — All States
          </h2>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            width: '100%',
            maxWidth: 400,
          }}
        >
          {states.map(({ data, label }) => (
            <div key={label}>
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#64748b',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </p>
              <div
                style={{
                  position: 'relative',
                  height: 64,
                  backgroundColor: '#0f172a',
                  borderRadius: 16,
                  border: '1px solid rgba(148,163,184,0.12)',
                  overflow: 'hidden',
                }}
              >
                <FuelRangeIndicator
                  mockData={data}
                  style={{ position: 'absolute', bottom: 12, right: 12 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};
