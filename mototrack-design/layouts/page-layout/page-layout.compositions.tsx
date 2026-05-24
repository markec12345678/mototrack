import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { PageLayout } from './page-layout.js';

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SectionCard({
  title,
  description,
  accent = false,
}: {
  title: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: accent ? `rgba(249,115,22,0.08)` : `#0f172a`,
        border: `1px solid ${accent ? `rgba(249,115,22,0.3)` : `rgba(148,163,184,0.12)`}`,
        borderRadius: `12px`,
        padding: `24px 28px`,
        boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
      }}
    >
      <h3
        style={{
          margin: `0 0 8px`,
          fontSize: `16px`,
          fontWeight: `700`,
          color: accent ? `#f97316` : `#f1f5f9`,
          letterSpacing: `-0.02em`,
        }}
      >
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: `14px`, color: `#94a3b8`, lineHeight: `1.6` }}>
        {description}
      </p>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        gap: `4px`,
        padding: `16px 24px`,
        backgroundColor: `#0f172a`,
        borderRadius: `10px`,
        border: `1px solid rgba(148,163,184,0.12)`,
        boxShadow: `0 2px 8px rgba(0,0,0,0.4)`,
        minWidth: `120px`,
      }}
    >
      <span
        style={{
          fontSize: `28px`,
          fontWeight: `800`,
          color: `#f97316`,
          letterSpacing: `-0.03em`,
          lineHeight: `1`,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: `11px`,
          fontWeight: `600`,
          letterSpacing: `0.08em`,
          textTransform: `uppercase`,
          color: `#64748b`,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p
        style={{
          margin: `0 0 8px`,
          fontSize: `11px`,
          fontWeight: `700`,
          letterSpacing: `0.12em`,
          textTransform: `uppercase`,
          color: `#f97316`,
        }}
      >
        MotoTrack
      </p>
      <h1
        style={{
          margin: `0 0 12px`,
          fontSize: `clamp(24px, 4vw, 40px)`,
          fontWeight: `800`,
          color: `#f1f5f9`,
          letterSpacing: `-0.03em`,
          lineHeight: `1.1`,
        }}
      >
        {title}
      </h1>
      <p style={{ margin: 0, fontSize: `16px`, color: `#94a3b8`, lineHeight: `1.6`, maxWidth: `560px` }}>
        {subtitle}
      </p>
    </div>
  );
}

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * Default — standard centered page layout with default max-width and spacing.
 */
export const DefaultPageLayout = () => {
  return (
    <MockProvider>
      <div style={{ minHeight: `100vh`, backgroundColor: `#020617` }}>
        <PageLayout>
          <PageHeading
            title="Race Dashboard"
            subtitle="Track live timing, standings, and telemetry data for every session across all championship rounds."
          />

          <div style={{ display: `flex`, gap: `16px`, flexWrap: `wrap` }}>
            <StatBadge label="Riders" value="24" />
            <StatBadge label="Laps" value="20" />
            <StatBadge label="Top Speed" value="312" />
            <StatBadge label="Gap P1" value="+0.4s" />
          </div>

          <div style={{ display: `flex`, flexDirection: `column`, gap: `12px` }}>
            <SectionCard
              title="Live Timing"
              description="Real-time lap times, sector splits, and gap to leader updated every 250 ms from the timing tower."
              accent
            />
            <SectionCard
              title="Tyre Strategy"
              description="Compound selection, tyre age, and predicted pit windows for all riders on track."
            />
            <SectionCard
              title="Weather Conditions"
              description="Track temperature, air humidity, wind speed, and grip level forecasts for the next 30 minutes."
            />
          </div>
        </PageLayout>
      </div>
    </MockProvider>
  );
};

/**
 * NarrowLayout — compact max-width suitable for detail or settings pages.
 */
