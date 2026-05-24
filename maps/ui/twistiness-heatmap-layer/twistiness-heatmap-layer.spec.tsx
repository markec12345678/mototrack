import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { straightnessToColor } from './twistiness-color.js';
import { mockTrack, STRAIGHT_TRACK, MINIMAL_TRACK } from './twistiness-heatmap-layer.mock.js';

// ─── Mock react-leaflet so tests run in JSDom ────────────────────────────────

vi.mock('react-leaflet', () => ({
  Polyline: ({ positions, pathOptions }: { positions: [number, number][]; pathOptions: { color: string; weight: number; opacity: number } }) => (
    <div
      data-testid="polyline"
      data-color={pathOptions.color}
      data-weight={pathOptions.weight}
      data-lat0={positions[0][0]}
      data-lng0={positions[0][1]}
    />
  ),
}));

import { TwistinessHeatmapLayer } from './twistiness-heatmap-layer.js';
import styles from './twistiness-heatmap-layer.module.scss';

// ─── Color utility tests ──────────────────────────────────────────────────────

describe('straightnessToColor', () => {
  it('returns a green-ish color for score 0 (fully twisty)', () => {
    const color = straightnessToColor(0);
    expect(color).toBe('rgb(0,200,0)');
  });

  it('returns a yellow-ish color for score 0.5', () => {
    const color = straightnessToColor(0.5);
    expect(color).toBe('rgb(255,200,0)');
  });

  it('returns a red color for score 1 (fully straight)', () => {
    const color = straightnessToColor(1);
    expect(color).toBe('rgb(255,0,0)');
  });

  it('clamps values below 0', () => {
    const color = straightnessToColor(-5);
    expect(color).toBe('rgb(0,200,0)');
  });

  it('clamps values above 1', () => {
    const color = straightnessToColor(99);
    expect(color).toBe('rgb(255,0,0)');
  });
});

// ─── Mock data tests ──────────────────────────────────────────────────────────

describe('mockTrack', () => {
  it('generates the requested number of points', () => {
    const track = mockTrack(46.0, 14.5, 60);
    expect(track.length).toBe(60);
  });

  it('returns LatLng instances', () => {
    const track = mockTrack();
    expect(track[0]).toBeInstanceOf(LatLng);
  });

  it('STRAIGHT_TRACK has monotonically increasing latitude', () => {
    for (let i = 1; i < STRAIGHT_TRACK.length; i++) {
      expect(STRAIGHT_TRACK[i].lat).toBeGreaterThan(STRAIGHT_TRACK[i - 1].lat);
    }
  });
});

// ─── Component rendering tests ────────────────────────────────────────────────

describe('TwistinessHeatmapLayer', () => {
  it('renders a polyline for each consecutive point pair', () => {
    const track = mockTrack(46.0, 14.5, 10);
    const { container } = render(<TwistinessHeatmapLayer track={track} />);
    const polylines = container.querySelectorAll('[data-testid="polyline"]');
    // n points → n-1 segments
    expect(polylines.length).toBe(track.length - 1);
  });

  it('renders nothing for an empty track', () => {
    const { container } = render(<TwistinessHeatmapLayer track={[]} />);
    const polylines = container.querySelectorAll('[data-testid="polyline"]');
    expect(polylines.length).toBe(0);
  });

  it('renders a single segment for a 2-point track', () => {
    const { container } = render(<TwistinessHeatmapLayer track={MINIMAL_TRACK} />);
    const polylines = container.querySelectorAll('[data-testid="polyline"]');
    expect(polylines.length).toBe(1);
  });

  it('applies the root class name', () => {
    const { container } = render(<TwistinessHeatmapLayer track={MINIMAL_TRACK} />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain(styles.root);
  });

  it('forwards a custom className to the root element', () => {
    const { container } = render(
      <TwistinessHeatmapLayer track={MINIMAL_TRACK} className="custom-class" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('custom-class');
  });

  it('passes the weight prop to each polyline', () => {
    const { container } = render(
      <TwistinessHeatmapLayer track={MINIMAL_TRACK} weight={8} />
    );
    const polyline = container.querySelector('[data-testid="polyline"]') as HTMLElement;
    expect(polyline.getAttribute('data-weight')).toBe('8');
  });

  it('assigns a color attribute to each polyline', () => {
    const track = mockTrack(46.0, 14.5, 5);
    const { container } = render(<TwistinessHeatmapLayer track={track} />);
    const polylines = container.querySelectorAll('[data-testid="polyline"]');
    polylines.forEach((p) => {
      const color = p.getAttribute('data-color');
      expect(color).toBeTruthy();
      expect(color).toMatch(/^rgb\(\d+,\d+,\d+\)$/);
    });
  });

  it('straight track segments are colored red-ish (high straightness)', () => {
    const { container } = render(<TwistinessHeatmapLayer track={STRAIGHT_TRACK} />);
    const polylines = container.querySelectorAll('[data-testid="polyline"]');
    // For a straight track, red channel should be 255
    polylines.forEach((p) => {
      const color = p.getAttribute('data-color') ?? '';
      const match = color.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
      if (match) {
        const r = Number(match[1]);
        // straight → red channel should be high
        expect(r).toBeGreaterThan(200);
      }
    });
  });

  it('renders correct number of segments for a longer track', () => {
    const track = mockTrack(46.0, 14.5, 120);
    const { container } = render(<TwistinessHeatmapLayer track={track} />);
    const polylines = container.querySelectorAll('[data-testid="polyline"]');
    expect(polylines.length).toBe(119);
  });
});
