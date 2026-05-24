import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Badge } from './badge.js';

// ── Inline icon helpers ───────────────────────────────────────────────────────

function CircleIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <circle cx="5" cy="5" r="4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1.5,5 4,7.5 8.5,2.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M5 1L9.33 8.5H0.67L5 1Z" />
      <rect x="4.4" y="4.2" width="1.2" height="2.4" rx="0.4" fill="white" />
      <rect x="4.4" y="7.2" width="1.2" height="1.2" rx="0.4" fill="white" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="2" y1="2" x2="8" y2="8" />
      <line x1="8" y1="2" x2="2" y2="8" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <circle cx="5" cy="5" r="4.5" />
      <rect x="4.4" y="4.2" width="1.2" height="3.2" rx="0.4" fill="white" />
      <rect x="4.4" y="2.6" width="1.2" height="1.2" rx="0.4" fill="white" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M2 1v8M2 1h6L6.5 4.5 8 8H2" />
    </svg>
  );
}

// ── Compositions ──────────────────────────────────────────────────────────────

/**
 * All Variants — showcases every badge variant at medium size.
 */
export const AllVariants = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}
      >
        {/* Header */}
        <div>
          <p
            style={{
              margin: '0 0 6px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
            }}
          >
            Badge Component
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            All Variants
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#64748b' }}>
            Six semantic variants — accent, success, warning, danger, info, neutral
          </p>
        </div>

        {/* Variants grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {[
            { variant: 'accent' as const, label: 'Fastest Lap', icon: <CircleIcon />, desc: 'Accent — primary brand orange' },
            { variant: 'success' as const, label: 'Race Complete', icon: <CheckIcon />, desc: 'Success — green status' },
            { variant: 'warning' as const, label: 'Yellow Flag', icon: <AlertIcon />, desc: 'Warning — caution state' },
            { variant: 'danger' as const, label: 'DNF', icon: <XIcon />, desc: 'Danger — critical state' },
            { variant: 'info' as const, label: 'Qualifying', icon: <InfoIcon />, desc: 'Info — informational state' },
            { variant: 'neutral' as const, label: 'Practice', icon: <FlagIcon />, desc: 'Neutral — default muted state' },
          ].map(({ variant, label, icon, desc }) => (
            <div
              key={variant}
              style={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(148,163,184,0.12)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Badge variant={variant} label={label} icon={icon} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9', marginBottom: '2px' }}>
                  {variant}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Sizes — sm and md side by side for every variant.
 */
export const Sizes = () => {
  const variants: Array<{ variant: 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'; label: string }> = [
    { variant: 'accent', label: 'Pole Position' },
    { variant: 'success', label: 'Finished' },
    { variant: 'warning', label: 'Pit Stop' },
    { variant: 'danger', label: 'Retired' },
    { variant: 'info', label: 'Qualifying' },
    { variant: 'neutral', label: 'Warm Up' },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 6px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
            }}
          >
            Badge Sizes
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-0.03em',
            }}
          >
            sm &amp; md
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#64748b' }}>
            Two sizes available — small for dense UIs, medium for standard use
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(148,163,184,0.12)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '0',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(148,163,184,0.1)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Variant
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              sm
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              md
            </span>
          </div>
          {variants.map(({ variant, label }) => (
            <div
              key={variant}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid rgba(148,163,184,0.06)',
              }}
            >
              <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>{variant}</span>
              <Badge variant={variant} label={label} size="sm" icon={<CircleIcon />} />
              <Badge variant={variant} label={label} size="md" icon={<CircleIcon />} />
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Race Dashboard — realistic usage of badges in a live race context.
 */
export const RaceDashboard = () => {
  const riders = [
    { name: 'Marco Bianchi', number: 46, country: '🇮🇹', position: 1, status: 'success' as const, statusLabel: 'Leading', lap: '1:23.456', gap: 'Interval' },
    { name: 'Luka Horvat', number: 33, country: '🇸🇮', position: 2, status: 'info' as const, statusLabel: 'Racing', lap: '1:23.891', gap: '+0.435' },
    { name: 'Carlos Ruiz', number: 99, country: '🇪🇸', position: 3, status: 'info' as const, statusLabel: 'Racing', lap: '1:24.102', gap: '+0.646' },
    { name: 'Jan Novák', number: 7, country: '🇨🇿', position: 4, status: 'warning' as const, statusLabel: 'Pit In', lap: '1:24.567', gap: '+1.111' },
    { name: 'Tomáš Kováč', number: 12, country: '🇸🇰', position: 5, status: 'danger' as const, statusLabel: 'Retired', lap: '1:25.013', gap: 'DNF' },
  ];

  const sessionBadges: Array<{ variant: 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'; label: string }> = [
    { variant: 'accent', label: 'LIVE' },
    { variant: 'info', label: 'Lap 14 / 20' },
    { variant: 'success', label: 'Green Flag' },
    { variant: 'neutral', label: 'MotoGP' },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '32px 24px',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          {/* Session header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {sessionBadges.map(({ variant, label }) => (
                <Badge key={label} variant={variant} label={label} size="sm" icon={<CircleIcon />} />
              ))}
            </div>
            <h2
              style={{
                margin: '0 0 4px',
                fontSize: '22px',
                fontWeight: 800,
                color: '#f1f5f9',
                letterSpacing: '-0.02em',
              }}
            >
              Race Classification
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              Circuit de Catalunya — Round 7
            </p>
          </div>

          {/* Leaderboard */}
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 80px 100px 100px',
                gap: '12px',
                padding: '12px 20px',
                borderBottom: '1px solid rgba(148,163,184,0.1)',
              }}
            >
              {['P', 'Rider', 'No.', 'Best Lap', 'Gap'].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#64748b',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {riders.map((rider, idx) => (
              <div
                key={rider.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 80px 100px 100px',
                  gap: '12px',
                  padding: '14px 20px',
                  alignItems: 'center',
                  borderBottom: idx < riders.length - 1 ? '1px solid rgba(148,163,184,0.06)' : 'none',
                  backgroundColor: rider.position === 1 ? 'rgba(249,115,22,0.04)' : 'transparent',
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: rider.position === 1 ? '#f97316' : rider.position <= 3 ? '#f1f5f9' : '#64748b',
                  }}
                >
                  {rider.position}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>
                      {rider.country} {rider.name}
                    </span>
                  </div>
                  <Badge
                    variant={rider.status}
                    label={rider.statusLabel}
                    size="sm"
                    icon={<CircleIcon />}
                  />
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#f97316',
                    fontFamily: 'monospace',
                  }}
                >
                  #{rider.number}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#94a3b8',
                  }}
                >
                  {rider.lap}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: rider.gap === 'DNF' ? '#ef4444' : '#64748b',
                    fontWeight: rider.gap === 'DNF' ? 700 : 400,
                  }}
                >
                  {rider.gap}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Badge variant="accent" label="Fastest Lap" size="sm" />
            <Badge variant="warning" label="Pit Stop" size="sm" />
            <Badge variant="neutral" label="Safety Car" size="sm" />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
