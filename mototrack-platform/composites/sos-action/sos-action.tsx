import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Modal } from '@markec/mototrack-design.overlays.modal';
import type { IceContact } from './ice-contact-type.js';
import type { BalkanEmergencyEntry } from './balkan-emergency-type.js';
import { balkanEmergencyNumbers, mockIceContacts } from './sos-action.mock.js';
import styles from './sos-action.module.scss';

export type GpsCoords = {
  lat: number;
  lng: number;
  accuracy?: number;
};

export type SosActionProps = {
  /**
   * ICE (In Case of Emergency) contacts to display in the modal.
   */
  iceContacts?: IceContact[];

  /**
   * Balkan emergency numbers list.
   */
   emergencyNumbers?: BalkanEmergencyEntry[];

  /**
   * Override GPS coordinates (useful for testing/SSR).
   */
  gpsCoords?: GpsCoords | null;

  /**
   * Additional class name for the pill button wrapper.
   */
  className?: string;

  /**
   * Inline styles for the pill button wrapper.
   */
  style?: React.CSSProperties;
};

function SosAlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type GpsState = {
  coords: GpsCoords | null;
  loading: boolean;
  error: string | null;
};

function useGps(overrideCoords?: GpsCoords | null): GpsState {
  const [state, setState] = useState<GpsState>({
    coords: overrideCoords !== undefined ? overrideCoords : null,
    loading: overrideCoords === undefined,
    error: null,
  });

  useEffect(() => {
    if (overrideCoords !== undefined) {
      setState({ coords: overrideCoords, loading: false, error: null });
      return;
    }

    if (typeof navigator === `undefined` || !navigator.geolocation) {
      setState({ coords: null, loading: false, error: `GPS ni podprt` });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          loading: false,
          error: null,
        });
      },
      () => {
        setState({ coords: null, loading: false, error: `GPS ni dostopen` });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [overrideCoords]);

  return state;
}

function buildLocationText(coords: GpsCoords | null): string {
  if (!coords) return `Lokacija ni na voljo`;
  return `Lat: ${coords.lat.toFixed(6)}, Lng: ${coords.lng.toFixed(6)}`;
}

