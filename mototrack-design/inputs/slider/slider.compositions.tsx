import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Slider } from './slider.js';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#020617',
  padding: '48px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderRadius: '16px',
  padding: '32px',
  border: '1px solid rgba(148,163,184,0.12)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
  maxWidth: '520px',
  width: '100%',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#f97316',
  marginBottom: '24px',
  marginTop: 0,
};

const sliderGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '28px',
};

/**
 * Route Planner — three sliders used together for planning a moto route.
 */
export const RoutePlannerSliders = () => {
  const [twistiness, setTwistiness] = useState(72);
  const [distance, setDistance] = useState(180);
  const [fuelReserve, setFuelReserve] = useState(15);

  return (
    <MockProvider>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <p style={sectionLabelStyle}>Route Preferences</p>
          <div style={sliderGroupStyle}>
            <Slider
              label="Twistiness"
              min={0}
              max={100}
              step={1}
              value={twistiness}
              unit="%"
              onChange={(v) => setTwistiness(v)}
            />
            <Slider
              label="Distance"
              min={50}
              max={500}
              step={10}
              value={distance}
              unit=" km"
              onChange={(v) => setDistance(v)}
            />
            <Slider
              label="Fuel Reserve"
              min={5}
              max={50}
              step={1}
              value={fuelReserve}
              unit=" L"
              onChange={(v) => setFuelReserve(v)}
            />
          </div>

          <div
            style={{
              marginTop: '32px',
              padding: '16px',
              backgroundColor: '#1e293b',
              borderRadius: '10px',
              border: '1px solid rgba(249,115,22,0.2)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}
          >
            {[
              { label: 'Twistiness', value: `${twistiness}%` },
              { label: 'Distance', value: `${distance} km` },
              { label: 'Fuel Reserve', value: `${fuelReserve} L` },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {label}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#f97316', fontVariantNumeric: 'tabular-nums' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Variants — showcasing different slider states.
 */
export const SliderVariants = () => {
  const [speed, setSpeed] = useState(220);
  const [lean, setLean] = useState(45);

  return (
    <MockProvider>
      <div style={containerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '24px', maxWidth: '520px' }}>

          {/* Default */}
          <div style={cardStyle}>
            <p style={sectionLabelStyle}>Default</p>
            <Slider
              label="Twistiness"
              min={0}
              max={100}
              step={1}
              defaultValue={65}
              unit="%"
            />
          </div>

          {/* Controlled */}
          <div style={cardStyle}>
            <p style={sectionLabelStyle}>Controlled — Top Speed</p>
            <Slider
              label="Top Speed"
              min={80}
              max={300}
              step={5}
              value={speed}
              unit=" km/h"
              onChange={(v) => setSpeed(v)}
            />
          </div>

          {/* Custom step */}
          <div style={cardStyle}>
            <p style={sectionLabelStyle}>Custom Step — Lean Angle</p>
            <Slider
              label="Lean Angle"
              min={0}
              max={60}
              step={5}
              value={lean}
              unit="°"
              onChange={(v) => setLean(v)}
            />
          </div>

          {/* Disabled */}
          <div style={cardStyle}>
            <p style={sectionLabelStyle}>Disabled</p>
            <Slider
              label="Engine Temp"
              min={60}
              max={120}
              step={1}
              defaultValue={95}
              unit="°C"
              disabled
            />
          </div>

          {/* Min value */}
          <div style={cardStyle}>
            <p style={sectionLabelStyle}>At Minimum</p>
            <Slider
              label="Fuel Reserve"
              min={0}
              max={50}
              step={1}
              defaultValue={0}
              unit=" L"
            />
          </div>

          {/* Max value */}
          <div style={cardStyle}>
            <p style={sectionLabelStyle}>At Maximum</p>
            <Slider
              label="Fuel Reserve"
              min={0}
              max={50}
              step={1}
              defaultValue={50}
              unit=" L"
            />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * RaceSetup — performance tuning panel with multiple sliders.
 */
export const RaceSetup = () => {
  const [suspension, setSuspension] = useState(6);
  const [brakeBalance, setBrakeBalance] = useState(55);
  const [tractionControl, setTractionControl] = useState(3);
  const [engineBraking, setEngineBraking] = useState(4);

  return (
    <MockProvider>
      <div style={containerStyle}>
        <div style={{ ...cardStyle, maxWidth: '560px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <p style={{ ...sectionLabelStyle, marginBottom: '4px' }}>Race Setup</p>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                Performance Tuning
              </h2>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'rgba(249,115,22,0.12)',
                borderRadius: '9999px',
                border: '1px solid rgba(249,115,22,0.3)',
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f97316' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#f97316', letterSpacing: '0.08em' }}>LIVE</span>
            </div>
          </div>

          <div style={sliderGroupStyle}>
            <Slider
              label="Suspension Stiffness"
              min={1}
              max={10}
              step={1}
              value={suspension}
              unit=""
              onChange={(v) => setSuspension(v)}
            />
            <Slider
              label="Brake Balance"
              min={40}
              max={70}
              step={1}
              value={brakeBalance}
              unit="%"
              onChange={(v) => setBrakeBalance(v)}
            />
            <Slider
              label="Traction Control"
              min={0}
              max={10}
              step={1}
              value={tractionControl}
              unit=""
              onChange={(v) => setTractionControl(v)}
            />
            <Slider
              label="Engine Braking"
              min={1}
              max={8}
              step={1}
              value={engineBraking}
              unit=""
              onChange={(v) => setEngineBraking(v)}
            />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
