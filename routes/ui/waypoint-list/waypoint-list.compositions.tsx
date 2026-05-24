import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Waypoint } from '@markec/routes.entities.waypoint';
import { WaypointList } from './waypoint-list.js';
import { mockWaypoints, mockTwoWaypoints } from './waypoint-list.mock.js';

const wrapperStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '40px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
};

const panelStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '16px',
  padding: '28px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
  maxWidth: '480px',
  width: '100%',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '20px',
  marginTop: '0',
};

/**
 * Full list — five waypoints, fully interactive with reorder and delete.
 */
export const FullList = () => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>(mockWaypoints);

  const handleNameChange = (id: string, name: string) => {
    setWaypoints((prev) =>
      prev.map((wp) => (wp.id === id ? Waypoint.from({ id: wp.id, name, lat: wp.lat, lng: wp.lng }) : wp))
    );
  };

  const handleDelete = (id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  };

  const handleReorder = (reordered: Waypoint[]) => {
    setWaypoints(reordered);
  };

  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={panelStyle}>
          <p style={sectionLabelStyle}>Waypoint List — Full</p>
          <WaypointList
            waypoints={waypoints}
            onNameChange={handleNameChange}
            onDelete={handleDelete}
            onReorder={handleReorder}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Two waypoints — minimal route with start and end only.
 */
export const TwoWaypoints = () => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>(mockTwoWaypoints);

  const handleNameChange = (id: string, name: string) => {
    setWaypoints((prev) =>
      prev.map((wp) => (wp.id === id ? Waypoint.from({ id: wp.id, name, lat: wp.lat, lng: wp.lng }) : wp))
    );
  };

  const handleDelete = (id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
  };

  const handleReorder = (reordered: Waypoint[]) => {
    setWaypoints(reordered);
  };

  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={panelStyle}>
          <p style={sectionLabelStyle}>Waypoint List — Two Points</p>
          <WaypointList
            waypoints={waypoints}
            onNameChange={handleNameChange}
            onDelete={handleDelete}
            onReorder={handleReorder}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Empty state — no waypoints, shows the map click hint.
 */
export const EmptyState = () => {
  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={panelStyle}>
          <p style={sectionLabelStyle}>Waypoint List — Empty</p>
          <WaypointList waypoints={[]} />
        </div>
      </div>
    </MockProvider>
  );
};
