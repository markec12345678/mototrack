import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Logo } from './logo.js';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '48px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '56px',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  margin: 0,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  alignItems: 'center',
  gap: '32px',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'rgba(148,163,184,0.12)',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '12px',
  padding: '20px 24px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
};

/**
 * All three sizes — sm, md, lg — side by side.
 */
export const AllSizes = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Logo Sizes</p>
          <div style={rowStyle}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>sm</span>
              <Logo size="sm" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>md (default)</span>
              <Logo size="md" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>lg</span>
              <Logo size="lg" />
            </div>
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>Without Tag</p>
          <div style={rowStyle}>
            <Logo size="sm" showTag={false} />
            <Logo size="md" showTag={false} />
            <Logo size="lg" showTag={false} />
          </div>
        </div>

        <div style={dividerStyle} />

        <div style={sectionStyle}>
          <p style={labelStyle}>Custom Tag Label</p>
          <div style={rowStyle}>
            <Logo size="sm" tag="Beta" />
            <Logo size="md" tag="Pro" />
            <Logo size="lg" tag="Balkans" />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Logo in context — shown inside a realistic nav bar and hero section.
 */
export const InContext = () => {
  return (
    <MockProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#020617' }}>
        {/* Nav bar */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: '60px',
            borderBottom: '1px solid rgba(148,163,184,0.12)',
            backgroundColor: '#0f172a',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          <Logo size="sm" />
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Routes', 'Riders', 'Live', 'Community'].map((item) => (
              <span
                key={item}
                style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500, cursor: 'pointer' }}
              >
                {item}
              </span>
            ))}
          </div>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: '#020617',
            }}
          >
            M
          </div>
        </nav>

        {/* Hero */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 32px',
            textAlign: 'center' as const,
            gap: '24px',
          }}
        >
          <Logo size="lg" />
          <p style={{ margin: 0, fontSize: '17px', color: '#94a3b8', maxWidth: '480px', lineHeight: 1.6 }}>
            Track every twist. Conquer every road across the Balkans.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <div
              style={{
                padding: '10px 24px',
                backgroundColor: '#f97316',
                color: '#020617',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Start Riding
            </div>
            <div
              style={{
                padding: '10px 24px',
                backgroundColor: 'transparent',
                color: '#f1f5f9',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '14px',
                border: '1px solid rgba(148,163,184,0.25)',
                cursor: 'pointer',
              }}
            >
              Explore Routes
            </div>
          </div>
        </div>

        {/* Cards row */}
        <div style={{ padding: '0 32px 48px', display: 'flex', flexDirection: 'column' as const, gap: '12px', maxWidth: '640px', margin: '0 auto' }}>
          {[
            { label: 'Active Riders', value: '2,841', icon: '🏍️' },
            { label: 'Routes Tracked', value: '14,392', icon: '🗺️' },
            { label: 'Countries', value: '10', icon: '🌍' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{icon}</span>
                <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>{label}</span>
              </div>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Dark surface variants — logo on different background surfaces.
 */
export const OnSurfaces = () => {
  const surfaces = [
    { label: 'App Background', bg: '#020617', border: 'none' },
    { label: 'Card Surface', bg: '#0f172a', border: '1px solid rgba(148,163,184,0.12)' },
    { label: 'Elevated Card', bg: '#1e293b', border: '1px solid rgba(148,163,184,0.15)' },
  ];

  return (
    <MockProvider>
      <div style={pageStyle}>
        <p style={labelStyle}>Logo on Different Surfaces</p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
          {surfaces.map(({ label, bg, border }) => (
            <div
              key={label}
              style={{
                backgroundColor: bg,
                border,
                borderRadius: '12px',
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: bg === '#020617' ? 'none' : '0 4px 16px rgba(0,0,0,0.5)',
              }}
            >
              <Logo size="md" />
              <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </MockProvider>
  );
};
