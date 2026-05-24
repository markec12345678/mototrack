import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { useSpeedCameras } from './use-speed-cameras.js';
import { speedCameraMocks, ljublianaCameraMock } from './use-speed-cameras.mock.js';

function wrapper({ children }: { children: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('returns mock cameras without querying GraphQL', () => {
  const { result } = renderHook(
    () => useSpeedCameras({ mockData: speedCameraMocks }),
    { wrapper }
  );

  expect(result.current.cameras).toHaveLength(speedCameraMocks.length);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('returns an empty array when no mock data is provided and query is skipped', () => {
  const { result } = renderHook(
    () => useSpeedCameras({ mockData: [] }),
    { wrapper }
  );

  expect(result.current.cameras).toHaveLength(0);
});

it('nearest() returns undefined when camera list is empty', () => {
  const { result } = renderHook(
    () => useSpeedCameras({ mockData: [] }),
    { wrapper }
  );

  const from = new LatLng(46.0511, 14.5051);
  expect(result.current.nearest(from)).toBeUndefined();
});

it('nearest() returns the closest camera with distanceKm and bearingDeg', () => {
  const { result } = renderHook(
    () => useSpeedCameras({ mockData: speedCameraMocks }),
    { wrapper }
  );

  // Position very close to the Ljubljana camera (cam-si-01)
  const from = new LatLng(46.052, 14.506);
  const hit = result.current.nearest(from);

  expect(hit).toBeDefined();
  expect(hit?.camera.id).toBe(ljublianaCameraMock.id);
  expect(typeof hit?.distanceKm).toBe('number');
  expect(hit?.distanceKm).toBeGreaterThanOrEqual(0);
  expect(typeof hit?.bearingDeg).toBe('number');
  expect(hit?.bearingDeg).toBeGreaterThanOrEqual(0);
  expect(hit?.bearingDeg).toBeLessThanOrEqual(360);
});

it('nearest() distance is less than 0.5 km when within 500 m alert range', () => {
  const { result } = renderHook(
    () => useSpeedCameras({ mockData: [ljublianaCameraMock] }),
    { wrapper }
  );

  // ~100 m away from the Ljubljana camera
  const from = new LatLng(46.0511, 14.5061);
  const hit = result.current.nearest(from);

  expect(hit).toBeDefined();
  expect(hit?.distanceKm).toBeLessThan(0.5);
});

it('list() returns cameras sorted by distance ascending', () => {
  const { result } = renderHook(
    () => useSpeedCameras({ mockData: speedCameraMocks }),
    { wrapper }
  );

  // Position near Ljubljana — cam-si-01 should be first
  const from = new LatLng(46.052, 14.506);
  const sorted = result.current.list(from);

  expect(sorted[0].id).toBe('cam-si-01');

  // Verify ascending order
  for (let i = 1; i < sorted.length; i++) {
    const prevDist = LatLng.haversineKm(from, new LatLng(sorted[i - 1].lat, sorted[i - 1].lng));
    const currDist = LatLng.haversineKm(from, new LatLng(sorted[i].lat, sorted[i].lng));
    expect(currDist).toBeGreaterThanOrEqual(prevDist);
  }
});

it('list() returns empty array when no cameras are available', () => {
  const { result } = renderHook(
    () => useSpeedCameras({ mockData: [] }),
    { wrapper }
  );

  const from = new LatLng(46.0511, 14.5051);
  expect(result.current.list(from)).toHaveLength(0);
});

it('cameras array contains objects with expected fields', () => {
  const { result } = renderHook(
    () => useSpeedCameras({ mockData: speedCameraMocks }),
    { wrapper }
  );

  const cam = result.current.cameras[0];
  expect(cam).toHaveProperty('id');
  expect(cam).toHaveProperty('lat');
  expect(cam).toHaveProperty('lng');
  expect(cam).toHaveProperty('speedLimit');
  expect(cam).toHaveProperty('type');
  expect(cam).toHaveProperty('country');
});
