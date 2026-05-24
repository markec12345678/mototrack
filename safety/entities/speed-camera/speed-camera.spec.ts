import { describe, it, expect } from 'vitest';
import { SpeedCamera } from './speed-camera.js';
import { mockSpeedCameras, mockSpeedCamera } from './speed-camera.mock.js';

describe('SpeedCamera', () => {
  it('should have a static from() method', () => {
    expect(SpeedCamera.from).toBeTruthy();
  });

  it('should create a SpeedCamera instance from a plain object', () => {
    const camera = SpeedCamera.from({
      id: 'sc-test-01',
      lat: 46.0419,
      lng: 14.4726,
      speedLimit: 50,
      type: 'fixed',
      country: 'Slovenia',
    });

    expect(camera).toBeInstanceOf(SpeedCamera);
    expect(camera.id).toBe('sc-test-01');
    expect(camera.lat).toBe(46.0419);
    expect(camera.lng).toBe(14.4726);
    expect(camera.speedLimit).toBe(50);
    expect(camera.type).toBe('fixed');
    expect(camera.country).toBe('Slovenia');
  });

  it('should serialize to a plain object via toObject()', () => {
    const plain = {
      id: 'sc-test-02',
      lat: 44.8016,
      lng: 20.4651,
      speedLimit: 60,
      type: 'fixed' as const,
      country: 'Serbia',
    };

    const camera = SpeedCamera.from(plain);
    const result = camera.toObject();

    expect(result).toEqual(plain);
  });

  it('should include id in toObject() output', () => {
    const camera = SpeedCamera.from({
      id: 'sc-test-03',
      lat: 42.5897,
      lng: 23.5228,
      speedLimit: 90,
      type: 'section',
      country: 'Bulgaria',
    });

    expect(camera.toObject()).toHaveProperty('id', 'sc-test-03');
  });

  it('should handle all SpeedCameraType values', () => {
    const types = ['fixed', 'mobile', 'average', 'red-light', 'section'] as const;

    types.forEach((type) => {
      const camera = SpeedCamera.from({
        id: `sc-type-${type}`,
        lat: 0,
        lng: 0,
        speedLimit: 50,
        type,
        country: 'Test',
      });
      expect(camera.type).toBe(type);
    });
  });

  it('should return 20 mock speed cameras', () => {
    const cameras = mockSpeedCameras();
    expect(cameras).toHaveLength(20);
    cameras.forEach((cam) => expect(cam).toBeInstanceOf(SpeedCamera));
  });

  it('should cover all 10 Balkan countries in the seed data', () => {
    const cameras = mockSpeedCameras();
    const countries = new Set(cameras.map((c) => c.country));

    expect(countries.has('Slovenia')).toBe(true);
    expect(countries.has('Croatia')).toBe(true);
    expect(countries.has('Serbia')).toBe(true);
    expect(countries.has('Bulgaria')).toBe(true);
    expect(countries.has('Romania')).toBe(true);
    expect(countries.has('Bosnia & Herzegovina')).toBe(true);
    expect(countries.has('North Macedonia')).toBe(true);
    expect(countries.has('Montenegro')).toBe(true);
    expect(countries.has('Albania')).toBe(true);
    expect(countries.has('Greece')).toBe(true);
  });

  it('should allow overriding mock properties', () => {
    const camera = mockSpeedCamera({ speedLimit: 130, type: 'average' });
    expect(camera.speedLimit).toBe(130);
    expect(camera.type).toBe('average');
  });

  it('should allow partial overrides in mockSpeedCameras()', () => {
    const cameras = mockSpeedCameras([{ speedLimit: 999 }]);
    expect(cameras[0].speedLimit).toBe(999);
    // other cameras remain unchanged
    expect(cameras[1].speedLimit).not.toBe(999);
  });

  it('should have valid coordinates for every seed camera', () => {
    const cameras = mockSpeedCameras();
    cameras.forEach((cam) => {
      expect(cam.lat).toBeGreaterThan(-90);
      expect(cam.lat).toBeLessThan(90);
      expect(cam.lng).toBeGreaterThan(-180);
      expect(cam.lng).toBeLessThan(180);
    });
  });
});
