import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { DrivingModePage } from './driving-mode-page.js';
import { mockRouteHighway, mockRouteCity, mockRouteMountain } from './driving-mode-page.mock.js';

/**
 * HighwayDrive — full driving HUD on a long highway route.
 * Default 1x font scale, 120 km/h warning threshold, voice enabled.
 */
export const HighwayDrive = () => {
  return (
    <MockProvider>
      <div style={{ width: `100%`, height: `100vh`, overflow: `hidden` }}>
        <DrivingModePage
          mockRoute={mockRouteHighway}
          fontScale="1x"
          warningThreshold={120}
          voiceEnabled
          tankCapacityLiters={18}
          initialFuelLiters={15}
        />
      </div>
    </MockProvider>
  );
};

/**
 * CityNavigation — city route with 2x font scale for maximum accessibility.
 * Lower speed warning threshold suitable for urban riding.
 */
export const CityNavigation = () => {
  return (
    <MockProvider>
      <div style={{ width: `100%`, height: `100vh`, overflow: `hidden` }}>
        <DrivingModePage
          mockRoute={mockRouteCity}
          fontScale="2x"
          warningThreshold={60}
          voiceEnabled={false}
          tankCapacityLiters={18}
          initialFuelLiters={8}
        />
      </div>
    </MockProvider>
  );
};

/**
 * MountainPass — scenic mountain pass route at 1.5x scale.
 * Low fuel scenario to demonstrate fuel gauge warning state.
 */
export const MountainPass = () => {
  return (
    <MockProvider>
      <div style={{ width: `100%`, height: `100vh`, overflow: `hidden` }}>
        <DrivingModePage
          mockRoute={mockRouteMountain}
          fontScale="1.5x"
          warningThreshold={90}
          voiceEnabled
          tankCapacityLiters={18}
          initialFuelLiters={3.5}
        />
      </div>
    </MockProvider>
  );
};
