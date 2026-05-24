import * as React from 'react';
import { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { GpxImportButton } from './gpx-import-button.js';
import type { ParsedGpxRoute } from './gpx-import-button.js';

const pageStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  padding: `48px 32px`,
  display: `flex`,
  flexDirection: `column`,
  gap: `48px`,
};

const sectionStyle: React.CSSProperties = {
  maxWidth: `640px`,
};

const labelStyle: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: 700,
  letterSpacing: `0.12em`,
  textTransform: `uppercase` as const,
  color: `#f97316`,
  marginBottom: `20px`,
  marginTop: 0,
};

const dividerStyle: React.CSSProperties = {
  height: `1px`,
  backgroundColor: `rgba(148,163,184,0.12)`,
  maxWidth: `640px`,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `12px`,
  padding: `24px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
};

function RoutePreview({ route }: { route: ParsedGpxRoute }) {
  return (
    <div style={cardStyle}>
      <div
        style={{
          fontSize: `11px`,
          fontWeight: 700,
          letterSpacing: `0.1em`,
          textTransform: `uppercase`,
          color: `#f97316`,
          marginBottom: `8px`,
        }}
      >
        Parsed Route
      </div>
      <div
        style={{
          fontSize: `18px`,
          fontWeight: 800,
          color: `#f1f5f9`,
          marginBottom: `16px`,
          letterSpacing: `-0.02em`,
        }}
      >
        {route.name}
      </div>
      <div
        style={{
          display: `grid`,
          gridTemplateColumns: `repeat(2, 1fr)`,
          gap: `12px`,
          marginBottom: `16px`,
        }}
      >
        <div
          style={{
            backgroundColor: `#1e293b`,
            borderRadius: `8px`,
            padding: `12px`,
            border: `1px solid rgba(148,163,184,0.1)`,
          }}
        >
          <div style={{ fontSize: `10px`, color: `#64748b`, fontWeight: 600, letterSpacing: `0.08em`, textTransform: `uppercase`, marginBottom: `4px` }}>
            Waypoints
          </div>
          <div style={{ fontSize: `22px`, fontWeight: 800, color: `#f1f5f9` }}>
            {route.waypoints.length}
          </div>
        </div>
        <div
          style={{
            backgroundColor: `#1e293b`,
            borderRadius: `8px`,
            padding: `12px`,
            border: `1px solid rgba(148,163,184,0.1)`,
          }}
        >
          <div style={{ fontSize: `10px`, color: `#64748b`, fontWeight: 600, letterSpacing: `0.08em`, textTransform: `uppercase`, marginBottom: `4px` }}>
            Track Points
          </div>
          <div style={{ fontSize: `22px`, fontWeight: 800, color: `#f1f5f9` }}>
            {route.geometry.length}
          </div>
        </div>
      </div>
      {route.waypoints.length > 0 && (
        <div>
          <div style={{ fontSize: `11px`, color: `#64748b`, fontWeight: 600, marginBottom: `8px` }}>
            Waypoints
          </div>
          <div style={{ display: `flex`, flexDirection: `column`, gap: `6px` }}>
            {route.waypoints.map((wp, idx) => (
              <div
                key={wp.id}
                style={{
                  display: `flex`,
                  alignItems: `center`,
                  gap: `10px`,
                  padding: `8px 10px`,
                  backgroundColor: `#1e293b`,
                  borderRadius: `6px`,
                  border: `1px solid rgba(148,163,184,0.08)`,
                }}
              >
                <div
                  style={{
                    width: `20px`,
                    height: `20px`,
                    borderRadius: `50%`,
                    backgroundColor: `#f97316`,
                    display: `flex`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    fontSize: `10px`,
                    fontWeight: 800,
                    color: `#020617`,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: `13px`, fontWeight: 600, color: `#f1f5f9` }}>
                    {wp.name ?? `Waypoint ${idx + 1}`}
                  </div>
                  <div style={{ fontSize: `11px`, color: `#64748b`, fontFamily: `monospace` }}>
                    {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Default — idle state ready to import a GPX file.
 */
export const Default = () => {
  const [route, setRoute] = useState<ParsedGpxRoute | null>(null);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>GPX Import Button</p>
          <div style={{ display: `flex`, flexDirection: `column`, gap: `16px` }}>
            <GpxImportButton
              onLoad={(parsed) => setRoute(parsed)}
              onError={(msg) => console.error(msg)}
            />
            {route && <RoutePreview route={route} />}
            {!route && (
              <div
                style={{
                  padding: `16px`,
                  borderRadius: `10px`,
                  border: `1px dashed rgba(148,163,184,0.2)`,
                  color: `#64748b`,
                  fontSize: `13px`,
                  lineHeight: 1.6,
                }}
              >
                Select a <strong style={{ color: `#94a3b8` }}>.gpx</strong> file to parse waypoints and track geometry.
                The parsed route will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * WithSuccessState — simulates a successfully loaded GPX route.
 */
export const WithSuccessState = () => {
  const preloaded: ParsedGpxRoute = {
    name: `Vršič Pass Loop`,
    waypoints: [
      { id: `wpt-0`, name: `Kranjska Gora`, lat: 46.4839, lng: 13.7864 },
      { id: `wpt-1`, name: `Vršič Pass`, lat: 46.4378, lng: 13.7447 },
      { id: `wpt-2`, name: `Trenta`, lat: 46.3997, lng: 13.6981 },
      { id: `wpt-3`, name: `Bovec`, lat: 46.3378, lng: 13.5522 },
    ],
    geometry: [
      { lat: 46.4839, lng: 13.7864 },
      { lat: 46.4650, lng: 13.7720 },
      { lat: 46.4378, lng: 13.7447 },
      { lat: 46.3997, lng: 13.6981 },
      { lat: 46.3378, lng: 13.5522 },
    ],
  };

  const [route, setRoute] = useState<ParsedGpxRoute>(preloaded);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Success State</p>
          <div style={{ display: `flex`, flexDirection: `column`, gap: `16px` }}>
            <GpxImportButton
              onLoad={(parsed) => setRoute(parsed)}
              label="Re-import GPX"
            />
            <RoutePreview route={route} />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * InToolbar — compact usage inside a route planning toolbar.
 */
export const InToolbar = () => {
  const [imported, setImported] = useState<ParsedGpxRoute | null>(null);
  const [error, setError] = useState<string>(``);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Toolbar Integration</p>
          <div
            style={{
              ...cardStyle,
              display: `flex`,
              flexDirection: `column`,
              gap: `20px`,
            }}
          >
            <div
              style={{
                display: `flex`,
                alignItems: `center`,
                justifyContent: `space-between`,
                flexWrap: `wrap`,
                gap: `12px`,
              }}
            >
              <div>
                <div style={{ fontSize: `11px`, color: `#64748b`, fontWeight: 600, letterSpacing: `0.08em`, textTransform: `uppercase`, marginBottom: `4px` }}>
                  Route Planner
                </div>
                <div style={{ fontSize: `18px`, fontWeight: 800, color: `#f1f5f9`, letterSpacing: `-0.02em` }}>
                  {imported ? imported.name : `New Route`}
                </div>
              </div>
              <GpxImportButton
                onLoad={(parsed) => {
                  setImported(parsed);
                  setError(``);
                }}
                onError={(msg) => setError(msg)}
                label="Import GPX"
              />
            </div>

            <div style={dividerStyle} />

            {imported ? (
              <div
                style={{
                  display: `grid`,
                  gridTemplateColumns: `repeat(3, 1fr)`,
                  gap: `12px`,
                }}
              >
                {[
                  { label: `Waypoints`, value: String(imported.waypoints.length) },
                  { label: `Track pts`, value: String(imported.geometry.length) },
                  { label: `Start`, value: imported.waypoints[0]?.name ?? `—` },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      backgroundColor: `#1e293b`,
                      borderRadius: `8px`,
                      padding: `12px`,
                      border: `1px solid rgba(148,163,184,0.1)`,
                    }}
                  >
                    <div style={{ fontSize: `10px`, color: `#64748b`, fontWeight: 600, letterSpacing: `0.08em`, textTransform: `uppercase`, marginBottom: `4px` }}>
                      {label}
                    </div>
                    <div style={{ fontSize: `16px`, fontWeight: 700, color: `#f1f5f9` }}>{value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: `24px`,
                  borderRadius: `8px`,
                  border: `1px dashed rgba(148,163,184,0.15)`,
                  textAlign: `center`,
                  color: `#64748b`,
                  fontSize: `13px`,
                }}
              >
                {error ? (
                  <span style={{ color: `#ef4444` }}>{error}</span>
                ) : (
                  `Import a GPX file to populate the route planner`
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
