import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { MapLibre3D } from './map-libre-3d.js';
import {
  mockCenter,
  mockCenterTransfagarasan,
  mockCenterGrossglockner,
  mockRoute,
  mockRouteTransfagarasan,
} from './map-libre-3d.mock.js';

const previewImageUrl =
  `https://storage.googleapis.com/bit-generated-images/images/image_a_dramatic_3d_terrain_map_rend_0_1779622648229.png`;

// ─── Shared wrapper ───────────────────────────────────────────────────────────

function CompositionShell({ children, title, subtitle }: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `32px`,
          boxSizing: `border-box`,
          fontFamily: `var(--typography-font-family, Inter, sans-serif)`,
        }}
      >
        <div style={{ maxWidth: `1100px`, margin: `0 auto` }}>
          <div style={{ marginBottom: `20px` }}>
            <p
              style={{
                margin: `0 0 4px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.12em`,
                textTransform: `uppercase`,
                color: `#f97316`,
              }}
            >
              MapLibre 3D
            </p>
            <h2
              style={{
                margin: `0 0 4px`,
                fontSize: `22px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.02em`,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <p style={{ margin: 0, fontSize: `14px`, color: `#64748b` }}>
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </MockProvider>
  );
}

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * DefaultView — Stelvio Pass with default 60° pitch and no route.
 */
