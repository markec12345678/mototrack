import { SpeedCamera } from '@markec/safety.entities.speed-camera';

/**
 * A small set of mock SpeedCamera instances for use in tests and compositions.
 * Coordinates are real locations across the Balkans.
 */
export const speedCameraMocks: SpeedCamera[] = [
  SpeedCamera.from({
    id: 'cam-si-01',
    lat: 46.0511,
    lng: 14.5051,
    speedLimit: 50,
    type: 'fixed',
    country: 'SI',
  }),
  SpeedCamera.from({
    id: 'cam-hr-01',
    lat: 45.815,
    lng: 15.9819,
    speedLimit: 130,
    type: 'fixed',
    country: 'HR',
  }),
  SpeedCamera.from({
    id: 'cam-rs-01',
    lat: 44.8176,
    lng: 20.4633,
    speedLimit: 80,
    type: 'mobile',
    country: 'RS',
  }),
  SpeedCamera.from({
    id: 'cam-bg-01',
    lat: 42.6977,
    lng: 23.3219,
    speedLimit: 90,
    type: 'fixed',
    country: 'BG',
  }),
  SpeedCamera.from({
    id: 'cam-ro-01',
    lat: 44.4268,
    lng: 26.1025,
    speedLimit: 100,
    type: 'average',
    country: 'RO',
  }),
];

/** A single mock camera close to Ljubljana for nearest() tests. */
export const ljublianaCameraMock: SpeedCamera = speedCameraMocks[0];
