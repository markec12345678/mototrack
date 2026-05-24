import { type CSSProperties } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ChatHeaderTrigger } from './chat-header-trigger.js';

/* ── Shared styles ─────────────────────────────────────────────────────────── */

const pageStyle: CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  display: `flex`,
  flexDirection: `column`,
  alignItems: `stretch`,
};

const headerStyle: CSSProperties = {
  backgroundColor: `#0f172a`,
  borderBottom: `1px solid rgba(148,163,184,0.12)`,
  height: `60px`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `space-between`,
  padding: `0 24px`,
  boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
};

const brandStyle: CSSProperties = {
  display: `flex`,
  alignItems: `center`,
  gap: `10px`,
};

const logoStyle: CSSProperties = {
  width: `32px`,
  height: `32px`,
  borderRadius: `8px`,
  background: `linear-gradient(135deg, #f97316, #ea580c)`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  fontSize: `16px`,
};

const brandNameStyle: CSSProperties = {
  fontSize: `15px`,
  fontWeight: `800`,
  color: `#f1f5f9`,
  letterSpacing: `-0.02em`,
  fontFamily: `system-ui, sans-serif`,
};

const navStyle: CSSProperties = {
  display: `flex`,
  alignItems: `center`,
  gap: `24px`,
};

const navLinkStyle: CSSProperties = {
  fontSize: `13px`,
  fontWeight: `500`,
  color: `#94a3b8`,
  textDecoration: `none`,
  fontFamily: `system-ui, sans-serif`,
};

const actionsStyle: CSSProperties = {
  display: `flex`,
  alignItems: `center`,
  gap: `4px`,
};

const contentStyle: CSSProperties = {
  flex: 1,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  padding: `48px 32px`,
};

const heroStyle: CSSProperties = {
  textAlign: `center`,
  maxWidth: `520px`,
};

const labelStyle: CSSProperties = {
  margin: `0 0 8px`,
  fontSize: `11px`,
  fontWeight: `700`,
  letterSpacing: `0.12em`,
  textTransform: `uppercase`,
  color: `#f97316`,
  fontFamily: `system-ui, sans-serif`,
};

const titleStyle: CSSProperties = {
  margin: `0 0 12px`,
  fontSize: `32px`,
  fontWeight: `800`,
  color: `#f1f5f9`,
  letterSpacing: `-0.03em`,
  lineHeight: `1.1`,
  fontFamily: `system-ui, sans-serif`,
};

const descStyle: CSSProperties = {
  margin: `0 0 32px`,
  fontSize: `15px`,
  color: `#94a3b8`,
  lineHeight: `1.6`,
  fontFamily: `system-ui, sans-serif`,
};

const hintStyle: CSSProperties = {
  display: `inline-flex`,
  alignItems: `center`,
  gap: `8px`,
  padding: `8px 16px`,
  backgroundColor: `rgba(249,115,22,0.1)`,
  border: `1px solid rgba(249,115,22,0.25)`,
  borderRadius: `9999px`,
  fontSize: `12px`,
  fontWeight: `600`,
  color: `#f97316`,
  fontFamily: `system-ui, sans-serif`,
};

/**
 * Default — ChatHeaderTrigger placed inside a realistic MotoTrack app header.
 * Click the 💬 icon in the top-right to open the MotoChat panel.
 */
export const Default = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <header style={headerStyle}>
          <div style={brandStyle}>
            <div style={logoStyle}>🏍️</div>
            <span style={brandNameStyle}>MotoTrack</span>
          </div>
          <nav style={navStyle}>
            {[`Poti`, `Vreme`, `Skupnost`, `Tekmovanja`].map((item) => (
              <a key={item} href="#" style={navLinkStyle}>
                {item}
              </a>
            ))}
          </nav>
          <div style={actionsStyle}>
            <ChatHeaderTrigger />
          </div>
        </header>
        <main style={contentStyle}>
          <div style={heroStyle}>
            <p style={labelStyle}>AI Asistent</p>
            <h1 style={titleStyle}>Vaš MotoChat je pripravljen</h1>
            <p style={descStyle}>
              Kliknite ikono 💬 v zgornjem desnem kotu, da odprete MotoChat AI asistenta.
              Vprašajte ga o poteh, vremenu ali motociklizmu.
            </p>
            <div style={hintStyle}>
              <span>💬</span>
              <span>Kliknite ikono v glavi strani</span>
            </div>
          </div>
        </main>
      </div>
    </MockProvider>
  );
};

