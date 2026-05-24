import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Toggle } from './toggle.js';

/* ── Shared layout helpers ───────────────────────────────────────── */

const page = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '40px 32px',
  fontFamily: 'Inter, system-ui, sans-serif',
} as React.CSSProperties;

const section = {
  maxWidth: '640px',
  margin: '0 auto',
} as React.CSSProperties;

const eyebrow = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '8px',
  marginTop: '0',
};

const heading = {
  margin: '0 0 32px',
  fontSize: '26px',
  fontWeight: 800,
  color: '#f1f5f9',
  letterSpacing: '-0.03em',
};

const divider = {
  height: '1px',
  backgroundColor: 'rgba(148,163,184,0.12)',
  margin: '32px 0',
};

const card = {
  backgroundColor: '#0f172a',
  borderRadius: '14px',
  padding: '24px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
} as React.CSSProperties;

const row = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 0',
  borderBottom: '1px solid rgba(148,163,184,0.08)',
} as React.CSSProperties;

const rowLast = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 0',
} as React.CSSProperties;

const rowLabel = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '2px',
};

const rowTitle = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#f1f5f9',
};

const rowSub = {
  fontSize: '12px',
  color: '#64748b',
};

/* ── Icon helpers ────────────────────────────────────────────────── */

function MicIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v7a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-7 9h2a5 5 0 0 0 10 0h2a7 7 0 0 1-6 6.92V21h3v2H8v-2h3v-2.08A7 7 0 0 1 5 12z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

/* ── Composition 1 — Rider Settings Panel ────────────────────────── */

/**
 * Rider Settings Panel — realistic MotoTrack settings screen
 * showing voice, night mode, and auto-pause toggles.
 */
