import * as React from 'react';
import { useEffect, useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RideStatsPanel } from './ride-stats-panel.js';
import {
  mockActiveRideStats,
  mockPausedRideStats,
  mockHighSpeedStats,
  mockNoGpsStats,
} from './ride-stats-panel.mock.js';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 32px',
  gap: '48px',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#f97316',
  marginBottom: '20px',
  textAlign: 'center',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px',
  alignItems: 'flex-start',
  justifyContent: 'center',
};

const mapMockStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '480px',
  height: '320px',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
};

const mapOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 40%, #0a1628 100%)',
};

/**
 * AllStates — all four panel states side by side.
 */
export const AllStates = () => {
  const states = [
    { label: 'Active Recording', props: mockActiveRideStats },
    { label: 'Paused', props: mockPausedRideStats },
    { label: 'High Speed', props: mockHighSpeedStats },
    { label: 'No GPS Fix', props: mockNoGpsStats },
  ];

  return (
    <MockProvider>
      <div style={pageStyle}>
        <div>
          <p style={sectionLabelStyle}>Ride Stats Panel — All States</p>
          <div style={rowStyle}>
            {states.map(({ label, props }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <RideStatsPanel {...props} />
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * FloatingOnMap — panel overlaid on a simulated map background, as used during recording.
 */
export const FloatingOnMap = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <p style={sectionLabelStyle}>Floating on Map — Recording Mode</p>
        <div style={mapMockStyle}>
          <div style={mapOverlayStyle} />
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 480 320"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 200 Q 120 180 200 160 Q 280 140 360 100 Q 420 70 480 60"
              fill="none"
              stroke="rgba(148,163,184,0.15)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 0 200 Q 120 180 200 160 Q 280 140 360 100 Q 420 70 480 60"
              fill="none"
              stroke="rgba(249,115,22,0.35)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="12 8"
            />
            <path
              d="M 0 260 Q 80 240 160 220 Q 240 200 320 240 Q 400 270 480 250"
              fill="none"
              stroke="rgba(148,163,184,0.1)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle cx="200" cy="160" r="8" fill="rgba(249,115,22,0.9)" />
            <circle cx="200" cy="160" r="16" fill="rgba(249,115,22,0.2)" />
          </svg>
          <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
            <RideStatsPanel {...mockActiveRideStats} />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * LiveSimulation — animated panel with incrementing stats to simulate a live ride.
 */
export const LiveSimulation = () => {
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [climb, setClimb] = useState(0);
  const [elevation, setElevation] = useState(320);

  useEffect(() => {
    let currentSpeed = 0;
    let direction = 1;

    const interval = setInterval(() => {
      currentSpeed += direction * (Math.random() * 8 + 1);
      if (currentSpeed >= 145) direction = -1;
      if (currentSpeed <= 5) direction = 1;
      const clamped = Math.max(0, Math.min(160, currentSpeed));

      setSpeed(clamped);
      setMaxSpeed((prev) => Math.max(prev, clamped));
      setDistance((prev) => prev + clamped / 3600 / 10);
      setDuration((prev) => prev + 1);
      setElevation((prev) => {
        const delta = (Math.random() - 0.45) * 3;
        return Math.max(100, prev + delta);
      });
      setClimb((prev) => {
        const delta = Math.random() * 1.5;
        return prev + delta;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MockProvider>
      <div style={pageStyle}>
        <p style={sectionLabelStyle}>Live Simulation — Real-time Updates</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <RideStatsPanel
            currentSpeedKmh={speed}
            distanceKm={distance}
            durationSec={duration}
            maxSpeedKmh={maxSpeed}
            climbM={climb}
            elevationM={elevation}
            gpsAccuracyMeters={7}
            isRecording
            warningThreshold={120}
          />
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            Updates every second · Warning at 120 km/h
          </p>
        </div>
      </div>
    </MockProvider>
  );
};
