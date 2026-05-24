import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useCountryFromLocation } from '@markec/safety.hooks.use-country-from-location';
import { useIceContacts } from '@markec/safety.hooks.use-ice-contacts';
import { useGeolocation } from '@markec/maps.hooks.use-geolocation';
import { IceContact } from './ice-contact-type.js';
import { EmergencyNumbers } from './emergency-numbers-type.js';
import styles from './sos-dialog.module.scss';

// ── Fallback emergency numbers ─────────────────────────────────────────────

const FALLBACK_EMERGENCY: EmergencyNumbers = {
  police: '112',
  ambulance: '112',
  fire: '112',
  general: '112',
};

// ── Default mock ICE contacts ──────────────────────────────────────────────

const DEFAULT_ICE_CONTACTS: IceContact[] = [
  {
    id: `ice-1`,
    userId: `user-1`,
    name: `Ana Horvat`,
    relation: `Partner`,
    phone: `+38641123456`,
    primary: true,
    bloodType: `A+`,
  },
  {
    id: `ice-2`,
    userId: `user-1`,
    name: `Marko Horvat`,
    relation: `Brother`,
    phone: `+38631987654`,
    primary: false,
  },
];

// ── Props ──────────────────────────────────────────────────────────────────

export type SosDialogProps = {
  /**
   * Whether the dialog is open.
   */
  open: boolean;

  /**
   * Callback fired when the dialog requests to be closed.
   */
  onClose: () => void;

  /**
   * Override ICE contacts (useful for testing / SSR).
   */
  iceContacts?: IceContact[];

  /**
   * Override emergency numbers (useful for testing / SSR).
   */
  emergencyNumbers?: EmergencyNumbers;

  /**
   * Override country name (useful for testing / SSR).
   */
  countryName?: string;

  /**
   * Override country flag emoji (useful for testing / SSR).
   */
  countryFlag?: string;

  /**
   * Override latitude (useful for testing / SSR).
   */
  lat?: number;

  /**
   * Override longitude (useful for testing / SSR).
   */
  lng?: number;

  /**
   * Additional class name.
   */
  className?: string;

  /**
   * Inline styles.
   */
  style?: React.CSSProperties;
};

// ── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(` `)
    .map((part) => part[0])
    .join(``)
    .toUpperCase()
    .slice(0, 2);
}

function buildCoordsText(lat: number, lng: number): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

