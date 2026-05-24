import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Sidebar } from './sidebar.js';
import { NavigationItem } from './navigation-item-type.js';

const raceNavItems: NavigationItem[] = [
  { key: `dashboard`, label: `Dashboard`, icon: `🏠`, path: `/`, order: 1, primary: true },
  { key: `races`, label: `Races`, icon: `🏁`, path: `/races`, order: 2, primary: true },
  { key: `riders`, label: `Riders`, icon: `🏍️`, path: `/riders`, order: 3, primary: true },
  { key: `map`, label: `Route Map`, icon: `🗺️`, path: `/map`, order: 4, primary: true },
  { key: `standings`, label: `Standings`, icon: `🏆`, path: `/standings`, order: 5, primary: true },
  { key: `analytics`, label: `Analytics`, icon: `📊`, path: `/analytics`, order: 6, primary: true },
  { key: `settings`, label: `Settings`, icon: `⚙️`, path: `/settings`, order: 7 },
];

const wrapperStyle: React.CSSProperties = {
  display: `flex`,
  minHeight: `100vh`,
  backgroundColor: `#020617`,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: `32px`,
  display: `flex`,
  flexDirection: `column`,
  gap: `16px`,
};

const headingStyle: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: 700,
  letterSpacing: `0.12em`,
  textTransform: `uppercase`,
  color: `#f97316`,
  margin: `0 0 8px`,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `12px`,
  padding: `24px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
};

const statGridStyle: React.CSSProperties = {
  display: `grid`,
  gridTemplateColumns: `repeat(3, 1fr)`,
  gap: `16px`,
};

function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: `10px`, fontWeight: 700, letterSpacing: `0.1em`, color: `#64748b`, textTransform: `uppercase`, marginBottom: `8px` }}>
        {label}
      </div>
      <div style={{ display: `flex`, alignItems: `baseline`, gap: `4px` }}>
        <span style={{ fontSize: `28px`, fontWeight: 800, color: `#f1f5f9`, letterSpacing: `-0.03em` }}>{value}</span>
        {unit && <span style={{ fontSize: `12px`, color: `#64748b` }}>{unit}</span>}
      </div>
    </div>
  );
}

function MockLogo() {
  return (
    <div style={{ display: `flex`, alignItems: `center`, gap: `10px` }}>
      <div style={{ width: `32px`, height: `32px`, borderRadius: `8px`, background: `linear-gradient(135deg, #f97316, #ea580c)`, display: `flex`, alignItems: `center`, justifyContent: `center`, fontSize: `16px`, flexShrink: 0 }}>
        🏍️
      </div>
      <div>
        <div style={{ fontSize: `14px`, fontWeight: 800, color: `#f1f5f9`, letterSpacing: `-0.02em`, lineHeight: 1 }}>MotoTrack</div>
        <div style={{ fontSize: `10px`, color: `#64748b`, fontWeight: 500, marginTop: `2px` }}>Platform</div>
      </div>
    </div>
  );
}

function MockFooter() {
  return (
    <div style={{ display: `flex`, alignItems: `center`, gap: `10px` }}>
      <div style={{ width: `32px`, height: `32px`, borderRadius: `50%`, background: `linear-gradient(135deg, #f97316, #ea580c)`, display: `flex`, alignItems: `center`, justifyContent: `center`, fontSize: `14px`, flexShrink: 0 }}>
        M
      </div>
      <div style={{ overflow: `hidden` }}>
        <div style={{ fontSize: `13px`, fontWeight: 600, color: `#f1f5f9`, whiteSpace: `nowrap`, overflow: `hidden`, textOverflow: `ellipsis` }}>Markec</div>
        <div style={{ fontSize: `11px`, color: `#64748b`, whiteSpace: `nowrap` }}>Level 8 · 5430 pts</div>
      </div>
    </div>
  );
}

/**
 * Expanded sidebar — full icon + label rows with active state.
 */
