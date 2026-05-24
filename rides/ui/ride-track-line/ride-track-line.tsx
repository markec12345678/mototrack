import * as React from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';
import { MotoMap } from '@markec/maps.ui.moto-map';
import { TrackPoint } from '@markec/rides.entities.track-point';
import { Polyline, CircleMarker, useMap } from 'react-leaflet';
import styles from './ride-track-line.module.scss';

// ── FitBounds helper ──────────────────────────────────────────────────────────

type FitBoundsProps = {
  positions: [number, number][];
};

function FitBounds({ positions }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (positions.length < 2) return;
    const lats = positions.map(([lat]) => lat);
    const lngs = positions.map(([, lng]) => lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    map.fitBounds(
      [
        [minLat, minLng],
        [maxLat, maxLng],
      ],
      { padding: [32, 32], animate: true }
    );
  }, [map, positions]);

  return null;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export type RideTrackLineProps = {
  /**
   * Array of TrackPoint objects that make up the ride track.
   */
  track: TrackPoint[];

  /**
   * When true, the map will fitBounds to the track on mount.
   */
  focused?: boolean;

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

export function RideTrackLine({
  track,
  focused = false,
  className,
  style,
}: RideTrackLineProps) {
  const positions: [number, number][] = track.map((pt) => [pt.lat, pt.lng]);

  const startPoint = positions[0];
  const endPoint = positions[positions.length - 1];

  const hasTrack = positions.length >= 2;

  if (!hasTrack) {
    return (
      <div className={classNames(styles.root, className)} style={style}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🗺️</span>
          <span className={styles.emptyText}>No track data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <MotoMap>
        {focused && <FitBounds positions={positions} />}

        <Polyline
          positions={positions}
          pathOptions={{
            color: `#22c55e`,
            weight: 4,
            opacity: 0.9,
            lineJoin: `round`,
            lineCap: `round`,
          }}
        />

        {startPoint && (
          <CircleMarker
            center={startPoint}
            radius={8}
            pathOptions={{
              color: `#16a34a`,
              fillColor: `#22c55e`,
              fillOpacity: 1,
              weight: 3,
            }}
          />
        )}

        {endPoint && (
          <CircleMarker
            center={endPoint}
            radius={8}
            pathOptions={{
              color: `#b91c1c`,
              fillColor: `#ef4444`,
              fillOpacity: 1,
              weight: 3,
            }}
          />
        )}
      </MotoMap>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={classNames(styles.legendDot, styles.legendDotStart)} />
          <span className={styles.legendLabel}>Start</span>
        </div>
        <div className={styles.legendItem}>
          <span className={classNames(styles.legendDot, styles.legendDotEnd)} />
          <span className={styles.legendLabel}>End</span>
        </div>
      </div>
    </div>
  );
}
