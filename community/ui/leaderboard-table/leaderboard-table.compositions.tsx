import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { LeaderboardTable } from './leaderboard-table.js';
import {
  mockLeaderboardEntries,
  mockLeaderboardEntriesWithMe,
  mockLeaderboardEntriesTopMe,
} from './leaderboard-table.mock.js';

const HERO_IMAGE =
  `https://storage.googleapis.com/bit-generated-images/images/image_dark_motorcycle_racing_leaderb_0_1779625012401.png`;

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `40px 24px`,
          fontFamily: `Inter, system-ui, sans-serif`,
        }}
      >
        <div style={{ maxWidth: `860px`, margin: `0 auto` }}>{children}</div>
      </div>
    </MockProvider>
  );
}

/**
 * Default — leaderboard with no current-user highlight, sorted by points.
 */
export const Default = () => {
  return (
    <PageShell>
      <div style={{ marginBottom: `32px` }}>
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
          Community
        </p>
        <h1
          style={{
            margin: `0 0 4px`,
            fontSize: `28px`,
            fontWeight: 800,
            color: `#f1f5f9`,
            letterSpacing: `-0.03em`,
          }}
        >
          Rider Rankings
        </h1>
        <p style={{ margin: 0, fontSize: `14px`, color: `#64748b` }}>
          Top riders across the Balkan motorcycle community
        </p>
      </div>
      <LeaderboardTable entries={mockLeaderboardEntries} defaultPeriod="month" defaultSortBy="points" />
    </PageShell>
  );
};

/**
 * CurrentUserHighlighted — the current user (rank 5) is highlighted in the table.
 */
export const CurrentUserHighlighted = () => {
  return (
    <PageShell>
      <div
        style={{
          display: `flex`,
          alignItems: `center`,
          gap: `12px`,
          marginBottom: `28px`,
          padding: `14px 20px`,
          backgroundColor: `rgba(249,115,22,0.08)`,
          borderRadius: `12px`,
          border: `1px solid rgba(249,115,22,0.2)`,
        }}
      >
        <span style={{ fontSize: `20px` }}>🏍️</span>
        <div>
          <div style={{ fontSize: `13px`, fontWeight: 700, color: `#f97316` }}>
            You are ranked #5 this week
          </div>
          <div style={{ fontSize: `12px`, color: `#64748b`, marginTop: `2px` }}>
            Keep riding to climb the leaderboard!
          </div>
        </div>
      </div>
      <LeaderboardTable
        entries={mockLeaderboardEntriesWithMe}
        defaultPeriod="week"
        defaultSortBy="points"
      />
    </PageShell>
  );
};

/**
 * HeroWithLeaderboard — full hero banner above the leaderboard table.
 */
export const HeroWithLeaderboard = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          fontFamily: `Inter, system-ui, sans-serif`,
        }}
      >
        {/* Hero */}
        <div style={{ position: `relative`, height: `220px`, overflow: `hidden` }}>
          <img
            src={HERO_IMAGE}
            alt="Leaderboard"
            style={{ width: `100%`, height: `100%`, objectFit: `cover`, display: `block` }}
          />
          <div
            style={{
              position: `absolute`,
              inset: 0,
              background: `linear-gradient(to bottom, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.95) 100%)`,
              display: `flex`,
              alignItems: `flex-end`,
              padding: `24px 32px`,
            }}
          >
            <div>
              <p
                style={{
                  margin: `0 0 4px`,
                  fontSize: `11px`,
                  fontWeight: 700,
                  letterSpacing: `0.12em`,
                  textTransform: `uppercase`,
                  color: `#f97316`,
                }}
              >
                Season Rankings
              </p>
              <h1
                style={{
                  margin: 0,
                  fontSize: `30px`,
                  fontWeight: 800,
                  color: `#f1f5f9`,
                  letterSpacing: `-0.03em`,
                }}
              >
                🏆 Balkan Grand Prix Leaderboard
              </h1>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ padding: `32px 24px`, maxWidth: `860px`, margin: `0 auto` }}>
          {/* Top 3 podium strip */}
          <div
            style={{
              display: `grid`,
              gridTemplateColumns: `repeat(3, 1fr)`,
              gap: `12px`,
              marginBottom: `24px`,
            }}
          >
            {mockLeaderboardEntriesTopMe.slice(0, 3).map((entry) => {
              const medals = [`🥇`, `🥈`, `🥉`];
              const colors = [`#f59e0b`, `#94a3b8`, `#b45309`];
              return (
                <div
                  key={entry.userId}
                  style={{
                    backgroundColor: `#0f172a`,
                    borderRadius: `12px`,
                    padding: `16px`,
                    border: `1px solid rgba(148,163,184,0.12)`,
                    boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
                    textAlign: `center`,
                  }}
                >
                  <div style={{ fontSize: `28px`, marginBottom: `6px` }}>
                    {medals[entry.rank - 1]}
                  </div>
                  <div
                    style={{
                      fontSize: `14px`,
                      fontWeight: 700,
                      color: colors[entry.rank - 1],
                      marginBottom: `2px`,
                    }}
                  >
                    {entry.displayName}
                  </div>
                  <div style={{ fontSize: `12px`, color: `#64748b` }}>
                    {entry.points.toLocaleString()} pts
                  </div>
                </div>
              );
            })}
          </div>

          <LeaderboardTable
            entries={mockLeaderboardEntriesTopMe}
            defaultPeriod="alltime"
            defaultSortBy="points"
          />
        </div>
      </div>
    </MockProvider>
  );
};