export const NarrowLayout = () => {
  return (
    <MockProvider>
      <div style={{ minHeight: `100vh`, backgroundColor: `#020617` }}>
        <PageLayout maxWidth="720px" gap="var(--spacing-lg)">
          <PageHeading
            title="Rider Profile"
            subtitle="Personal stats, championship history, and performance analytics for a single competitor."
          />

          <div
            style={{
              display: `grid`,
              gridTemplateColumns: `repeat(auto-fill, minmax(160px, 1fr))`,
              gap: `12px`,
            }}
          >
            <StatBadge label="Championships" value="3" />
            <StatBadge label="Race Wins" value="47" />
            <StatBadge label="Podiums" value="89" />
          </div>

          <SectionCard
            title="Career Highlights"
            description="Three-time World Champion (2019, 2021, 2023). Holds the record for most consecutive podium finishes in the premier class."
            accent
          />
          <SectionCard
            title="Current Season"
            description="Leading the championship by 28 points after 12 rounds. Best qualifying position: P1 (×6 this season)."
          />
          <SectionCard
            title="Technical Notes"
            description="Preferred setup: stiff front suspension, aggressive braking bias. Known for exceptional corner entry speed."
          />
        </PageLayout>
      </div>
    </MockProvider>
  );
};

/**
 * FluidLayout — full-width fluid layout for data-dense dashboards.
 */
export const FluidLayout = () => {
  const rounds = [
    { country: `🇶🇦 Qatar`, circuit: `Losail`, date: `Mar 2`, winner: `M. Bianchi`, time: `42:13.456` },
    { country: `🇵🇹 Portugal`, circuit: `Portimão`, date: `Mar 23`, winner: `L. Horvat`, time: `41:58.012` },
    { country: `🇪🇸 Spain`, circuit: `Jerez`, date: `Apr 27`, winner: `C. Ruiz`, time: `40:44.789` },
    { country: `🇫🇷 France`, circuit: `Le Mans`, date: `May 11`, winner: `M. Bianchi`, time: `41:02.334` },
    { country: `🇮🇹 Italy`, circuit: `Mugello`, date: `Jun 1`, winner: `J. Novák`, time: `39:57.901` },
  ];

  return (
    <MockProvider>
      <div style={{ minHeight: `100vh`, backgroundColor: `#020617` }}>
        <PageLayout fluid padding="var(--spacing-xl) var(--spacing-lg)" gap="var(--spacing-lg)">
          <PageHeading
            title="Season Calendar"
            subtitle="Full championship schedule — results, winners, and race times for every round."
          />

          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              overflow: `hidden`,
              boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
            }}
          >
            <div
              style={{
                display: `grid`,
                gridTemplateColumns: `1fr 1fr 100px 1fr 1fr`,
                padding: `12px 20px`,
                borderBottom: `1px solid rgba(148,163,184,0.12)`,
                backgroundColor: `rgba(249,115,22,0.06)`,
              }}
            >
              {[`Country`, `Circuit`, `Date`, `Winner`, `Race Time`].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: `10px`,
                    fontWeight: `700`,
                    letterSpacing: `0.1em`,
                    textTransform: `uppercase`,
                    color: `#64748b`,
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {rounds.map((round, i) => (
              <div
                key={round.circuit}
                style={{
                  display: `grid`,
                  gridTemplateColumns: `1fr 1fr 100px 1fr 1fr`,
                  padding: `14px 20px`,
                  borderBottom:
                    i < rounds.length - 1 ? `1px solid rgba(148,163,184,0.08)` : `none`,
                  alignItems: `center`,
                }}
              >
                <span style={{ fontSize: `14px`, color: `#f1f5f9`, fontWeight: `600` }}>
                  {round.country}
                </span>
                <span style={{ fontSize: `13px`, color: `#94a3b8` }}>{round.circuit}</span>
                <span style={{ fontSize: `12px`, color: `#64748b` }}>{round.date}</span>
                <span style={{ fontSize: `13px`, color: `#f97316`, fontWeight: `700` }}>
                  {round.winner}
                </span>
                <span
                  style={{
                    fontSize: `13px`,
                    color: `#94a3b8`,
                    fontFamily: `monospace`,
                  }}
                >
                  {round.time}
                </span>
              </div>
            ))}
          </div>
        </PageLayout>
      </div>
    </MockProvider>
  );
};
