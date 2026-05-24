import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { DeviationAlert } from './deviation-alert.js';
import type { DeviationState } from './deviation-alert.js';

// ── Shared layout helpers ──────────────────────────────────────────────────

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 32px`,
          display: `flex`,
          flexDirection: `column`,
          gap: `48px`,
          fontFamily: `Inter, system-ui, sans-serif`,
        }}
      >
        {children}
      </div>
    </MockProvider>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: `0 0 20px`,
        fontSize: `11px`,
        fontWeight: 700,
        letterSpacing: `0.12em`,
        textTransform: `uppercase`,
        color: `#f97316`,
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: `1px`,
        backgroundColor: `rgba(148,163,184,0.12)`,
      }}
    />
  );
}

// ── Map background mock ────────────────────────────────────────────────────

function MapMock({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: `relative`,
        width: `100%`,
        maxWidth: `480px`,
        height: `260px`,
        borderRadius: `16px`,
        overflow: `hidden`,
        border: `1px solid rgba(148,163,184,0.12)`,
        background: `linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f2027 100%)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.6)`,
      }}
    >
      {/* Simulated road lines */}
      <svg
        style={{ position: `absolute`, inset: 0, width: `100%`, height: `100%`, opacity: 0.18 }}
        viewBox="0 0 480 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 200 Q120 160 240 130 Q360 100 480 80" stroke="#94a3b8" strokeWidth="24" strokeLinecap="round" />
        <path d="M0 200 Q120 160 240 130 Q360 100 480 80" stroke="#020617" strokeWidth="3" strokeLinecap="round" strokeDasharray="20 16" />
        <path d="M0 240 Q100 220 200 200 Q340 170 480 140" stroke="#475569" strokeWidth="14" strokeLinecap="round" />
        <path d="M60 0 Q80 80 100 130 Q130 190 160 260" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
        <circle cx="240" cy="130" r="6" fill="#f97316" />
      </svg>

      {/* Overlay label */}
      <div
        style={{
          position: `absolute`,
          bottom: `12px`,
          left: `12px`,
          fontSize: `10px`,
          color: `rgba(148,163,184,0.5)`,
          letterSpacing: `0.08em`,
          fontWeight: 600,
          textTransform: `uppercase`,
        }}
      >
        Live Map Preview
      </div>

      {/* Alert overlay */}
      <div
        style={{
          position: `absolute`,
          top: `14px`,
          left: `50%`,
          transform: `translateX(-50%)`,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
          gap: `8px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Compositions ───────────────────────────────────────────────────────────

/**
 * All States — showcases all four deviation states side by side.
 */
export const AllStates = () => {
  const states: Array<{ state: DeviationState; meters: number; label: string }> = [
    { state: `on-track`, meters: 0, label: `On Track` },
    { state: `minor`, meters: 45, label: `Minor (45 m)` },
    { state: `moderate`, meters: 320, label: `Moderate (320 m)` },
    { state: `lost`, meters: 1200, label: `Lost (1.2 km)` },
  ];

  return (
    <PageWrapper>
      <div style={{ maxWidth: `700px` }}>
        <SectionLabel>Deviation States — Color Escalation</SectionLabel>
        <p style={{ margin: `0 0 28px`, fontSize: `13px`, color: `#64748b`, lineHeight: 1.6 }}>
          The pill escalates from green → yellow → orange → red as the rider deviates further from the planned route.
          When the route is lost, a Recompute button appears.
        </p>

        <div style={{ display: `flex`, flexDirection: `column`, gap: `16px` }}>
          {states.map(({ state, meters, label }) => (
            <div
              key={state}
              style={{
                display: `flex`,
                alignItems: `center`,
                gap: `20px`,
                padding: `16px 20px`,
                backgroundColor: `#0f172a`,
                borderRadius: `12px`,
                border: `1px solid rgba(148,163,184,0.1)`,
              }}
            >
              <div style={{ width: `120px`, fontSize: `12px`, color: `#64748b`, fontWeight: 600 }}>{label}</div>
              <DeviationAlert state={state} deviationMeters={meters} onRecompute={() => {}} />
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

/**
 * FloatingOnMap — pills overlaid on a simulated map background, as they'd appear in a real navigation UI.
 */
export const FloatingOnMap = () => {
  const [currentState, setCurrentState] = useState<DeviationState>(`on-track`);
  const [recomputed, setRecomputed] = useState(false);

  const stateMeters: Record<DeviationState, number> = {
    'on-track': 0,
    minor: 38,
    moderate: 275,
    lost: 1450,
  };

  const handleRecompute = () => {
    setRecomputed(true);
    setTimeout(() => {
      setCurrentState(`on-track`);
      setRecomputed(false);
    }, 1200);
  };

  return (
    <PageWrapper>
      <div style={{ maxWidth: `560px` }}>
        <SectionLabel>Floating on Map</SectionLabel>

        <MapMock>
          <DeviationAlert
            state={recomputed ? `on-track` : currentState}
            deviationMeters={stateMeters[currentState]}
            onRecompute={handleRecompute}
          />
        </MapMock>

        <div style={{ marginTop: `24px` }}>
          <p style={{ margin: `0 0 12px`, fontSize: `11px`, color: `#64748b`, fontWeight: 600, letterSpacing: `0.08em`, textTransform: `uppercase` }}>
            Simulate deviation state
          </p>
          <div style={{ display: `flex`, flexWrap: `wrap`, gap: `8px` }}>
            {([`on-track`, `minor`, `moderate`, `lost`] as DeviationState[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setCurrentState(s); setRecomputed(false); }}
                style={{
                  padding: `6px 14px`,
                  borderRadius: `8px`,
                  border: `1px solid ${currentState === s ? `#f97316` : `rgba(148,163,184,0.2)`}`,
                  backgroundColor: currentState === s ? `rgba(249,115,22,0.15)` : `transparent`,
                  color: currentState === s ? `#f97316` : `#94a3b8`,
                  fontSize: `12px`,
                  fontWeight: 600,
                  cursor: `pointer`,
                  fontFamily: `inherit`,
                  transition: `all 0.15s ease`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

/**
 * WithDistances — shows the pill with various distance values and units.
 */
export const WithDistances = () => {
  const examples: Array<{ state: DeviationState; meters: number; description: string }> = [
    { state: `on-track`, meters: 0, description: `No deviation — distance hidden` },
    { state: `minor`, meters: 12, description: `12 m — metres display` },
    { state: `minor`, meters: 99, description: `99 m — metres display` },
    { state: `moderate`, meters: 500, description: `500 m — metres display` },
    { state: `moderate`, meters: 999, description: `999 m — just below km threshold` },
    { state: `lost`, meters: 1000, description: `1.0 km — kilometre display` },
    { state: `lost`, meters: 3750, description: `3.8 km — kilometre display` },
  ];

  return (
    <PageWrapper>
      <div style={{ maxWidth: `640px` }}>
        <SectionLabel>Distance Display</SectionLabel>
        <p style={{ margin: `0 0 24px`, fontSize: `13px`, color: `#64748b`, lineHeight: 1.6 }}>
          Distances below 1 000 m are shown in metres; at or above 1 000 m they switch to kilometres.
          When the deviation is zero the distance badge is hidden.
        </p>

        <div style={{ display: `flex`, flexDirection: `column`, gap: `12px` }}>
          {examples.map(({ state, meters, description }) => (
            <div
              key={`${state}-${meters}`}
              style={{
                display: `flex`,
                alignItems: `center`,
                gap: `20px`,
                padding: `14px 18px`,
                backgroundColor: `#0f172a`,
                borderRadius: `10px`,
                border: `1px solid rgba(148,163,184,0.08)`,
              }}
            >
              <DeviationAlert state={state} deviationMeters={meters} onRecompute={() => {}} />
              <span style={{ fontSize: `12px`, color: `#475569`, flex: 1 }}>{description}</span>
            </div>
          ))}
        </div>

        <Divider />

        <div style={{ marginTop: `32px` }}>
          <SectionLabel>Lost State — Recompute CTA</SectionLabel>
          <p style={{ margin: `0 0 20px`, fontSize: `13px`, color: `#64748b`, lineHeight: 1.6 }}>
            When the state is <code style={{ color: `#f87171`, backgroundColor: `rgba(239,68,68,0.1)`, padding: `1px 5px`, borderRadius: `4px` }}>lost</code>,
            a Recompute button appears next to the pill to let the rider request a new route calculation.
          </p>
          <DeviationAlert state="lost" deviationMeters={2300} onRecompute={() => {}} />
        </div>
      </div>
    </PageWrapper>
  );
};
