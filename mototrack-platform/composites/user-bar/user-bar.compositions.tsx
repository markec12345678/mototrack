import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { UserBar } from './user-bar.js';
import { MOCK_AVATAR_URL } from './user-bar.mock.js';

// ── Shared layout ──────────────────────────────────────────────────────────

const navbarStyle: React.CSSProperties = {
  display: `flex`,
  alignItems: `center`,
  justifyContent: `space-between`,
  padding: `0 32px`,
  height: `64px`,
  backgroundColor: `#0f172a`,
  borderBottom: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 2px 16px rgba(0,0,0,0.5)`,
};

const logoStyle: React.CSSProperties = {
  display: `flex`,
  alignItems: `center`,
  gap: `10px`,
};

const logoIconStyle: React.CSSProperties = {
  width: `32px`,
  height: `32px`,
  borderRadius: `8px`,
  background: `linear-gradient(135deg, #f97316, #ea580c)`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
};

const logoTextStyle: React.CSSProperties = {
  fontSize: `17px`,
  fontWeight: `800`,
  color: `#f1f5f9`,
  letterSpacing: `-0.03em`,
};

const navLinksStyle: React.CSSProperties = {
  display: `flex`,
  gap: `24px`,
};

const navLinkStyle: React.CSSProperties = {
  fontSize: `13px`,
  fontWeight: `500`,
  color: `#94a3b8`,
  textDecoration: `none`,
};

const pageStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
};

const contentStyle: React.CSSProperties = {
  padding: `48px 32px`,
  maxWidth: `800px`,
  margin: `0 auto`,
};

const labelStyle: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: `700`,
  letterSpacing: `0.12em`,
  textTransform: `uppercase` as const,
  color: `#f97316`,
  marginBottom: `8px`,
  marginTop: `0`,
};

const descStyle: React.CSSProperties = {
  fontSize: `14px`,
  color: `#64748b`,
  marginTop: `8px`,
  lineHeight: `1.6`,
};

function MotoTrackLogo() {
  return (
    <div style={logoStyle}>
      <div style={logoIconStyle}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#020617" strokeWidth="2" strokeLinecap="round" />
          <circle cx="9" cy="12" r="3" fill="#020617" />
        </svg>
      </div>
      <span style={logoTextStyle}>MotoTrack</span>
    </div>
  );
}

function NavLinks() {
  return (
    <nav style={navLinksStyle}>
      {[`Races`, `Riders`, `Circuits`, `Live`].map((label) => (
        <a key={label} href="#" style={navLinkStyle}>
          {label}
        </a>
      ))}
    </nav>
  );
}

// ── Compositions ───────────────────────────────────────────────────────────

/**
 * Anonymous state — shows Login and Sign Up buttons.
 * The useAuth hook returns no user (not authenticated).
 */
export const AnonymousUserBar = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <header style={navbarStyle}>
          <MotoTrackLogo />
          <NavLinks />
          <UserBar
            loginHref="/login"
            signupHref="/signup"
          />
        </header>
        <div style={contentStyle}>
          <p style={labelStyle}>Anonymous State</p>
          <p style={{ ...descStyle, marginTop: `0` }}>
            When no user is authenticated, the UserBar renders a ghost{` `}
            <strong style={{ color: `#f1f5f9` }}>Login</strong> button and a primary{` `}
            <strong style={{ color: `#f97316` }}>Sign Up</strong> button.
          </p>
          <div
            style={{
              marginTop: `32px`,
              padding: `24px`,
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              display: `inline-flex`,
              alignItems: `center`,
              gap: `12px`,
            }}
          >
            <UserBar loginHref="/login" signupHref="/signup" />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Authenticated state — avatar trigger + full dropdown menu.
 * Uses the seeded demo user (markec / level 8 / 5430 pts).
 */
export const AuthenticatedUserBar = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <header style={navbarStyle}>
          <MotoTrackLogo />
          <NavLinks />
          <UserBar
            avatarSrc={MOCK_AVATAR_URL}
            profileHref="/profile"
            settingsHref="/settings"
          />
        </header>
        <div style={contentStyle}>
          <p style={labelStyle}>Authenticated State</p>
          <p style={{ ...descStyle, marginTop: `0` }}>
            When a user is authenticated, the UserBar renders an avatar trigger with the user&apos;s
            display name, level badge, and points. Clicking opens a dropdown with profile, settings,
            and logout actions.
          </p>
          <div
            style={{
              marginTop: `32px`,
              padding: `32px`,
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `center`,
            }}
          >
            <UserBar
              avatarSrc={MOCK_AVATAR_URL}
              profileHref="/profile"
              settingsHref="/settings"
            />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Full navbar integration — shows the UserBar in a realistic top navigation bar.
 */
export const InNavbar = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <header style={navbarStyle}>
          <MotoTrackLogo />
          <NavLinks />
          <UserBar
            avatarSrc={MOCK_AVATAR_URL}
            profileHref="/profile"
            settingsHref="/settings"
            loginHref="/login"
            signupHref="/signup"
          />
        </header>
        <div style={contentStyle}>
          <p style={labelStyle}>Navbar Integration</p>
          <p style={{ ...descStyle, marginTop: `0` }}>
            The UserBar is designed to sit flush inside a top navigation bar. It adapts between
            anonymous and authenticated states automatically via the{` `}
            <code style={{ color: `#f97316`, fontSize: `13px` }}>useAuth</code> hook.
          </p>
          <div
            style={{
              marginTop: `32px`,
              display: `grid`,
              gridTemplateColumns: `repeat(auto-fill, minmax(220px, 1fr))`,
              gap: `16px`,
            }}
          >
            {[
              { label: `Avatar + Name`, desc: `Displays user display name and level badge` },
              { label: `Level Badge`, desc: `Gradient badge showing current rider level` },
              { label: `Points`, desc: `Formatted point total shown in trigger` },
              { label: `Dropdown`, desc: `Profile, settings, and logout actions` },
            ].map(({ label, desc }) => (
              <div
                key={label}
                style={{
                  backgroundColor: `#0f172a`,
                  borderRadius: `10px`,
                  padding: `16px`,
                  border: `1px solid rgba(148,163,184,0.12)`,
                }}
              >
                <div
                  style={{
                    fontSize: `11px`,
                    fontWeight: `700`,
                    color: `#f97316`,
                    letterSpacing: `0.08em`,
                    textTransform: `uppercase`,
                    marginBottom: `6px`,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: `13px`, color: `#94a3b8` }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
