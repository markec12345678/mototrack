import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ForecastCard } from './forecast-card.js';
import { mockForecastDays, mockForecastDaysStorm, mockForecastDaysSunny } from './forecast-card.mock.js';

function PageWrapper({ children }: { children: React.ReactNode }) {
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
        <div style={{ maxWidth: `480px`, margin: `0 auto` }}>
          {children}
        </div>
      </div>
    </MockProvider>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
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
 * Default — mixed 3-day forecast with varying conditions.
 */
export const DefaultForecast = () => {
  return (
    <PageWrapper>
      <SectionLabel>3-Day Forecast — Mixed Conditions</SectionLabel>
      <ForecastCard days={mockForecastDays} title="3-dnevna napoved" />
    </PageWrapper>
  );
};

/**
 * StormWarning — dangerous wind and heavy rain scenario.
 */
export const StormWarning = () => {
  return (
    <PageWrapper>
      <SectionLabel>Storm Warning — High Wind &amp; Rain</SectionLabel>
      <ForecastCard days={mockForecastDaysStorm} title="Opozorilo: Nevihte" />
    </PageWrapper>
  );
};

/**
 * PerfectRidingWeather — ideal sunny conditions for a motorcycle trip.
 */
export const PerfectRidingWeather = () => {
  return (
    <PageWrapper>
      <SectionLabel>Perfect Riding Weather</SectionLabel>
      <ForecastCard days={mockForecastDaysSunny} title="Idealno za vožnjo" />

      <div style={{ marginTop: `32px` }}>
        <SectionLabel>Dashboard Context</SectionLabel>
        <div
          style={{
            display: `grid`,
            gridTemplateColumns: `1fr 1fr`,
            gap: `16px`,
          }}
        >
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              padding: `16px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
            }}
          >
            <div style={{ fontSize: `10px`, fontWeight: 700, letterSpacing: `0.1em`, textTransform: `uppercase`, color: `#64748b`, marginBottom: `8px` }}>
              Temperatura zdaj
            </div>
            <div style={{ fontSize: `28px`, fontWeight: 800, color: `#f97316`, letterSpacing: `-0.03em` }}>
              24°C
            </div>
          </div>
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              padding: `16px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
            }}
          >
            <div style={{ fontSize: `10px`, fontWeight: 700, letterSpacing: `0.1em`, textTransform: `uppercase`, color: `#64748b`, marginBottom: `8px` }}>
              Veter zdaj
            </div>
            <div style={{ fontSize: `28px`, fontWeight: 800, color: `#4ade80`, letterSpacing: `-0.03em` }}>
              9 km/h
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