function buildShareUrl(coords: GpsCoords | null): string {
  if (!coords) return `https://mototrack.app/sos`;
  return `https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;
}

export function SosAction({
  iceContacts = mockIceContacts,
  emergencyNumbers = balkanEmergencyNumbers,
  gpsCoords,
  className,
  style,
}: SosActionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const gps = useGps(gpsCoords);

  const locationText = buildLocationText(gps.coords);
  const shareUrl = buildShareUrl(gps.coords);

  const handleCopy = useCallback(() => {
    const text = `🆘 SOS MotoTrack\n${locationText}\n${shareUrl}`;
    if (typeof navigator !== `undefined` && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        setCopied(false);
      });
    }
  }, [locationText, shareUrl]);

  const smsBody = encodeURIComponent(`🆘 SOS! Potrebujem pomoč. Moja lokacija: ${shareUrl}`);
  const waText = encodeURIComponent(`🆘 SOS! Potrebujem pomoč. Moja lokacija: ${shareUrl}`);
  const tgText = encodeURIComponent(`🆘 SOS! Potrebujem pomoč. Moja lokacija: ${shareUrl}`);

  const dotClass = gps.loading
    ? classNames(styles.gpsStatusDot, styles.gpsStatusDotLoading)
    : gps.error
    ? classNames(styles.gpsStatusDot, styles.gpsStatusDotError)
    : styles.gpsStatusDot;

  return (
    <>
      <button
        type="button"
        className={classNames(styles.sosPill, className)}
        style={style}
        onClick={() => setModalOpen(true)}
        aria-label="Odpri SOS meni"
      >
        <span className={styles.pillIcon}>
          <SosAlertIcon />
        </span>
        <span className={styles.pillLabel}>SOS</span>
      </button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="🆘 SOS — Nujna Pomoč"
        size="md"
      >
        <div className={styles.modalContent}>

          {/* GPS Coordinates */}
          <div className={styles.gpsSection}>
            <div className={styles.gpsSectionHeader}>
              <p className={styles.gpsSectionTitle}>
                <MapPinIcon />
                GPS Lokacija
              </p>
              <span className={dotClass} />
            </div>

            {gps.loading && (
              <div className={styles.gpsCoords}>
                <div className={styles.gpsCoordItem}>
                  <span className={styles.gpsCoordLabel}>Latitude</span>
                  <span className={classNames(styles.gpsCoordValue, styles.gpsCoordValuePlaceholder)}>Pridobivam…</span>
                </div>
                <div className={styles.gpsCoordItem}>
                  <span className={styles.gpsCoordLabel}>Longitude</span>
                  <span className={classNames(styles.gpsCoordValue, styles.gpsCoordValuePlaceholder)}>Pridobivam…</span>
                </div>
              </div>
            )}

            {!gps.loading && gps.error && (
              <div className={styles.gpsCoords}>
                <div className={styles.gpsCoordItem}>
                  <span className={styles.gpsCoordLabel}>Status</span>
                  <span className={classNames(styles.gpsCoordValue, styles.gpsCoordValuePlaceholder)}>{gps.error}</span>
                </div>
              </div>
            )}

            {!gps.loading && gps.coords && (
              <>
                <div className={styles.gpsCoords}>
                  <div className={styles.gpsCoordItem}>
                    <span className={styles.gpsCoordLabel}>Latitude</span>
                    <span className={styles.gpsCoordValue}>{gps.coords.lat.toFixed(6)}°</span>
                  </div>
                  <div className={styles.gpsCoordItem}>
                    <span className={styles.gpsCoordLabel}>Longitude</span>
                    <span className={styles.gpsCoordValue}>{gps.coords.lng.toFixed(6)}°</span>
                  </div>
                </div>
                {gps.coords.accuracy !== undefined && (
                  <span className={styles.gpsAccuracy}>
                    Natančnost: ±{Math.round(gps.coords.accuracy)} m
                  </span>
                )}
              </>
            )}
          </div>

          {/* Share Location */}
          <div className={styles.shareSection}>
            <p className={styles.shareSectionTitle}>Deli lokacijo</p>
            <div className={styles.shareButtons}>
              <a
                href={`sms:?body=${smsBody}`}
                className={classNames(styles.shareButton, styles.shareButtonSms)}
              >
                <span className={styles.shareButtonIcon}>💬</span>
                SMS
              </a>
              <a
                href={`https://wa.me/?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames(styles.shareButton, styles.shareButtonWhatsapp)}
              >
                <span className={styles.shareButtonIcon}>📱</span>
                WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${tgText}`}
                target="_blank"
                rel="noopener noreferrer"
                className={classNames(styles.shareButton, styles.shareButtonTelegram)}
              >
                <span className={styles.shareButtonIcon}>✈️</span>
                Telegram
              </a>
              <button
                type="button"
                onClick={() => handleCopy()}
                className={classNames(styles.shareButton, styles.shareButtonCopy, {
                  [styles.shareButtonCopied]: copied,
                })}
              >
                <span className={styles.shareButtonIcon}>
                  {copied ? <CheckIcon /> : `📋`}
                </span>
                {copied ? `Kopirano!` : `Kopiraj`}
              </button>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Call 112 */}
          <div className={styles.call112Section}>
            <a
              href="tel:112"
              className={styles.call112Button}
            >
              <PhoneIcon size={22} />
              <span>
                <span className={styles.call112Number}>112</span>
              </span>
              <span className={styles.call112Label}>Pokliči EU reševalce</span>
            </a>
          </div>

          <hr className={styles.divider} />

          {/* Balkan Emergency Numbers */}
          <div className={styles.balkansSection}>
            <p className={styles.balkansSectionTitle}>Balkanske urgentne številke</p>
            <div className={styles.balkansGrid}>
              {emergencyNumbers.map((entry) => (
                <div key={entry.country} className={styles.balkansRow}>
                  <div className={styles.balkansCountry}>
                    <span className={styles.balkansFlag}>{entry.flag}</span>
                    <span className={styles.balkansCountryName}>{entry.country}</span>
                  </div>
                  <div className={styles.balkansNumberGroup}>
                    <span className={styles.balkansNumberLabel}>🚔</span>
                    <a href={`tel:${entry.police}`} className={styles.balkansNumberLink}>{entry.police}</a>
                  </div>
                  <div className={styles.balkansNumberGroup}>
                    <span className={styles.balkansNumberLabel}>🚑</span>
                    <a href={`tel:${entry.ambulance}`} className={styles.balkansNumberLink}>{entry.ambulance}</a>
                  </div>
                  <div className={styles.balkansNumberGroup}>
                    <span className={styles.balkansNumberLabel}>🚒</span>
                    <a href={`tel:${entry.fire}`} className={styles.balkansNumberLink}>{entry.fire}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* ICE Contacts */}
          <div className={styles.iceSection}>
            <div className={styles.iceSectionHeader}>
              <p className={styles.iceSectionTitle}>ICE kontakti</p>
              <button type="button" className={styles.iceAddButton}>
                <PlusIcon />
                Dodaj
              </button>
            </div>

            {iceContacts.length === 0 ? (
              <div className={styles.iceEmptyPlaceholder}>
                <span className={styles.iceEmptyIcon}>👤</span>
                <p className={styles.iceEmptyText}>
                  Ni ICE kontaktov. Dodaj osebe, ki jih je treba obvestiti v primeru nesreče.
                </p>
              </div>
            ) : (
              <div className={styles.iceContactsList}>
                {iceContacts.map((contact) => (
                  <div key={contact.phone} className={styles.iceContactCard}>
                    <div className={styles.iceContactAvatar}>
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.iceContactInfo}>
                      <div className={styles.iceContactName}>{contact.name}</div>
                      <div className={styles.iceContactMeta}>
                        {contact.relation ? `${contact.relation} · ` : ``}{contact.phone}
                      </div>
                    </div>
                    <a
                      href={`tel:${contact.phone}`}
                      className={styles.iceContactCallLink}
                      aria-label={`Pokliči ${contact.name}`}
                    >
                      <PhoneIcon size={14} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </Modal>
    </>
  );
}

/**
 * HeaderAction slot registration descriptor for the SosAction component.
 */
export const sosHeaderAction = {
  key: `sos-action`,
  label: `SOS`,
  icon: `🆘`,
  component: SosAction,
  order: 0,
};
