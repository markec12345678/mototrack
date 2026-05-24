import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { IconButton } from './icon-button.js';
import {
  BellIcon,
  SearchIcon,
  SettingsIcon,
  MapPinIcon,
  PlusIcon,
  MinusIcon,
  LayersIcon,
  TrashIcon,
  UserIcon,
  FlagIcon,
  CompassIcon,
  XIcon,
} from './icons.js';

const panelStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '16px',
  padding: '32px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '20px',
  marginTop: '0',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap' as const,
};

const captionStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#64748b',
  marginTop: '8px',
  fontFamily: 'monospace',
};

/**
 * All Variants — ghost, filled, and danger across all sizes.
 */
export const AllVariants = () => {
  return (
    <MockProvider>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Ghost */}
        <div style={panelStyle}>
          <p style={labelStyle}>Ghost Variant</p>
          <div style={rowStyle}>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<BellIcon />} variant="ghost" size="sm" aria-label="Notifications" title="Notifications" />
              <p style={captionStyle}>sm</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<BellIcon />} variant="ghost" size="md" aria-label="Notifications" title="Notifications" />
              <p style={captionStyle}>md</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<BellIcon />} variant="ghost" size="lg" aria-label="Notifications" title="Notifications" />
              <p style={captionStyle}>lg</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<SearchIcon />} variant="ghost" size="md" aria-label="Search" title="Search" />
              <p style={captionStyle}>search</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<SettingsIcon />} variant="ghost" size="md" aria-label="Settings" title="Settings" />
              <p style={captionStyle}>settings</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<UserIcon />} variant="ghost" size="md" aria-label="Profile" title="Profile" />
              <p style={captionStyle}>profile</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<BellIcon />} variant="ghost" size="md" disabled aria-label="Disabled" title="Disabled" />
              <p style={captionStyle}>disabled</p>
            </div>
          </div>
        </div>

        {/* Filled */}
        <div style={panelStyle}>
          <p style={labelStyle}>Filled Variant</p>
          <div style={rowStyle}>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<PlusIcon />} variant="filled" size="sm" aria-label="Add" title="Add" />
              <p style={captionStyle}>sm</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<PlusIcon />} variant="filled" size="md" aria-label="Add" title="Add" />
              <p style={captionStyle}>md</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<PlusIcon />} variant="filled" size="lg" aria-label="Add" title="Add" />
              <p style={captionStyle}>lg</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<MapPinIcon />} variant="filled" size="md" aria-label="Location" title="My Location" />
              <p style={captionStyle}>location</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<FlagIcon />} variant="filled" size="md" aria-label="Flag" title="Flag" />
              <p style={captionStyle}>flag</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<PlusIcon />} variant="filled" size="md" disabled aria-label="Disabled" title="Disabled" />
              <p style={captionStyle}>disabled</p>
            </div>
          </div>
        </div>

        {/* Danger */}
        <div style={panelStyle}>
          <p style={labelStyle}>Danger Variant</p>
          <div style={rowStyle}>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<TrashIcon />} variant="danger" size="sm" aria-label="Delete" title="Delete" />
              <p style={captionStyle}>sm</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<TrashIcon />} variant="danger" size="md" aria-label="Delete" title="Delete" />
              <p style={captionStyle}>md</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<TrashIcon />} variant="danger" size="lg" aria-label="Delete" title="Delete" />
              <p style={captionStyle}>lg</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<XIcon />} variant="danger" size="md" aria-label="Remove" title="Remove" />
              <p style={captionStyle}>remove</p>
            </div>
            <div style={{ textAlign: 'center' as const }}>
              <IconButton icon={<TrashIcon />} variant="danger" size="md" disabled aria-label="Disabled" title="Disabled" />
              <p style={captionStyle}>disabled</p>
            </div>
          </div>
        </div>

      </div>
    </MockProvider>
  );
};

/**
 * Header Actions — ghost icon buttons as used in a dark app header.
 */
