import React, { useEffect, useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ElevationProfile } from './elevation-profile.js';
import {
  mockMountainPassPoints,
  mockRollingHillsPoints,
  mockFlatCoastalPoints,
  mockClimbM,
  mockDescentM,
  mockRollingClimbM,
  mockRollingDescentM,
  mockFlatClimbM,
  mockFlatDescentM,
} from './elevation-profile.mock.js';

const wrapperStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 24px',
  gap: '40px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
  width: '100%',
  maxWidth: '480px',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#f97316',
  marginBottom: '4px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#f1f5f9',
  marginBottom: '16px',
};

/**
 * Static mountain pass elevation profile — ride detail view.
 */
export const MountainPassProfile = () => {
  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <p style={{ ...labelStyle, margin: '0 0 4px' }}>Ride Detail</p>
          <p style={{ ...titleStyle, margin: '0 0 16px' }}>Vršič Mountain Pass</p>
          <ElevationProfile
            points={mockMountainPassPoints}
            climbM={mockClimbM}
            descentM={mockDescentM}
            width={432}
            height={100}
            showStats
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>0 km</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>22 km</span>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Live recording view — animated progress indicator moves along the track.
 */
export const LiveRecording = () => {
  const [progress, setProgress] = useState(0.18);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.004;
        return next > 1 ? 0 : next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const currentKm = (progress * 22).toFixed(1);
  const currentClimb = Math.round(progress * mockClimbM);
  const currentDescent = Math.round(progress * mockDescentM);

  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ ...labelStyle, margin: '0 0 2px' }}>Live Recording</p>
              <p style={{ ...titleStyle, margin: 0 }}>Vršič Pass</p>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'rgba(239,68,68,0.15)',
                borderRadius: '9999px',
                border: '1px solid rgba(239,68,68,0.35)',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444',
                  boxShadow: '0 0 6px rgba(239,68,68,0.8)',
                  animation: 'pulse 1.2s ease-in-out infinite',
                }}
              />
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#ef4444', letterSpacing: '0.08em' }}>
                REC
              </span>
            </div>
          </div>

          <ElevationProfile
            points={mockMountainPassPoints}
            progress={progress}
            climbM={currentClimb}
            descentM={currentDescent}
            width={432}
            height={96}
            showStats
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>0 km</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f97316', fontVariantNumeric: 'tabular-nums' }}>
              {currentKm} km
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>22 km</span>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Multiple route types side by side — mountain pass, rolling hills, flat coastal.
 */
export const RouteVariants = () => {
  const routes = [
    {
      label: 'Alpine',
      title: 'Mountain Pass',
      points: mockMountainPassPoints,
      climbM: mockClimbM,
      descentM: mockDescentM,
      totalKm: 22,
    },
    {
      label: 'Countryside',
      title: 'Rolling Hills',
      points: mockRollingHillsPoints,
      climbM: mockRollingClimbM,
      descentM: mockRollingDescentM,
      totalKm: 14,
    },
    {
      label: 'Coastal',
      title: 'Flat Route',
      points: mockFlatCoastalPoints,
      climbM: mockFlatClimbM,
      descentM: mockFlatDescentM,
      totalKm: 10,
    },
  ];

  return (
    <MockProvider>
      <div style={{ ...wrapperStyle, gap: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ ...labelStyle, margin: '0 0 4px' }}>Elevation Profiles</p>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-0.02em' }}>
            Route Variants
          </p>
        </div>
        {routes.map((route) => (
          <div key={route.title} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <p style={{ ...labelStyle, margin: '0 0 2px' }}>{route.label}</p>
                <p style={{ ...titleStyle, margin: 0 }}>{route.title}</p>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{route.totalKm} km</span>
            </div>
            <ElevationProfile
              points={route.points}
              climbM={route.climbM}
              descentM={route.descentM}
              width={432}
              height={72}
              showStats
            />
          </div>
        ))}
      </div>
    </MockProvider>
  );
};
