import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { PlanPage } from './plan-page.js';
import { mockWaypointsLjubljanaMariborLoop, mockWaypointsSocaValley } from './plan-page.mock.js';

const fullPageStyle: React.CSSProperties = {
  width: `100%`,
  height: `100vh`,
  overflow: `hidden`,
};

/**
 * EmptyPlanner — fresh plan page with no waypoints.
 * Click the map to start adding waypoints.
 */
export const EmptyPlanner = () => {
  return (
    <MockProvider>
      <div style={fullPageStyle}>
        <PlanPage initialRouteName="Nova Ruta" />
      </div>
    </MockProvider>
  );
};

/**
 * LjubljanaMariborLoop — pre-loaded with four waypoints along the Ljubljana–Maribor corridor.
 */
export const LjubljanaMariborLoop = () => {
  return (
    <MockProvider>
      <div style={fullPageStyle}>
        <PlanPage
          initialWaypoints={mockWaypointsLjubljanaMariborLoop}
          initialRouteName="Ljubljana → Maribor Loop"
        />
      </div>
    </MockProvider>
  );
};

/**
 * SocaValleyRide — scenic Soča Valley route pre-loaded with mountain waypoints.
 */
export const SocaValleyRide = () => {
  return (
    <MockProvider>
      <div style={fullPageStyle}>
        <PlanPage
          initialWaypoints={mockWaypointsSocaValley}
          initialRouteName="Soška Dolina"
        />
      </div>
    </MockProvider>
  );
};
