import * as React from 'react';
import { useState, useCallback } from 'react';
import classNames from 'classnames';
import { MotoMap, type MapOverlay } from '@markec/maps.ui.moto-map';
import { MapLibre3D } from '@markec/maps.ui.map-libre-3d';
import { OfflineCacheIndicator } from '@markec/maps.ui.offline-cache-indicator';
import { ProtectedRoute } from '@markec/mototrack-platform.ui.protected-route';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import { LatLng } from '@markec/maps.entities.lat-lng';
import type { User } from '@markec/mototrack-platform.entities.user';
import styles from './map-page.module.scss';

// ── Icons ─────────────────────────────────────────────────────────────────────

function CubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

// ── Default values ────────────────────────────────────────────────────────────

const DEFAULT_CENTER = LatLng.from({ lat: 43.8563, lng: 18.4131 });
const DEFAULT_ZOOM = 13;
const DEFAULT_OVERLAYS: MapOverlay[] = [];

// ── Props ─────────────────────────────────────────────────────────────────────

export type MapPageProps = {
  /**
   * Initial map center coordinates.
   */
  center?: LatLng;

  /**
   * Initial zoom level.
   */
  zoom?: number;

  /**
   * Slot-registered MapOverlay components to render inside MotoMap.
   */
  overlays?: MapOverlay[];

  /**
   * Path to redirect unauthenticated users.
   */
  redirectTo?: string;

  /**
   * Mock user for testing and compositions — bypasses real auth.
   */
  mockUser?: User;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function MapPage({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  overlays = DEFAULT_OVERLAYS,
  redirectTo = `/login`,
  mockUser,
  className,
  style,
}: MapPageProps) {
  const [is3D, setIs3D] = useState(false);

  const handleToggle3D = useCallback(() => {
    setIs3D((prev) => !prev);
  }, []);

  return (
    <ProtectedRoute redirectTo={redirectTo} mockUser={mockUser}>
      <div className={classNames(styles.root, className)} style={style}>
        {/* ── Map views ─────────────────────────────────────────────────── */}
        <div className={classNames(styles.mapLayer, { [styles.mapLayerVisible]: !is3D })}>
          <MotoMap
            center={center}
            zoom={zoom}
            overlays={overlays}
            className={styles.map}
          />
        </div>

        <div className={classNames(styles.mapLayer, { [styles.mapLayerVisible]: is3D })}>
          <MapLibre3D
            center={center}
            zoom={zoom}
            pitch={60}
            bearing={0}
            height="100%"
            className={styles.map}
          />
        </div>

        {/* ── Floating controls ──────────────────────────────────────────── */}
        <div className={styles.floatingTopRight}>
          <div className={classNames(styles.toggleButton, { [styles.toggleButtonActive]: is3D })}>
            <IconButton
              icon={is3D ? <MapIcon /> : <CubeIcon />}
              variant={is3D ? `filled` : `ghost`}
              size="md"
              aria-label={is3D ? `Switch to 2D map` : `Switch to 3D terrain`}
              title={is3D ? `Switch to 2D map` : `Switch to 3D terrain`}
              onClick={() => handleToggle3D()}
            />
          </div>

          {is3D && (
            <div className={styles.badge3DLabel}>
              <span>3D TERRAIN</span>
            </div>
          )}
        </div>

        {/* ── Offline cache indicator ────────────────────────────────────── */}
        <div className={styles.floatingBottomLeft}>
          <OfflineCacheIndicator />
        </div>
      </div>
    </ProtectedRoute>
  );
}
