import * as React from 'react';
import { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { MotoMap } from '@markec/maps.ui.moto-map';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { HazardMarkersLayer } from './hazard-markers-layer.js';
import { MOCK_HAZARDS } from './hazard-markers-layer.mock.js';

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

const sectionLabel: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: 700,
  letterSpacing: `0.12em`,
  textTransform: `uppercase`,
  color: `#f97316`,
  marginBottom: `8px`,
  marginTop: 0,
};

const infoPanel: React.CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `12px`,
  padding: `16px 20px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
};

/**
 * DefaultLayer — HazardMarkersLayer with all 8 mock hazard types on the map.
 */
export const DefaultLayer = () => {
  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>HazardMarkersLayer — Default</p>
          <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
            8 mock hazards around Sarajevo. Click any marker to see the popup with type, time, confirm count, and Potrdi button.
          </p>
        </div>
        <div style={mapWrap}>
          <MotoMap center={SARAJEVO} zoom={13}>
            <HazardMarkersLayer hazards={MOCK_HAZARDS} lat={43.8563} lng={18.4131} />
          </MotoMap>
        </div>
        <div style={infoPanel}>
          <p style={sectionLabel}>Hazard Types ({MOCK_HAZARDS.length})</p>
          <div style={{ display: `flex`, flexWrap: `wrap`, gap: `8px` }}>
            {MOCK_HAZARDS.map((h) => (
              <div
                key={h.id}
                style={{
                  padding: `4px 10px`,
                  backgroundColor: `rgba(249,115,22,0.08)`,
                  border: `1px solid rgba(249,115,22,0.2)`,
                  borderRadius: `6px`,
                  fontSize: `12px`,
                  color: `#94a3b8`,
                  fontWeight: 600,
                }}
              >
                {h.type}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * WithConfirmCallback — demonstrates the onConfirm callback firing when Potrdi is clicked.
 */
export const WithConfirmCallback = () => {
  const [confirmed, setConfirmed] = useState<string[]>([]);

  const handleConfirm = (id: string) => {
    setConfirmed((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>HazardMarkersLayer — Confirm Callback</p>
          <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
            Click a marker, then press Potrdi to confirm the hazard. Confirmed IDs appear below.
          </p>
        </div>
        <div style={mapWrap}>
          <MotoMap center={SARAJEVO} zoom={13}>
            <HazardMarkersLayer
              hazards={MOCK_HAZARDS}
              lat={43.8563}
              lng={18.4131}
              onConfirm={(id) => handleConfirm(id)}
            />
          </MotoMap>
        </div>
        <div style={infoPanel}>
          <p style={sectionLabel}>Confirmed Hazards ({confirmed.length})</p>
          {confirmed.length === 0 ? (
            <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
              No hazards confirmed yet. Click a marker and press Potrdi.
            </p>
          ) : (
            <div style={{ display: `flex`, flexDirection: `column`, gap: `8px` }}>
              {confirmed.map((id) => {
                const hazard = MOCK_HAZARDS.find((h) => h.id === id);
                return (
                  <div
                    key={id}
                    style={{
                      display: `flex`,
                      alignItems: `center`,
                      gap: `10px`,
                      padding: `8px 12px`,
                      backgroundColor: `rgba(34,197,94,0.08)`,
                      border: `1px solid rgba(34,197,94,0.2)`,
                      borderRadius: `8px`,
                    }}
                  >
                    <span style={{ fontSize: `16px` }}>✅</span>
                    <span style={{ fontSize: `13px`, color: `#94a3b8`, fontWeight: 600 }}>
                      {hazard?.type ?? id}
                    </span>
                    <span style={{ fontSize: `11px`, color: `#64748b`, marginLeft: `auto`, fontFamily: `monospace` }}>
                      {id}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * SingleHazardType — shows only ice hazards to highlight a specific type.
 */
export const SingleHazardType = () => {
  const iceHazards = MOCK_HAZARDS.filter((h) => h.type === `ice`);

  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>HazardMarkersLayer — Ice Only</p>
          <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
            Filtered to show only ice hazard markers. Demonstrates per-type DivIcon coloring.
          </p>
        </div>
        <div style={mapWrap}>
          <MotoMap center={SARAJEVO} zoom={13}>
            <HazardMarkersLayer hazards={iceHazards} lat={43.8563} lng={18.4131} />
          </MotoMap>
        </div>
        <div style={infoPanel}>
          <p style={sectionLabel}>Ice Hazard Details</p>
          <div style={{ display: `flex`, flexDirection: `column`, gap: `8px` }}>
            {iceHazards.map((h) => (
              <div
                key={h.id}
                style={{
                  display: `flex`,
                  alignItems: `center`,
                  gap: `12px`,
                  padding: `10px 14px`,
                  backgroundColor: `rgba(59,130,246,0.08)`,
                  border: `1px solid rgba(59,130,246,0.2)`,
                  borderRadius: `8px`,
                }}
              >
                <span style={{ fontSize: `20px` }}>🧊</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: `13px`, color: `#f1f5f9`, fontWeight: 700 }}>Led</div>
                  <div style={{ fontSize: `11px`, color: `#64748b`, fontFamily: `monospace` }}>
                    {h.lat.toFixed(4)}, {h.lng.toFixed(4)}
                  </div>
                </div>
                <div style={{ textAlign: `right` }}>
                  <div style={{ fontSize: `12px`, color: `#3b82f6`, fontWeight: 700 }}>
                    {h.confirmedCount} ✅
                  </div>
                  <div style={{ fontSize: `10px`, color: `#64748b` }}>potrditev</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
