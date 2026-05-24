import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import {
  MapIcon,
  PlanIcon,
  TrackIcon,
  ExploreIcon,
  ProfileIcon,
  SosIcon,
  ChatIcon,
  MenuIcon,
  LogoutIcon,
  SettingsIcon,
  BellIcon,
} from './mototrack-icons.js';

const allIcons = [
  { name: `MapIcon`, Component: MapIcon, description: `Live map / route view` },
  { name: `PlanIcon`, Component: PlanIcon, description: `Route planning` },
  { name: `TrackIcon`, Component: TrackIcon, description: `Record a ride` },
  { name: `ExploreIcon`, Component: ExploreIcon, description: `Route discovery` },
  { name: `ProfileIcon`, Component: ProfileIcon, description: `User profile` },
  { name: `SosIcon`, Component: SosIcon, description: `Emergency / SOS` },
  { name: `ChatIcon`, Component: ChatIcon, description: `Community chat` },
  { name: `MenuIcon`, Component: MenuIcon, description: `Navigation drawer` },
  { name: `LogoutIcon`, Component: LogoutIcon, description: `Sign out` },
  { name: `SettingsIcon`, Component: SettingsIcon, description: `App settings` },
  { name: `BellIcon`, Component: BellIcon, description: `Notifications` },
];

/**
 * FullIconSet — all MotoTrack platform icons in a grid with labels.
 */
