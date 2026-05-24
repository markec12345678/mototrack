import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { QuickPrompts } from './quick-prompts.js';
import type { QuickPrompt } from './quick-prompts.js';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '0 0 48px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '16px',
  marginTop: 0,
  paddingLeft: '24px',
};

const feedbackStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#94a3b8',
  paddingLeft: '24px',
  marginTop: '16px',
  minHeight: '20px',
};

const selectedBadgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 14px',
  borderRadius: '9999px',
  backgroundColor: 'rgba(249,115,22,0.15)',
  border: '1px solid rgba(249,115,22,0.35)',
  fontSize: '13px',
  color: '#f97316',
  fontWeight: 600,
};

/**
 * Default — full Slovenian prompt chips with selection feedback.
 */
export const Default = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div>
          <p style={labelStyle}>Predlogi za AI asistenta</p>
          <QuickPrompts onSelect={(label) => setSelected(label)} />
          <div style={feedbackStyle}>
            {selected ? (
              <span style={selectedBadgeStyle}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {selected}
              </span>
            ) : (
              <span>Izberi predlog za začetek pogovora…</span>
            )}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * CustomPrompts — custom set of route-related chips.
 */
export const CustomPrompts = () => {
  const [selected, setSelected] = useState<string | null>(null);

  const customPrompts: QuickPrompt[] = [
    { id: `a`, label: `Najboljša pot čez Stelvio Pass` },
    { id: `b`, label: `Vremenska napoved za Col du Galibier` },
    { id: `c`, label: `Parkirišča pri Grossglockner` },
    { id: `d`, label: `Restavracije na poti čez Furkapass` },
    { id: `e`, label: `Bencinska črpalka pred Timmelsjoch` },
    { id: `f`, label: `Alternativna pot mimo Brennerja` },
  ];

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div>
          <p style={labelStyle}>Alpske poti</p>
          <QuickPrompts
            prompts={customPrompts}
            onSelect={(label) => setSelected(label)}
          />
          <div style={feedbackStyle}>
            {selected ? (
              <span style={selectedBadgeStyle}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {selected}
              </span>
            ) : (
              <span>Izberi predlog za začetek pogovora…</span>
            )}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * InChatContext — chips rendered inside a realistic AI chat shell.
 */
export const InChatContext = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <MockProvider>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Chat header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(148,163,184,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2C5.13 2 2 5.13 2 9s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12.5A5.5 5.5 0 1 1 9 3.5a5.5 5.5 0 0 1 0 11zM9 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-.75 3.75v3h1.5v-3h-1.5z" fill="white" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>MotoTrack AI</div>
            <div style={{ fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
              Na voljo
            </div>
          </div>
        </div>

        {/* Chat body */}
        <div style={{ flex: 1, padding: '32px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '24px' }}>
          {/* Welcome message */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12C2 12 3.5 9 5 7C6.5 5 8.5 5 9.5 4C10.5 3 11 2 11 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="2" cy="12" r="1.25" fill="white" />
                <circle cx="11" cy="2" r="1.25" fill="white" />
              </svg>
            </div>
            <div
              style={{
                backgroundColor: '#0f172a',
                borderRadius: '0 12px 12px 12px',
                padding: '14px 18px',
                border: '1px solid rgba(148,163,184,0.1)',
                maxWidth: '480px',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px', color: '#f1f5f9', lineHeight: '1.6' }}>
                Pozdravljeni! Sem vaš MotoTrack AI asistent. 🏍️ Pomagam vam načrtovati poti, preveriti vreme in najti storitve na poti. Kaj vas zanima?
              </p>
            </div>
          </div>

          {/* Selected prompt echo */}
          {selected && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  backgroundColor: '#f97316',
                  borderRadius: '12px 0 12px 12px',
                  padding: '12px 18px',
                  maxWidth: '400px',
                }}
              >
                <p style={{ margin: 0, fontSize: '14px', color: '#020617', fontWeight: 600, lineHeight: '1.5' }}>
                  {selected}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts + input */}
        <div style={{ borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: '12px' }}>
          <QuickPrompts onSelect={(label) => setSelected(label)} />
          <div style={{ padding: '12px 16px 16px', display: 'flex', gap: '10px' }}>
            <div
              style={{
                flex: 1,
                backgroundColor: '#0f172a',
                border: '1px solid rgba(148,163,184,0.15)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#64748b',
              }}
            >
              {selected ? selected : `Vnesite sporočilo…`}
            </div>
            <button
              type="button"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#f97316',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="#020617" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
