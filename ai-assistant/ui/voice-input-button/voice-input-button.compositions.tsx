import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { VoiceInputButton } from './voice-input-button.js';

const panelStyle: React.CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `16px`,
  padding: `32px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 4px 24px rgba(0,0,0,0.6)`,
  display: `flex`,
  flexDirection: `column`,
  gap: `24px`,
  maxWidth: `480px`,
  width: `100%`,
};

const labelStyle: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: 700,
  letterSpacing: `0.12em`,
  textTransform: `uppercase`,
  color: `#f97316`,
  margin: 0,
};

const transcriptBoxStyle: React.CSSProperties = {
  backgroundColor: `#020617`,
  borderRadius: `10px`,
  padding: `16px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  minHeight: `56px`,
  display: `flex`,
  alignItems: `center`,
};

/**
 * Default — single VoiceInputButton with live transcript display.
 */
export const Default = () => {
  const [transcript, setTranscript] = useState(``);

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          padding: `40px`,
        }}
      >
        <div style={panelStyle}>
          <p style={labelStyle}>Glasovni vnos — sl-SI</p>

          <div style={{ display: `flex`, alignItems: `center`, gap: `16px` }}>
            <VoiceInputButton onResult={(text) => setTranscript(text)} />
            <div>
              <div style={{ fontSize: `13px`, fontWeight: 600, color: `#f1f5f9`, marginBottom: `4px` }}>
                Kliknite mikrofon
              </div>
              <div style={{ fontSize: `12px`, color: `#64748b` }}>
                Govorite v slovenščini (sl-SI)
              </div>
            </div>
          </div>

          <div style={transcriptBoxStyle}>
            {transcript ? (
              <span style={{ fontSize: `15px`, color: `#f1f5f9`, lineHeight: `1.5` }}>{transcript}</span>
            ) : (
              <span style={{ fontSize: `13px`, color: `#475569`, fontStyle: `italic` }}>
                Prepis se bo prikazal tukaj…
              </span>
            )}
          </div>

          {transcript && (
            <button
              type="button"
              onClick={() => setTranscript(``)}
              style={{
                alignSelf: `flex-start`,
                padding: `6px 14px`,
                backgroundColor: `rgba(148,163,184,0.1)`,
                border: `1px solid rgba(148,163,184,0.2)`,
                borderRadius: `8px`,
                color: `#94a3b8`,
                fontSize: `12px`,
                fontWeight: 600,
                cursor: `pointer`,
              }}
            >
              Počisti
            </button>
          )}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * InChatInput — VoiceInputButton embedded inside a chat input bar.
 */
export const InChatInput = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [draft, setDraft] = useState(``);

  const handleResult = (text: string) => {
    setDraft(text);
  };

  const handleSend = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [...prev, draft.trim()]);
    setDraft(``);
  };

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          display: `flex`,
          flexDirection: `column`,
          padding: `40px`,
          gap: `24px`,
        }}
      >
        <div style={{ maxWidth: `560px`, width: `100%`, margin: `0 auto`, display: `flex`, flexDirection: `column`, gap: `24px` }}>
          <p style={labelStyle}>AI Asistent — Glasovni vnos</p>

          {/* Message list */}
          <div
            style={{
              display: `flex`,
              flexDirection: `column`,
              gap: `10px`,
              minHeight: `200px`,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: `center`,
                  padding: `40px 20px`,
                  color: `#475569`,
                  fontSize: `14px`,
                }}
              >
                Začnite pogovor z glasovnim vnosom ali tipkanjem.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: `flex-end`,
                  backgroundColor: `#f97316`,
                  color: `#020617`,
                  borderRadius: `12px 12px 2px 12px`,
                  padding: `10px 16px`,
                  fontSize: `14px`,
                  fontWeight: 500,
                  maxWidth: `80%`,
                  boxShadow: `0 2px 8px rgba(249,115,22,0.3)`,
                }}
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Input bar */}
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `14px`,
              border: `1px solid rgba(148,163,184,0.15)`,
              padding: `8px 8px 8px 16px`,
              display: `flex`,
              alignItems: `center`,
              gap: `8px`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
            }}
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === `Enter`) handleSend(); }}
              placeholder="Napišite ali govorite sporočilo…"
              style={{
                flex: 1,
                background: `transparent`,
                border: `none`,
                outline: `none`,
                color: `#f1f5f9`,
                fontSize: `14px`,
                fontFamily: `inherit`,
              }}
            />
            <VoiceInputButton onResult={(text) => handleResult(text)} />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!draft.trim()}
              style={{
                padding: `8px 16px`,
                backgroundColor: draft.trim() ? `#f97316` : `rgba(249,115,22,0.2)`,
                color: draft.trim() ? `#020617` : `#64748b`,
                border: `none`,
                borderRadius: `10px`,
                fontWeight: 700,
                fontSize: `13px`,
                cursor: draft.trim() ? `pointer` : `default`,
                transition: `all 0.15s ease`,
              }}
            >
              Pošlji
            </button>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * DisabledState — VoiceInputButton in a disabled state.
 */
export const DisabledState = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          padding: `40px`,
        }}
      >
        <div style={panelStyle}>
          <p style={labelStyle}>Onemogočeno stanje</p>

          <div style={{ display: `flex`, alignItems: `center`, gap: `24px` }}>
            <div style={{ display: `flex`, flexDirection: `column`, alignItems: `center`, gap: `8px` }}>
              <VoiceInputButton onResult={() => {}} />
              <span style={{ fontSize: `11px`, color: `#64748b`, fontFamily: `monospace` }}>enabled</span>
            </div>
            <div style={{ display: `flex`, flexDirection: `column`, alignItems: `center`, gap: `8px` }}>
              <VoiceInputButton onResult={() => {}} disabled />
              <span style={{ fontSize: `11px`, color: `#64748b`, fontFamily: `monospace` }}>disabled</span>
            </div>
          </div>

          <div
            style={{
              padding: `12px 16px`,
              backgroundColor: `rgba(148,163,184,0.05)`,
              borderRadius: `8px`,
              border: `1px solid rgba(148,163,184,0.1)`,
              fontSize: `13px`,
              color: `#64748b`,
              lineHeight: `1.6`,
            }}
          >
            Ko je gumb onemogočen, glasovni vnos ni na voljo. Komponenta se samodejno skrije, 
            če brskalnik ne podpira Web Speech API.
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
