import * as React from 'react';
import { useEffect, useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { NavInstruction } from '@markec/navigation.entities.nav-instruction';
import { DrivingModeHud } from './driving-mode-hud.js';
import { mockHudDataHighway, mockHudDataCity, mockHudDataLowFuel } from './driving-mode-hud.mock.js';

// ─── Composition 1: Highway Cruise ───────────────────────────────────────────

/**
 * Highway — full HUD at default 1x scale, highway speed, good GPS, ample fuel.
 */
export const HighwayCruise = () => {
  return (
    <MockProvider>
      <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
        <DrivingModeHud
          data={mockHudDataHighway}
          fontScale="1x"
          warningThreshold={120}
          voiceEnabled
          btConnected
          btDeviceName="Sena 50S"
          onExit={() => alert(`Returning to map…`)}
        />
      </div>
    </MockProvider>
  );
};

// ─── Composition 2: City Navigation with Accessibility Scale ─────────────────

/**
 * CityNavAccessibility — city driving at 2x font scale for maximum accessibility.
 * Low fuel warning state with poor GPS signal.
 */
export const CityNavAccessibility = () => {
  return (
    <MockProvider>
      <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
        <DrivingModeHud
          data={mockHudDataCity}
          fontScale="2x"
          warningThreshold={60}
          voiceEnabled={false}
          btConnected={false}
          onExit={() => alert(`Returning to map…`)}
        />
      </div>
    </MockProvider>
  );
};

// ─── Composition 3: Live Animated HUD ────────────────────────────────────────

/**
 * LiveAnimatedHud — animated HUD with real-time speed, heading, and fuel changes.
 * Demonstrates the full driving experience with 1.5x font scale.
 */
export const LiveAnimatedHud = () => {
  const [speed, setSpeed] = useState(0);
  const [heading, setHeading] = useState(47);
  const [fuel, setFuel] = useState(mockHudDataLowFuel.currentFuelLiters);
  const [distance, setDistance] = useState(mockHudDataLowFuel.distanceToDestinationKm);
  const [turnDistance, setTurnDistance] = useState(850);

  useEffect(() => {
    let speedDir = 1;
    let currentSpeed = 0;

    const speedInterval = setInterval(() => {
      currentSpeed += speedDir * (Math.random() * 4 + 1);
      if (currentSpeed >= 95) speedDir = -1;
      if (currentSpeed <= 20) speedDir = 1;
      setSpeed(Math.max(0, Math.min(110, currentSpeed)));
    }, 150);

    const headingInterval = setInterval(() => {
      setHeading((h) => (h + 0.5) % 360);
    }, 100);

    const fuelInterval = setInterval(() => {
      setFuel((f) => Math.max(0, f - 0.01));
    }, 300);

    const distanceInterval = setInterval(() => {
      setDistance((d) => Math.max(0, d - 0.01));
    }, 400);

    const turnInterval = setInterval(() => {
      setTurnDistance((d) => {
        if (d <= 50) return 900;
        return Math.max(50, d - 10);
      });
    }, 200);

    return () => {
      clearInterval(speedInterval);
      clearInterval(headingInterval);
      clearInterval(fuelInterval);
      clearInterval(distanceInterval);
      clearInterval(turnInterval);
    };
  }, []);

  const fuelRange = Math.round((fuel / 6.5) * 100);

  const liveData = {
    ...mockHudDataLowFuel,
    speed,
    heading,
    currentFuelLiters: Number(fuel.toFixed(2)),
    fuelRangeKm: fuelRange,
    distanceToDestinationKm: Number(distance.toFixed(1)),
    nextInstruction: NavInstruction.from({
      id: `live-instr`,
      text: `Nadaljujte naravnost`,
      distanceM: turnDistance,
      modifier: `continue`,
      announceAt: 300,
    }),
  };

  return (
    <MockProvider>
      <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
        <DrivingModeHud
          data={liveData}
          fontScale="1.5x"
          warningThreshold={90}
          voiceEnabled
          btConnected
          btDeviceName="Cardo Packtalk"
          onExit={() => alert(`Returning to map…`)}
        />
      </div>
    </MockProvider>
  );
};
