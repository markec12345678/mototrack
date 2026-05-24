import { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { OfflineCacheIndicator } from './offline-cache-indicator.js';

// ─── Shared map background ────────────────────────────────────────────────────

type MapBackgroundProps = {
  children?: React.ReactNode;
};

function MapBackground({ children }: MapBackgroundProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '420px',
        background: `
          linear-gradient(rgba(2,6,23,0.55), rgba(2,6,23,0.55)),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            rgba(148,163,184,0.07) 39px,
            rgba(148,163,184,0.07) 40px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 39px,
            rgba(148,163,184,0.07) 39px,
            rgba(148,163,184,0.07) 40px
          )
        `,
        backgroundColor: '#0c1a2e',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '20px',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}
        viewBox="0 0 600 420"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M0 210 Q150 160 300 210 T600 210" stroke="#f97316" strokeWidth="3" fill="none" />
        <path d="M0 280 Q200 240 400 280 T600 260" stroke="#94a3b8" strokeWidth="2" fill="none" />
        <path d="M100 0 Q180 200 160 420" stroke="#64748b" strokeWidth="1.5" fill="none" />
        <path d="M420 0 Q380 200 440 420" stroke="#64748b" strokeWidth="1.5" fill="none" />
      </svg>
      {children}
    </div>
  );
}

// ─── Composition 1 — Well-cached (ready state) ────────────────────────────────

/**
 * Ready — high tile count and storage, readiness score above 70.
 */
export const ReadyState = () => {
  return (
    <MockProvider>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '32px' }}>
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
          Ready State — High Cache Coverage
        </p>
        <MapBackground>
          <OfflineCacheIndicator
            tilesCached={4820}
            bytes={158 * 1024 * 1024}
          />
        </MapBackground>
        <p style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
          Click the pill to expand the detail panel and inspect cache stats or clear the cache.
        </p>
      </div>
    </MockProvider>
  );
};

// ─── Composition 2 — Partial cache ───────────────────────────────────────────

/**
 * Partial — moderate tile count, readiness score between 35–70.
 */
export const PartialState = () => {
  return (
    <MockProvider>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '32px' }}>
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
          Partial State — Limited Cache Coverage
        </p>
        <MapBackground>
          <OfflineCacheIndicator
            tilesCached={1240}
            bytes={38 * 1024 * 1024}
          />
        </MapBackground>
        <p style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
          Some tiles are cached but coverage is incomplete for full offline use.
        </p>
      </div>
    </MockProvider>
  );
};

// ─── Composition 3 — Empty / No cache ────────────────────────────────────────

/**
 * Empty — no tiles cached, readiness score 0.
 */
export const EmptyState = () => {
  return (
    <MockProvider>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '32px' }}>
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
          Empty State — No Cache
        </p>
        <MapBackground>
          <OfflineCacheIndicator
            tilesCached={0}
            bytes={0}
          />
        </MapBackground>
        <p style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
          No tiles have been cached yet. Cache a route first to enable offline maps.
        </p>
      </div>
    </MockProvider>
  );
};

// ─── Composition 4 — Interactive clear ───────────────────────────────────────

/**
 * Interactive — demonstrates the clear-cache callback with live feedback.
 */
export const InteractiveClear = () => {
  const [cleared, setCleared] = useState(false);
  const [tiles, setTiles] = useState(3100);
  const [bytes, setBytes] = useState(96 * 1024 * 1024);

  const handleCacheCleared = () => {
    setCleared(true);
    setTiles(0);
    setBytes(0);
  };

  return (
    <MockProvider>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '32px' }}>
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
          Interactive — Clear Cache Demo
        </p>
        <MapBackground>
          <OfflineCacheIndicator
            tilesCached={tiles}
            bytes={bytes}
            onCacheCleared={handleCacheCleared}
          />
        </MapBackground>
        {cleared && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#22c55e',
              fontWeight: 600,
            }}
          >
            ✓ onCacheCleared callback fired — cache has been wiped.
          </div>
        )}
        {!cleared && (
          <p style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
            Expand the panel and press &ldquo;Clear Cache&rdquo; to see the callback in action.
          </p>
        )}
      </div>
    </MockProvider>
  );
};