/**
 * WithCustomSubtitle — trigger with a custom subtitle shown inside the panel.
 */
export const WithCustomSubtitle = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <header style={headerStyle}>
          <div style={brandStyle}>
            <div style={logoStyle}>🏍️</div>
            <span style={brandNameStyle}>MotoTrack</span>
          </div>
          <nav style={navStyle}>
            {[`Alpske poti`, `Vreme`, `Navigacija`].map((item) => (
              <a key={item} href="#" style={navLinkStyle}>
                {item}
              </a>
            ))}
          </nav>
          <div style={actionsStyle}>
            <ChatHeaderTrigger subtitle="Alpski AI vodnik za motocikliste" />
          </div>
        </header>
        <main style={contentStyle}>
          <div style={heroStyle}>
            <p style={labelStyle}>Alpske poti</p>
            <h1 style={titleStyle}>Odkrijte gorske prelaze</h1>
            <p style={descStyle}>
              MotoChat vam pomaga načrtovati pot čez Stelvio, Grossglockner in druge legendarne
              alpske prelaze. Kliknite 💬 za začetek.
            </p>
            <div style={hintStyle}>
              <span>🏔️</span>
              <span>Prilagojeni predlogi za alpske poti</span>
            </div>
          </div>
        </main>
      </div>
    </MockProvider>
  );
};

/**
 * InMinimalHeader — trigger in a compact minimal header alongside other actions.
 */
export const InMinimalHeader = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <header
          style={{
            ...headerStyle,
            height: `52px`,
            backgroundColor: `rgba(15,23,42,0.95)`,
            backdropFilter: `blur(12px)`,
            WebkitBackdropFilter: `blur(12px)`,
            borderBottom: `1px solid rgba(148,163,184,0.08)`,
          }}
        >
          <div style={brandStyle}>
            <span style={{ fontSize: `20px` }}>🏍️</span>
            <span
              style={{
                ...brandNameStyle,
                fontSize: `13px`,
                color: `#94a3b8`,
              }}
            >
              MotoTrack
            </span>
          </div>
          <div style={{ ...actionsStyle, gap: `2px` }}>
            <div
              style={{
                width: `32px`,
                height: `32px`,
                borderRadius: `9999px`,
                display: `flex`,
                alignItems: `center`,
                justifyContent: `center`,
                color: `#64748b`,
                fontSize: `14px`,
                cursor: `pointer`,
              }}
              title="Iskanje"
            >
              🔍
            </div>
            <div
              style={{
                width: `32px`,
                height: `32px`,
                borderRadius: `9999px`,
                display: `flex`,
                alignItems: `center`,
                justifyContent: `center`,
                color: `#64748b`,
                fontSize: `14px`,
                cursor: `pointer`,
              }}
              title="Obvestila"
            >
              🔔
            </div>
            <ChatHeaderTrigger subtitle="Vaš AI sopotnik na vsakem izletu" />
          </div>
        </header>
        <main style={contentStyle}>
          <div style={heroStyle}>
            <p style={labelStyle}>Minimalni vmesnik</p>
            <h1 style={titleStyle}>Kompaktna glava strani</h1>
            <p style={descStyle}>
              ChatHeaderTrigger se brezhibno vklopi med ostale akcijske gumbe v glavi strani.
              Kliknite 💬 za odprtje MotoChat panela.
            </p>
            <div style={hintStyle}>
              <span>✨</span>
              <span>Animirana oranžna pika signalizira razpoložljivost</span>
            </div>
          </div>
        </main>
      </div>
    </MockProvider>
  );
};