export const RiderSettingsPanel = () => {
  const [voice, setVoice] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  const [autoPause, setAutoPause] = useState(true);
  const [lapAlert, setLapAlert] = useState(false);
  const [crashDetect, setCrashDetect] = useState(true);

  return (
    <MockProvider>
      <div style={page}>
        <div style={section}>
          <p style={eyebrow}>MotoTrack Settings</p>
          <h2 style={heading}>Rider Preferences</h2>

          <div style={card}>
            <div style={{ marginBottom: '4px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>
              Audio &amp; Display
            </div>

            <div style={row}>
              <div style={rowLabel}>
                <span style={rowTitle}>Voice Guidance</span>
                <span style={rowSub}>Spoken turn-by-turn instructions</span>
              </div>
              <Toggle
                checked={voice}
                onChange={(v) => setVoice(v)}
                icon={<MicIcon />}
                size="md"
                variant="default"
                aria-label="Voice guidance"
              />
            </div>

            <div style={rowLast}>
              <div style={rowLabel}>
                <span style={rowTitle}>Night Mode</span>
                <span style={rowSub}>Dim display for low-light riding</span>
              </div>
              <Toggle
                checked={nightMode}
                onChange={(v) => setNightMode(v)}
                icon={<MoonIcon />}
                size="md"
                variant="warning"
                aria-label="Night mode"
              />
            </div>

            <div style={divider} />

            <div style={{ marginBottom: '4px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>
              Tracking &amp; Safety
            </div>

            <div style={row}>
              <div style={rowLabel}>
                <span style={rowTitle}>Auto-Pause</span>
                <span style={rowSub}>Pause recording when stopped</span>
              </div>
              <Toggle
                checked={autoPause}
                onChange={(v) => setAutoPause(v)}
                icon={<PauseIcon />}
                size="md"
                variant="success"
                aria-label="Auto-pause"
              />
            </div>

            <div style={row}>
              <div style={rowLabel}>
                <span style={rowTitle}>Lap Alerts</span>
                <span style={rowSub}>Vibrate on new best lap time</span>
              </div>
              <Toggle
                checked={lapAlert}
                onChange={(v) => setLapAlert(v)}
                size="md"
                variant="default"
                aria-label="Lap alerts"
              />
            </div>

            <div style={rowLast}>
              <div style={rowLabel}>
                <span style={rowTitle}>Crash Detection</span>
                <span style={rowSub}>Alert emergency contacts on impact</span>
              </div>
              <Toggle
                checked={crashDetect}
                onChange={(v) => setCrashDetect(v)}
                size="md"
                variant="danger"
                aria-label="Crash detection"
              />
            </div>
          </div>

          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'rgba(249,115,22,0.08)', borderRadius: '10px', border: '1px solid rgba(249,115,22,0.2)' }}>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
              <span style={{ color: '#f97316', fontWeight: 600 }}>Active:</span>{' '}
              {[voice && 'Voice', nightMode && 'Night Mode', autoPause && 'Auto-Pause', lapAlert && 'Lap Alerts', crashDetect && 'Crash Detection']
                .filter(Boolean)
                .join(', ') || 'None'}
            </p>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/* ── Composition 2 — Size & Variant Showcase ─────────────────────── */

/**
 * Size & Variant Showcase — all sizes and colour variants side-by-side.
 */
export const SizeAndVariantShowcase = () => {
  const [states, setStates] = useState<Record<string, boolean>>({
    smOff: false, smOn: true,
    mdOff: false, mdOn: true,
    lgOff: false, lgOn: true,
    varDefault: true,
    varSuccess: true,
    varWarning: true,
    varDanger: true,
  });

  const toggle = (key: string) =>
    setStates((prev) => ({ ...prev, [key]: !prev[key] }));

  const sectionTitle = (text: string) => (
    <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#f97316' }}>
      {text}
    </p>
  );

  return (
    <MockProvider>
      <div style={page}>
        <div style={section}>
          <p style={eyebrow}>Component Showcase</p>
          <h2 style={heading}>Sizes &amp; Variants</h2>

          <div style={card}>
            {sectionTitle('Sizes')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', width: '80px' }}>Small</span>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <Toggle size="sm" checked={states.smOff} onChange={() => toggle('smOff')} aria-label="Small off" />
                  <Toggle size="sm" checked={states.smOn} onChange={() => toggle('smOn')} aria-label="Small on" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', width: '80px' }}>Medium</span>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <Toggle size="md" checked={states.mdOff} onChange={() => toggle('mdOff')} aria-label="Medium off" />
                  <Toggle size="md" checked={states.mdOn} onChange={() => toggle('mdOn')} aria-label="Medium on" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', width: '80px' }}>Large</span>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <Toggle size="lg" checked={states.lgOff} onChange={() => toggle('lgOff')} aria-label="Large off" />
                  <Toggle size="lg" checked={states.lgOn} onChange={() => toggle('lgOn')} aria-label="Large on" />
                </div>
              </div>
            </div>

            <div style={divider} />

            {sectionTitle('Colour Variants (checked)')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {([
                { key: 'varDefault', variant: 'default', label: 'Default (Orange)' },
                { key: 'varSuccess', variant: 'success', label: 'Success (Green)' },
                { key: 'varWarning', variant: 'warning', label: 'Warning (Yellow)' },
                { key: 'varDanger', variant: 'danger', label: 'Danger (Red)' },
              ] as const).map(({ key, variant, label }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>{label}</span>
                  <Toggle
                    size="md"
                    variant={variant}
                    checked={states[key]}
                    onChange={() => toggle(key)}
                    aria-label={label}
                  />
                </div>
              ))}
            </div>

            <div style={divider} />

            {sectionTitle('With Labels & Descriptions')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Toggle
                label="Voice Guidance"
                description="Spoken turn-by-turn instructions while riding"
                defaultChecked
                variant="default"
                icon={<MicIcon />}
              />
              <Toggle
                label="Night Mode"
                description="Reduces screen brightness for night riding"
                variant="warning"
                icon={<MoonIcon />}
              />
              <Toggle
                label="Auto-Pause (disabled)"
                description="This setting is locked by your team admin"
                defaultChecked
                disabled
                variant="success"
              />
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/* ── Composition 3 — Quick Controls HUD ─────────────────────────── */

/**
 * Quick Controls HUD — compact toggle strip for in-ride heads-up display.
 */
export const QuickControlsHUD = () => {
  const [controls, setControls] = useState({
    voice: true,
    night: false,
    pause: true,
    record: true,
  });

  const set = (key: keyof typeof controls) => (val: boolean) =>
    setControls((prev) => ({ ...prev, [key]: val }));

  return (
    <MockProvider>
      <div style={{ ...page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <p style={eyebrow}>In-Ride HUD</p>
          <h2 style={{ ...heading, marginBottom: '20px' }}>Quick Controls</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {([
              { key: 'voice', label: 'Voice', sub: 'Guidance', icon: <MicIcon />, variant: 'default' },
              { key: 'night', label: 'Night', sub: 'Mode', icon: <MoonIcon />, variant: 'warning' },
              { key: 'pause', label: 'Auto', sub: 'Pause', icon: <PauseIcon />, variant: 'success' },
              { key: 'record', label: 'Record', sub: 'Session', icon: null, variant: 'danger' },
            ] as const).map(({ key, label, sub, icon, variant }) => {
              const isOn = controls[key];
              return (
                <div
                  key={key}
                  style={{
                    backgroundColor: isOn ? 'rgba(249,115,22,0.08)' : '#0f172a',
                    borderRadius: '14px',
                    padding: '20px',
                    border: `1px solid ${isOn ? 'rgba(249,115,22,0.25)' : 'rgba(148,163,184,0.12)'}`,
                    boxShadow: isOn ? '0 0 20px rgba(249,115,22,0.12)' : '0 2px 8px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: '12px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{sub}</div>
                  </div>
                  <Toggle
                    size="sm"
                    variant={variant}
                    checked={isOn}
                    onChange={set(key)}
                    icon={icon ?? undefined}
                    aria-label={`${label} ${sub}`}
                  />
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
            {Object.entries(controls).map(([k, v]) => (
              <span
                key={k}
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: v ? 'rgba(249,115,22,0.15)' : 'rgba(100,116,139,0.15)',
                  color: v ? '#f97316' : '#64748b',
                  border: `1px solid ${v ? 'rgba(249,115,22,0.3)' : 'rgba(100,116,139,0.2)'}`,
                  textTransform: 'capitalize' as const,
                }}
              >
                {k}: {v ? 'ON' : 'OFF'}
              </span>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
