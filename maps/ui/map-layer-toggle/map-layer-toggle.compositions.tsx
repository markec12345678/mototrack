import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { MapLayerToggle } from './map-layer-toggle.js';
import { SatelliteIcon } from './icons/satellite-icon.js';
import { TrafficIcon } from './icons/traffic-icon.js';
import { TerrainIcon } from './icons/terrain-icon.js';
import { RouteIcon } from './icons/route-icon.js';
import { PoiIcon } from './icons/poi-icon.js';
import { WeatherIcon } from './icons/weather-icon.js';

/* ── Shared layout ───────────────────────────────────────────────── */

const mapBackground: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  background: `
    linear-gradient(rgba(2,6,23,0.55), rgba(2,6,23,0.55)),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 40px,
      rgba(148,163,184,0.04) 40px,
      rgba(148,163,184,0.04) 41px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 40px,
      rgba(148,163,184,0.04) 40px,
      rgba(148,163,184,0.04) 41px
    )
  `,
  backgroundColor: '#0a1628',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  padding: '24px',
  fontFamily: 'Inter, system-ui, sans-serif',
};

const mapOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    radial-gradient(ellipse at 30% 60%, rgba(249,115,22,0.06) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.05) 0%, transparent 50%)
  `,
  pointerEvents: 'none',
};

/* ── Composition 1 — Default Rider Layers ────────────────────────── */

/**
 * Default Rider Layers — standard MotoTrack map layer panel
 * with satellite, traffic, terrain, and route overlays.
 */
export const DefaultRiderLayers = () => {
  const [lastChange, setLastChange] = useState<string | null>(null);

  const layers = [
    { key: `satellite`, label: `Satellite`, icon: <SatelliteIcon />, defaultEnabled: false },
    { key: `traffic`, label: `Traffic`, icon: <TrafficIcon />, defaultEnabled: true },
    { key: `terrain`, label: `Terrain`, icon: <TerrainIcon />, defaultEnabled: false },
    { key: `route`, label: `Route Overlay`, icon: <RouteIcon />, defaultEnabled: true },
  ];

  return (
    <MockProvider>
      <div style={mapBackground}>
        <div style={mapOverlay} />

        {/* Fake map road lines */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          aria-hidden
        >
          <path d="M0 300 Q200 250 400 320 T800 280" stroke="rgba(148,163,184,0.12)" strokeWidth="3" fill="none" />
          <path d="M100 0 Q180 200 150 400 T200 700" stroke="rgba(148,163,184,0.10)" strokeWidth="2" fill="none" />
          <path d="M300 100 Q500 180 700 150 T1200 200" stroke="rgba(148,163,184,0.08)" strokeWidth="2" fill="none" />
          <path d="M0 500 Q300 480 600 520 T1200 490" stroke="rgba(249,115,22,0.15)" strokeWidth="2" fill="none" strokeDasharray="8 4" />
        </svg>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
          <MapLayerToggle
            layers={layers}
            title="Map Layers"
            onLayerChange={(key, enabled) => setLastChange(`${key}: ${enabled ? 'ON' : 'OFF'}`)}
          />

          {lastChange && (
            <div style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(249,115,22,0.15)',
              border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#f97316',
              letterSpacing: '0.06em',
            }}>
              Changed → {lastChange}
            </div>
          )}
        </div>
      </div>
    </MockProvider>
  );
};

/* ── Composition 2 — Full Layer Suite ────────────────────────────── */

/**
 * Full Layer Suite — all available MotoTrack map layers including
 * POI markers, weather overlay, and live traffic data.
 */
export const FullLayerSuite = () => {
  const layers = [
    { key: `satellite2`, label: `Satellite View`, icon: <SatelliteIcon />, defaultEnabled: false },
    { key: `terrain2`, label: `Terrain`, icon: <TerrainIcon />, defaultEnabled: true },
    { key: `traffic2`, label: `Live Traffic`, icon: <TrafficIcon />, defaultEnabled: true },
    { key: `route2`, label: `Planned Route`, icon: <RouteIcon />, defaultEnabled: true },
    { key: `poi2`, label: `Points of Interest`, icon: <PoiIcon />, defaultEnabled: false },
    { key: `weather2`, label: `Weather`, icon: <WeatherIcon />, defaultEnabled: false },
  ];

  return (
    <MockProvider>
      <div style={{ ...mapBackground, justifyContent: 'center', alignItems: 'center' }}>
        <div style={mapOverlay} />

        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          aria-hidden
        >
          <path d="M0 200 Q300 180 600 220 T1200 200" stroke="rgba(148,163,184,0.10)" strokeWidth="2" fill="none" />
          <path d="M0 400 Q400 370 800 410 T1600 390" stroke="rgba(148,163,184,0.08)" strokeWidth="2" fill="none" />
          <path d="M200 0 Q220 300 200 600" stroke="rgba(249,115,22,0.12)" strokeWidth="2" fill="none" strokeDasharray="6 4" />
          <circle cx="350" cy="280" r="4" fill="rgba(249,115,22,0.4)" />
          <circle cx="650" cy="350" r="3" fill="rgba(59,130,246,0.4)" />
          <circle cx="500" cy="180" r="5" fill="rgba(34,197,94,0.3)" />
        </svg>

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f97316', textAlign: 'center' }}>
            Full Layer Suite
          </div>
          <MapLayerToggle
            layers={layers}
            title="Overlays"
          />
          <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', maxWidth: '220px', lineHeight: 1.5 }}>
            Toggle states are persisted in localStorage across sessions.
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/* ── Composition 3 — Minimal / No Icons ─────────────────────────── */

/**
 * Minimal Panel — layers without icons, positioned bottom-left
 * as a compact HUD element during active rides.
 */
export const MinimalPanel = () => {
  const layers = [
    { key: `sat-min`, label: `Satellite`, defaultEnabled: false },
    { key: `traffic-min`, label: `Traffic`, defaultEnabled: true },
    { key: `speed-zones`, label: `Speed Zones`, defaultEnabled: true },
    { key: `checkpoints`, label: `Checkpoints`, defaultEnabled: false },
  ];

  return (
    <MockProvider>
      <div style={{ ...mapBackground, alignItems: 'flex-end', justifyContent: 'flex-start' }}>
        <div style={mapOverlay} />

        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          aria-hidden
        >
          <path d="M0 350 Q250 320 500 360 T1000 340" stroke="rgba(249,115,22,0.18)" strokeWidth="3" fill="none" />
          <path d="M0 370 Q250 340 500 380 T1000 360" stroke="rgba(249,115,22,0.08)" strokeWidth="1" fill="none" />
          <path d="M150 0 Q170 250 155 500" stroke="rgba(148,163,184,0.08)" strokeWidth="2" fill="none" />
          <rect x="300" y="200" width="80" height="50" rx="4" fill="none" stroke="rgba(59,130,246,0.15)" strokeWidth="1" />
          <rect x="500" y="300" width="60" height="40" rx="4" fill="none" stroke="rgba(34,197,94,0.12)" strokeWidth="1" />
        </svg>

        <div style={{ position: 'relative', zIndex: 10 }}>
          <MapLayerToggle
            layers={layers}
            title="Layers"
          />
        </div>
      </div>
    </MockProvider>
  );
};
