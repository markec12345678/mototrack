import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { SosAction } from './sos-action.js';
import type { IceContact } from './ice-contact-type.js';

const pageStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  padding: `40px 32px`,
};

const headerMockStyle: React.CSSProperties = {
  width: `100%`,
  maxWidth: `900px`,
  height: `64px`,
  backgroundColor: `#0f172a`,
  borderRadius: `16px`,
  border: `1px solid rgba(148,163,184,0.12)`,
  boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `space-between`,
  padding: `0 24px`,
  boxSizing: `border-box` as const,
};

const logoStyle: React.CSSProperties = {
  display: `flex`,
  alignItems: `center`,
  gap: `10px`,
};

const logoIconStyle: React.CSSProperties = {
  width: `32px`,
  height: `32px`,
  borderRadius: `8px`,
  background: `linear-gradient(135deg, #f97316, #ea580c)`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  fontSize: `16px`,
};

const logoTextStyle: React.CSSProperties = {
  fontSize: `16px`,
  fontWeight: `800`,
  color: `#f1f5f9`,
  letterSpacing: `-0.02em`,
};

const navStyle: React.CSSProperties = {
  display: `flex`,
  alignItems: `center`,
  gap: `8px`,
};

const navItemStyle: React.CSSProperties = {
  padding: `6px 14px`,
  borderRadius: `8px`,
  fontSize: `13px`,
  fontWeight: `600`,
  color: `#64748b`,
  backgroundColor: `transparent`,
  border: `none`,
  cursor: `pointer`,
};

const mockIceContacts: IceContact[] = [
  { name: `Ana Kovač`, phone: `+386 41 123 456`, relation: `Partner` },
  { name: `Marko Novak`, phone: `+386 31 987 654`, relation: `Brat` },
];

const mockGps = {
  lat: 46.056946,
  lng: 14.505751,
  accuracy: 8,
};

/**
 * InHeader — SOS pill rendered inside a realistic mock header bar.
 */
export const InHeader = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ width: `100%`, maxWidth: `900px`, display: `flex`, flexDirection: `column`, gap: `32px` }}>
          <div>
            <p style={{ margin: `0 0 16px`, fontSize: `11px`, fontWeight: `700`, letterSpacing: `0.12em`, textTransform: `uppercase`, color: `#f97316` }}>
              SOS v glavi aplikacije
            </p>
            <div style={headerMockStyle}>
              <div style={logoStyle}>
                <div style={logoIconStyle}>🏍️</div>
                <span style={logoTextStyle}>MotoTrack</span>
              </div>
              <div style={navStyle}>
                <button type="button" style={navItemStyle}>Karta</button>
                <button type="button" style={navItemStyle}>Rute</button>
                <button type="button" style={navItemStyle}>Profil</button>
                <SosAction gpsCoords={mockGps} iceContacts={mockIceContacts} />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: `#0f172a`, borderRadius: `12px`, padding: `20px 24px`, border: `1px solid rgba(148,163,184,0.1)` }}>
            <p style={{ margin: `0 0 8px`, fontSize: `13px`, fontWeight: `700`, color: `#f1f5f9` }}>Opis komponente</p>
            <p style={{ margin: `0`, fontSize: `13px`, color: `#64748b`, lineHeight: `1.6` }}>
              Rdeča gradientna pila je vedno vidna v glavi aplikacije. Ob kliku odpre modalni dialog z GPS koordinatami, gumbi za deljenje lokacije, klicanjem 112 in urgentnimi številkami za balkanske države.
            </p>
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * WithGpsCoords — SOS modal with pre-loaded GPS coordinates.
 */
export const WithGpsCoords = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ display: `flex`, flexDirection: `column`, alignItems: `center`, gap: `24px` }}>
          <div style={{ textAlign: `center` }}>
            <p style={{ margin: `0 0 8px`, fontSize: `11px`, fontWeight: `700`, letterSpacing: `0.12em`, textTransform: `uppercase`, color: `#f97316` }}>
              Z GPS koordinatami
            </p>
            <p style={{ margin: `0`, fontSize: `13px`, color: `#64748b` }}>
              Klikni gumb za odprtje SOS modalnega okna
            </p>
          </div>
          <SosAction
            gpsCoords={mockGps}
            iceContacts={mockIceContacts}
          />
          <div style={{
            backgroundColor: `#0f172a`,
            borderRadius: `12px`,
            padding: `16px 20px`,
            border: `1px solid rgba(148,163,184,0.1)`,
            display: `grid`,
            gridTemplateColumns: `1fr 1fr 1fr`,
            gap: `16px`,
            minWidth: `320px`,
          }}>
            {[
              { label: `Latitude`, value: `${mockGps.lat.toFixed(6)}°` },
              { label: `Longitude`, value: `${mockGps.lng.toFixed(6)}°` },
              { label: `Natančnost`, value: `±${mockGps.accuracy} m` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: `flex`, flexDirection: `column`, gap: `4px` }}>
                <span style={{ fontSize: `10px`, fontWeight: `700`, color: `#64748b`, textTransform: `uppercase`, letterSpacing: `0.1em` }}>{label}</span>
                <span style={{ fontSize: `13px`, fontWeight: `700`, color: `#f1f5f9`, fontFamily: `monospace` }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * NoIceContacts — SOS modal showing the empty ICE contacts placeholder.
 */
export const NoIceContacts = () => {
  return (
    <MockProvider>
      <div style={pageStyle}>
        <div style={{ display: `flex`, flexDirection: `column`, alignItems: `center`, gap: `24px` }}>
          <div style={{ textAlign: `center` }}>
            <p style={{ margin: `0 0 8px`, fontSize: `11px`, fontWeight: `700`, letterSpacing: `0.12em`, textTransform: `uppercase`, color: `#f97316` }}>
              Brez ICE kontaktov
            </p>
            <p style={{ margin: `0`, fontSize: `13px`, color: `#64748b` }}>
              Prikazuje placeholder za prazne ICE kontakte
            </p>
          </div>
          <SosAction
            gpsCoords={mockGps}
            iceContacts={[]}
          />
        </div>
      </div>
    </MockProvider>
  );
};