export const HeaderActions = () => {
  const [active, setActive] = useState<string | null>(null);

  return (
    <MockProvider>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '40px' }}>
        {/* Simulated header bar */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderBottom: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '12px',
            padding: '0 24px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            marginBottom: '32px',
          }}
        >
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FlagIcon />
            </div>
            <span style={{ fontSize: '15px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              MotoTrack
            </span>
          </div>

          {/* Header action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <IconButton
              icon={<SearchIcon />}
              variant="ghost"
              size="sm"
              aria-label="Search"
              title="Search"
              active={active === 'search'}
              onClick={() => setActive(active === 'search' ? null : 'search')}
            />
            <IconButton
              icon={<BellIcon />}
              variant="ghost"
              size="sm"
              aria-label="Notifications"
              title="Notifications"
              active={active === 'bell'}
              onClick={() => setActive(active === 'bell' ? null : 'bell')}
            />
            <IconButton
              icon={<SettingsIcon />}
              variant="ghost"
              size="sm"
              aria-label="Settings"
              title="Settings"
              active={active === 'settings'}
              onClick={() => setActive(active === 'settings' ? null : 'settings')}
            />
            <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(148,163,184,0.15)', margin: '0 4px' }} />
            <IconButton
              icon={<UserIcon />}
              variant="filled"
              size="sm"
              aria-label="Profile"
              title="My Profile"
            />
          </div>
        </div>

        {/* Info */}
        <div style={panelStyle}>
          <p style={{ ...labelStyle, marginBottom: '8px' }}>Header Action Pattern</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
            Ghost buttons for secondary actions (search, notifications, settings) with a filled primary button for the main CTA (profile). Click to toggle active state.
          </p>
          {active && (
            <div
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                backgroundColor: 'rgba(249,115,22,0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(249,115,22,0.25)',
                fontSize: '13px',
                color: '#f97316',
                fontWeight: '600',
              }}
            >
              Active: {active}
            </div>
          )}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Floating Map Controls — filled and ghost buttons as floating map overlays.
 */
export const FloatingMapControls = () => {
  const [zoom, setZoom] = useState(12);
  const [layer, setLayer] = useState<'satellite' | 'terrain' | 'street'>('street');

  const layers: Array<'satellite' | 'terrain' | 'street'> = ['satellite', 'terrain', 'street'];

  return (
    <MockProvider>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh', padding: '40px' }}>
        {/* Simulated map area */}
        <div
          style={{
            position: 'relative',
            height: '480px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
            border: '1px solid rgba(148,163,184,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          }}
        >
          {/* Decorative map grid */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Decorative road lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 240 Q 200 180 400 240 T 800 240" stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="12 6" />
            <path d="M 100 0 Q 180 200 160 480" stroke="#94a3b8" strokeWidth="2" fill="none" />
            <path d="M 300 0 Q 350 200 320 480" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
          </svg>

          {/* Map label */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', color: '#f97316', textTransform: 'uppercase', marginBottom: '8px' }}>
              Live Race Map
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Zoom: {zoom} · Layer: {layer}
            </div>
          </div>

          {/* Zoom controls — top right */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <IconButton
              icon={<PlusIcon />}
              variant="filled"
              size="md"
              aria-label="Zoom in"
              title="Zoom in"
              onClick={() => setZoom((z) => Math.min(z + 1, 20))}
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.6)' }}
            />
            <IconButton
              icon={<MinusIcon />}
              variant="ghost"
              size="md"
              aria-label="Zoom out"
              title="Zoom out"
              onClick={() => setZoom((z) => Math.max(z - 1, 1))}
              style={{ backgroundColor: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(148,163,184,0.2)' }}
            />
          </div>

          {/* Layer switcher — top left */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {layers.map((l) => (
              <IconButton
                key={l}
                icon={<LayersIcon />}
                variant={layer === l ? 'filled' : 'ghost'}
                size="sm"
                aria-label={`${l} layer`}
                title={`${l.charAt(0).toUpperCase() + l.slice(1)} layer`}
                active={layer === l}
                onClick={() => setLayer(l)}
                style={layer !== l ? { backgroundColor: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(148,163,184,0.2)' } : undefined}
              />
            ))}
          </div>

          {/* Bottom controls */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              display: 'flex',
              gap: '8px',
            }}
          >
            <IconButton
              icon={<CompassIcon />}
              variant="ghost"
              size="md"
              aria-label="Reset bearing"
              title="Reset bearing"
              style={{ backgroundColor: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(148,163,184,0.2)' }}
            />
            <IconButton
              icon={<MapPinIcon />}
              variant="filled"
              size="md"
              aria-label="My location"
              title="My location"
              style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.6)' }}
            />
          </div>

          {/* Danger — remove waypoint */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
            <IconButton
              icon={<TrashIcon />}
              variant="danger"
              size="sm"
              aria-label="Remove waypoint"
              title="Remove waypoint"
            />
          </div>
        </div>

        <div style={{ ...panelStyle, marginTop: '24px' }}>
          <p style={{ ...labelStyle, marginBottom: '8px' }}>Floating Map Controls Pattern</p>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
            Filled buttons for primary actions (zoom in, my location), ghost buttons with glass morphism for secondary controls, danger for destructive waypoint removal. Try the zoom and layer controls above.
          </p>
        </div>
      </div>
    </MockProvider>
  );
};
