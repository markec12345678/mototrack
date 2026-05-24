import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TextInput } from './text-input.js';

// ─── Icons ────────────────────────────────────────────────────────────────────

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 5.5L8 9.5L14.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="10.5" r="1" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function HashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h10M3 10h10M6 2.5L5 13.5M11 2.5L10 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * All input types — text, email, password, number, search with icons and states.
 */
export const AllInputTypes = () => {
  const [textVal, setTextVal] = useState(``);
  const [emailVal, setEmailVal] = useState(``);
  const [passwordVal, setPasswordVal] = useState(``);
  const [numberVal, setNumberVal] = useState(``);
  const [searchVal, setSearchVal] = useState(``);

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 32px`,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
        }}
      >
        <div style={{ width: `100%`, maxWidth: `480px` }}>
          <p
            style={{
              margin: `0 0 8px`,
              fontSize: `11px`,
              fontWeight: `700`,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Input Types
          </p>
          <h2
            style={{
              margin: `0 0 32px`,
              fontSize: `24px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Text Input Component
          </h2>

          <div style={{ display: `flex`, flexDirection: `column`, gap: `20px` }}>
            <TextInput
              type="text"
              label="Rider Name"
              placeholder="e.g. Marco Rossi"
              helperText="Enter your full racing name."
              leftIcon={<UserIcon />}
              value={textVal}
              onChange={(v) => setTextVal(v)}
            />

            <TextInput
              type="email"
              label="Email Address"
              placeholder="rider@mototrack.com"
              helperText="We'll send race updates here."
              leftIcon={<MailIcon />}
              value={emailVal}
              onChange={(v) => setEmailVal(v)}
            />

            <TextInput
              type="password"
              label="Password"
              placeholder="••••••••"
              helperText="Minimum 8 characters."
              leftIcon={<LockIcon />}
              value={passwordVal}
              onChange={(v) => setPasswordVal(v)}
            />

            <TextInput
              type="number"
              label="Race Number"
              placeholder="46"
              helperText="Your official racing number."
              leftIcon={<HashIcon />}
              value={numberVal}
              onChange={(v) => setNumberVal(v)}
            />

            <TextInput
              type="search"
              label="Search Riders"
              placeholder="Search by name or number…"
              leftIcon={<SearchIcon />}
              value={searchVal}
              onChange={(v) => setSearchVal(v)}
            />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Validation states — default, error, disabled, required.
 */
export const ValidationStates = () => {
  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 32px`,
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
        }}
      >
        <div style={{ width: `100%`, maxWidth: `480px` }}>
          <p
            style={{
              margin: `0 0 8px`,
              fontSize: `11px`,
              fontWeight: `700`,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              color: `#f97316`,
            }}
          >
            Validation States
          </p>
          <h2
            style={{
              margin: `0 0 32px`,
              fontSize: `24px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.03em`,
            }}
          >
            Input States
          </h2>

          <div style={{ display: `flex`, flexDirection: `column`, gap: `20px` }}>
            <TextInput
              type="text"
              label="Default State"
              placeholder="Enter circuit name…"
              helperText="This is a helper text providing context."
              leftIcon={<SearchIcon />}
            />

            <TextInput
              type="email"
              label="Error State"
              placeholder="rider@mototrack.com"
              value="invalid-email"
              errorMessage="Please enter a valid email address."
              leftIcon={<MailIcon />}
            />

            <TextInput
              type="text"
              label="Required Field"
              placeholder="Team name is required"
              required
              helperText="This field cannot be left empty."
            />

            <TextInput
              type="text"
              label="Disabled State"
              placeholder="Cannot edit this field"
              value="Valentino Rossi"
              helperText="This field is locked."
              leftIcon={<UserIcon />}
              disabled
            />

            <TextInput
              type="number"
              label="Error with Icon"
              placeholder="Enter lap time…"
              value="abc"
              errorMessage="Lap time must be a valid number."
              leftIcon={<HashIcon />}
            />
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * Registration form — realistic MotoTrack rider sign-up form.
 */
