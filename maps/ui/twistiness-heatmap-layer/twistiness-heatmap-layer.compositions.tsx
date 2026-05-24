import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TwistinessHeatmapLayer } from './twistiness-heatmap-layer.js';
import { mockTrack, STRAIGHT_TRACK } from './twistiness-heatmap-layer.mock.js';

// Leaflet CSS must be loaded for the map to render correctly
import 'leaflet/dist/leaflet.css';

const MAP_STYLE: React.CSSProperties = {
  width: '100%',
  height: '480px',
  borderRadius: '12px',
  overflow: 'hidden',
};

const WRAPPER_STYLE: React.CSSProperties = {
  padding: '24px',
  minHeight: '100vh',
  background: 'var(--colors-surface-background)',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 'var(--typography-sizes-body-small)',
  fontWeight: 'var(--typography-font-weight-semi-bold)',
  color: 'var(--colors-text-muted)',
  letterSpacing: 'var(--typography-letter-spacing-wider)',
  textTransform: 'uppercase',
  marginBottom: '12px',
};

const HEADING_STYLE: React.CSSProperties = {
  fontSize: 'var(--typography-sizes-heading-h4)',
  fontWeight: 'var(--typography-font-weight-bold)',
  color: 'var(--colors-text-default)',
  margin: '0 0 4px',
};

const DESC_STYLE: React.CSSProperties = {
  fontSize: 'var(--typography-sizes-body-default)',
  color: 'var(--colors-text-muted)',
  margin: '0 0 16px',
};

const LEGEND_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  marginBottom: '12px',
};

const LEGEND_ITEM_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: 'var(--typography-sizes-body-small)',
  color: 'var(--colors-text-secondary)',
};

function LegendDot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

function Legend() {
  return (
    <div style={LEGEND_STYLE}>
      <div style={LEGEND_ITEM_STYLE}>
        <LegendDot color="rgb(0,200,0)" />
        Twisty
      </div>
      <div style={LEGEND_ITEM_STYLE}>
        <LegendDot color="rgb(255,200,0)" />
        Moderate
      </div>
      <div style={LEGEND_ITEM_STYLE}>
        <LegendDot color="rgb(255,0,0)" />
        Straight
      </div>
    </div>
  );
}

const twistyTrack = mockTrack(46.0569, 14.5058, 120);
const straightTrack = STRAIGHT_TRACK;

/**
 * Mixed track — alternating twisty and straight sections.
 * Green = twisty corners, red = straight sections.
 */
export const MixedTrack = () => {
  const center: [number, number] = [twistyTrack[0].lat, twistyTrack[0].lng];

  return (
    <MockProvider>
      <div style={WRAPPER_STYLE}>
        <div>
          <p style={LABEL_STYLE}>Twistiness Heatmap</p>
          <h2 style={HEADING_STYLE}>Mixed Track — Twisty &amp; Straight</h2>
          <p style={DESC_STYLE}>
            A 120-point track with alternating twisty corners and straight sections.
            The heatmap colors each 500 m window from green (twisty) to red (straight).
          </p>
          <Legend />
          <div style={MAP_STYLE}>
            <MapContainer
              center={center}
              zoom={14}
              style={{ width: '100%', height: '100%' }}
              zoomControl
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              <TwistinessHeatmapLayer track={twistyTrack} weight={5} opacity={0.9} />
            </MapContainer>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Straight track — all segments should render red.
 */
export const StraightTrack = () => {
  const center: [number, number] = [straightTrack[0].lat, straightTrack[0].lng];

  return (
    <MockProvider>
      <div style={WRAPPER_STYLE}>
        <div>
          <p style={LABEL_STYLE}>Twistiness Heatmap</p>
          <h2 style={HEADING_STYLE}>Straight Track</h2>
          <p style={DESC_STYLE}>
            A perfectly straight track — all segments should appear red, indicating
            zero bearing change across the 500 m sliding window.
          </p>
          <Legend />
          <div style={MAP_STYLE}>
            <MapContainer
              center={center}
              zoom={14}
              style={{ width: '100%', height: '100%' }}
              zoomControl
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              <TwistinessHeatmapLayer track={straightTrack} weight={6} opacity={1} />
            </MapContainer>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Thick strokes — same mixed track with heavier weight for visibility.
 */
export const ThickStrokes = () => {
  const center: [number, number] = [twistyTrack[0].lat, twistyTrack[0].lng];

  return (
    <MockProvider>
      <div style={WRAPPER_STYLE}>
        <div>
          <p style={LABEL_STYLE}>Twistiness Heatmap</p>
          <h2 style={HEADING_STYLE}>Thick Stroke Variant</h2>
          <p style={DESC_STYLE}>
            Same mixed track rendered with a heavier stroke weight (10 px) for
            dashboards and large-screen displays.
          </p>
          <Legend />
          <div style={MAP_STYLE}>
            <MapContainer
              center={center}
              zoom={14}
              style={{ width: '100%', height: '100%' }}
              zoomControl
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              <TwistinessHeatmapLayer track={twistyTrack} weight={10} opacity={0.85} />
            </MapContainer>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
