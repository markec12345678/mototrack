import React, { useEffect, useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { GpsQualityIndicator } from './gps-quality-indicator.js';

// ─── Shared layout helpers ────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '40px 32px',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '20px',
  marginTop: '0',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '12px',
  padding: '24px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  flexWrap: 'wrap' as const,
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'rgba(148,163,184,0.1)',
  margin: '32px 0',
};

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * AllVariants — shows all four GPS quality states side by side.
 */
export const AllVariants = () => {
  const variants: Array<{ label: string; accuracy: number | null }> = [
    { label: 'Excellent ≤10 m', accuracy: 6 },
    { label: 'Good ≤25 m', accuracy: 18 },
    { label: 'Poor ≤50 m', accuracy: 42 },
    { label: 'Lost / No Fix', accuracy: null },
  ];

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={sectionTitleStyle}>GPS Quality Indicator — All Variants</p>

          <div style={cardStyle}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
              {variants.map(({ label, accuracy }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: '1px solid rgba(148,163,184,0.08)',
                  }}
                >
                  <GpsQualityIndicator accuracyMeters={accuracy} size={14} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      {accuracy != null ? `±${accuracy} m accuracy` : 'No GPS fix'}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#475569', fontFamily: 'monospace' }}>
                    {accuracy != null ? `${accuracy}m` : 'null'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={dividerStyle} />

          {/* Size scale */}
          <p style={sectionTitleStyle}>Size Scale</p>
          <div style={cardStyle}>
            <div style={rowStyle}>
              {[8, 10, 12, 14, 16, 20, 24].map((size) => (
                <div key={size} style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px' }}>
                  <GpsQualityIndicator accuracyMeters={6} size={size} />
                  <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>{size}px</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * HudDashboard — realistic HUD panel showing GPS alongside other telemetry.
 */
export const HudDashboard = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <p style={sectionTitleStyle}>Live HUD Panel</p>

          <div style={cardStyle}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em', color: '#64748b', textTransform: 'uppercase' as const }}>
                  Track Session
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.02em', marginTop: '2px' }}>
                  Lap 7 / 20
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GpsQualityIndicator accuracyMeters={8} size={12} />
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>GPS</span>
              </div>
            </div>

            {/* Telemetry grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Speed', value: '287', unit: 'km/h', color: '#f97316' },
                { label: 'Lap Time', value: '1:24.3', unit: '', color: '#f1f5f9' },
                { label: 'Position', value: 'P3', unit: '', color: '#facc15' },
              ].map(({ label, value, unit, color }) => (
                <div
                  key={label}
                  style={{
                    backgroundColor: '#0a1628',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(148,163,184,0.08)',
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '6px' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color, letterSpacing: '-0.02em' }}>
                    {value}
                    {unit && <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', marginLeft: '3px' }}>{unit}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* GPS detail row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                backgroundColor: 'rgba(34,197,94,0.06)',
                borderRadius: '8px',
                border: '1px solid rgba(34,197,94,0.15)',
              }}
            >
              <GpsQualityIndicator accuracyMeters={8} size={10} />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                GPS lock · <span style={{ color: '#22c55e', fontWeight: '600' }}>±8 m</span> accuracy · 12 satellites
              </span>
            </div>
          </div>

          <div style={dividerStyle} />

          {/* Poor signal card */}
          <div style={{ ...cardStyle, border: '1px solid rgba(249,115,22,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <GpsQualityIndicator accuracyMeters={38} size={12} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#f97316' }}>Poor GPS Signal</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Tunnel section — reduced accuracy</div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
              Accuracy degraded to ±38 m. Position data may be unreliable. Exiting tunnel in ~200 m.
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * LiveReconnect — simulates a GPS signal cycling through states with pulse on reconnect.
 */
export const LiveReconnect = () => {
  const cycle: Array<{ accuracy: number | null; label: string }> = [
    { accuracy: 7, label: 'Excellent lock' },
    { accuracy: 20, label: 'Good signal' },
    { accuracy: 45, label: 'Poor signal' },
    { accuracy: null, label: 'Signal lost…' },
    { accuracy: 8, label: 'Reconnected!' },
  ];

  const [step, setStep] = useState(0);
  const [reconnecting, setReconnecting] = useState(false);
  const current = cycle[step];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        const next = (prev + 1) % cycle.length;
        if (cycle[prev].accuracy === null && cycle[next].accuracy !== null) {
          setReconnecting(true);
          setTimeout(() => setReconnecting(false), 2100);
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <p style={sectionTitleStyle}>Live Signal Simulation</p>

          <div style={cardStyle}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '24px', padding: '16px 0' }}>
              <GpsQualityIndicator
                accuracyMeters={current.accuracy}
                reconnecting={reconnecting}
                size={24}
              />

              <div style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', marginBottom: '6px' }}>
                  {current.label}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {current.accuracy != null ? `Accuracy: ±${current.accuracy} m` : 'No GPS fix'}
                </div>
              </div>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {cycle.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: i === step ? '#f97316' : 'rgba(148,163,184,0.3)',
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                ))}
              </div>

              <div style={rowStyle}>
                {cycle.map(({ accuracy, label }, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: i === step ? 'rgba(249,115,22,0.1)' : 'transparent',
                      border: `1px solid ${i === step ? 'rgba(249,115,22,0.3)' : 'transparent'}`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <GpsQualityIndicator accuracyMeters={accuracy} size={8} showTooltip={false} />
                    <span style={{ fontSize: '11px', color: i === step ? '#f1f5f9' : '#64748b' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
