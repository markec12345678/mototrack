import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { LeaderboardDashboardPanel } from './leaderboard-dashboard-panel.js';
import { mockLeaderboardEntries, mockLeaderboardEntriesNoMe } from './leaderboard-dashboard-panel.mock.js';

const pageStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  padding: `32px`,
  display: `flex`,
  alignItems: `flex-start`,
  justifyContent: `center`,
};

const gridStyle: React.CSSProperties = {
  display: `grid`,
  gridTemplateColumns: `repeat(2, 1fr)`,
  gap: `24px`,
  width: `100%`,
  maxWidth: `900px`,
};

/**
 * Default — top 5 weekly leaderboard with the current user highlighted (rank 3).
 */
export const Default = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ width: `100%`, maxWidth: `480px` }}>
          <LeaderboardDashboardPanel mockEntries={mockLeaderboardEntries} />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * InDashboardGrid — simulates the panel spanning 2 columns inside a dashboard grid.
 */
export const InDashboardGrid = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={gridStyle}>
          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              padding: `20px`,
              minHeight: `160px`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `center`,
            }}
          >
            <span style={{ fontSize: `12px`, color: `#64748b` }}>Stats Panel</span>
          </div>

          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              padding: `20px`,
              minHeight: `160px`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `center`,
            }}
          >
            <span style={{ fontSize: `12px`, color: `#64748b` }}>Activity Panel</span>
          </div>

          <div style={{ gridColumn: `span 2` }}>
            <LeaderboardDashboardPanel mockEntries={mockLeaderboardEntries} />
          </div>

          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              padding: `20px`,
              minHeight: `120px`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `center`,
            }}
          >
            <span style={{ fontSize: `12px`, color: `#64748b` }}>Routes Panel</span>
          </div>

          <div
            style={{
              backgroundColor: `#0f172a`,
              borderRadius: `12px`,
              border: `1px solid rgba(148,163,184,0.12)`,
              padding: `20px`,
              minHeight: `120px`,
              display: `flex`,
              alignItems: `center`,
              justifyContent: `center`,
            }}
          >
            <span style={{ fontSize: `12px`, color: `#64748b` }}>Challenges Panel</span>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * NoCurrentUser — leaderboard without any highlighted "me" entry.
 */
export const NoCurrentUser = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ width: `100%`, maxWidth: `480px` }}>
          <LeaderboardDashboardPanel mockEntries={mockLeaderboardEntriesNoMe} />
        </div>
      </div>
    </MockProvider>
  );
};
