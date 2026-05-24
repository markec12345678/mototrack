import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Paragraph } from './paragraph.js';

/**
 * All Variants — showcases body, caption, label, and mono side by side.
 */
export const AllVariants = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '48px 32px',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p
            style={{
              margin: '0 0 32px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
            }}
          >
            Paragraph — All Variants
          </p>

          {/* Body */}
          <div style={{ marginBottom: '40px' }}>
            <p
              style={{
                margin: '0 0 12px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              body
            </p>
            <Paragraph variant="body" color="primary">
              MotoTrack delivers real-time telemetry and race analytics for professional motorcycle
              racing teams. From lap timing to tyre degradation, every data point is captured and
              visualised with precision.
            </Paragraph>
          </div>

          {/* Caption */}
          <div style={{ marginBottom: '40px' }}>
            <p
              style={{
                margin: '0 0 12px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              caption
            </p>
            <Paragraph variant="caption" color="secondary">
              Last updated 3 minutes ago · Round 7 of 20 · Circuit de Barcelona-Catalunya
            </Paragraph>
          </div>

          {/* Label */}
          <div style={{ marginBottom: '40px' }}>
            <p
              style={{
                margin: '0 0 12px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              label
            </p>
            <Paragraph variant="label" color="primary">
              Live Timing
            </Paragraph>
          </div>

          {/* Mono */}
          <div style={{ marginBottom: '40px' }}>
            <p
              style={{
                margin: '0 0 12px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#64748b',
              }}
            >
              mono
            </p>
            <Paragraph variant="mono" color="primary">
              1:23.456
            </Paragraph>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Color Scale — primary, secondary, and muted colors on body text.
 */
export const ColorScale = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '48px 32px',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p
            style={{
              margin: '0 0 32px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
            }}
          >
            Paragraph — Color Scale
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <Paragraph variant="caption" color="muted" style={{ marginBottom: '6px' }}>
                primary
              </Paragraph>
              <Paragraph variant="body" color="primary">
                Sector 1 completed in 28.341 s — a new personal best for rider #46.
              </Paragraph>
            </div>

            <div>
              <Paragraph variant="caption" color="muted" style={{ marginBottom: '6px' }}>
                secondary
              </Paragraph>
              <Paragraph variant="body" color="secondary">
                Sector 1 completed in 28.341 s — a new personal best for rider #46.
              </Paragraph>
            </div>

            <div>
              <Paragraph variant="caption" color="muted" style={{ marginBottom: '6px' }}>
                muted
              </Paragraph>
              <Paragraph variant="body" color="muted">
                Sector 1 completed in 28.341 s — a new personal best for rider #46.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * RaceCard — realistic usage inside a race data card.
 */
export const RaceCard = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '48px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(148,163,184,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            width: '100%',
            maxWidth: '480px',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px',
            }}
          >
            <div>
              <Paragraph variant="label" color="muted">
                Round 7
              </Paragraph>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#f1f5f9',
                  letterSpacing: '-0.02em',
                }}
              >
                Spanish Grand Prix
              </p>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'rgba(249,115,22,0.15)',
                borderRadius: '9999px',
                border: '1px solid rgba(249,115,22,0.3)',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#f97316',
                  boxShadow: '0 0 6px rgba(249,115,22,0.8)',
                }}
              />
              <Paragraph variant="label" color="primary" style={{ color: '#f97316' }}>
                Live
              </Paragraph>
            </div>
          </div>

          {/* Lap time */}
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <Paragraph variant="label" color="muted">
                Fastest Lap
              </Paragraph>
              <Paragraph variant="mono" color="primary" style={{ marginTop: '6px' }}>
                1:23.456
              </Paragraph>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Paragraph variant="label" color="muted">
                Leader
              </Paragraph>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#f1f5f9',
                }}
              >
                M. Bianchi
              </p>
            </div>
          </div>

          {/* Description */}
          <Paragraph variant="body" color="secondary">
            Lap 14 of 20 underway. The leading pack is separated by less than half a second as
            tyre strategies begin to diverge across the top five.
          </Paragraph>

          {/* Footer */}
          <div style={{ marginTop: '16px', borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: '14px' }}>
            <Paragraph variant="caption" color="muted">
              Updated 12 s ago · Circuit de Barcelona-Catalunya · 4.655 km
            </Paragraph>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
