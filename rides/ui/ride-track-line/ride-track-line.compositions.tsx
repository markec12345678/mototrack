import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RideTrackLine } from './ride-track-line.js';
import { MOCK_TRACK_TREBEVIC, MOCK_TRACK_BASCARSIJA, MOCK_TRACK_EMPTY } from './ride-track-line.mock.js';

const pageWrap: React.CSSProperties = {
  backgroundColor: `#020617`,
  minHeight: `100vh`,
  padding: `32px`,
  display: `flex`,
  flexDirection: `column`,
  gap: `24px`,
  boxSizing: `border-box`,
};

const sectionLabel: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: 700,
  letterSpacing: `0.12em`,
  textTransform: `uppercase` as const,
  color: `#f97316`,
  marginBottom: `8px`,
  marginTop: 0,
};

const sectionDesc: React.CSSProperties = {
  margin: 0,
  fontSize: `13px`,
  color: `#64748b`,
};

const mapWrap: React.CSSProperties = {
  width: `100%`,
  height: `480px`,
  borderRadius: `16px`,
  overflow: `hidden`,
};

/**
 * TrebevicAscent — a mountain road track with fitBounds focused on mount.
 */
export const TrebevicAscent = () => {
  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>RideTrackLine — Trebević Ascent</p>
          <p style={sectionDesc}>
            Green polyline with start (green) and end (red) markers. fitBounds is active on mount.
          </p>
        </div>
        <div style={mapWrap}>
          <RideTrackLine track={MOCK_TRACK_TREBEVIC} focused />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * BascarsijLoop — a short urban loop track without auto-fitBounds.
 */
export const BascarsijLoop = () => {
  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>RideTrackLine — Baščaršija Loop</p>
          <p style={sectionDesc}>
            Short urban loop track. focused is false — map stays at default center.
          </p>
        </div>
        <div style={mapWrap}>
          <RideTrackLine track={MOCK_TRACK_BASCARSIJA} />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * EmptyTrack — renders the empty state when no track points are provided.
 */
export const EmptyTrack = () => {
  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>RideTrackLine — Empty Track</p>
          <p style={sectionDesc}>
            When no track points are provided, an empty state is shown.
          </p>
        </div>
        <div style={mapWrap}>
          <RideTrackLine track={MOCK_TRACK_EMPTY} focused />
        </div>
      </div>
    </MockProvider>
  );
};
