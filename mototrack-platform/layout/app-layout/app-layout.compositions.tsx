import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { AppLayout } from './app-layout.js';
import {
  MOCK_NAVIGATION_ITEMS,
  MOCK_HEADER_ACTIONS,
  MOCK_DASHBOARD_PANELS,
} from './app-layout.mock.js';

/* ── Shared mock page content ───────────────────────────────────────────────── */

const pageStyle: React.CSSProperties = {
  padding: `32px`,
  maxWidth: `960px`,
  margin: `0 auto`,
};

const labelStyle: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: 700,
  letterSpacing: `0.12em`,
  textTransform: `uppercase` as const,
  color: `#f97316`,
  marginBottom: `8px`,
  marginTop: `0`,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `12px`,
  padding: `20px 24px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
  marginBottom: `16px`,
};

const statGridStyle: React.CSSProperties = {
  display: `grid`,
  gridTemplateColumns: `repeat(auto-fill, minmax(160px, 1fr))`,
  gap: `16px`,
  marginBottom: `16px`,
};

const statCardStyle: React.CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `10px`,
  padding: `16px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  textAlign: `center` as const,
};

function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div style={statCardStyle}>
      <div style={{ fontSize: `10px`, fontWeight: 700, letterSpacing: `0.1em`, color: `#64748b`, textTransform: `uppercase`, marginBottom: `8px` }}>
        {label}
      </div>
      <div style={{ display: `flex`, alignItems: `baseline`, justifyContent: `center`, gap: `4px` }}>
        <span style={{ fontSize: `26px`, fontWeight: 800, color: `#f1f5f9`, letterSpacing: `-0.03em` }}>{value}</span>
        {unit && <span style={{ fontSize: `12px`, color: `#64748b` }}>{unit}</span>}
      </div>
    </div>
  );
}

