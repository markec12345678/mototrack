import * as React from 'react';
import { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import classNames from 'classnames';
import { useSpeedCameras } from '@markec/safety.hooks.use-speed-cameras';
import styles from './speed-camera-layer.module.scss';

export type SpeedCamera = {
  id: string;
  lat: number;
  lng: number;
  speedLimit: number;
  type: string;
  country: string;
};

export type SpeedCameraLayerProps = {
  /**
   * Override cameras list — useful for testing and compositions.
   * When provided, bypasses the GraphQL query entirely.
   */
  cameras?: SpeedCamera[];

  /**
   * Additional class name for the layer root wrapper.
   */
  className?: string;

  /**
   * Inline styles for the layer root wrapper.
   */
  style?: React.CSSProperties;
};

function CameraIconMarkup() {
  return (
    <div
      style={{
        width: `40px`,
        height: `40px`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        backgroundColor: `#eab308`,
        borderRadius: `50%`,
        border: `3px solid #ca8a04`,
        boxShadow: `0 2px 8px rgba(0,0,0,0.5)`,
        fontSize: `18px`,
        lineHeight: `1`,
        cursor: `pointer`,
      }}
    >
      📷
    </div>
  );
}

function buildCameraIcon() {
  const html = renderToStaticMarkup(<CameraIconMarkup />);
  return divIcon({
    html,
    className: ``,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -44],
  });
}

export function SpeedCameraLayer({ cameras: cameraProp, className, style }: SpeedCameraLayerProps) {
  const { cameras: fetchedCameras } = useSpeedCameras(
    cameraProp ? { mockData: cameraProp as never } : undefined
  );

  const cameras: SpeedCamera[] = cameraProp ?? (fetchedCameras as SpeedCamera[]) ?? [];

  const icon = useMemo(() => buildCameraIcon(), []);

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {cameras.map((cam) => (
        <Marker
          key={cam.id}
          position={[cam.lat, cam.lng]}
          icon={icon}
        >
          <Popup>
            <div className={styles.popup}>
              <div className={styles.popupHeader}>
                <span className={styles.popupEmoji}>📷</span>
                <span className={styles.popupTitle}>Speed Camera</span>
              </div>
              <div className={styles.popupBody}>
                <div className={styles.popupRow}>
                  <span className={styles.popupLabel}>Limit</span>
                  <span className={styles.popupValue}>
                    <span className={styles.speedLimit}>{cam.speedLimit}</span>
                    <span className={styles.speedUnit}>&nbsp;km/h</span>
                  </span>
                </div>
                <div className={styles.popupRow}>
                  <span className={styles.popupLabel}>Type</span>
                  <span className={styles.popupValue}>{cam.type}</span>
                </div>
                <div className={styles.popupRow}>
                  <span className={styles.popupLabel}>Country</span>
                  <span className={styles.popupValue}>{cam.country}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </div>
  );
}
