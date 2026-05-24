import { describe, it, expect } from 'vitest';
import { PlannedRoute } from './planned-route.js';
import { mockPlannedRoute, mockPlannedRoutes } from './planned-route.mock.js';

describe('PlannedRoute', () => {
  describe('PlannedRoute.from()', () => {
    it('creates a PlannedRoute from a plain object', () => {
      const route = PlannedRoute.from({
        id: 'r-1',
        userId: 'u-1',
        name: 'Test Route',
        waypoints: [{ id: 'wp-1', name: 'Start', lat: 46.0, lng: 14.0 }],
        mode: 'paved',
        geometry: [{ lat: 46.0, lng: 14.0 }, { lat: 46.1, lng: 14.1 }],
        distanceKm: 12.5,
        durationSec: 900,
        notes: 'A test note',
        createdAt: 1710000000,
      });

      expect(route).toBeInstanceOf(PlannedRoute);
      expect(route.id).toBe('r-1');
      expect(route.userId).toBe('u-1');
      expect(route.name).toBe('Test Route');
      expect(route.mode).toBe('paved');
      expect(route.distanceKm).toBe(12.5);
      expect(route.durationSec).toBe(900);
      expect(route.notes).toBe('A test note');
      expect(route.createdAt).toBe(1710000000);
    });

    it('handles optional userId being undefined', () => {
      const route = PlannedRoute.from({
        id: 'r-2',
        userId: undefined,
        name: 'Anonymous Route',
        waypoints: [],
        mode: 'offroad',
        geometry: [],
        distanceKm: 0,
        durationSec: 0,
        notes: undefined,
        createdAt: 1710000000,
      });

      expect(route.userId).toBeUndefined();
      expect(route.notes).toBeUndefined();
    });

    it('handles missing optional fields with safe defaults', () => {
      const route = PlannedRoute.from({
        id: 'r-3',
        name: 'Minimal Route',
        waypoints: [],
        mode: 'twisty',
        geometry: [],
        distanceKm: 0,
        durationSec: 0,
        createdAt: 0,
      } as any);

      expect(route.waypoints).toEqual([]);
      expect(route.geometry).toEqual([]);
    });

    it('maps waypoints into Waypoint instances', () => {
      const route = PlannedRoute.from({
        id: 'r-4',
        name: 'Waypoint Route',
        waypoints: [
          { id: 'wp-a', name: 'Alpha', lat: 46.1, lng: 14.1 },
          { id: 'wp-b', name: 'Beta', lat: 46.2, lng: 14.2 },
        ],
        mode: 'paved',
        geometry: [],
        distanceKm: 5,
        durationSec: 300,
        createdAt: 1710000000,
      });

      expect(route.waypoints).toHaveLength(2);
      expect(route.waypoints[0].id).toBe('wp-a');
      expect(route.waypoints[1].lat).toBe(46.2);
    });
  });

  describe('toObject()', () => {
    it('serializes the route to a plain object', () => {
      const route = mockPlannedRoute({ id: 'fixed-id', name: 'Serialized Route' });
      const obj = route.toObject();

      expect(obj.id).toBe('fixed-id');
      expect(obj.name).toBe('Serialized Route');
      expect(Array.isArray(obj.waypoints)).toBe(true);
      expect(Array.isArray(obj.geometry)).toBe(true);
      expect(typeof obj.distanceKm).toBe('number');
      expect(typeof obj.durationSec).toBe('number');
      expect(typeof obj.createdAt).toBe('number');
    });

    it('round-trips through from() and toObject()', () => {
      const plain = {
        id: 'rt-1',
        userId: 'u-rt',
        name: 'Round Trip Route',
        waypoints: [{ id: 'wp-rt', name: 'Mid', lat: 46.5, lng: 13.5 }],
        mode: 'twisty' as const,
        geometry: [{ lat: 46.5, lng: 13.5 }],
        distanceKm: 99.9,
        durationSec: 7200,
        notes: 'Round trip notes',
        createdAt: 1710000000,
      };

      const obj = PlannedRoute.from(plain).toObject();

      expect(obj.id).toBe(plain.id);
      expect(obj.userId).toBe(plain.userId);
      expect(obj.name).toBe(plain.name);
      expect(obj.mode).toBe(plain.mode);
      expect(obj.distanceKm).toBe(plain.distanceKm);
      expect(obj.durationSec).toBe(plain.durationSec);
      expect(obj.notes).toBe(plain.notes);
      expect(obj.createdAt).toBe(plain.createdAt);
      expect(obj.waypoints[0].id).toBe('wp-rt');
    });
  });

  describe('toGpx()', () => {
    it('returns a valid GPX 1.1 XML string', () => {
      const route = mockPlannedRoute({ id: 'gpx-1', name: 'GPX Route' });
      const gpx = route.toGpx();

      expect(gpx).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(gpx).toContain('<gpx version="1.1"');
      expect(gpx).toContain('xmlns="http://www.topografix.com/GPX/1/1"');
    });

    it('includes the route name in metadata', () => {
      const route = mockPlannedRoute({ id: 'gpx-2', name: 'Vršič Pass Loop' });
      const gpx = route.toGpx();

      expect(gpx).toContain('<name>Vršič Pass Loop</name>');
    });

    it('includes waypoints as <wpt> elements', () => {
      const route = mockPlannedRoute({ id: 'gpx-3' });
      const gpx = route.toGpx();

      expect(gpx).toContain('<wpt lat=');
      expect(gpx).toContain('lon=');
    });

    it('includes geometry as <trkpt> elements', () => {
      const route = mockPlannedRoute({ id: 'gpx-4' });
      const gpx = route.toGpx();

      expect(gpx).toContain('<trkpt lat=');
      expect(gpx).toContain('<trkseg>');
      expect(gpx).toContain('</trkseg>');
    });

    it('includes notes as <desc> when present', () => {
      const route = mockPlannedRoute({ id: 'gpx-5', notes: 'My scenic route' });
      const gpx = route.toGpx();

      expect(gpx).toContain('<desc>My scenic route</desc>');
    });

    it('omits <desc> when notes are undefined', () => {
      const route = mockPlannedRoute({ id: 'gpx-6', notes: undefined });
      const gpx = route.toGpx();

      expect(gpx).not.toContain('<desc>');
    });

    it('includes the route mode as track type', () => {
      const route = mockPlannedRoute({ id: 'gpx-7', mode: 'offroad' });
      const gpx = route.toGpx();

      expect(gpx).toContain('<type>offroad</type>');
    });

    it('escapes XML special characters in name', () => {
      const route = mockPlannedRoute({ id: 'gpx-8', name: 'Route <A> & "B"' });
      const gpx = route.toGpx();

      expect(gpx).toContain('Route &lt;A&gt; &amp; &quot;B&quot;');
    });
  });

  describe('mockPlannedRoutes()', () => {
    it('returns an array of PlannedRoute instances', () => {
      const routes = mockPlannedRoutes();

      expect(routes.length).toBeGreaterThan(0);
      routes.forEach((r) => expect(r).toBeInstanceOf(PlannedRoute));
    });

    it('returns routes with different modes', () => {
      const routes = mockPlannedRoutes();
      const modes = routes.map((r) => r.mode);

      expect(modes).toContain('twisty');
      expect(modes).toContain('offroad');
      expect(modes).toContain('paved');
    });
  });
});