function MockDashboardContent() {
  return (
    <div style={pageStyle}>
      <p style={labelStyle}>Dashboard</p>

      <div style={statGridStyle}>
        <StatCard label="Total Rides" value="142" />
        <StatCard label="Distance" value="8,430" unit="km" />
        <StatCard label="Level" value="8" />
        <StatCard label="Points" value="5,430" />
      </div>

      <div style={cardStyle}>
        <p style={{ ...labelStyle, marginBottom: `16px` }}>Recent Activity</p>
        {[
          { name: `Vršič Pass`, km: `87 km`, time: `2h 14m`, date: `Today` },
          { name: `Soča Valley Loop`, km: `124 km`, time: `3h 02m`, date: `Yesterday` },
          { name: `Mangart Saddle`, km: `56 km`, time: `1h 38m`, date: `3 days ago` },
        ].map((ride) => (
          <div
            key={ride.name}
            style={{
              display: `flex`,
              justifyContent: `space-between`,
              alignItems: `center`,
              padding: `12px 0`,
              borderBottom: `1px solid rgba(148,163,184,0.08)`,
            }}
          >
            <div>
              <div style={{ fontSize: `13px`, color: `#f1f5f9`, fontWeight: 600 }}>{ride.name}</div>
              <div style={{ fontSize: `11px`, color: `#64748b`, marginTop: `2px` }}>{ride.time} · {ride.date}</div>
            </div>
            <div style={{ fontSize: `13px`, color: `#f97316`, fontWeight: 700 }}>{ride.km}</div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <p style={{ ...labelStyle, marginBottom: `16px` }}>Live Race Feed</p>
        {[
          { rider: `Marco Bianchi`, event: `Fastest lap — 1:23.456`, color: `#f59e0b` },
          { rider: `Luka Horvat`, event: `Pit stop — 22.4s`, color: `#94a3b8` },
          { rider: `Carlos Ruiz`, event: `Overtake on Turn 7`, color: `#b45309` },
        ].map(({ rider, event, color }) => (
          <div key={rider} style={{ display: `flex`, alignItems: `center`, gap: `12px`, padding: `10px 0`, borderBottom: `1px solid rgba(148,163,184,0.08)` }}>
            <div style={{ width: `32px`, height: `32px`, borderRadius: `50%`, backgroundColor: color, display: `flex`, alignItems: `center`, justifyContent: `center`, fontWeight: 800, fontSize: `12px`, color: `#020617`, flexShrink: 0 }}>
              {rider[0]}
            </div>
            <div>
              <div style={{ fontSize: `13px`, fontWeight: 600, color: `#f1f5f9` }}>{rider}</div>
              <div style={{ fontSize: `12px`, color: `#64748b`, marginTop: `2px` }}>{event}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockAnonymousContent() {
  return (
    <div style={pageStyle}>
      <p style={labelStyle}>Welcome to MotoTrack</p>
      <div style={cardStyle}>
        <h2 style={{ margin: `0 0 12px`, fontSize: `22px`, fontWeight: 800, color: `#f1f5f9`, letterSpacing: `-0.02em` }}>
          The Ultimate Motorcycle Platform
        </h2>
        <p style={{ margin: `0 0 20px`, fontSize: `14px`, color: `#94a3b8`, lineHeight: 1.6 }}>
          Track your rides, connect with fellow riders, and experience the thrill of motorcycle racing like never before.
        </p>
        <div style={{ display: `flex`, gap: `12px`, flexWrap: `wrap` as const }}>
          <button
            type="button"
            style={{
              padding: `10px 24px`,
              background: `linear-gradient(135deg, #f97316, #ea580c)`,
              border: `none`,
              borderRadius: `8px`,
              color: `#fff`,
              fontWeight: 700,
              fontSize: `14px`,
              cursor: `pointer`,
            }}
          >
            Get Started
          </button>
          <button
            type="button"
            style={{
              padding: `10px 24px`,
              backgroundColor: `transparent`,
              border: `1px solid rgba(148,163,184,0.3)`,
              borderRadius: `8px`,
              color: `#94a3b8`,
              fontWeight: 600,
              fontSize: `14px`,
              cursor: `pointer`,
            }}
          >
            Sign In
          </button>
        </div>
      </div>

      <div style={{ display: `grid`, gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`, gap: `16px` }}>
        {[
          { icon: `🏍️`, title: `Ride Tracking`, desc: `Log every ride with GPS precision and detailed stats.` },
          { icon: `🗺️`, title: `Route Planning`, desc: `Discover and plan epic motorcycle routes worldwide.` },
          { icon: `🏆`, title: `Leaderboards`, desc: `Compete with riders globally and climb the rankings.` },
          { icon: `💬`, title: `MotoChat`, desc: `Connect with the rider community in real time.` },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={cardStyle}>
            <div style={{ fontSize: `28px`, marginBottom: `12px` }}>{icon}</div>
            <div style={{ fontSize: `14px`, fontWeight: 700, color: `#f1f5f9`, marginBottom: `6px` }}>{title}</div>
            <div style={{ fontSize: `12px`, color: `#64748b`, lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Compositions ────────────────────────────────────────────────────────────── */

/**
 * Authenticated layout — full shell with sidebar (desktop) + bottom-nav (mobile).
 * The MockProvider seeds a logged-in user automatically.
 */
export const AuthenticatedLayout = () => {
  return (
    <MockProvider>
      <AppLayout
        navigationItems={MOCK_NAVIGATION_ITEMS}
        headerActions={MOCK_HEADER_ACTIONS}
        dashboardPanels={MOCK_DASHBOARD_PANELS}
        profileHref="/profile"
        settingsHref="/settings"
        loginHref="/login"
        signupHref="/signup"
      >
        <MockDashboardContent />
      </AppLayout>
    </MockProvider>
  );
};

/**
 * Anonymous layout — header + content only, no sidebar or bottom-nav.
 * Simulates a logged-out visitor viewing the landing/marketing page.
 */
export const AnonymousLayout = () => {
  return (
    <MockProvider>
      <AppLayout
        navigationItems={MOCK_NAVIGATION_ITEMS}
        headerActions={MOCK_HEADER_ACTIONS}
        loginHref="/login"
        signupHref="/signup"
      >
        <MockAnonymousContent />
      </AppLayout>
    </MockProvider>
  );
};

/**
 * Minimal layout — no navigation items or header actions registered.
 * Demonstrates the layout shell with empty slots.
 */
export const MinimalLayout = () => {
  return (
    <MockProvider>
      <AppLayout
        loginHref="/login"
        signupHref="/signup"
      >
        <div style={{ ...pageStyle, display: `flex`, flexDirection: `column` as const, gap: `16px` }}>
          <p style={labelStyle}>Minimal Shell</p>
          <div style={cardStyle}>
            <p style={{ margin: 0, fontSize: `14px`, color: `#94a3b8`, lineHeight: 1.6 }}>
              This composition shows the app layout shell with no navigation items or header actions registered.
              The header is still rendered with the logo and user bar. The main content area fills the remaining space.
            </p>
          </div>
          <div style={{ display: `flex`, flexDirection: `column` as const, gap: `12px` }}>
            {[`Route Outlet Area`, `Children Rendered Here`, `Full Width Content`].map((label) => (
              <div
                key={label}
                style={{
                  padding: `20px`,
                  backgroundColor: `rgba(249,115,22,0.06)`,
                  borderRadius: `10px`,
                  border: `1px dashed rgba(249,115,22,0.25)`,
                  fontSize: `13px`,
                  color: `#64748b`,
                  textAlign: `center` as const,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    </MockProvider>
  );
};