function buildMapsUrl(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`;
}

// ── Icons ──────────────────────────────────────────────────────────────────

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 3h3l1.5 3.5-1.75 1.25a9 9 0 004 4L11.5 10l3.5 1.5v3A1.5 1.5 0 0113.5 16C6.596 16 2 11.404 2 4.5A1.5 1.5 0 013.5 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WifiOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1l12 12M9.5 9.5A3 3 0 007 8.5a3 3 0 00-2.5 1M5 5a6 6 0 014 1.5M2.5 3A9 9 0 0112 7.5M7 12.5h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export function SosDialog({
  open,
  onClose,
  iceContacts,
  emergencyNumbers,
  countryName,
  countryFlag,
  lat: latProp,
  lng: lngProp,
  className,
  style,
}: SosDialogProps) {
  const [copied, setCopied] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Geolocation
  const geoResult = useGeolocation();
  const geoPosition = (geoResult as Record<string, unknown>).position as
    | { lat?: number; lng?: number }
    | undefined;
  const lat = latProp ?? geoPosition?.lat ?? null;
  const lng = lngProp ?? geoPosition?.lng ?? null;

  // Country detection
  const locationResult = useCountryFromLocation({ lat: lat ?? undefined, lng: lng ?? undefined });
  const resolvedCountry = countryName ?? (locationResult as Record<string, unknown> | null)?.country as string | null ?? null;
  const resolvedFlag = countryFlag ?? (locationResult as Record<string, unknown> | null)?.flag as string | null ?? null;
  const rawEmergency = (locationResult as Record<string, unknown> | null)?.emergencyNumbers as EmergencyNumbers | undefined;
  const resolvedEmergency: EmergencyNumbers = emergencyNumbers ?? rawEmergency ?? FALLBACK_EMERGENCY;

  // ICE contacts — useIceContacts returns an object; we safely read the contacts list
  const iceHookResult = useIceContacts();
  const fetchedContacts = Array.isArray((iceHookResult as Record<string, unknown>).contacts)
    ? ((iceHookResult as Record<string, unknown>).contacts as IceContact[])
    : undefined;
  const resolvedContacts: IceContact[] = iceContacts ?? fetchedContacts ?? DEFAULT_ICE_CONTACTS;

  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    if (typeof window !== `undefined`) {
      setIsOffline(!window.navigator.onLine);
      window.addEventListener(`online`, handleOnline);
      window.addEventListener(`offline`, handleOffline);
    }
    return () => {
      if (typeof window !== `undefined`) {
        window.removeEventListener(`online`, handleOnline);
        window.removeEventListener(`offline`, handleOffline);
      }
    };
  }, []);

  // ESC key
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === `Escape`) onClose();
    };
    document.addEventListener(`keydown`, handleKey);
    return () => document.removeEventListener(`keydown`, handleKey);
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = `hidden`;
    } else {
      document.body.style.overflow = ``;
    }
    return () => {
      document.body.style.overflow = ``;
    };
  }, [open]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleCopyCoords = useCallback(async () => {
    if (lat === null || lng === null) return;
    const text = `${buildCoordsText(lat, lng)} — ${buildMapsUrl(lat, lng)}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement(`textarea`);
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand(`copy`);
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [lat, lng]);

  const handleWebShare = useCallback(async () => {
    if (lat === null || lng === null) return;
    const url = buildMapsUrl(lat, lng);
    const text = `🆘 I need help! My location: ${buildCoordsText(lat, lng)}`;
    if (typeof navigator !== `undefined` && navigator.share) {
      try {
        await navigator.share({ title: `SOS — My Location`, text, url });
      } catch {
        // User cancelled or share failed — silently ignore
      }
    }
  }, [lat, lng]);

  const handleSms = useCallback(() => {
    if (lat === null || lng === null) return;
    const body = encodeURIComponent(
      `🆘 SOS! I need help. My location: ${buildMapsUrl(lat, lng)} (${buildCoordsText(lat, lng)})`
    );
    window.open(`sms:?body=${body}`, `_self`);
  }, [lat, lng]);

  const handleWhatsApp = useCallback(() => {
    if (lat === null || lng === null) return;
    const text = encodeURIComponent(
      `🆘 SOS! I need help. My location: ${buildMapsUrl(lat, lng)} (${buildCoordsText(lat, lng)})`
    );
    window.open(`https://wa.me/?text=${text}`, `_blank`);
  }, [lat, lng]);

  if (!open) return null;

  const hasLocation = lat !== null && lng !== null;

  const emergencyCards = [
    { label: `Police`, icon: `🚔`, number: resolvedEmergency.police },
    { label: `Ambulance`, icon: `🚑`, number: resolvedEmergency.ambulance },
    { label: `Fire`, icon: `🚒`, number: resolvedEmergency.fire },
  ];

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="SOS Emergency Dialog"
    >
      <div className={classNames(styles.dialog, className)} style={style}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.sosLabel}>
              <span className={styles.sosDot} />
              <span className={styles.sosLabelText}>SOS</span>
            </div>
            {resolvedFlag && resolvedCountry && (
              <div className={styles.countryBadge}>
                <span>{resolvedFlag}</span>
                <span className={styles.countryBadgeText}>{resolvedCountry}</span>
              </div>
            )}
            {isOffline && (
              <div className={styles.offlineBanner}>
                <WifiOffIcon />
                <span>Offline</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => onClose()}
            aria-label="Close SOS dialog"
          >
            <XIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div className={styles.body}>
          {/* Big call 112 button */}
          <div className={styles.callButtonWrap}>
            <a
              href={`tel:${resolvedEmergency.general}`}
              className={styles.callButton}
              aria-label={`Call emergency number ${resolvedEmergency.general}`}
            >
              <PhoneIcon />
              {resolvedEmergency.general !== `112` ? (
                <span>Call {resolvedEmergency.general} · 112</span>
              ) : (
                <span>Call 112 — Emergency</span>
              )}
            </a>
            <span className={styles.callButtonHint}>
              Tap to call · works without internet
            </span>
          </div>

          {/* Emergency numbers grid */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Emergency Numbers</p>
            <div className={styles.emergencyGrid}>
              {emergencyCards.map((card) => (
                <a
                  key={card.label}
                  href={`tel:${card.number}`}
                  className={styles.emergencyCard}
                  aria-label={`Call ${card.label}: ${card.number}`}
                >
                  <span className={styles.emergencyCardIcon}>{card.icon}</span>
                  <span className={styles.emergencyCardLabel}>{card.label}</span>
                  <span className={styles.emergencyCardNumber}>{card.number}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ICE contacts */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>ICE Contacts</p>
            {resolvedContacts.length === 0 ? (
              <div className={styles.iceEmpty}>
                No emergency contacts saved yet.
              </div>
            ) : (
              <ul className={styles.iceList}>
                {resolvedContacts.map((contact) => (
                  <li
                    key={contact.id}
                    className={classNames(styles.iceItem, { [styles.primary]: contact.primary })}
                  >
                    <div
                      className={classNames(styles.iceAvatar, {
                        [styles.secondary]: !contact.primary,
                      })}
                    >
                      {getInitials(contact.name)}
                    </div>
                    <div className={styles.iceInfo}>
                      <div className={styles.iceName}>{contact.name}</div>
                      <div className={styles.iceRelation}>{contact.relation}</div>
                    </div>
                    {contact.primary && (
                      <span className={styles.icePrimaryBadge}>Primary</span>
                    )}
                    <a
                      href={`tel:${contact.phone}`}
                      className={styles.iceCallLink}
                      aria-label={`Call ${contact.name}`}
                    >
                      <PhoneIcon />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Share location */}
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Share My Location</p>
            <div className={styles.shareGrid}>
              <button
                type="button"
                className={styles.shareButton}
                onClick={() => handleWebShare()}
                disabled={!hasLocation}
                aria-label="Share location via system share"
              >
                <span className={styles.shareButtonIcon}>📤</span>
                <span className={styles.shareButtonLabel}>Share</span>
              </button>
              <button
                type="button"
                className={styles.shareButton}
                onClick={() => handleSms()}
                disabled={!hasLocation}
                aria-label="Share location via SMS"
              >
                <span className={styles.shareButtonIcon}>💬</span>
                <span className={styles.shareButtonLabel}>SMS</span>
              </button>
              <button
                type="button"
                className={styles.shareButton}
                onClick={() => handleWhatsApp()}
                disabled={!hasLocation}
                aria-label="Share location via WhatsApp"
              >
                <span className={styles.shareButtonIcon}>🟢</span>
                <span className={styles.shareButtonLabel}>WhatsApp</span>
              </button>
              <button
                type="button"
                className={styles.shareButton}
                onClick={() => handleCopyCoords()}
                disabled={!hasLocation}
                aria-label="Copy coordinates to clipboard"
              >
                <span className={styles.shareButtonIcon}>📋</span>
                <span className={styles.shareButtonLabel}>Copy Coords</span>
              </button>
            </div>
            {copied && (
              <div className={styles.copiedFeedback}>
                <CheckIcon />
                <span>Coordinates copied to clipboard!</span>
              </div>
            )}
            {!hasLocation && (
              <div className={styles.offlineBanner}>
                <WifiOffIcon />
                <span>Location unavailable — sharing disabled</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
