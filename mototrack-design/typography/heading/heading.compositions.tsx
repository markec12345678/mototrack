import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Heading } from './heading.js';

/**
 * All heading levels — h1 through h6 with their default size mapping.
 */
export const AllLevels = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '48px 40px',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
              marginBottom: '32px',
              marginTop: 0,
            }}
          >
            Heading Levels — h1 to h6
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>h1 / 3xl</span>
              <Heading level={1}>MotoTrack Racing Series</Heading>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>h2 / 2xl</span>
              <Heading level={2}>Season Championship 2025</Heading>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>h3 / xl</span>
              <Heading level={3}>Race Results Overview</Heading>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>h4 / lg</span>
              <Heading level={4}>Lap Time Statistics</Heading>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>h5 / md</span>
              <Heading level={5}>Sector Analysis</Heading>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '6px' }}>h6 / sm</span>
              <Heading level={6}>Tyre Compound Notes</Heading>
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * All size variants — xs through 3xl applied to the same semantic level.
 */
export const AllSizes = () => {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '48px 40px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
              marginBottom: '32px',
              marginTop: 0,
            }}
          >
            Size Variants — xs to 3xl
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {sizes.map((size) => (
              <div key={size} style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    color: '#64748b',
                    fontFamily: 'monospace',
                    width: '28px',
                    flexShrink: 0,
                  }}
                >
                  {size}
                </span>
                <Heading level={2} size={size}>
                  Fast Lap — 1:23.456
                </Heading>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Color variants — primary, secondary, accent, danger.
 */
export const ColorVariants = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          padding: '48px 40px',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
              marginBottom: '32px',
              marginTop: 0,
            }}
          >
            Color Variants
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '8px' }}>color=&quot;primary&quot;</span>
              <Heading level={2} size="xl" color="primary">
                P1 — Marco Bianchi
              </Heading>
            </div>

            <div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '8px' }}>color=&quot;secondary&quot;</span>
              <Heading level={2} size="xl" color="secondary">
                P2 — Luka Horvat
              </Heading>
            </div>

            <div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '8px' }}>color=&quot;accent&quot;</span>
              <Heading level={2} size="xl" color="accent">
                Fastest Lap — 1:23.456
              </Heading>
            </div>

            <div>
              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginBottom: '8px' }}>color=&quot;danger&quot;</span>
              <Heading level={2} size="xl" color="danger">
                Red Flag — Race Suspended
              </Heading>
            </div>

            <div
              style={{
                marginTop: '16px',
                padding: '28px 32px',
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.12)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              }}
            >
              <Heading level={3} size="2xl" color="accent">
                MotoTrack 2025
              </Heading>
              <Heading level={4} size="lg" color="primary" style={{ marginTop: '8px' }}>
                Championship Standings
              </Heading>
              <Heading level={5} size="sm" color="secondary" style={{ marginTop: '6px' }}>
                Round 7 of 18 — Circuit de Catalunya
              </Heading>
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
