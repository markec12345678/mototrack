import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Dashboard } from './dashboard.js';

// ─── Sample panel components ──────────────────────────────────────────────────

function RideStatsPanel() {
  const stats = [
    { label: `Skupna razdalja`, value: `1 247`, unit: `km` },
    { label: `Skupni čas`, value: `38h 14m`, unit: `` },
    { label: `Povprečna hitrost`, value: `87`, unit: `km/h` },
    { label: `Skupna višinska razlika`, value: `18 430`, unit: `m` },
  ];

  return (
    <div style={{ display: `grid`, gridTemplateColumns: `repeat(2, 1fr)`, gap: `12px` }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            backgroundColor: `rgba(249,115,22,0.06)`,
            borderRadius: `10px`,
            padding: `14px 16px`,
            border: `1px solid rgba(249,115,22,0.15)`,
          }}
        >
          <div style={{ fontSize: `10px`, fontWeight: 700, letterSpacing: `0.1em`, textTransform: `uppercase`, color: `#64748b`, marginBottom: `6px` }}>
            {stat.label}
          </div>
          <div style={{ display: `flex`, alignItems: `baseline`, gap: `4px` }}>
            <span style={{ fontSize: `22px`, fontWeight: 800, color: `#f1f5f9`, letterSpacing: `-0.02em` }}>{stat.value}</span>
            {stat.unit && <span style={{ fontSize: `11px`, color: `#64748b` }}>{stat.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentRidesPanel() {
  const rides = [
    { name: `Vršič Pass Loop`, date: `12. jun 2025`, distance: `142 km`, duration: `3h 20m` },
    { name: `Soča Valley Run`, date: `8. jun 2025`, distance: `98 km`, duration: `2h 15m` },
    { name: `Nanos Plateau`, date: `1. jun 2025`, distance: `76 km`, duration: `1h 55m` },
  ];

  return (
    <div style={{ display: `flex`, flexDirection: `column`, gap: `10px` }}>
      {rides.map((ride) => (
        <div
          key={ride.name}
          style={{
            display: `flex`,
            justifyContent: `space-between`,
            alignItems: `center`,
            padding: `12px 14px`,
            backgroundColor: `rgba(15,23,42,0.6)`,
            borderRadius: `8px`,
            border: `1px solid rgba(148,163,184,0.1)`,
          }}
        >
          <div>
            <div style={{ fontSize: `13px`, fontWeight: 700, color: `#f1f5f9`, marginBottom: `2px` }}>{ride.name}</div>
            <div style={{ fontSize: `11px`, color: `#64748b` }}>{ride.date}</div>
          </div>
          <div style={{ textAlign: `right` }}>
            <div style={{ fontSize: `13px`, fontWeight: 600, color: `#f97316` }}>{ride.distance}</div>
            <div style={{ fontSize: `11px`, color: `#64748b` }}>{ride.duration}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WeatherPanel() {
  return (
    <div style={{ display: `flex`, flexDirection: `column`, gap: `12px` }}>
      <div style={{ display: `flex`, alignItems: `center`, gap: `16px` }}>
        <span style={{ fontSize: `48px` }}>⛅</span>
        <div>
          <div style={{ fontSize: `32px`, fontWeight: 800, color: `#f1f5f9`, letterSpacing: `-0.03em` }}>22°C</div>
          <div style={{ fontSize: `13px`, color: `#94a3b8` }}>Delno oblačno · Ljubljana</div>
        </div>
      </div>
      <div style={{ display: `grid`, gridTemplateColumns: `repeat(3, 1fr)`, gap: `8px` }}>
        {[
          { label: `Veter`, value: `14 km/h` },
          { label: `Vlažnost`, value: `58%` },
          { label: `Vidljivost`, value: `25 km` },
        ].map((item) => (
          <div key={item.label} style={{ backgroundColor: `rgba(148,163,184,0.06)`, borderRadius: `8px`, padding: `10px 12px`, border: `1px solid rgba(148,163,184,0.1)` }}>
            <div style={{ fontSize: `10px`, color: `#64748b`, fontWeight: 600, letterSpacing: `0.08em`, textTransform: `uppercase`, marginBottom: `4px` }}>{item.label}</div>
            <div style={{ fontSize: `14px`, fontWeight: 700, color: `#f1f5f9` }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * EmptyState — dashboard with no registered panels, showing getting-started cards.
 */
export const EmptyState = () => {
  return (
    <MockProvider>
      <Dashboard displayName="Markec" />
    </MockProvider>
  );
};

/**
 * WithPanels — dashboard with a mix of 1-span and 2-span panel widgets.
 */
export const WithPanels = () => {
  const panels = [
    {
      key: `ride-stats`,
      title: `Statistike voženj`,
      component: RideStatsPanel,
      span: 1 as const,
    },
    {
      key: `recent-rides`,
      title: `Nedavne vožnje`,
      component: RecentRidesPanel,
      span: 2 as const,
    },
    {
      key: `weather`,
      title: `Vreme za danes`,
      component: WeatherPanel,
      span: 1 as const,
    },
  ];

  return (
    <MockProvider>
      <Dashboard displayName="Markec" panels={panels} />
    </MockProvider>
  );
};

/**
 * FullWidthPanel — dashboard with a single full-width (span 3) panel.
 */
export const FullWidthPanel = () => {
  const panels = [
    {
      key: `ride-stats-full`,
      title: `Pregled statistik — celotna sezona`,
      component: RideStatsPanel,
      span: 3 as const,
    },
    {
      key: `recent-rides-full`,
      title: `Nedavne vožnje`,
      component: RecentRidesPanel,
      span: 2 as const,
    },
    {
      key: `weather-full`,
      title: `Vreme`,
      component: WeatherPanel,
      span: 1 as const,
    },
  ];

  return (
    <MockProvider>
      <Dashboard displayName="Luka" panels={panels} />
    </MockProvider>
  );
};
