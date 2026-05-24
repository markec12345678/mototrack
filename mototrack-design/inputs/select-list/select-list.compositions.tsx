import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { SelectList } from './select-list.js';
import type { SelectOption } from './select-list.js';

const raceClassOptions: SelectOption[] = [
  { value: `motogp`, label: `MotoGP` },
  { value: `moto2`, label: `Moto2` },
  { value: `moto3`, label: `Moto3` },
  { value: `superbike`, label: `Superbike` },
  { value: `supersport`, label: `Supersport` },
];

const circuitOptions: SelectOption[] = [
  { value: `mugello`, label: `Mugello Circuit — Italy` },
  { value: `jerez`, label: `Circuito de Jerez — Spain` },
  { value: `sachsenring`, label: `Sachsenring — Germany` },
  { value: `silverstone`, label: `Silverstone — Great Britain` },
  { value: `phillip-island`, label: `Phillip Island — Australia` },
  { value: `sepang`, label: `Sepang International — Malaysia` },
  { value: `losail`, label: `Losail International — Qatar` },
];

const tyreCompoundOptions: SelectOption[] = [
  { value: `soft`, label: `Soft` },
  { value: `medium`, label: `Medium` },
  { value: `hard`, label: `Hard` },
  { value: `intermediate`, label: `Intermediate` },
  { value: `wet`, label: `Wet` },
];

const wrapperStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  padding: `48px 32px`,
  display: `flex`,
  flexDirection: `column`,
  alignItems: `center`,
  gap: `48px`,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: `#0f172a`,
  borderRadius: `16px`,
  padding: `32px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
  width: `100%`,
  maxWidth: `480px`,
  boxSizing: `border-box`,
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: `11px`,
  fontWeight: `700`,
  letterSpacing: `0.12em`,
  textTransform: `uppercase`,
  color: `#f97316`,
  marginBottom: `8px`,
  marginTop: `0`,
};

const headingStyle: React.CSSProperties = {
  fontSize: `20px`,
  fontWeight: `800`,
  color: `#f1f5f9`,
  margin: `0 0 24px`,
  letterSpacing: `-0.02em`,
};

/**
 * Default — basic select with label and placeholder.
 */
export const Default = () => {
  const [value, setValue] = useState(``);

  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <p style={sectionLabelStyle}>Basic Usage</p>
          <h2 style={headingStyle}>Race Category</h2>
          <SelectList
            label="Race Class"
            options={raceClassOptions}
            value={value}
            placeholder="Select a class..."
            onChange={(v) => setValue(v)}
          />
          {value && (
            <div
              style={{
                marginTop: `16px`,
                padding: `10px 14px`,
                backgroundColor: `rgba(249,115,22,0.1)`,
                borderRadius: `8px`,
                border: `1px solid rgba(249,115,22,0.25)`,
                fontSize: `13px`,
                color: `#f97316`,
                fontWeight: `600`,
              }}
            >
              Selected: {raceClassOptions.find((o) => o.value === value)?.label}
            </div>
          )}
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * FormExample — multiple selects in a race setup form.
 */
export const FormExample = () => {
  const [raceClass, setRaceClass] = useState(``);
  const [circuit, setCircuit] = useState(``);
  const [tyre, setTyre] = useState(``);
  const [circuitError, setCircuitError] = useState(``);

  const handleCircuitChange = (v: string) => {
    setCircuit(v);
    setCircuitError(``);
  };

  const handleSubmit = () => {
    if (!circuit) {
      setCircuitError(`Please select a circuit before submitting.`);
    }
  };

  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <p style={sectionLabelStyle}>Race Setup</p>
          <h2 style={headingStyle}>Configure Session</h2>

          <div style={{ display: `flex`, flexDirection: `column`, gap: `20px` }}>
            <SelectList
              label="Race Class"
              options={raceClassOptions}
              value={raceClass}
              placeholder="Select a class..."
              required
              onChange={(v) => setRaceClass(v)}
            />

            <SelectList
              label="Circuit"
              options={circuitOptions}
              value={circuit}
              placeholder="Select a circuit..."
              error={circuitError}
              required
              onChange={handleCircuitChange}
            />

            <SelectList
              label="Tyre Compound"
              options={tyreCompoundOptions}
              value={tyre}
              placeholder="Select compound..."
              onChange={(v) => setTyre(v)}
            />

            <button
              type="button"
              onClick={handleSubmit}
              style={{
                marginTop: `8px`,
                padding: `12px 24px`,
                backgroundColor: `#f97316`,
                color: `#020617`,
                border: `none`,
                borderRadius: `10px`,
                fontWeight: `700`,
                fontSize: `14px`,
                cursor: `pointer`,
                letterSpacing: `0.02em`,
                transition: `background-color 0.15s ease`,
              }}
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * States — showcasing default, error, and disabled states.
 */
export const States = () => {
  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          <p style={sectionLabelStyle}>Component States</p>
          <h2 style={headingStyle}>Select Variants</h2>

          <div style={{ display: `flex`, flexDirection: `column`, gap: `28px` }}>
            <div>
              <p style={{ fontSize: `12px`, color: `#64748b`, margin: `0 0 10px`, fontWeight: `600` }}>
                Default (no selection)
              </p>
              <SelectList
                label="Race Class"
                options={raceClassOptions}
                placeholder="Choose a class..."
              />
            </div>

            <div>
              <p style={{ fontSize: `12px`, color: `#64748b`, margin: `0 0 10px`, fontWeight: `600` }}>
                With value selected
              </p>
              <SelectList
                label="Race Class"
                options={raceClassOptions}
                value="motogp"
                placeholder="Choose a class..."
              />
            </div>

            <div>
              <p style={{ fontSize: `12px`, color: `#64748b`, margin: `0 0 10px`, fontWeight: `600` }}>
                Error state
              </p>
              <SelectList
                label="Circuit"
                options={circuitOptions}
                placeholder="Select a circuit..."
                error="Please select a valid circuit to continue."
              />
            </div>

            <div>
              <p style={{ fontSize: `12px`, color: `#64748b`, margin: `0 0 10px`, fontWeight: `600` }}>
                Disabled state
              </p>
              <SelectList
                label="Tyre Compound"
                options={tyreCompoundOptions}
                value="soft"
                placeholder="Select compound..."
                disabled
              />
            </div>

            <div>
              <p style={{ fontSize: `12px`, color: `#64748b`, margin: `0 0 10px`, fontWeight: `600` }}>
                Required field
              </p>
              <SelectList
                label="Race Class"
                options={raceClassOptions}
                placeholder="Choose a class..."
                required
              />
            </div>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};