export const DefaultView = () => {
  return (
    <CompositionShell
      title="Stelvio Pass — Default 3D View"
      subtitle="MapLibre GL JS with terrain-RGB DEM, 60° pitch, no route overlay."
    >
      <div style={{ height: `520px`, borderRadius: `12px`, overflow: `hidden` }}>
        <MapLibre3D
          center={mockCenter}
          zoom={12}
          pitch={60}
          bearing={0}
          height="100%"
        />
      </div>
      <div
        style={{
          marginTop: `16px`,
          display: `grid`,
          gridTemplateColumns: `repeat(3, 1fr)`,
          gap: `12px`,
        }}
      >
        {[
          { label: `Center`, value: `46.5253°N 10.4536°E` },
          { label: `Zoom`, value: `12` },
          { label: `Pitch`, value: `60°` },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `10px`,
              padding: `14px 16px`,
              border: `1px solid rgba(148,163,184,0.12)`,
            }}
          >
            <div style={{ fontSize: `10px`, fontWeight: 700, letterSpacing: `0.1em`, color: `#64748b`, textTransform: `uppercase`, marginBottom: `6px` }}>
              {label}
            </div>
            <div style={{ fontSize: `14px`, fontWeight: 600, color: `#f1f5f9`, fontFamily: `monospace` }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </CompositionShell>
  );
};

/**
 * WithRoute — Stelvio Pass with a glowing orange route polyline.
 */
export const WithRoute = () => {
  return (
    <CompositionShell
      title="Stelvio Pass — Route Overlay"
      subtitle="12-waypoint motorcycle route rendered as a glowing polyline over 3D terrain."
    >
      <div style={{ display: `grid`, gridTemplateColumns: `1fr 300px`, gap: `16px`, alignItems: `start` }}>
        <div style={{ height: `560px`, borderRadius: `12px`, overflow: `hidden` }}>
          <MapLibre3D
            center={mockCenter}
            zoom={13}
            pitch={65}
            bearing={-20}
            route={mockRoute}
            height="100%"
          />
        </div>

        <div style={{ display: `flex`, flexDirection: `column`, gap: `12px` }}>
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              padding: `16px`,
              border: `1px solid rgba(148,163,184,0.12)`,
            }}
          >
            <p style={{ margin: `0 0 12px`, fontSize: `11px`, fontWeight: 700, letterSpacing: `0.1em`, color: `#64748b`, textTransform: `uppercase` }}>
              Route Info
            </p>
            <div style={{ display: `flex`, flexDirection: `column`, gap: `8px` }}>
              {[
                { label: `Waypoints`, value: `${mockRoute.length}` },
                { label: `Start`, value: `46.500°N` },
                { label: `End`, value: `46.540°N` },
                { label: `Pitch`, value: `65°` },
                { label: `Bearing`, value: `-20°` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: `flex`, justifyContent: `space-between`, alignItems: `center` }}>
                  <span style={{ fontSize: `12px`, color: `#64748b` }}>{label}</span>
                  <span style={{ fontSize: `12px`, fontWeight: 600, color: `#f1f5f9`, fontFamily: `monospace` }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              padding: `16px`,
              border: `1px solid rgba(249,115,22,0.2)`,
            }}
          >
            <p style={{ margin: `0 0 8px`, fontSize: `11px`, fontWeight: 700, letterSpacing: `0.1em`, color: `#f97316`, textTransform: `uppercase` }}>
              Route Waypoints
            </p>
            <div style={{ display: `flex`, flexDirection: `column`, gap: `4px`, maxHeight: `200px`, overflowY: `auto` }}>
              {mockRoute.map((pt, i) => (
                <div
                  key={i}
                  style={{
                    display: `flex`,
                    alignItems: `center`,
                    gap: `8px`,
                    padding: `4px 0`,
                    borderBottom: i < mockRoute.length - 1 ? `1px solid rgba(148,163,184,0.06)` : `none`,
                  }}
                >
                  <div
                    style={{
                      width: `18px`,
                      height: `18px`,
                      borderRadius: `50%`,
                      backgroundColor: i === 0 ? `#22c55e` : i === mockRoute.length - 1 ? `#ef4444` : `rgba(249,115,22,0.3)`,
                      border: `1px solid ${i === 0 ? `#22c55e` : i === mockRoute.length - 1 ? `#ef4444` : `rgba(249,115,22,0.6)`}`,
                      display: `flex`,
                      alignItems: `center`,
                      justifyContent: `center`,
                      fontSize: `8px`,
                      fontWeight: 700,
                      color: `#020617`,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ fontSize: `10px`, color: `#94a3b8`, fontFamily: `monospace` }}>
                    {pt.lat.toFixed(4)}, {pt.lng.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: `12px`,
              overflow: `hidden`,
              border: `1px solid rgba(148,163,184,0.12)`,
            }}
          >
            <img
              src={previewImageUrl}
              alt="3D terrain preview"
              style={{ width: `100%`, height: `140px`, objectFit: `cover`, display: `block` }}
            />
          </div>
        </div>
      </div>
    </CompositionShell>
  );
};

/**
 * MultiDestination — Side-by-side comparison of three alpine destinations.
 */
export const MultiDestination = () => {
  const destinations = [
    {
      label: `Stelvio Pass`,
      country: `🇮🇹 Italy`,
      center: mockCenter,
      route: mockRoute,
      pitch: 60,
      bearing: 0,
      zoom: 12,
    },
    {
      label: `Transfăgărășan`,
      country: `🇷🇴 Romania`,
      center: mockCenterTransfagarasan,
      route: mockRouteTransfagarasan,
      pitch: 55,
      bearing: 15,
      zoom: 12,
    },
    {
      label: `Grossglockner`,
      country: `🇦🇹 Austria`,
      center: mockCenterGrossglockner,
      route: [],
      pitch: 70,
      bearing: -30,
      zoom: 11,
    },
  ];

  return (
    <CompositionShell
      title="Alpine Destinations"
      subtitle="Three legendary motorcycle roads rendered in 3D terrain mode."
    >
      <div style={{ display: `grid`, gridTemplateColumns: `repeat(3, 1fr)`, gap: `16px` }}>
        {destinations.map((dest) => (
          <div key={dest.label} style={{ display: `flex`, flexDirection: `column`, gap: `10px` }}>
            <div
              style={{
                display: `flex`,
                alignItems: `center`,
                justifyContent: `space-between`,
                padding: `10px 14px`,
                backgroundColor: `#0f172a`,
                borderRadius: `10px`,
                border: `1px solid rgba(148,163,184,0.12)`,
              }}
            >
              <div>
                <div style={{ fontSize: `13px`, fontWeight: 700, color: `#f1f5f9` }}>{dest.label}</div>
                <div style={{ fontSize: `11px`, color: `#64748b`, marginTop: `2px` }}>{dest.country}</div>
              </div>
              {dest.route.length > 0 && (
                <div
                  style={{
                    padding: `3px 8px`,
                    backgroundColor: `rgba(249,115,22,0.15)`,
                    border: `1px solid rgba(249,115,22,0.3)`,
                    borderRadius: `9999px`,
                    fontSize: `10px`,
                    fontWeight: 700,
                    color: `#f97316`,
                  }}
                >
                  Route
                </div>
              )}
            </div>
            <div style={{ height: `280px`, borderRadius: `10px`, overflow: `hidden` }}>
              <MapLibre3D
                center={dest.center}
                zoom={dest.zoom}
                pitch={dest.pitch}
                bearing={dest.bearing}
                route={dest.route}
                height="100%"
              />
            </div>
            <div style={{ display: `grid`, gridTemplateColumns: `1fr 1fr`, gap: `8px` }}>
              <div
                style={{
                  backgroundColor: `#0f172a`,
                  borderRadius: `8px`,
                  padding: `10px 12px`,
                  border: `1px solid rgba(148,163,184,0.1)`,
                }}
              >
                <div style={{ fontSize: `9px`, fontWeight: 700, letterSpacing: `0.1em`, color: `#64748b`, textTransform: `uppercase`, marginBottom: `4px` }}>
                  Pitch
                </div>
                <div style={{ fontSize: `16px`, fontWeight: 800, color: `#f97316` }}>{dest.pitch}°</div>
              </div>
              <div
                style={{
                  backgroundColor: `#0f172a`,
                  borderRadius: `8px`,
                  padding: `10px 12px`,
                  border: `1px solid rgba(148,163,184,0.1)`,
                }}
              >
                <div style={{ fontSize: `9px`, fontWeight: 700, letterSpacing: `0.1em`, color: `#64748b`, textTransform: `uppercase`, marginBottom: `4px` }}>
                  Zoom
                </div>
                <div style={{ fontSize: `16px`, fontWeight: 800, color: `#f1f5f9` }}>{dest.zoom}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CompositionShell>
  );
};
