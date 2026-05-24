import React, { useState } from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { SosDialog } from './sos-dialog.js';
import {
  mockIceContacts,
  mockEmergencyNumbersSlovenia,
  mockEmergencyNumbersCroatia,
  mockLocationSlovenia,
  mockLocationCroatia,
  mockEmergencyNumbersGeneric,
} from './sos-dialog.mock.js';

// ── Shared trigger button ──────────────────────────────────────────────────

function SosTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick()}
      style={{
        display: `inline-flex`,
        alignItems: `center`,
        gap: `10px`,
        padding: `16px 32px`,
        background: `linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)`,
        border: `none`,
        borderRadius: `12px`,
        color: `#ffffff`,
        fontFamily: `inherit`,
        fontSize: `16px`,
        fontWeight: `800`,
        letterSpacing: `0.05em`,
        cursor: `pointer`,
        boxShadow: `0 8px 32px rgba(239,68,68,0.55)`,
      }}
    >
      🆘 Open SOS Dialog
    </button>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: `100vh`,
        backgroundColor: `#020617`,
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        justifyContent: `center`,
        gap: `24px`,
        padding: `40px 24px`,
        fontFamily: `Inter, system-ui, sans-serif`,
      }}
    >
      {children}
    </div>
  );
}

/**
 * SloveniaEmergency — SOS dialog with Slovenian country data and ICE contacts.
 */
export const SloveniaEmergency = () => {
  const [open, setOpen] = useState(false);

  return (
    <MockProvider>
      <PageWrapper>
        <div style={{ textAlign: `center`, maxWidth: `400px` }}>
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
            Safety · SOS Dialog
          </p>
          <h2
            style={{
              margin: `0 0 8px`,
              fontSize: `24px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.02em`,
            }}
          >
            Slovenia Emergency
          </h2>
          <p style={{ margin: `0 0 28px`, fontSize: `14px`, color: `#64748b`, lineHeight: `1.6` }}>
            Country-aware emergency numbers, ICE contacts, and location sharing — all in one dialog.
          </p>
          <SosTrigger onClick={() => setOpen(true)} />
        </div>

        <SosDialog
          open={open}
          onClose={() => setOpen(false)}
          iceContacts={mockIceContacts}
          emergencyNumbers={mockEmergencyNumbersSlovenia}
          countryName={mockLocationSlovenia.countryName}
          countryFlag={mockLocationSlovenia.countryFlag}
          lat={mockLocationSlovenia.lat}
          lng={mockLocationSlovenia.lng}
        />
      </PageWrapper>
    </MockProvider>
  );
};

/**
 * CroatiaEmergency — SOS dialog with Croatian country data.
 */
export const CroatiaEmergency = () => {
  const [open, setOpen] = useState(false);

  return (
    <MockProvider>
      <PageWrapper>
        <div style={{ textAlign: `center`, maxWidth: `400px` }}>
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
            Safety · SOS Dialog
          </p>
          <h2
            style={{
              margin: `0 0 8px`,
              fontSize: `24px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.02em`,
            }}
          >
            Croatia Emergency
          </h2>
          <p style={{ margin: `0 0 28px`, fontSize: `14px`, color: `#64748b`, lineHeight: `1.6` }}>
            Showing Croatian emergency numbers (Police 192, Ambulance 194, Fire 193).
          </p>
          <SosTrigger onClick={() => setOpen(true)} />
        </div>

        <SosDialog
          open={open}
          onClose={() => setOpen(false)}
          iceContacts={mockIceContacts}
          emergencyNumbers={mockEmergencyNumbersCroatia}
          countryName={mockLocationCroatia.countryName}
          countryFlag={mockLocationCroatia.countryFlag}
          lat={mockLocationCroatia.lat}
          lng={mockLocationCroatia.lng}
        />
      </PageWrapper>
    </MockProvider>
  );
};

/**
 * NoLocationFallback — SOS dialog with no GPS location available (offline scenario).
 */
export const NoLocationFallback = () => {
  const [open, setOpen] = useState(false);

  return (
    <MockProvider>
      <PageWrapper>
        <div style={{ textAlign: `center`, maxWidth: `400px` }}>
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
            Safety · SOS Dialog
          </p>
          <h2
            style={{
              margin: `0 0 8px`,
              fontSize: `24px`,
              fontWeight: `800`,
              color: `#f1f5f9`,
              letterSpacing: `-0.02em`,
            }}
          >
            Offline / No GPS
          </h2>
          <p style={{ margin: `0 0 28px`, fontSize: `14px`, color: `#64748b`, lineHeight: `1.6` }}>
            Works offline — tel: links and ICE contacts remain accessible even without GPS.
          </p>
          <SosTrigger onClick={() => setOpen(true)} />
        </div>

        <SosDialog
          open={open}
          onClose={() => setOpen(false)}
          iceContacts={mockIceContacts}
          emergencyNumbers={mockEmergencyNumbersGeneric}
        />
      </PageWrapper>
    </MockProvider>
  );
};
