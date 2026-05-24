import * as React from 'react';
import { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { MotoMap } from './moto-map.js';
import type { MapPolyline } from './polyline-type.js';
import type { MapMarker } from './map-marker-type.js';
import type { DraggableWaypoint } from './draggable-waypoint-type.js';

const SARAJEVO = LatLng.from({ lat: 43.8563, lng: 18.4131 });

const pageWrap: React.CSSProperties = {
  backgroundColor: `#020617`,
  minHeight: `100vh`,
  padding: `32px`,
  display: `flex`,
  flexDirection: `column`,
  gap: `24px`,
  boxSizing: `border-box`,
};

const mapWrap: React.CSSProperties = {
  width: `100%`,
  height: `520px`,
  borderRadius: `16px`,
  overflow: `hidden`,
};

const infoPanel: React.CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `12px`,
  padding: `16px 20px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
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

/**
 * Default — MotoMap centered on Sarajevo with dark tile style,
 * floating TileStylePicker and MapLayerToggle overlays.
 */
export const DefaultMap = () => {
  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>MotoMap — Default</p>
          <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
            Dark tile style, floating controls. Click to add waypoints.
          </p>
        </div>
        <div style={mapWrap}>
          <MotoMap center={SARAJEVO} zoom={13} />
        </div>
      </div>
    </MockProvider>
  );
};

const ROUTE_POINTS: LatLng[] = [
  LatLng.from({ lat: 43.8563, lng: 18.4131 }),
  LatLng.from({ lat: 43.862, lng: 18.422 }),
  LatLng.from({ lat: 43.871, lng: 18.435 }),
  LatLng.from({ lat: 43.878, lng: 18.448 }),
  LatLng.from({ lat: 43.882, lng: 18.462 }),
  LatLng.from({ lat: 43.875, lng: 18.478 }),
  LatLng.from({ lat: 43.865, lng: 18.49 }),
];

const TRACK_POINTS: LatLng[] = [
  LatLng.from({ lat: 43.8563, lng: 18.4131 }),
  LatLng.from({ lat: 43.859, lng: 18.417 }),
  LatLng.from({ lat: 43.863, lng: 18.424 }),
  LatLng.from({ lat: 43.868, lng: 18.431 }),
];

const POLYLINES: MapPolyline[] = [
  {
    points: ROUTE_POINTS,
    color: `#3b82f6`,
    weight: 4,
    dashArray: `8 4`,
  },
];

const MARKERS: MapMarker[] = [
  { latlng: LatLng.from({ lat: 43.8563, lng: 18.4131 }), popup: `Start — Sarajevo City Center` },
  { latlng: LatLng.from({ lat: 43.865, lng: 18.49 }), popup: `Finish — Pale Junction` },
  { latlng: LatLng.from({ lat: 43.878, lng: 18.448 }), popup: `Fuel stop — 47 km` },
];

/**
 * ActiveRide — MotoMap with a planned route polyline, recorded track,
 * rider position, and POI markers.
 */
export const ActiveRide = () => {
  const riderPos = LatLng.from({ lat: 43.868, lng: 18.431 });

  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>MotoMap — Active Ride</p>
          <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
            Planned route (blue dashed), recorded track (orange solid), rider position (orange dot), and POI markers.
          </p>
        </div>
        <div style={mapWrap}>
          <MotoMap
            center={LatLng.from({ lat: 43.868, lng: 18.445 })}
            zoom={12}
            polylines={POLYLINES}
            markers={MARKERS}
            rideTrack={TRACK_POINTS}
            riderPosition={riderPos}
          />
        </div>
        <div style={infoPanel}>
          <p style={sectionLabel}>Ride Stats</p>
          <div style={{ display: `flex`, gap: `32px`, flexWrap: `wrap` as const }}>
            {[
              { label: `Distance`, value: `47.2 km` },
              { label: `Elapsed`, value: `38 min` },
              { label: `Top Speed`, value: `112 km/h` },
              { label: `Waypoints`, value: `3` },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: `10px`, color: `#64748b`, fontWeight: 700, letterSpacing: `0.08em`, textTransform: `uppercase` as const, marginBottom: `4px` }}>
                  {label}
                </div>
                <div style={{ fontSize: `20px`, fontWeight: 800, color: `#f1f5f9`, letterSpacing: `-0.02em` }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * WaypointPlanner — click on the map to add draggable waypoints.
 * Waypoints can be dragged to new positions or removed via popup.
 */
export const WaypointPlanner = () => {
  const [waypoints, setWaypoints] = useState<DraggableWaypoint[]>([
    { id: `wp-1`, latlng: LatLng.from({ lat: 43.862, lng: 18.408 }) },
    { id: `wp-2`, latlng: LatLng.from({ lat: 43.872, lng: 18.43 }) },
    { id: `wp-3`, latlng: LatLng.from({ lat: 43.858, lng: 18.445 }) },
  ]);

  const handleMapClick = (latlng: LatLng) => {
    const id = `wp-${Date.now()}`;
    setWaypoints((prev) => [...prev, { id, latlng }]);
  };

  const handleDrag = (id: string, latlng: LatLng) => {
    setWaypoints((prev) =>
      prev.map((wp) => (wp.id === id ? { ...wp, latlng } : wp))
    );
  };

  const handleRemove = (id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  };

  const routePolyline: MapPolyline[] =
    waypoints.length > 1
      ? [
          {
            points: waypoints.map((wp) => wp.latlng),
            color: `#f97316`,
            weight: 3,
            dashArray: `6 3`,
          },
        ]
      : [];

  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>MotoMap — Waypoint Planner</p>
          <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
            Click anywhere on the map to add a waypoint. Drag to reposition. Click a marker to remove it.
          </p>
        </div>
        <div style={mapWrap}>
          <MotoMap
            center={SARAJEVO}
            zoom={13}
            draggableWaypoints={waypoints}
            onDrag={handleDrag}
            onRemove={handleRemove}
            onMapClick={handleMapClick}
            polylines={routePolyline}
          />
        </div>
        <div style={infoPanel}>
          <p style={sectionLabel}>Waypoints ({waypoints.length})</p>
          {waypoints.length === 0 ? (
            <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
              Click the map to add your first waypoint.
            </p>
          ) : (
            <div style={{ display: `flex`, flexDirection: `column` as const, gap: `8px` }}>
              {waypoints.map((wp, idx) => (
                <div
                  key={wp.id}
                  style={{
                    display: `flex`,
                    alignItems: `center`,
                    gap: `12px`,
                    padding: `8px 12px`,
                    backgroundColor: `rgba(249,115,22,0.08)`,
                    borderRadius: `8px`,
                    border: `1px solid rgba(249,115,22,0.2)`,
                  }}
                >
                  <div
                    style={{
                      width: `24px`,
                      height: `24px`,
                      borderRadius: `50%`,
                      backgroundColor: `#f97316`,
                      display: `flex`,
                      alignItems: `center`,
                      justifyContent: `center`,
                      fontSize: `11px`,
                      fontWeight: 800,
                      color: `#020617`,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, fontFamily: `monospace`, fontSize: `12px`, color: `#94a3b8` }}>
                    {wp.latlng.lat.toFixed(4)}, {wp.latlng.lng.toFixed(4)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(wp.id)}
                    style={{
                      padding: `4px 10px`,
                      backgroundColor: `rgba(239,68,68,0.15)`,
                      border: `1px solid rgba(239,68,68,0.3)`,
                      borderRadius: `6px`,
                      color: `#ef4444`,
                      fontSize: `11px`,
                      fontWeight: 600,
                      cursor: `pointer`,
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MockProvider>
  );
};