export const ExpandedSidebar = () => {
  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <Sidebar
          navigationItems={raceNavItems}
          logo={<MockLogo />}
          footer={<MockFooter />}
        />
        <div style={contentStyle}>
          <p style={headingStyle}>Live Race Dashboard</p>
          <div style={statGridStyle}>
            <StatCard label="Current Lap" value="14" unit="/ 20" />
            <StatCard label="Top Speed" value="312" unit="km/h" />
            <StatCard label="Position" value="P1" />
          </div>
          <div style={cardStyle}>
            <p style={{ ...headingStyle, marginBottom: `16px` }}>Race Feed</p>
            {[
              { rider: `Marco Bianchi`, event: `Fastest lap — 1:23.456`, time: `2m ago`, color: `#f59e0b` },
              { rider: `Luka Horvat`, event: `Pit stop — 22.4s`, time: `5m ago`, color: `#94a3b8` },
              { rider: `Carlos Ruiz`, event: `Overtake on Turn 7`, time: `8m ago`, color: `#b45309` },
            ].map(({ rider, event, time, color }) => (
              <div key={rider} style={{ display: `flex`, alignItems: `center`, gap: `12px`, padding: `12px 0`, borderBottom: `1px solid rgba(148,163,184,0.08)` }}>
                <div style={{ width: `36px`, height: `36px`, borderRadius: `50%`, backgroundColor: color, display: `flex`, alignItems: `center`, justifyContent: `center`, fontWeight: 800, fontSize: `13px`, color: `#020617`, flexShrink: 0 }}>
                  {rider[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: `13px`, fontWeight: 600, color: `#f1f5f9` }}>{rider}</div>
                  <div style={{ fontSize: `12px`, color: `#64748b`, marginTop: `2px` }}>{event}</div>
                </div>
                <div style={{ fontSize: `11px`, color: `#475569` }}>{time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Collapsed sidebar — icon-only with tooltips on hover.
 */
export const CollapsedSidebar = () => {
  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <Sidebar
          navigationItems={raceNavItems}
          defaultCollapsed
          logo={<MockLogo />}
          footer={<MockFooter />}
        />
        <div style={contentStyle}>
          <p style={headingStyle}>Collapsed Sidebar Preview</p>
          <div style={cardStyle}>
            <p style={{ fontSize: `14px`, color: `#94a3b8`, margin: 0, lineHeight: 1.6 }}>
              The sidebar is collapsed to icon-only mode. Hover over the icons to see tooltips with navigation labels. Click the arrow at the bottom to expand.
            </p>
          </div>
          <div style={statGridStyle}>
            <StatCard label="Riders" value="24" />
            <StatCard label="Circuits" value="18" />
            <StatCard label="Races" value="12" unit="this season" />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Sidebar with minimal navigation items — primary items only.
 */
export const PrimaryItemsOnly = () => {
  const primaryItems: NavigationItem[] = raceNavItems.filter((item) => item.primary);

  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <Sidebar
          navigationItems={primaryItems}
          logo={<MockLogo />}
        />
        <div style={contentStyle}>
          <p style={headingStyle}>Primary Navigation Only</p>
          <div style={cardStyle}>
            <p style={{ fontSize: `14px`, color: `#94a3b8`, margin: 0, lineHeight: 1.6 }}>
              Only primary navigation items are shown. Secondary items like Settings are hidden.
            </p>
          </div>
          <div style={{ display: `grid`, gridTemplateColumns: `repeat(2, 1fr)`, gap: `16px` }}>
            {primaryItems.map((item) => (
              <div key={item.key} style={{ ...cardStyle, display: `flex`, alignItems: `center`, gap: `12px` }}>
                <span style={{ fontSize: `24px` }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: `13px`, fontWeight: 600, color: `#f1f5f9` }}>{item.label}</div>
                  <div style={{ fontSize: `11px`, color: `#64748b`, marginTop: `2px` }}>{item.path}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
