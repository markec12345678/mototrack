import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Spinner } from './spinner.js';

/**
 * All three sizes side-by-side — no label.
 */
export const AllSizes = () => {
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
          gap: '48px',
          padding: '48px 32px',
        }}
      >
        <div>
          <p
            style={{
              margin: '0 0 32px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#f97316',
              textAlign: 'center',
            }}
          >
            Spinner Sizes
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '48px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <Spinner size="sm" />
              <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>sm</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <Spinner size="md" />
              <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>md</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <Spinner size="lg" />
              <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>lg</span>
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Spinners with labels — as used in protected-route and async data loads.
 */
export const WithLabels = () => {
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
          gap: '48px',
          padding: '48px 32px',
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#f97316',
            textAlign: 'center',
          }}
        >
          With Labels
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '64px',
            flexWrap: 'wrap',
          }}
        >
          <Spinner size="sm" label="Loading…" />
          <Spinner size="md" label="Fetching race data…" />
          <Spinner size="lg" label="Authenticating rider…" />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Full-page loading overlay — typical protected-route usage.
 */
export const ProtectedRouteOverlay = () => {
  return (
    <MockProvider>
      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: '#020617',
          overflow: 'hidden',
        }}
      >
        {/* Simulated blurred background content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            padding: '32px',
            filter: 'blur(4px)',
            opacity: 0.3,
            pointerEvents: 'none',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                height: '120px',
                border: '1px solid rgba(148,163,184,0.12)',
              }}
            />
          ))}
        </div>

        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.75)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '20px',
              padding: '40px 48px',
              border: '1px solid rgba(148,163,184,0.12)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 4px 16px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'rgba(249,115,22,0.12)',
                borderRadius: '9999px',
                border: '1px solid rgba(249,115,22,0.25)',
                marginBottom: '16px',
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
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#f97316', letterSpacing: '0.1em' }}>
                PROTECTED ROUTE
              </span>
            </div>
            <Spinner size="lg" label="Verifying your credentials…" />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
