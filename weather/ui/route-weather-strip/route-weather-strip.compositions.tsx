import { type ReactNode } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RouteWeatherStrip } from './route-weather-strip.js';
import { mockRoute } from './route-weather-strip.mock.js';

function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 32px`,
          fontFamily: `Inter, system-ui, sans-serif`,
        }}
      >
        <div style={{ maxWidth: `900px`, margin: `0 auto` }}>{children}</div>
      </div>
    </MockProvider>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        margin: `0 0 16px`,
        fontSize: `11px`,
        fontWeight: 700,
        letterSpacing: `0.12em`,
        textTransform: `uppercase`,
        color: `#f97316`,
      }}
    >
      {children}
    </p>
  );
}

/**
 * Default — full route weather strip with 5 sample points.
 */
export const DefaultStrip = () => {
  return (
    <PageWrapper>
      <SectionLabel>Route Weather Strip</SectionLabel>
      <p
        style={{
          margin: `0 0 24px`,
          fontSize: `13px`,
          color: `#64748b`,
          lineHeight: 1.6,
        }}
      >
        Showing weather conditions at 5 evenly-spaced checkpoints along the Ljubljana → Kranjska Gora route.
      </p>
      <RouteWeatherStrip route={mockRoute} samples={5} />
    </PageWrapper>
  );
};

/**
 * InPlanPage — strip embedded inside a realistic plan page layout.
 */
export const InPlanPage = () => {
  return (
    <PageWrapper>
      <div
        style={{
          display: `flex`,
          alignItems: `flex-start`,
          justifyContent: `space-between`,
          marginBottom: `32px`,
          flexWrap: `wrap`,
          gap: `16px`,
        }}
      >
        <div>
          <div
            style={{
              display: `inline-flex`,
              alignItems: `center`,
              gap: `8px`,
              padding: `4px 12px`,
              backgroundColor: `rgba(249,115,22,0.12)`,
              borderRadius: `9999px`,
              border: `1px solid rgba(249,115,22,0.3)`,
              marginBottom: `12px`,
            }}
          >
            <div
              style={{
                width: `6px`,
                height: `6px`,
                borderRadius: `50%`,
                backgroundColor: `#f97316`,
                boxShadow: `0 0 6px rgba(249,115,22,0.8)`,
              }}
            />
            <span
              style={{
                fontSize: `11px`,
                fontWeight: 700,
                color: `#f97316`,
                letterSpacing: `0.08em`,
              }}
            >
              PLAN MODE
            </span>
          </div>
          <h1
            style={{
              margin: `0 0 6px`,
              fontSize: `28px`,
              fontWeight: 800,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Ljubljana → Kranjska Gora
          </h1>
          <p style={{ margin: 0, fontSize: `14px`, color: `#64748b` }}>
            🏍️ &nbsp;Estimated ride time: 2h 04m &nbsp;·&nbsp; 124 km &nbsp;·&nbsp; Departure 09:00
          </p>
        </div>

        <div style={{ display: `flex`, gap: `10px` }}>
          <button
            type="button"
            style={{
              padding: `10px 20px`,
              backgroundColor: `transparent`,
              color: `#94a3b8`,
              border: `1px solid rgba(148,163,184,0.2)`,
              borderRadius: `10px`,
              fontWeight: 600,
              fontSize: `13px`,
              cursor: `pointer`,
            }}
          >
            Edit Route
          </button>
          <button
            type="button"
            style={{
              padding: `10px 20px`,
              backgroundColor: `#f97316`,
              color: `#020617`,
              border: `none`,
              borderRadius: `10px`,
              fontWeight: 700,
              fontSize: `13px`,
              cursor: `pointer`,
            }}
          >
            Start Ride
          </button>
        </div>
      </div>

      <div
        style={{
          display: `grid`,
          gridTemplateColumns: `repeat(auto-fill, minmax(140px, 1fr))`,
          gap: `12px`,
          marginBottom: `32px`,
        }}
      >
        {[
          { label: `Distance`, value: `124 km` },
          { label: `Duration`, value: `2h 04m` },
          { label: `Elevation`, value: `+1 240 m` },
          { label: `Waypoints`, value: `5` },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              padding: `14px 16px`,
              border: `1px solid rgba(148,163,184,0.1)`,
            }}
          >
            <div
              style={{
                fontSize: `10px`,
                fontWeight: 700,
                letterSpacing: `0.1em`,
                textTransform: `uppercase`,
                color: `#64748b`,
                marginBottom: `6px`,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: `20px`,
                fontWeight: 800,
                color: `#f1f5f9`,
                letterSpacing: `-0.02em`,
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: `#0f172a`,
          borderRadius: `16px`,
          padding: `20px`,
          border: `1px solid rgba(148,163,184,0.1)`,
          boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
          marginBottom: `24px`,
        }}
      >
        <RouteWeatherStrip route={mockRoute} samples={5} />
      </div>

      <div
        style={{
          display: `flex`,
          alignItems: `center`,
          gap: `10px`,
          padding: `12px 16px`,
          backgroundColor: `rgba(59,130,246,0.08)`,
          borderRadius: `10px`,
          border: `1px solid rgba(59,130,246,0.2)`,
        }}
      >
        <span style={{ fontSize: `16px` }}>ℹ️</span>
        <p style={{ margin: 0, fontSize: `13px`, color: `#94a3b8`, lineHeight: 1.5 }}>
          Weather is sampled at 5 evenly-spaced points. Forecasts update automatically based on your planned departure time.
        </p>
      </div>
    </PageWrapper>
  );
};

/**
 * ThreeCheckpoints — strip with only 3 sample points for a shorter route.
 */
export const ThreeCheckpoints = () => {
  const shortRoute = [
    { lat: 46.0569, lng: 14.5058 },
    { lat: 46.1502, lng: 14.4269 },
    { lat: 46.2396, lng: 14.3561 },
  ];

  return (
    <PageWrapper>
      <SectionLabel>Short Route — 3 Checkpoints</SectionLabel>
      <p
        style={{
          margin: `0 0 24px`,
          fontSize: `13px`,
          color: `#64748b`,
          lineHeight: 1.6,
        }}
      >
        Ljubljana → Škofja Loka — a shorter route with 3 weather checkpoints.
      </p>
      <div
        style={{
          backgroundColor: `#0f172a`,
          borderRadius: `16px`,
          padding: `20px`,
          border: `1px solid rgba(148,163,184,0.1)`,
          boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
        }}
      >
        <RouteWeatherStrip route={shortRoute} samples={3} />
      </div>
    </PageWrapper>
  );
};
