import { describe, it, expect } from 'vitest';
import { Waypoint } from './waypoint.js';
import { mockWaypoint, mockWaypoints } from './waypoint.mock.js';

describe('Waypoint', () => {
  describe('Waypoint.from()', () => {
    it('creates a Waypoint from a plain object', () => {
      const wp = Waypoint.from({ id: 'abc', name: 'Start', lat: 10, lng: 20 });
      expect(wp).toBeInstanceOf(Waypoint);
      expect(wp.id).toBe('abc');
      expect(wp.name).toBe('Start');
      expect(wp.lat).toBe(10);
      expect(wp.lng).toBe(20);
    });

    it('handles missing optional name gracefully', () => {
      const wp = Waypoint.from({ id: 'xyz', lat: 5, lng: 15 });
      expect(wp.name).toBeUndefined();
    });

    it('defaults id and coordinates when missing', () => {
      const wp = Waypoint.from({} as any);
      expect(wp.id).toBe('');
      expect(wp.lat).toBe(0);
      expect(wp.lng).toBe(0);
    });
  });

  describe('Waypoint.fromLatLng()', () => {
    it('creates a Waypoint from a LatLng object', () => {
      const wp = Waypoint.fromLatLng({ lat: 48.8584, lng: 2.2945 });
      expect(wp).toBeInstanceOf(Waypoint);
      expect(wp.lat).toBe(48.8584);
      expect(wp.lng).toBe(2.2945);
    });

    it('assigns the optional label as name', () => {
      const wp = Waypoint.fromLatLng({ lat: 48.8584, lng: 2.2945 }, 'Eiffel Tower');
      expect(wp.name).toBe('Eiffel Tower');
    });

    it('leaves name undefined when no label is provided', () => {
      const wp = Waypoint.fromLatLng({ lat: 0, lng: 0 });
      expect(wp.name).toBeUndefined();
    });

    it('generates a unique id each time', () => {
      const wp1 = Waypoint.fromLatLng({ lat: 1, lng: 1 });
      const wp2 = Waypoint.fromLatLng({ lat: 1, lng: 1 });
      expect(wp1.id).not.toBe(wp2.id);
    });

    it('generates an id that starts with "wp-"', () => {
      const wp = Waypoint.fromLatLng({ lat: 0, lng: 0 });
      expect(wp.id.startsWith('wp-')).toBe(true);
    });
  });

  describe('Waypoint.toObject()', () => {
    it('serializes a Waypoint to a plain object', () => {
      const wp = Waypoint.from({ id: 'abc', name: 'Start', lat: 10, lng: 20 });
      const obj = wp.toObject();
      expect(obj).toEqual({ id: 'abc', name: 'Start', lat: 10, lng: 20 });
    });

    it('includes id in the serialized object', () => {
      const wp = Waypoint.from({ id: 'test-id', lat: 0, lng: 0 });
      expect(wp.toObject().id).toBe('test-id');
    });

    it('round-trips through from() and toObject()', () => {
      const plain = { id: 'rt-1', name: 'Checkpoint', lat: 51.5074, lng: -0.1278 };
      const obj = Waypoint.from(plain).toObject();
      expect(obj).toEqual(plain);
    });
  });

  describe('mock helpers', () => {
    it('mockWaypoint() returns a Waypoint instance', () => {
      const wp = mockWaypoint();
      expect(wp).toBeInstanceOf(Waypoint);
    });

    it('mockWaypoint() supports partial overrides', () => {
      const wp = mockWaypoint({ name: 'Custom Place', lat: 99 });
      expect(wp.name).toBe('Custom Place');
      expect(wp.lat).toBe(99);
    });

    it('mockWaypoints() returns an array of Waypoint instances', () => {
      const wps = mockWaypoints();
      expect(wps.length).toBeGreaterThan(0);
      wps.forEach((wp) => expect(wp).toBeInstanceOf(Waypoint));
    });

    it('mockWaypoints() supports per-item overrides', () => {
      const wps = mockWaypoints([{ name: 'Override First' }]);
      expect(wps[0].name).toBe('Override First');
    });
  });
});
