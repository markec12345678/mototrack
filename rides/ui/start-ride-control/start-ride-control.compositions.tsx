import { useState, type CSSProperties } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { StartRideControl } from './start-ride-control.js';

const pageStyle: CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
  justifyContent: `center`,
  padding: `40px 24px`,
  gap: `32px`,
};

const labelStyle: CSSProperties = {
  fontSize: `11px`,
  fontWeight: 700,
  letterSpacing: `0.12em`,
  textTransform: `uppercase`,
  color: `#f97316`,
  margin: 0,
};

const cardStyle: CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `20px`,
  padding: `40px 32px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 8px 32px rgba(0,0,0,0.6)`,
  width: `100%`,
  maxWidth: `600px`,
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
  gap: `24px`,
};

const eventLogStyle: CSSProperties = {
  width: `100%`,
  maxWidth: `600px`,
  backgroundColor: `#0f172a`,
  borderRadius: `12px`,
  padding: `16px 20px`,
  border: `1px solid rgba(148,163,184,0.12)`,
};

/**
 * Default — idle state with the large "Začni vožnjo" button.
 * Opens the Pre-Ride checklist modal on click.
 */
export const Default = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: `center` }}>
            <p style={labelStyle}>Kontrola vožnje</p>
            <h2
              style={{
                margin: `8px 0 0`,
                fontSize: `22px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.02em`,
              }}
            >
              Pripravljeni za vožnjo?
            </h2>
            <p style={{ margin: `8px 0 0`, fontSize: `14px`, color: `#64748b` }}>
              Pritisni gumb za začetek — najprej preveri opremo.
            </p>
          </div>
          <StartRideControl />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * WithEventLog — shows ride lifecycle events (saved / discarded) in a log panel.
 */
export const WithEventLog = () => {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (msg: string) => {
    const time = new Date().toLocaleTimeString(`sl-SI`);
    setEvents((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 8));
  };

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: `center` }}>
            <p style={labelStyle}>Interaktivna demonstracija</p>
            <h2
              style={{
                margin: `8px 0 0`,
                fontSize: `22px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.02em`,
              }}
            >
              Celoten potek vožnje
            </h2>
          </div>
          <StartRideControl
            onRideSaved={(id) => addEvent(`✅ Vožnja shranjena — ID: ${id}`)}
            onRideDiscarded={() => addEvent(`🗑️ Vožnja zavržena`)}
          />
        </div>

        <div style={eventLogStyle}>
          <p
            style={{
              margin: `0 0 12px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.1em`,
              textTransform: `uppercase`,
              color: `#64748b`,
            }}
          >
            Dnevnik dogodkov
          </p>
          {events.length === 0 ? (
            <p style={{ margin: 0, fontSize: `13px`, color: `#475569`, fontStyle: `italic` }}>
              Dogodki se bodo prikazali tukaj...
            </p>
          ) : (
            <div style={{ display: `flex`, flexDirection: `column`, gap: `6px` }}>
              {events.map((ev, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: `13px`,
                    color: i === 0 ? `#f1f5f9` : `#64748b`,
                    fontFamily: `monospace`,
                    padding: `6px 10px`,
                    backgroundColor: i === 0 ? `rgba(249,115,22,0.08)` : `transparent`,
                    borderRadius: `6px`,
                    border: i === 0 ? `1px solid rgba(249,115,22,0.2)` : `1px solid transparent`,
                    transition: `all 0.2s ease`,
                  }}
                >
                  {ev}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * MobileView — compact layout simulating a mobile screen.
 */
export const MobileView = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
          padding: `24px 16px`,
        }}
      >
        <div
          style={{
            width: `390px`,
            backgroundColor: `#020617`,
            borderRadius: `40px`,
            border: `2px solid rgba(148,163,184,0.15)`,
            overflow: `hidden`,
            boxShadow: `0 24px 64px rgba(0,0,0,0.8)`,
          }}
        >
          <div
            style={{
              padding: `14px 24px 8px`,
              display: `flex`,
              justifyContent: `space-between`,
              alignItems: `center`,
            }}
          >
            <span style={{ fontSize: `12px`, fontWeight: 700, color: `#f1f5f9` }}>9:41</span>
            <div style={{ display: `flex`, gap: `6px`, alignItems: `center` }}>
              <span style={{ fontSize: `10px`, color: `#94a3b8` }}>●●●</span>
              <span style={{ fontSize: `10px`, color: `#94a3b8` }}>WiFi</span>
              <span style={{ fontSize: `10px`, color: `#94a3b8` }}>100%</span>
            </div>
          </div>

          <div
            style={{
              padding: `8px 24px 16px`,
              borderBottom: `1px solid rgba(148,163,184,0.1)`,
            }}
          >
            <p style={{ ...labelStyle, marginBottom: `4px` }}>MotoTrack</p>
            <h3
              style={{
                margin: 0,
                fontSize: `20px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.02em`,
              }}
            >
              Začni vožnjo
            </h3>
          </div>

          <div
            style={{
              padding: `40px 24px`,
              display: `flex`,
              flexDirection: `column`,
              alignItems: `center`,
              gap: `24px`,
              minHeight: `360px`,
            }}
          >
            <StartRideControl />
          </div>

          <div
            style={{
              padding: `12px 24px 24px`,
              borderTop: `1px solid rgba(148,163,184,0.1)`,
              display: `flex`,
              justifyContent: `space-around`,
            }}
          >
            {[`🏠`, `🗺️`, `▶️`, `📊`, `👤`].map((icon, i) => (
              <div
                key={i}
                style={{
                  fontSize: `20px`,
                  opacity: i === 2 ? 1 : 0.4,
                  filter: i === 2 ? `drop-shadow(0 0 6px rgba(249,115,22,0.8))` : `none`,
                }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
