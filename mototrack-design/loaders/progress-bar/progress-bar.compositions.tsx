import React, { useEffect, useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ProgressBar } from './progress-bar.js';

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
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
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

// ─── Composition 1 — All Variants ────────────────────────────────────────────

/**
 * All color variants at various progress levels with labels and percentages.
 */
export const AllVariants = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '40px 32px',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: '24px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            Progress Bar
          </h2>
          <p style={{ margin: '0 0 40px', fontSize: '14px', color: '#64748b' }}>
            Horizontal progress bars with color variants, labels, and percentage display.
          </p>

          <Section title="Accent — Default">
            <ProgressBar value={72} variant="accent" label="Race Completion" showPercentage height={10} />
            <ProgressBar value={45} variant="accent" label="Qualifying Lap" showPercentage height={8} />
            <ProgressBar value={20} variant="accent" label="Warm-up" showPercentage height={6} />
          </Section>

          <Divider />

          <Section title="Success">
            <ProgressBar value={95} variant="success" label="Engine Health" showPercentage height={10} />
            <ProgressBar value={60} variant="success" label="Tyre Grip" showPercentage height={8} />
          </Section>

          <Divider />

          <Section title="Warning">
            <ProgressBar value={38} variant="warning" label="Fuel Level" showPercentage height={10} />
            <ProgressBar value={55} variant="warning" label="Brake Temp" showPercentage height={8} />
          </Section>

          <Divider />

          <Section title="Danger">
            <ProgressBar value={12} variant="danger" label="Tyre Life Remaining" showPercentage height={10} />
            <ProgressBar value={5} variant="danger" label="Oil Pressure" showPercentage height={8} />
          </Section>

          <Divider />

          <Section title="No Label / No Percentage">
            <ProgressBar value={65} variant="accent" height={6} />
            <ProgressBar value={40} variant="success" height={4} />
            <ProgressBar value={80} variant="warning" height={8} />
            <ProgressBar value={25} variant="danger" height={12} />
          </Section>
        </div>
      </div>
    </MockProvider>
  );
};

// ─── Composition 2 — Indeterminate / Animated Stripes ────────────────────────

/**
 * Indeterminate mode with animated diagonal stripes across all variants.
 */
export const IndeterminateMode = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '40px 32px',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2
            style={{
              margin: '0 0 8px',
              fontSize: '24px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            Indeterminate Mode
          </h2>
          <p style={{ margin: '0 0 40px', fontSize: '14px', color: '#64748b' }}>
            When no value is provided the bar renders animated diagonal stripes to signal an
            in-progress operation of unknown duration.
          </p>

          <Section title="Animated Stripes — All Variants">
            <ProgressBar variant="accent" label="Connecting to telemetry…" height={10} />
            <ProgressBar variant="success" label="Syncing race data…" height={10} />
            <ProgressBar variant="warning" label="Calibrating sensors…" height={10} />
            <ProgressBar variant="danger" label="Critical system check…" height={10} />
          </Section>

          <Divider />

          <Section title="Thin Indeterminate Bars">
            <ProgressBar variant="accent" height={4} />
            <ProgressBar variant="success" height={4} />
            <ProgressBar variant="warning" height={4} />
            <ProgressBar variant="danger" height={4} />
          </Section>
        </div>
      </div>
    </MockProvider>
  );
};

// ─── Composition 3 — Live Race Dashboard ─────────────────────────────────────

/**
 * Realistic MotoTrack race dashboard with animated progress bars.
 */
export const LiveRaceDashboard = () => {
  const [fuel, setFuel] = useState(88);
  const [tyreLife, setTyreLife] = useState(74);
  const [engineTemp, setEngineTemp] = useState(42);
  const [lapProgress, setLapProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setLapProgress((p) => {
        if (p >= 100) return 0;
        return p + 1.2;
      });
      setFuel((f) => Math.max(0, f - 0.15));
      setTyreLife((t) => Math.max(0, t - 0.08));
      setEngineTemp((t) => Math.min(100, t + 0.1));
    }, 120);
    return () => clearInterval(interval);
  }, [loading]);

  const stats = [
    {
      label: 'Lap Progress',
      value: Math.min(100, lapProgress),
      variant: 'accent' as const,
      unit: 'lap',
    },
    {
      label: 'Fuel Level',
      value: fuel,
      variant: (fuel < 20 ? 'danger' : fuel < 40 ? 'warning' : 'success') as 'danger' | 'warning' | 'success',
      unit: '%',
    },
    {
      label: 'Tyre Life',
      value: tyreLife,
      variant: (tyreLife < 20 ? 'danger' : tyreLife < 40 ? 'warning' : 'success') as 'danger' | 'warning' | 'success',
      unit: '%',
    },
    {
      label: 'Engine Temp',
      value: engineTemp,
      variant: (engineTemp > 80 ? 'danger' : engineTemp > 60 ? 'warning' : 'accent') as 'danger' | 'warning' | 'accent',
      unit: '°C',
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
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: loading ? '#64748b' : '#22c55e',
                boxShadow: loading ? 'none' : '0 0 8px rgba(34,197,94,0.8)',
                transition: 'all 0.4s ease',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: loading ? '#64748b' : '#22c55e',
                transition: 'color 0.4s ease',
              }}
            >
              {loading ? 'Connecting…' : 'Live Telemetry'}
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
            Race Dashboard
          </h2>
          <p style={{ margin: '0 0 32px', fontSize: '13px', color: '#64748b' }}>
            Rider #46 · MotoTrack Pro Series · Round 7
          </p>

          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              padding: '28px 24px',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column' as const,
              gap: '24px',
            }}
          >
            {loading ? (
              <>
                <ProgressBar variant="accent" label="Connecting to telemetry…" height={10} />
                <ProgressBar variant="success" label="Loading race data…" height={10} />
                <ProgressBar variant="warning" label="Initialising sensors…" height={10} />
                <ProgressBar variant="danger" label="Running diagnostics…" height={10} />
              </>
            ) : (
              stats.map((stat) => (
                <ProgressBar
                  key={stat.label}
                  value={Math.round(stat.value)}
                  variant={stat.variant}
                  label={stat.label}
                  showPercentage
                  height={10}
                />
              ))
            )}
          </div>

          <p
            style={{
              marginTop: '16px',
              fontSize: '11px',
              color: '#334155',
              textAlign: 'center' as const,
            }}
          >
            Values update in real-time · Bars animate on value change
          </p>
        </div>
      </div>
    </MockProvider>
  );
};
