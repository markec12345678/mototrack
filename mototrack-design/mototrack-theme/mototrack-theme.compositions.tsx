import React from 'react';
import { TokenViewer } from '@bitdesign/sparks.sparks-theme';
import { useTheme } from './mototrack-theme-provider.js';
import { MototrackTheme } from './mototrack-theme.js';

const brandBookImageUrl =
  'https://storage.googleapis.com/bit-generated-images/images/image_dark_motorcycle_racing_dashboa_0_1779615246683.png';

// ─── Shared inline styles ────────────────────────────────────────────────────

const sectionStyle: React.CSSProperties = {
  padding: '32px',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headingStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '16px',
  marginTop: '0',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: '12px',
  marginBottom: '40px',
};

const swatchStyle = (bg: string): React.CSSProperties => ({
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid rgba(148,163,184,0.15)',
});

const swatchColorStyle = (bg: string): React.CSSProperties => ({
  height: '56px',
  backgroundColor: bg,
});

const swatchLabelStyle: React.CSSProperties = {
  padding: '8px 10px',
  backgroundColor: '#0f172a',
};

const swatchNameStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '600',
  color: '#f1f5f9',
  display: 'block',
  marginBottom: '2px',
};

const swatchValueStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#64748b',
  fontFamily: 'monospace',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '12px',
  marginBottom: '40px',
  alignItems: 'center',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'rgba(148,163,184,0.15)',
  margin: '32px 0',
};

// ─── Token Viewer sub-component ──────────────────────────────────────────────

function ViewTokens() {
  const theme = useTheme();
  return <TokenViewer theme={theme} />;
}

// ─── Color Swatch ────────────────────────────────────────────────────────────

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={swatchStyle(value)}>
      <div style={swatchColorStyle(value)} />
      <div style={swatchLabelStyle}>
        <span style={swatchNameStyle}>{name}</span>
        <span style={swatchValueStyle}>{value}</span>
      </div>
    </div>
  );
}

// ─── Typography Sample ───────────────────────────────────────────────────────

function TypeSample({ size, label, weight = '400' }: { size: string; label: string; weight?: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <span
        style={{
          fontSize: size,
          fontWeight: weight,
          color: '#f1f5f9',
          lineHeight: '1.25',
          display: 'block',
        }}
      >
        MotoTrack Racing
      </span>
      <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
        {label} — {size}
      </span>
    </div>
  );
}

// ─── Shadow Card ─────────────────────────────────────────────────────────────

function ShadowCard({ label, shadow }: { label: string; shadow: string }) {
  return (
    <div
      style={{
        backgroundColor: '#0f172a',
        borderRadius: '12px',
        padding: '24px 20px',
        boxShadow: shadow,
        border: '1px solid rgba(148,163,184,0.15)',
        minWidth: '160px',
        textAlign: 'center' as const,
      }}
    >
      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{label}</span>
    </div>
  );
}

// ─── Flag Swatch ─────────────────────────────────────────────────────────────

function FlagSwatch({ name, color }: { name: string; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        backgroundColor: '#0f172a',
        borderRadius: '6px',
        border: '1px solid rgba(148,163,184,0.15)',
      }}
    >
      <div
        style={{
          width: '20px',
          height: '14px',
          backgroundColor: color,
          borderRadius: '2px',
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>{name}</span>
    </div>
  );
}

// ─── Compositions ────────────────────────────────────────────────────────────

/**
 * Brand Book — full MotoTrack design language showcase
 */
