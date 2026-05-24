import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { MotoMap } from '@markec/maps.ui.moto-map';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { SpeedCameraLayer } from './speed-camera-layer.js';
import { mockSpeedCameras } from './speed-camera-layer.mock.js';

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
 * Default — SpeedCameraLayer with mock cameras around Sarajevo.
 * Yellow 📷 markers with popups showing limit, type, and country.
 */
export const DefaultSpeedCameraLayer = () => {
  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>SpeedCameraLayer — Default</p>
          <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
            Yellow camera markers around Sarajevo. Click a marker to see speed limit, type and country.
          </p>
        </div>
        <div style={mapWrap}>
          <MotoMap center={SARAJEVO} zoom={13}>
            <SpeedCameraLayer cameras={mockSpeedCameras.slice(0, 5)} />
          </MotoMap>
        </div>
        <div style={infoPanel}>
          <p style={sectionLabel}>Cameras in view ({mockSpeedCameras.slice(0, 5).length})</p>
          <div style={{ display: `flex`, flexWrap: `wrap`, gap: `8px` }}>
            {mockSpeedCameras.slice(0, 5).map((cam) => (
              <div
                key={cam.id}
                style={{
                  display: `flex`,
                  alignItems: `center`,
                  gap: `8px`,
                  padding: `6px 12px`,
                  backgroundColor: `rgba(234,179,8,0.1)`,
                  border: `1px solid rgba(234,179,8,0.3)`,
                  borderRadius: `8px`,
                }}
              >
                <span style={{ fontSize: `14px` }}>📷</span>
                <span style={{ fontSize: `12px`, fontWeight: 700, color: `#eab308` }}>{cam.speedLimit} km/h</span>
                <span style={{ fontSize: `11px`, color: `#64748b` }}>{cam.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * MultiCountry — cameras from multiple Balkan countries on a wider view.
 */
export const MultiCountryLayer = () => {
  const CENTER = LatLng.from({ lat: 44.5, lng: 17.5 });

  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>SpeedCameraLayer — Multi-Country</p>
          <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
            Speed cameras across Bosnia, Croatia, Slovenia and Serbia. Zoom in to interact.
          </p>
        </div>
        <div style={mapWrap}>
          <MotoMap center={CENTER} zoom={7}>
            <SpeedCameraLayer cameras={mockSpeedCameras} />
          </MotoMap>
        </div>
        <div style={infoPanel}>
          <p style={sectionLabel}>All cameras ({mockSpeedCameras.length})</p>
          <div
            style={{
              display: `grid`,
              gridTemplateColumns: `repeat(auto-fill, minmax(220px, 1fr))`,
              gap: `8px`,
            }}
          >
            {mockSpeedCameras.map((cam) => (
              <div
                key={cam.id}
                style={{
                  display: `flex`,
                  alignItems: `center`,
                  gap: `10px`,
                  padding: `10px 12px`,
                  backgroundColor: `#0f172a`,
                  border: `1px solid rgba(148,163,184,0.1)`,
                  borderRadius: `8px`,
                }}
              >
                <div
                  style={{
                    width: `32px`,
                    height: `32px`,
                    borderRadius: `50%`,
                    backgroundColor: `#eab308`,
                    display: `flex`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    fontSize: `14px`,
                    flexShrink: 0,
                  }}
                >
                  📷
                </div>
                <div>
                  <div style={{ fontSize: `13px`, fontWeight: 700, color: `#eab308` }}>
                    {cam.speedLimit} km/h
                  </div>
                  <div style={{ fontSize: `11px`, color: `#64748b` }}>
                    {cam.type} · {cam.country}
                  </div>
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
 * SingleCamera — zoomed in on a single speed camera with popup detail.
 */
export const SingleCamera = () => {
  const cam = mockSpeedCameras[2];
  const center = LatLng.from({ lat: cam.lat, lng: cam.lng });

  return (
    <MockProvider>
      <div style={pageWrap}>
        <div>
          <p style={sectionLabel}>SpeedCameraLayer — Single Camera</p>
          <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>
            Zoomed in on a single average-speed camera. Click the marker to open the popup.
          </p>
        </div>
        <div style={mapWrap}>
          <MotoMap center={center} zoom={16}>
            <SpeedCameraLayer cameras={[cam]} />
          </MotoMap>
        </div>
        <div style={infoPanel}>
          <p style={sectionLabel}>Camera Details</p>
          <div style={{ display: `flex`, gap: `32px`, flexWrap: `wrap` }}>
            {[
              { label: `Speed Limit`, value: `${cam.speedLimit} km/h` },
              { label: `Type`, value: cam.type },
              { label: `Country`, value: cam.country },
              { label: `Coordinates`, value: `${cam.lat.toFixed(4)}, ${cam.lng.toFixed(4)}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: `10px`,
                    color: `#64748b`,
                    fontWeight: 700,
                    letterSpacing: `0.08em`,
                    textTransform: `uppercase`,
                    marginBottom: `4px`,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: `18px`, fontWeight: 800, color: `#eab308`, letterSpacing: `-0.02em` }}>
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