export const RiderRegistrationForm = () => {
  const [name, setName] = useState(``);
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [raceNumber, setRaceNumber] = useState(``);
  const [team, setTeam] = useState(``);
  const [submitted, setSubmitted] = useState(false);

  const emailError =
    submitted && email && !email.includes(`@`) ? `Please enter a valid email address.` : undefined;
  const nameError = submitted && !name ? `Rider name is required.` : undefined;
  const passwordError =
    submitted && password && password.length < 8
      ? `Password must be at least 8 characters.`
      : undefined;

  return (
    <MockProvider>
      <div
        style={{
          minHeight: `100vh`,
          backgroundColor: `#020617`,
          padding: `48px 24px`,
          display: `flex`,
          alignItems: `center`,
          justifyContent: `center`,
        }}
      >
        <div
          style={{
            width: `100%`,
            maxWidth: `440px`,
            backgroundColor: `#0f172a`,
            borderRadius: `16px`,
            padding: `36px 32px`,
            border: `1px solid rgba(148,163,184,0.12)`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)`,
          }}
        >
          <div
            style={{
              display: `inline-flex`,
              alignItems: `center`,
              gap: `6px`,
              padding: `3px 10px`,
              backgroundColor: `rgba(249,115,22,0.12)`,
              borderRadius: `9999px`,
              border: `1px solid rgba(249,115,22,0.25)`,
              marginBottom: `20px`,
            }}
          >
            <div
              style={{
                width: `6px`,
                height: `6px`,
                borderRadius: `50%`,
                backgroundColor: `#f97316`,
              }}
            />
            <span
              style={{
                fontSize: `10px`,
                fontWeight: `700`,
                letterSpacing: `0.1em`,
                color: `#f97316`,
              }}
            >
              RIDER REGISTRATION
            </span>
          </div>

          <h2
            style={{
              margin: `0 0 6px`,
              fontSize: `22px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.02em`,
            }}
          >
            Create your account
          </h2>
          <p style={{ margin: `0 0 28px`, fontSize: `13px`, color: `#64748b` }}>
            Join MotoTrack and start tracking your performance.
          </p>

          <div style={{ display: `flex`, flexDirection: `column`, gap: `18px` }}>
            <TextInput
              type="text"
              label="Full Name"
              placeholder="Marco Rossi"
              value={name}
              onChange={(v) => setName(v)}
              errorMessage={nameError}
              helperText={!nameError ? `Your official racing name.` : undefined}
              leftIcon={<UserIcon />}
              required
            />

            <TextInput
              type="email"
              label="Email Address"
              placeholder="rider@mototrack.com"
              value={email}
              onChange={(v) => setEmail(v)}
              errorMessage={emailError}
              helperText={!emailError ? `Race updates will be sent here.` : undefined}
              leftIcon={<MailIcon />}
              required
            />

            <TextInput
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(v) => setPassword(v)}
              errorMessage={passwordError}
              helperText={!passwordError ? `Minimum 8 characters.` : undefined}
              leftIcon={<LockIcon />}
              required
            />

            <div style={{ display: `grid`, gridTemplateColumns: `1fr 1fr`, gap: `12px` }}>
              <TextInput
                type="number"
                label="Race Number"
                placeholder="46"
                value={raceNumber}
                onChange={(v) => setRaceNumber(v)}
                leftIcon={<HashIcon />}
              />

              <TextInput
                type="text"
                label="Team"
                placeholder="Yamaha Racing"
                value={team}
                onChange={(v) => setTeam(v)}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            style={{
              marginTop: `28px`,
              width: `100%`,
              padding: `13px`,
              backgroundColor: `#f97316`,
              color: `#020617`,
              border: `none`,
              borderRadius: `10px`,
              fontWeight: `800`,
              fontSize: `14px`,
              letterSpacing: `0.04em`,
              cursor: `pointer`,
              transition: `background-color 0.15s ease`,
            }}
          >
            Create Account
          </button>

          <p
            style={{
              margin: `16px 0 0`,
              textAlign: `center`,
              fontSize: `12px`,
              color: `#64748b`,
            }}
          >
            Already have an account?{` `}
            <span style={{ color: `#f97316`, fontWeight: `600`, cursor: `pointer` }}>Sign in</span>
          </p>
        </div>
      </div>
    </MockProvider>
  );
};
