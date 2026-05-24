import React, { useMemo } from 'react';
import { Polyline } from 'react-leaflet';
import { LatLng } from '@markec/maps.entities.lat-lng';
import classNames from 'classnames';
import styles from './twistiness-heatmap-layer.module.scss';

const WINDOW_METERS = 500;

export type TwistinessHeatmapLayerProps = {
  /**
   * Ordered list of track coordinates.
   */
  track: LatLng[];

  /**
   * Opacity of the rendered polylines (0–1).
   */
  opacity?: number;

  /**
   * Stroke weight in pixels.
   */
  weight?: number;

  /**
   * Additional class name for the wrapper element.
   */
  className?: string;

  /**
   * Inline styles for the wrapper element.
   */
  style?: React.CSSProperties;
};

type Segment = {
  positions: [number, number][];
  color: string;
};

/**
 * Interpolates between green (twisty) → yellow → red (straight)
 * based on a normalized straightness score in [0, 1].
 * 0 = very twisty (green), 1 = very straight (red).
 */
function straightnessToColor(score: number): string {
  const t = Math.max(0, Math.min(1, score));

  if (t <= 0.5) {
    // green → yellow
    const f = t / 0.5;
    const r = Math.round(f * 255);
    const g = 200;
    const b = 0;
    return `rgb(${r},${g},${b})`;
  }

  // yellow → red
  const f = (t - 0.5) / 0.5;
  const r = 255;
  const g = Math.round((1 - f) * 200);
  const b = 0;
  return `rgb(${r},${g},${b})`;
}

/**
 * Computes the total absolute bearing change (in degrees) for a list of points.
 */
function totalBearingChange(points: LatLng[]): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const b1 = LatLng.bearingDeg(points[i - 1], points[i]);
    const b2 = LatLng.bearingDeg(points[i], points[i + 1]);
    let delta = Math.abs(b2 - b1);
    if (delta > 180) delta = 360 - delta;
    total += delta;
  }
  return total;
}

/**
 * Builds colored segments from a track using a 500 m sliding window.
 * Each segment is colored based on how straight (red) or twisty (green) it is.
 */
function buildSegments(track: LatLng[], weight: number, opacity: number): Segment[] {
  if (track.length < 2) return [];

  // Pre-compute cumulative distances
  const cumDist: number[] = [0];
  for (let i = 1; i < track.length; i++) {
    cumDist.push(cumDist[i - 1] + LatLng.haversineKm(track[i - 1], track[i]) * 1000);
  }

  const totalDist = cumDist[cumDist.length - 1];
  if (totalDist === 0) return [];

  // For each consecutive pair of points, assign a twistiness score
  // using a 500 m window centred on the midpoint of the segment.
  const segments: Segment[] = [];

  // Max possible bearing change for normalization (heuristic: 180° per point pair)
  // We normalize against a reference of 360° total change per 500 m window.
  const REFERENCE_CHANGE = 360;

  for (let i = 0; i < track.length - 1; i++) {
    const midDist = (cumDist[i] + cumDist[i + 1]) / 2;
    const windowStart = midDist - WINDOW_METERS / 2;
    const windowEnd = midDist + WINDOW_METERS / 2;

    // Collect all points within the window
    const windowPoints: LatLng[] = [];
    for (let j = 0; j < track.length; j++) {
      if (cumDist[j] >= windowStart && cumDist[j] <= windowEnd) {
        windowPoints.push(track[j]);
      }
    }

    const change = totalBearingChange(windowPoints);
    // High bearing change = twisty (score → 0 = green)
    // Low bearing change = straight (score → 1 = red)
    const score = 1 - Math.min(change / REFERENCE_CHANGE, 1);
    const color = straightnessToColor(score);

    segments.push({
      positions: [
        [track[i].lat, track[i].lng],
        [track[i + 1].lat, track[i + 1].lng],
      ],
      color,
    });
  }

  return segments;
}

/**
 * TwistinessHeatmapLayer renders a series of colored Leaflet polylines
 * representing how twisty each part of a track is.
 *
 * Must be rendered inside a react-leaflet `<MapContainer>`.
 */
export function TwistinessHeatmapLayer({
  track,
  opacity = 0.9,
  weight = 5,
  className,
  style,
}: TwistinessHeatmapLayerProps) {
  const segments = useMemo(
    () => buildSegments(track, weight, opacity),
    [track, weight, opacity]
  );

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {segments.map((seg, idx) => (
        <Polyline
          key={idx}
          positions={seg.positions}
          pathOptions={{ color: seg.color, weight, opacity }}
        />
      ))}
    </div>
  );
}