export const BrandBook = () => {
  return (
    <MototrackTheme>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
          <img
            src={brandBookImageUrl}
            alt="MotoTrack Design System"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(2,6,23,0.3) 0%, rgba(2,6,23,0.95) 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '32px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#f97316',
                  marginBottom: '8px',
                }}
              >
                Design System
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '36px',
                  fontWeight: '800',
                  color: '#f1f5f9',
                  lineHeight: '1.1',
                  letterSpacing: '-0.03em',
                }}
              >
                MotoTrack Brand Book
              </h1>
              <p style={{ margin: '8px 0 0', fontSize: '15px', color: '#94a3b8' }}>
                Dark motorcycle theme — design tokens &amp; visual language
              </p>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          {/* Surface Colors */}
          <p style={headingStyle}>Surface Colors</p>
          <div style={gridStyle}>
            <Swatch name="App Background" value="#020617" />
            <Swatch name="Card" value="#0f172a" />
            <Swatch name="Card Elevated" value="#1e293b" />
          </div>

          <div style={dividerStyle} />

          {/* Accent & Brand */}
          <p style={headingStyle}>Accent &amp; Brand</p>
          <div style={gridStyle}>
            <Swatch name="Accent" value="#f97316" />
            <Swatch name="Accent Hover" value="#ea580c" />
            <Swatch name="Accent Active" value="#c2410c" />
          </div>

          <div style={dividerStyle} />

          {/* Text Colors */}
          <p style={headingStyle}>Text Scale</p>
          <div style={gridStyle}>
            <Swatch name="Primary" value="#f1f5f9" />
            <Swatch name="Secondary" value="#94a3b8" />
            <Swatch name="Muted" value="#64748b" />
          </div>

          <div style={dividerStyle} />

          {/* Status Colors */}
          <p style={headingStyle}>Status Colors</p>
          <div style={gridStyle}>
            <Swatch name="Success" value="#22c55e" />
            <Swatch name="Warning" value="#eab308" />
            <Swatch name="Danger" value="#ef4444" />
            <Swatch name="Info" value="#3b82f6" />
          </div>

          <div style={dividerStyle} />

          {/* Country / Flag Palette */}
          <p style={headingStyle}>Country Flag Palette</p>
          <div style={{ ...rowStyle, flexWrap: 'wrap' }}>
            {[
              { name: 'Red', color: '#ef4444' },
              { name: 'Blue', color: '#3b82f6' },
              { name: 'Yellow', color: '#eab308' },
              { name: 'Green', color: '#22c55e' },
              { name: 'White', color: '#f1f5f9' },
              { name: 'Orange', color: '#f97316' },
              { name: 'Purple', color: '#a855f7' },
              { name: 'Pink', color: '#ec4899' },
              { name: 'Teal', color: '#14b8a6' },
              { name: 'Gold', color: '#f59e0b' },
              { name: 'Silver', color: '#94a3b8' },
              { name: 'Bronze', color: '#b45309' },
            ].map(({ name, color }) => (
              <FlagSwatch key={name} name={name} color={color} />
            ))}
          </div>

          <div style={dividerStyle} />

          {/* Typography Scale */}
          <p style={headingStyle}>Typography Scale — xs → 3xl</p>
          <div style={{ marginBottom: '40px' }}>
            <TypeSample size="11px" label="xs" />
            <TypeSample size="13px" label="sm" />
            <TypeSample size="15px" label="base / md" />
            <TypeSample size="17px" label="lg" />
            <TypeSample size="20px" label="xl" weight="600" />
            <TypeSample size="24px" label="2xl" weight="700" />
            <TypeSample size="30px" label="3xl" weight="800" />
          </div>

          <div style={dividerStyle} />

          {/* Border Radii */}
          <p style={headingStyle}>Border Radii</p>
          <div style={rowStyle}>
            {[
              { label: 'xs — 2px', r: '2px' },
              { label: 'sm — 4px', r: '4px' },
              { label: 'md — 8px', r: '8px' },
              { label: 'lg — 12px', r: '12px' },
              { label: 'xl — 16px', r: '16px' },
              { label: 'full', r: '9999px' },
            ].map(({ label, r }) => (
              <div
                key={label}
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#1e293b',
                  border: '2px solid #f97316',
                  borderRadius: r,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={dividerStyle} />

          {/* Shadows */}
          <p style={headingStyle}>Floating Panel Shadows</p>
          <div style={rowStyle}>
            <ShadowCard label="xs" shadow="0 1px 2px rgba(0,0,0,0.5)" />
            <ShadowCard label="small" shadow="0 2px 8px rgba(0,0,0,0.6)" />
            <ShadowCard label="medium" shadow="0 4px 16px rgba(0,0,0,0.7)" />
            <ShadowCard label="floating" shadow="0 8px 32px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)" />
            <ShadowCard label="panel" shadow="0 20px 60px rgba(0,0,0,0.85), 0 4px 16px rgba(0,0,0,0.7)" />
            <ShadowCard label="glow" shadow="0 0 20px rgba(249,115,22,0.35)" />
          </div>

          <div style={dividerStyle} />

          {/* Spacing Scale */}
          <p style={headingStyle}>Spacing Scale — 4px base</p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '40px' }}>
            {[
              { label: 'xs — 4px', size: 4 },
              { label: 'sm — 8px', size: 8 },
              { label: 'md — 12px', size: 12 },
              { label: 'lg — 16px', size: 16 },
              { label: 'xl — 24px', size: 24 },
              { label: '2xl — 32px', size: 32 },
              { label: '3xl — 48px', size: 48 },
            ].map(({ label, size }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', width: '100px' }}>
                  {label}
                </span>
                <div
                  style={{
                    height: '12px',
                    width: `${size * 2}px`,
                    backgroundColor: '#f97316',
                    borderRadius: '2px',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MototrackTheme>
  );
};

/**
 * Token Viewer — all raw design tokens rendered by Sparks
 */
export const AllTokens = () => {
  return (
    <MototrackTheme>
      <div style={{ padding: '32px', backgroundColor: '#020617', minHeight: '100vh' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#f97316',
            marginBottom: '24px',
            marginTop: '0',
          }}
        >
          All Design Tokens
        </p>
        <ViewTokens />
      </div>
    </MototrackTheme>
  );
};

/**
 * Midnight Variant — ultra-dark OLED theme variation
 */
export const MidnightVariant = () => {
  return (
    <MototrackTheme initialTheme="dark">
      <div style={{ backgroundColor: '#000000', minHeight: '100vh', padding: '32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              backgroundColor: 'rgba(251,146,60,0.15)',
              borderRadius: '9999px',
              border: '1px solid rgba(251,146,60,0.3)',
              marginBottom: '24px',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fb923c' }} />
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#fb923c', letterSpacing: '0.08em' }}>
              MIDNIGHT VARIANT
            </span>
          </div>

          <h2
            style={{
              margin: '0 0 8px',
              fontSize: '30px',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}
          >
            Ultra-Dark Mode
          </h2>
          <p style={{ margin: '0 0 40px', fontSize: '15px', color: '#94a3b8' }}>
            Optimised for OLED displays — deeper blacks, maximum contrast.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { title: 'Live Timing', value: '1:23.456', sub: 'Fastest Lap', accent: '#fb923c' },
              { title: 'Top Speed', value: '312 km/h', sub: 'Sector 2', accent: '#4ade80' },
              { title: 'Position', value: 'P1', sub: '+0.000', accent: '#facc15' },
              { title: 'Tyre Life', value: '87%', sub: 'Soft compound', accent: '#60a5fa' },
            ].map(({ title, value, sub, accent }) => (
              <div
                key={title}
                style={{
                  backgroundColor: '#080f1e',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(148,163,184,0.10)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)',
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {title}
                </div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: accent, letterSpacing: '-0.03em', lineHeight: '1' }}>
                  {value}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>{sub}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '32px' }}>
            <ViewTokens />
          </div>
        </div>
      </div>
    </MototrackTheme>
  );
};
