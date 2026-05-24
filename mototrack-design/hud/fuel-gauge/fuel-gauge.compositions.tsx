import React, { useEffect, useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { FuelGauge } from './fuel-gauge.js';

// ─── Shared layout helpers ────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <p
        style={{
          margin: '0 0 16px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: '#f97316',
        }}
      >
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: '1px',
        backgroundColor: 'rgba(148,163,184,0.12)',
        margin: '8px 0 40px',
      }}
    />
  );
}

// ─── Composition 1 — All Fuel States ─────────────────────────────────────────

/**
 * All three fuel states: full (green), low (yellow), and critical (red).
 */
export const AllFuelStates = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '40px 32px',
        }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: '24px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            Fuel Gauge
          </h2>
          <p style={{ margin: '0 0 40px', fontSize: '14px', color: '#64748b' }}>
            Color shifts green → yellow → red as fuel decreases.
          </p>

          <Section title="Full — Green (above 40%)">
            <FuelGauge
              currentLiters={16}
              tankCapacity={18}
              estimatedRange={246}
              barHeight={12}
            />
          </Section>

          <Divider />

          <Section title="Low — Yellow (20–40%)">
            <FuelGauge
              currentLiters={5.5}
              tankCapacity={18}
              estimatedRange={84}
              barHeight={12}
            />
          </Section>

          <Divider />

          <Section title="Critical — Red (below 20%)">
            <FuelGauge
              currentLiters={2.1}
              tankCapacity={18}
              estimatedRange={32}
              barHeight={12}
            />
          </Section>

          <Divider />

          <Section title="Empty">
            <FuelGauge
              currentLiters={0}
              tankCapacity={18}
              estimatedRange={0}
              barHeight={12}
            />
          </Section>
        </div>
      </div>
    </MockProvider>
  );
};

// ─── Composition 2 — Profile Card Usage ──────────────────────────────────────

/**
 * Fuel gauge as used in a rider profile card with compact layout.
 */
export const ProfileCardUsage = () => {
  const riders = [
    {
      name: `Marco Bianchi`,
      number: 46,
      currentLiters: 15.2,
      tankCapacity: 18,
      estimatedRange: 233,
    },
    {
      name: `Luka Horvat`,
      number: 7,
      currentLiters: 6.8,
      tankCapacity: 18,
      estimatedRange: 104,
    },
    {
      name: `Carlos Ruiz`,
      number: 99,
      currentLiters: 2.4,
      tankCapacity: 18,
      estimatedRange: 36,
    },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '40px 32px',
        }}
      >
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
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
            Profile Mode
          </p>
          <h2
            style={{
              margin: '0 0 32px',
              fontSize: '24px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            Rider Fuel Status
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
            {riders.map((rider) => (
              <div
                key={rider.number}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      color: '#020617',
                      flexShrink: 0,
                    }}
                  >
                    {rider.number}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>
                      {rider.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      Rider #{rider.number}
                    </div>
                  </div>
                </div>
                <FuelGauge
                  currentLiters={rider.currentLiters}
                  tankCapacity={rider.tankCapacity}
                  estimatedRange={rider.estimatedRange}
                  barHeight={8}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

// ─── Composition 3 — Live Driving Mode HUD ───────────────────────────────────

/**
 * Animated fuel gauge simulating real-time fuel consumption in driving mode.
 */
export const DrivingModeHUD = () => {
  const [liters, setLiters] = useState(17.5);
  const tankCapacity = 18;
  const consumptionRate = 6.5;

  useEffect(() => {
    const interval = setInterval(() => {
      setLiters((prev) => {
        if (prev <= 0) return 17.5;
        return Math.max(0, prev - 0.05);
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const range = Math.round((liters / consumptionRate) * 100);

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 32px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* HUD header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 8px rgba(34,197,94,0.8)',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: '#22c55e',
              }}
            >
              Live Telemetry
            </span>
          </div>

          <h2
            style={{
              margin: '0 0 4px',
              fontSize: '26px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            Driving Mode HUD
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: '13px', color: '#64748b' }}>
            Fuel drains in real-time · Watch the color shift as levels drop
          </p>

          {/* Speed card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            {[
              { label: `Speed`, value: `187`, unit: `km/h` },
              { label: `RPM`, value: `9,200`, unit: `rpm` },
              { label: `Gear`, value: `5`, unit: `` },
            ].map(({ label, value, unit }) => (
              <div
                key={label}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  padding: '14px 12px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  textAlign: 'center' as const,
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#64748b',
                    textTransform: 'uppercase' as const,
                    marginBottom: '6px',
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#f97316',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  {value}
                </div>
                {unit && (
                  <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                    {unit}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Animated fuel gauge */}
          <FuelGauge
            currentLiters={Number(liters.toFixed(2))}
            tankCapacity={tankCapacity}
            estimatedRange={range}
            barHeight={14}
          />

          <p
            style={{
              marginTop: '16px',
              fontSize: '11px',
              color: '#334155',
              textAlign: 'center' as const,
            }}
          >
            Fuel depletes automatically · Resets at 0 L
          </p>
        </div>
      </div>
    </MockProvider>
  );
};
