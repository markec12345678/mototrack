import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TileProvider } from '@markec/maps.entities.tile-provider';
import { TileStylePicker } from './tile-style-picker.js';
import { BUILT_IN_PROVIDERS } from './built-in-providers.js';

const mapBackground: React.CSSProperties = {
  position: `relative`,
  width: `100%`,
  height: `480px`,
  background: `linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)`,
  borderRadius: `16px`,
  overflow: `hidden`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 8px 32px rgba(0,0,0,0.7)`,
};

const gridOverlay: React.CSSProperties = {
  position: `absolute`,
  inset: 0,
  backgroundImage: `linear-gradient(rgba(148,163,184,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.05) 1px, transparent 1px)`,
  backgroundSize: `40px 40px`,
};

const mapLabel: React.CSSProperties = {
  position: `absolute`,
  top: `50%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`,
  textAlign: `center`,
  pointerEvents: `none`,
};

const controlsCorner: React.CSSProperties = {
  position: `absolute`,
  bottom: `16px`,
  right: `16px`,
};

const pageWrap: React.CSSProperties = {
  backgroundColor: `#020617`,
  minHeight: `100vh`,
  padding: `40px`,
  display: `flex`,
  flexDirection: `column`,
  gap: `32px`,
};

const infoPanel: React.CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `12px`,
  padding: `20px 24px`,
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
 * Default — picker with all 5 built-in tile styles, floating over a simulated map.
 */
export const Default = () => {
  const [activeKey, setActiveKey] = useState(`streets`);

  const activeProvider = BUILT_IN_PROVIDERS.find((p) => p.key === activeKey);

  return (
    <MockProvider>
      <div style={pageWrap}>
        <div style={mapBackground}>
          <div style={gridOverlay} />
          <svg
            style={{ position: `absolute`, inset: 0, width: `100%`, height: `100%`, opacity: 0.12 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 240 Q 200 180 400 240 T 800 240"
              stroke="#f97316"
              strokeWidth="3"
              fill="none"
              strokeDasharray="12 6"
            />
            <path d="M 160 0 Q 180 200 160 480" stroke="#94a3b8" strokeWidth="2" fill="none" />
            <path d="M 320 0 Q 350 200 320 480" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
          </svg>

          <div style={mapLabel}>
            <div style={{ fontSize: `11px`, fontWeight: 700, letterSpacing: `0.12em`, color: `#f97316`, textTransform: `uppercase`, marginBottom: `8px` }}>
              Live Race Map
            </div>
            <div style={{ fontSize: `13px`, color: `#64748b` }}>
              Active style: <span style={{ color: `#f1f5f9`, fontWeight: 600 }}>{activeProvider?.label ?? activeKey}</span>
            </div>
          </div>

          <div style={controlsCorner}>
            <TileStylePicker
              activeKey={activeKey}
              onSelect={(p) => setActiveKey(p.key)}
            />
          </div>
        </div>

        <div style={infoPanel}>
          <p style={sectionLabel}>Active Tile Provider</p>
          <div style={{ display: `flex`, flexDirection: `column`, gap: `4px` }}>
            <div style={{ fontSize: `13px`, color: `#f1f5f9`, fontWeight: 600 }}>{activeProvider?.label}</div>
            <div style={{ fontSize: `11px`, color: `#64748b`, fontFamily: `monospace`, wordBreak: `break-all` }}>
              {activeProvider?.urlTemplate}
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * WithSlotProviders — built-in styles plus two custom slot-registered providers.
 */
export const WithSlotProviders = () => {
  const [activeKey, setActiveKey] = useState(`dark`);

  const customProviders: (TileProvider & { previewUrl?: string })[] = [
    {
      key: `custom-moto`,
      label: `MotoTrack`,
      urlTemplate: `https://tiles.example.com/mototrack/{z}/{x}/{y}.png`,
      attribution: `&copy; MotoTrack`,
      maxZoom: 18,
      previewUrl: `https://storage.googleapis.com/bit-generated-images/images/image_miniature_map_tile_preview_in__0_1779622612243.png`,
    },
    {
      key: `custom-race`,
      label: `Race Circuit`,
      urlTemplate: `https://tiles.example.com/race/{z}/{x}/{y}.png`,
      attribution: `&copy; RaceCircuit`,
      maxZoom: 20,
      previewUrl: `https://storage.googleapis.com/bit-generated-images/images/image_miniature_satellite_map_tile_p_0_1779622625201.png`,
    },
  ];

  return (
    <MockProvider>
      <div style={pageWrap}>
        <div style={mapBackground}>
          <div style={gridOverlay} />
          <div style={mapLabel}>
            <div style={{ fontSize: `11px`, fontWeight: 700, letterSpacing: `0.12em`, color: `#f97316`, textTransform: `uppercase`, marginBottom: `8px` }}>
              7 Styles Available
            </div>
            <div style={{ fontSize: `13px`, color: `#64748b` }}>
              5 built-in + 2 registered providers
            </div>
          </div>
          <div style={controlsCorner}>
            <TileStylePicker
              activeKey={activeKey}
              onSelect={(p) => setActiveKey(p.key)}
              providers={customProviders}
            />
          </div>
        </div>

        <div style={infoPanel}>
          <p style={sectionLabel}>Slot-Registered Providers</p>
          <div style={{ display: `flex`, flexDirection: `column`, gap: `12px` }}>
            {customProviders.map((p) => (
              <div key={p.key} style={{ display: `flex`, alignItems: `center`, gap: `12px` }}>
                <img
                  src={p.previewUrl}
                  alt={p.label}
                  style={{ width: 40, height: 40, borderRadius: 6, objectFit: `cover`, border: `1px solid rgba(148,163,184,0.2)` }}
                />
                <div>
                  <div style={{ fontSize: `13px`, color: `#f1f5f9`, fontWeight: 600 }}>{p.label}</div>
                  <div style={{ fontSize: `11px`, color: `#64748b` }}>key: {p.key}</div>
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
 * PreSelectedSatellite — picker opened with satellite pre-selected.
 */
export const PreSelectedSatellite = () => {
  const [activeKey, setActiveKey] = useState(`satellite`);

  return (
    <MockProvider>
      <div style={pageWrap}>
        <div style={mapBackground}>
          <div style={gridOverlay} />
          <div style={mapLabel}>
            <div style={{ fontSize: `11px`, fontWeight: 700, letterSpacing: `0.12em`, color: `#f97316`, textTransform: `uppercase`, marginBottom: `8px` }}>
              Satellite View
            </div>
            <div style={{ fontSize: `13px`, color: `#64748b` }}>
              Pre-selected: <span style={{ color: `#f1f5f9`, fontWeight: 600 }}>Satellite</span>
            </div>
          </div>
          <div style={controlsCorner}>
            <TileStylePicker
              activeKey={activeKey}
              onSelect={(p) => setActiveKey(p.key)}
            />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
