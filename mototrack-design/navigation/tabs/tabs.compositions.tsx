import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Tabs } from './tabs.js';
import { type TabItem } from './tab-item-type.js';

// ─── Icon helpers (inline SVG) ────────────────────────────────────────────────

function CompassIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 17 16 21" />
      <line x1="12" y1="17" x2="12" y2="11" />
      <path d="M7 4H4a2 2 0 0 0-2 2v2a6 6 0 0 0 6 6" />
      <path d="M17 4h3a2 2 0 0 1 2 2v2a6 6 0 0 1-6 6" />
      <rect x="7" y="2" width="10" height="9" rx="2" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * Explore page tabs — icon + label pill tabs with active accent state.
 */
export const ExploreTabs = () => {
  const [activeKey, setActiveKey] = useState(`all`);

  const items: TabItem[] = [
    { key: `all`, label: `All`, icon: <CompassIcon /> },
    { key: `races`, label: `Races`, icon: <FlagIcon /> },
    { key: `riders`, label: `Riders`, icon: <UserIcon /> },
    { key: `standings`, label: `Standings`, icon: <TrophyIcon /> },
    { key: `circuits`, label: `Circuits`, icon: <MapPinIcon /> },
  ];

  return (
    <MockProvider>
      <div style={{ backgroundColor: `#020617`, minHeight: `100vh`, padding: `40px 0` }}>
        <div style={{ maxWidth: `600px`, margin: `0 auto`, padding: `0 24px` }}>
          {/* Section heading */}
          <p
            style={{
              margin: `0 0 6px`,
              fontSize: `11px`,
              fontWeight: `700`,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Explore
          </p>
          <h2
            style={{
              margin: `0 0 24px`,
              fontSize: `24px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.02em`,
            }}
          >
            MotoTrack Feed
          </h2>

          <Tabs items={items} activeKey={activeKey} onTabChange={(key) => setActiveKey(key)} />

          {/* Content placeholder */}
          <div
            style={{
              marginTop: `24px`,
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              padding: `32px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              textAlign: `center`,
            }}
          >
            <div style={{ fontSize: `32px`, marginBottom: `12px` }}>
              {activeKey === `all` && `🏍️`}
              {activeKey === `races` && `🏁`}
              {activeKey === `riders` && `👤`}
              {activeKey === `standings` && `🏆`}
              {activeKey === `circuits` && `📍`}
            </div>
            <p style={{ margin: 0, fontSize: `14px`, color: `#64748b` }}>
              Showing content for <span style={{ color: `#f97316`, fontWeight: `600` }}>{activeKey}</span>
            </p>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Profile sub-section tabs — label-only pills for profile page navigation.
 */
export const ProfileTabs = () => {
  const [activeKey, setActiveKey] = useState(`overview`);

  const items: TabItem[] = [
    { key: `overview`, label: `Overview`, icon: <GridIcon /> },
    { key: `results`, label: `Results`, icon: <FlagIcon /> },
    { key: `stats`, label: `Statistics`, icon: <BarChartIcon /> },
    { key: `achievements`, label: `Achievements`, icon: <StarIcon /> },
    { key: `biography`, label: `Biography`, icon: <UserIcon /> },
  ];

  return (
    <MockProvider>
      <div style={{ backgroundColor: `#020617`, minHeight: `100vh` }}>
        {/* Rider hero */}
        <div
          style={{
            background: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`,
            padding: `32px 24px 0`,
            borderBottom: `1px solid rgba(148,163,184,0.12)`,
          }}
        >
          <div style={{ maxWidth: `600px`, margin: `0 auto` }}>
            <div style={{ display: `flex`, alignItems: `center`, gap: `16px`, marginBottom: `24px` }}>
              <div
                style={{
                  width: `56px`,
                  height: `56px`,
                  borderRadius: `50%`,
                  background: `linear-gradient(135deg, #f97316, #ea580c)`,
                  display: `flex`,
                  alignItems: `center`,
                  justifyContent: `center`,
                  fontSize: `22px`,
                  fontWeight: `800`,
                  color: `#020617`,
                  flexShrink: 0,
                  boxShadow: `0 0 20px rgba(249,115,22,0.4)`,
                }}
              >
                46
              </div>
              <div>
                <h2 style={{ margin: `0 0 2px`, fontSize: `20px`, fontWeight: `800`, color: `#f1f5f9`, letterSpacing: `-0.02em` }}>
                  Valentino Rossi
                </h2>
                <p style={{ margin: 0, fontSize: `13px`, color: `#64748b` }}>🇮🇹 Italy · MotoGP Legend</p>
              </div>
            </div>

            <Tabs items={items} activeKey={activeKey} onTabChange={(key) => setActiveKey(key)} />
          </div>
        </div>

        {/* Tab content */}
        <div style={{ maxWidth: `600px`, margin: `0 auto`, padding: `24px` }}>
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              padding: `24px`,
              border: `1px solid rgba(148,163,184,0.12)`,
            }}
          >
            <p style={{ margin: 0, fontSize: `14px`, color: `#64748b` }}>
              Active section: <span style={{ color: `#f97316`, fontWeight: `600` }}>{activeKey}</span>
            </p>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Scrollable overflow tabs — many items to demonstrate horizontal scroll behaviour.
 */
export const ScrollableTabs = () => {
  const [activeKey, setActiveKey] = useState(`motogp`);

  const items: TabItem[] = [
    { key: `motogp`, label: `MotoGP`, icon: <FlagIcon /> },
    { key: `moto2`, label: `Moto2`, icon: <FlagIcon /> },
    { key: `moto3`, label: `Moto3`, icon: <FlagIcon /> },
    { key: `superbike`, label: `Superbike`, icon: <TrophyIcon /> },
    { key: `supersport`, label: `Supersport`, icon: <TrophyIcon /> },
    { key: `endurance`, label: `Endurance`, icon: <MapPinIcon /> },
    { key: `motocross`, label: `Motocross`, icon: <CompassIcon /> },
    { key: `trial`, label: `Trial`, icon: <StarIcon /> },
  ];

  return (
    <MockProvider>
      <div style={{ backgroundColor: `#020617`, minHeight: `100vh`, padding: `40px 0` }}>
        <div style={{ maxWidth: `420px`, margin: `0 auto`, padding: `0 16px` }}>
          <p
            style={{
              margin: `0 0 6px`,
              fontSize: `11px`,
              fontWeight: `700`,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Championship
          </p>
          <h2
            style={{
              margin: `0 0 24px`,
              fontSize: `22px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.02em`,
            }}
          >
            Select Series
          </h2>

          <Tabs items={items} activeKey={activeKey} onTabChange={(key) => setActiveKey(key)} />

          <div
            style={{
              marginTop: `24px`,
              display: `grid`,
              gridTemplateColumns: `repeat(2, 1fr)`,
              gap: `12px`,
            }}
          >
            {[
              { label: `Rounds`, value: `20` },
              { label: `Riders`, value: `24` },
              { label: `Teams`, value: `12` },
              { label: `Nations`, value: `18` },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  backgroundColor: `#0f172a`,
                  borderRadius: `10px`,
                  padding: `16px`,
                  border: `1px solid rgba(148,163,184,0.12)`,
                  boxShadow: `0 2px 8px rgba(0,0,0,0.4)`,
                }}
              >
                <div style={{ fontSize: `10px`, fontWeight: `700`, letterSpacing: `0.1em`, color: `#64748b`, textTransform: `uppercase`, marginBottom: `6px` }}>
                  {label}
                </div>
                <div style={{ fontSize: `26px`, fontWeight: `800`, color: `#f1f5f9`, letterSpacing: `-0.03em` }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