export const FullIconSet = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 32px`,
        }}
      >
        <div style={{ maxWidth: `800px`, margin: `0 auto` }}>
          <p
            style={{
              margin: `0 0 6px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            MotoTrack Platform
          </p>
          <h1
            style={{
              margin: `0 0 4px`,
              fontSize: `30px`,
              fontWeight: 800,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Icon Set
          </h1>
          <p style={{ margin: `0 0 40px`, fontSize: `14px`, color: `#64748b` }}>
            Named icon exports for navigation, actions, and status across the platform.
          </p>

          <div
            style={{
              display: `grid`,
              gridTemplateColumns: `repeat(auto-fill, minmax(140px, 1fr))`,
              gap: `16px`,
            }}
          >
            {allIcons.map(({ name, Component, description }) => (
              <div
                key={name}
                style={{
                  backgroundColor: `#0f172a`,
                  borderRadius: `14px`,
                  padding: `28px 16px 20px`,
                  border: `1px solid rgba(148,163,184,0.10)`,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
                  display: `flex`,
                  flexDirection: `column`,
                  alignItems: `center`,
                  gap: `14px`,
                  transition: `border-color 0.15s ease, box-shadow 0.15s ease`,
                }}
              >
                <Component size="xl" color="#f97316" />
                <div style={{ textAlign: `center` }}>
                  <div style={{ fontSize: `12px`, fontWeight: 700, color: `#f1f5f9`, marginBottom: `4px` }}>
                    {name}
                  </div>
                  <div style={{ fontSize: `10px`, color: `#64748b`, lineHeight: 1.4 }}>{description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * SizeScale — all icons rendered across every available size.
 */
export const SizeScale = () => {
  const sizes = [`xs`, `sm`, `md`, `lg`, `xl`, `xxl`] as const;
  const sizeLabels: Record<string, string> = {
    xs: `12px`,
    sm: `16px`,
    md: `20px`,
    lg: `24px`,
    xl: `32px`,
    xxl: `48px`,
  };

  const showcaseIcons = [
    { name: `Map`, Component: MapIcon },
    { name: `Track`, Component: TrackIcon },
    { name: `Menu`, Component: MenuIcon },
    { name: `Bell`, Component: BellIcon },
    { name: `Settings`, Component: SettingsIcon },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 32px`,
        }}
      >
        <div style={{ maxWidth: `900px`, margin: `0 auto` }}>
          <p
            style={{
              margin: `0 0 6px`,
              fontSize: `11px`,
              fontWeight: 700,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Size Scale
          </p>
          <h1
            style={{
              margin: `0 0 40px`,
              fontSize: `28px`,
              fontWeight: 800,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            xs · sm · md · lg · xl · xxl
          </h1>

          <div style={{ display: `flex`, flexDirection: `column`, gap: `24px` }}>
            {showcaseIcons.map(({ name, Component }) => (
              <div
                key={name}
                style={{
                  backgroundColor: `#0f172a`,
                  borderRadius: `12px`,
                  padding: `24px 28px`,
                  border: `1px solid rgba(148,163,184,0.10)`,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
                  display: `flex`,
                  alignItems: `center`,
                  gap: `32px`,
                  flexWrap: `wrap`,
                }}
              >
                <span
                  style={{
                    fontSize: `11px`,
                    fontWeight: 700,
                    color: `#64748b`,
                    width: `80px`,
                    flexShrink: 0,
                    letterSpacing: `0.06em`,
                  }}
                >
                  {name}
                </span>
                {sizes.map((size) => (
                  <div
                    key={size}
                    style={{ display: `flex`, flexDirection: `column`, alignItems: `center`, gap: `8px` }}
                  >
                    <Component size={size} color="#f97316" />
                    <span style={{ fontSize: `9px`, color: `#475569`, fontFamily: `monospace` }}>
                      {size}
                      <br />
                      {sizeLabels[size]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * NavigationBar — realistic bottom navigation bar using platform icons.
 */
export const NavigationBar = () => {
  const [active, setActive] = React.useState(`map`);

  const navItems = [
    { key: `map`, label: `Map`, Component: MapIcon },
    { key: `explore`, label: `Explore`, Component: ExploreIcon },
    { key: `track`, label: `Track`, Component: TrackIcon },
    { key: `chat`, label: `Chat`, Component: ChatIcon },
    { key: `profile`, label: `Profile`, Component: ProfileIcon },
  ];

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          display: `flex`,
          flexDirection: `column`,
          justifyContent: `flex-end`,
          padding: `32px`,
        }}
      >
        <div style={{ maxWidth: `480px`, margin: `0 auto`, width: `100%` }}>
          {/* Page content preview */}
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `16px`,
              padding: `32px 24px`,
              marginBottom: `16px`,
              border: `1px solid rgba(148,163,184,0.10)`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
              textAlign: `center`,
            }}
          >
            <p
              style={{
                margin: `0 0 6px`,
                fontSize: `11px`,
                fontWeight: 700,
                letterSpacing: `0.12em`,
                textTransform: `uppercase`,
                color: `#f97316`,
              }}
            >
              Active Section
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: `24px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.02em`,
              }}
            >
              {navItems.find((n) => n.key === active)?.label ?? `Map`}
            </h2>
          </div>

          {/* Bottom Nav */}
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `16px`,
              padding: `12px 8px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)`,
              display: `flex`,
              justifyContent: `space-around`,
              alignItems: `center`,
            }}
          >
            {navItems.map(({ key, label, Component }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActive(key)}
                  style={{
                    background: `none`,
                    border: `none`,
                    cursor: `pointer`,
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `center`,
                    gap: `5px`,
                    padding: `8px 12px`,
                    borderRadius: `10px`,
                    backgroundColor: isActive ? `rgba(249,115,22,0.12)` : `transparent`,
                    transition: `background-color 0.15s ease`,
                  }}
                >
                  <Component
                    size="md"
                    color={isActive ? `#f97316` : `#64748b`}
                  />
                  <span
                    style={{
                      fontSize: `10px`,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? `#f97316` : `#64748b`,
                      letterSpacing: `0.04em`,
                    }}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action icons row */}
          <div
            style={{
              marginTop: `16px`,
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              padding: `16px 20px`,
              border: `1px solid rgba(148,163,184,0.10)`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.4)`,
              display: `flex`,
              justifyContent: `space-between`,
              alignItems: `center`,
            }}
          >
            <span style={{ fontSize: `11px`, color: `#64748b`, fontWeight: 600 }}>Header Actions</span>
            <div style={{ display: `flex`, gap: `16px`, alignItems: `center` }}>
              <PlanIcon size="sm" color="#94a3b8" onClick={() => undefined} />
              <BellIcon size="sm" color="#94a3b8" onClick={() => undefined} />
              <SosIcon size="sm" color="#ef4444" onClick={() => undefined} />
              <SettingsIcon size="sm" color="#94a3b8" onClick={() => undefined} />
              <LogoutIcon size="sm" color="#64748b" onClick={() => undefined} />
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
